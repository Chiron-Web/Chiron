from flask import Flask, request, jsonify
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
import torch
from nltk.tokenize import sent_tokenize
import nltk
nltk.download('punkt')
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This enables CORS for all domains on all routes

# Load models and tokenizers
health_model_path = "./distilbert_model5"
general_model_path = "./general_model"

# Load tokenizers
health_tokenizer = DistilBertTokenizer.from_pretrained(health_model_path)
general_tokenizer = DistilBertTokenizer.from_pretrained(general_model_path)

# Load models
health_model = DistilBertForSequenceClassification.from_pretrained(health_model_path)
general_model = DistilBertForSequenceClassification.from_pretrained(general_model_path)

def smart_intro_conclusion_tokenize(texts, tokenizer, max_length=384):
    results = {'input_ids': []}
    half_len = max_length // 2

    for text in texts:
        full_tokens = tokenizer(text, truncation=False, return_attention_mask=False)
        input_ids = full_tokens['input_ids']

        if len(input_ids) <= max_length:
            encoded = tokenizer(text, padding='max_length', max_length=max_length,
                                truncation=True, return_tensors="pt")
            results['input_ids'].append(encoded['input_ids'][0])
            continue

        sentences = sent_tokenize(text)
        sentence_tokens = []
        for sent in sentences:
            sent_tokens = tokenizer(sent, add_special_tokens=False)['input_ids']
            sentence_tokens.append((sent, len(sent_tokens), sent_tokens))

        # Intro half
        intro_ids, current_len = [], 0
        for sent, sent_len, sent_tokens in sentence_tokens:
            if current_len + sent_len > half_len:
                break
            intro_ids.extend(sent_tokens)
            current_len += sent_len

        # Conclusion half
        concl_ids, current_len = [], 0
        for sent, sent_len, sent_tokens in reversed(sentence_tokens):
            if current_len + sent_len > half_len:
                break
            concl_ids = sent_tokens + concl_ids
            current_len += sent_len

        combined_ids = (intro_ids + concl_ids)[:max_length]
        padding_len = max_length - len(combined_ids)
        combined_ids += [tokenizer.pad_token_id] * padding_len

        results['input_ids'].append(torch.tensor(combined_ids))

    return results

def classify_health_news(text, tokenizer, model, max_length=512):
    """
    Classify news content as "general" or "health".

    Parameters:
        text (str): The news content to classify.
        tokenizer: The DistilBERT tokenizer.
        model: The fine-tuned DistilBERT model.
        max_length (int): Maximum length of the input sequence.

    Returns:
        str: "general" or "health".
    """ 
    inputs = tokenizer(
        text,
        truncation=True,
        padding=True,
        max_length=max_length,
        return_tensors="pt"
    )

    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        predicted_class = torch.argmax(logits, dim=-1).item()

    labels = ["general", "health"]
    return labels[predicted_class]

def classify_news_authenticity(text, tokenizer, model, max_length=384):
    """
    Classify news content as "authentic" or "fake".

    Parameters:
        text (str): The news content to classify.
        tokenizer: The DistilBERT tokenizer.
        model: The fine-tuned DistilBERT model.
        max_length (int): Maximum length of the input sequence.

    Returns:
        str: "authentic" or "fake".
    """ 
    inputs = smart_intro_conclusion_tokenize([text], tokenizer, max_length=max_length)
    input_ids = torch.stack(inputs['input_ids'])

    with torch.no_grad():
        outputs = model(input_ids=input_ids)
        logits = outputs.logits
        probs = torch.softmax(logits, dim=-1)
        predicted_class = torch.argmax(probs, dim=-1).item()
        confidence = probs[0][predicted_class].item()

    labels = ["fake", "authentic"]
    return labels[predicted_class], confidence

@app.route('/classify', methods=['POST'])
def classify():
    """
    API endpoint for news classification.
    Expects JSON with 'text' field containing the news content.
    Returns whether the news is health-related and its authenticity if it is.
    """
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({"error": "Missing 'text' field in request"}), 400
        
        text = data['text']
        
        # First classify if it's health news
        news_type = classify_health_news(text, general_tokenizer, general_model)
        
        response = {
            "news_type": news_type,
            "status": "success"
        }
        
        # If health, check authenticity
        if news_type == "health":
            authenticity, auth_conf = classify_news_authenticity(text, health_tokenizer, health_model)
            response["authenticity"] = authenticity
            response["authenticity_confidence"] = round(auth_conf, 4)
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0')