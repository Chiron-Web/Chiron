from flask import Flask, request, jsonify
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
import torch
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This enables CORS for all domains on all routes

# Load models and tokenizers
health_model_path = "./distilbert_model4"
general_model_path = "./general_model"

# Load tokenizers
health_tokenizer = DistilBertTokenizer.from_pretrained(health_model_path)
general_tokenizer = DistilBertTokenizer.from_pretrained(general_model_path)

# Load models
health_model = DistilBertForSequenceClassification.from_pretrained(health_model_path)
general_model = DistilBertForSequenceClassification.from_pretrained(general_model_path)

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

def classify_news_authenticity(text, tokenizer, model, max_length=512):
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

    labels = ["fake", "authentic"]
    return labels[predicted_class]

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
        
        # If it's health news, also classify authenticity
        if news_type == "health":
            authenticity = classify_news_authenticity(text, health_tokenizer, health_model)
            response["authenticity"] = authenticity
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)