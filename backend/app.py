from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle

app = Flask(__name__)
CORS(app)

# Load the logistic regression model
with open("logistic_model.pkl", "rb") as f:
    model = pickle.load(f)

# Load the TF-IDF vectorizer
with open("tfidf_vectorizer.pkl", "rb") as f:  # updated filename
    tfidf = pickle.load(f)


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    text = data.get('news', '')

    if not text:
        return jsonify({'error': 'No text provided'}), 400

    X_new = tfidf.transform([text])
    pred = model.predict(X_new)[0]
    pred_proba = model.predict_proba(X_new)[0].max()

   
    return jsonify({
        'prediction': int(pred),        # 1=Real, 0=Fake
        'probability': float(pred_proba)
    })





if __name__ == '__main__':
    app.run(debug=True)


