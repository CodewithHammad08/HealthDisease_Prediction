import requests

url = "http://127.0.0.1:5000/predict"

data = {
    "age": 45,
    "sex": "M",
    "chest_pain": "ATA",
    "resting_bp": 130,
    "cholesterol": 220,
    "fasting_bs": 0,
    "max_hr": 150,
    "oldpeak": 1.0
}

response = requests.post(url, json=data)

print(response.json())