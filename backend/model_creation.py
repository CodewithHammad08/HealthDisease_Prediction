import joblib
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

model = joblib.load(
    os.path.join(BASE_DIR, "model", "Logistic_Heart.pkl")
)

scaler = joblib.load(
    os.path.join(BASE_DIR, "model", "scaler.pkl")
)

columns = joblib.load(
    os.path.join(BASE_DIR, "model", "columns.pkl")
)

numerical_cols = joblib.load(
    os.path.join(BASE_DIR, "model", "numerical_cols.pkl")
)

print("Model loaded successfully!")
print("Scaler loaded successfully!")
print("Columns:", columns)
print("Numerical columns:", numerical_cols)