from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os
import pandas as pd

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

model = joblib.load(os.path.join(BASE_DIR, "model", "Logistic_Heart.pkl"))
scaler = joblib.load(os.path.join(BASE_DIR, "model", "scaler.pkl"))
columns = joblib.load(os.path.join(BASE_DIR, "model", "columns.pkl"))
numerical_cols = joblib.load(os.path.join(BASE_DIR, "model", "numerical_cols.pkl"))


@app.route("/")
def home():
    return "Heart Disease Prediction API is running!"


@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    input_data = pd.DataFrame([data])

    # Convert categorical values to match training data
    input_data["Sex_M"] = (input_data["sex"] == "M").astype(int)

    input_data["ChestPainType_ATA"] = (
        input_data["chest_pain"] == "ATA"
    ).astype(int)

    input_data["ChestPainType_NAP"] = (
        input_data["chest_pain"] == "NAP"
    ).astype(int)

    input_data["ChestPainType_TA"] = (
        input_data["chest_pain"] == "TA"
    ).astype(int)

    # Create remaining columns
    input_data["RestingECG_Normal"] = 0
    input_data["RestingECG_ST"] = 0
    input_data["ExerciseAngina_Y"] = 0
    input_data["ST_Slope_Flat"] = 0
    input_data["ST_Slope_Up"] = 0

    # Rename columns
    input_data.rename(columns={
        "age": "Age",
        "resting_bp": "RestingBP",
        "cholesterol": "Cholesterol",
        "max_hr": "MaxHR",
        "oldpeak": "Oldpeak",
        "fasting_bs": "FastingBS"
    }, inplace=True)

    # Keep exact training column order
    input_data = input_data[columns]

    # Scale numerical columns
    input_data[numerical_cols] = scaler.transform(
        input_data[numerical_cols]
    )

    prediction = model.predict(input_data)[0]

    return jsonify({
        "prediction": int(prediction)
    })

if __name__ == "__main__":
    app.run(debug=True)