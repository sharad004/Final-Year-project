# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import pickle

# app = Flask(__name__)
# CORS(app)

# # Load the logistic regression model
# with open("logistic_model.pkl", "rb") as f:
#     model = pickle.load(f)

# # Load the TF-IDF vectorizer
# with open("tfidf_vectorizer.pkl", "rb") as f:  # updated filename
#     tfidf = pickle.load(f)


# @app.route('/predict', methods=['POST'])
# def predict():
#     data = request.get_json()
#     text = data.get('news', '')

#     if not text:
#         return jsonify({'error': 'No text provided'}), 400

#     X_new = tfidf.transform([text])
#     pred = model.predict(X_new)[0]
#     pred_proba = model.predict_proba(X_new)[0].max()

   
#     return jsonify({
#         'prediction': int(pred),        # 1=Real, 0=Fake
#         'probability': float(pred_proba)
#     })





# if __name__ == '__main__':
#     app.run(debug=True)


from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Load the logistic regression model
with open("logistic_model.pkl", "rb") as f:
    model = pickle.load(f)

# Load the TF-IDF vectorizer
with open("tfidf_vectorizer.pkl", "rb") as f:
    tfidf = pickle.load(f)

# --- MongoDB Setup ---
client = MongoClient("mongodb://localhost:27017/")  # Replace with your MongoDB URI if using Atlas
db = client["fake_news_db"]  # Database name
collection = db["submissions"]  # Collection name

# --- Prediction Route ---
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    title = data.get('title', '')       
    text = data.get('news', '')

    if not text:
        return jsonify({'error': 'No text provided'}), 400

    # Predict
    X_new = tfidf.transform([text])
    pred = model.predict(X_new)[0]
    pred_proba = model.predict_proba(X_new)[0].max()

    # Save to MongoDB
    submission = {
        "title": title,
        "content": text,
        "prediction": int(pred),          
        "probability": float(pred_proba),
        "timestamp": datetime.utcnow()
    }
    collection.insert_one(submission)

    return jsonify({
        'prediction': int(pred),
        'probability': float(pred_proba)
    })


# --- Admin Route: Fetch all submissions ---
@app.route('/admin/submissions', methods=['GET'])
def admin_get_submissions():
    # Include _id so we can delete later
    submissions = list(collection.find({}))
    # Convert ObjectId to string for JSON serialization
    for sub in submissions:
        sub['_id'] = str(sub['_id'])
    return jsonify(submissions)


# --- Admin Route: Delete a submission by _id ---
@app.route('/admin/delete/<submission_id>', methods=['DELETE'])
def admin_delete_submission(submission_id):
    try:
        result = collection.delete_one({"_id": ObjectId(submission_id)})
        if result.deleted_count == 1:
            return jsonify({"message": "Submission deleted successfully"})
        else:
            return jsonify({"error": "Submission not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == '__main__':
    app.run(debug=True)
