from flask import Flask, request, jsonify
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
import torch
from flask_cors import CORS
from functools import lru_cache

app = Flask(__name__)
CORS(app)  # Enable CORS for all domains


@lru_cache()
def get_general_model():
    tokenizer = DistilBertTokenizer.from_pretrained("rabidpurson/generalChironBERT")
    model = DistilBertForSequenceClassification.from_pretrained("rabidpurson/generalChironBERT")
    return tokenizer, model


@lru_cache()
def get_health_model():
    tokenizer = DistilBertTokenizer.from_pretrained("rabidpurson/chironBERT")
    model = DistilBertForSequenceClassification.from_pretrained("rabidpurson/chironBERT")
    return tokenizer, model


def intro_conclusion_tokenize(texts, tokenizer, max_length=512):
    result_input_ids = []
    result_attention_mask = []

    half_len = max_length // 2

    for text in texts:
        tokens = tokenizer(text, truncation=False, padding=False, return_attention_mask=True)
        input_ids = tokens['input_ids']
        attention_mask = tokens['attention_mask']

        intro_ids = input_ids[:half_len]
        concl_ids = input_ids[-half_len:]
        combined_ids = intro_ids + concl_ids

        intro_mask = attention_mask[:half_len]
        concl_mask = attention_mask[-half_len:]
        combined_mask = intro_mask + concl_mask

        padding_len = max_length - len(combined_ids)
        if padding_len > 0:
            combined_ids += [tokenizer.pad_token_id] * padding_len
            combined_mask += [0] * padding_len

        result_input_ids.append(torch.tensor(combined_ids))
        result_attention_mask.append(torch.tensor(combined_mask))

    return {
        'input_ids': result_input_ids,
        'attention_mask': result_attention_mask
    }


def classify_health_news(text, tokenizer, model, max_length=512):
    inputs = tokenizer(text, truncation=True, padding=True, max_length=max_length, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**inputs)
        predicted_class = torch.argmax(outputs.logits, dim=-1).item()

    labels = ["general", "health"]
    return labels[predicted_class]


def classify_news_authenticity(text, tokenizer, model, max_length=512):
    inputs = intro_conclusion_tokenize([text], tokenizer, max_length=max_length)
    input_ids = torch.stack(inputs['input_ids'])
    attention_mask = torch.stack(inputs['attention_mask'])

    with torch.no_grad():
        outputs = model(input_ids=input_ids, attention_mask=attention_mask)
        probs = torch.softmax(outputs.logits, dim=-1)
        predicted_class = torch.argmax(probs, dim=-1).item()
        confidence = probs[0][predicted_class].item()

    labels = ["fake", "authentic"]
    return labels[predicted_class], confidence


@app.route('/classify', methods=['POST'])
def classify():
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "Missing 'text' field in request"}), 400

        text = data['text']

        general_tokenizer, general_model = get_general_model()
        news_type = classify_health_news(text, general_tokenizer, general_model)

        response = {
            "news_type": news_type,
            "status": "success"
        }

        if news_type == "health":
            health_tokenizer, health_model = get_health_model()
            authenticity, confidence = classify_news_authenticity(text, health_tokenizer, health_model)
            response["authenticity"] = authenticity
            response["authenticity_confidence"] = round(confidence, 4)

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200


if __name__ == '__main__':
    app.run()
