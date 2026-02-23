"""
app.py  —  EstateVision Flask API
===================================
Serves XGBoost predictions + SHAP explanations.

Run with:  python app.py
Endpoint:  POST http://localhost:5000/predict
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)
CORS(app)  # allows React frontend to call this API

# ── LOAD MODEL FILES ───────────────────────────────────────────
print("Loading model files...")
model      = joblib.load("xgb_model.pkl")
explainer  = joblib.load("shap_explainer.pkl")
features   = joblib.load("feature_names.pkl")
le         = joblib.load("district_encoder.pkl")
print(f"✅ Model loaded — {len(features)} features")
print(f"   Known districts: {list(le.classes_)}")

# ── DISTRICT MAPPINGS ──────────────────────────────────────────
DISTRICT_TIERS = {
    "Colombo": 1,
    "Gampaha": 2, "Kalutara": 2, "Kandy": 2, "Galle": 2, "Matara": 2,
    "Kurunegala": 3, "Ratnapura": 3, "Trincomalee": 3, "Puttalam": 3,
    "Kegalle": 3, "Negombo": 3,
    "Badulla": 4, "Anuradhapura": 4, "Polonnaruwa": 4, "Ampara": 4,
    "Batticaloa": 4, "Jaffna": 4, "Hambantota": 4, "Monaragala": 4,
    "Nuwara Eliya": 4, "Matale": 4, "Other": 4,
}

COLOMBO_PREMIUM_AREAS = [
    "colombo 1", "colombo 2", "colombo 3", "colombo 4",
    "colombo 5", "colombo 6", "colombo 7", "cinnamon",
    "kollupitiya", "bambalapitiya", "havelock", "borella",
    "rajagiriya", "battaramulla", "nawala", "nugegoda",
    "dehiwala", "mount lavinia",
]

PROPERTY_TYPE_MAP = {"house": 0, "houses": 0, "apartment": 1, "apartments": 1, "land": 2}


def encode_district(district_name):
    """Safely encode district — use 'Other' if unseen."""
    known = list(le.classes_)
    if district_name in known:
        return int(le.transform([district_name])[0])
    # Find closest match
    for d in known:
        if d.lower() in district_name.lower():
            return int(le.transform([d])[0])
    # Default to most common (Colombo=index of Colombo)
    return int(le.transform(["Colombo"])[0]) if "Colombo" in known else 0


# ── HEALTH CHECK ───────────────────────────────────────────────
@app.route("/", methods=["GET"])
def health():
    return jsonify({
        "status": "running",
        "model": "XGBoost Property Price Predictor",
        "features": len(features),
        "districts": list(le.classes_),
    })


# ── PREDICT ENDPOINT ───────────────────────────────────────────
@app.route("/predict", methods=["POST"])
def predict():
    try:
        body = request.get_json()
        if not body:
            return jsonify({"error": "No JSON body provided"}), 400

        # ── Extract inputs ─────────────────────────────────────
        district      = body.get("district", "Colombo")
        property_type = body.get("property_type", "house")
        location      = body.get("location", "").lower()

        # ── Build feature row ──────────────────────────────────
        district_enc  = encode_district(district)
        district_tier = DISTRICT_TIERS.get(district, 4)
        colombo_prem  = int(any(p in location or p in district.lower()
                                for p in COLOMBO_PREMIUM_AREAS))
        prop_type_enc = PROPERTY_TYPE_MAP.get(property_type.lower(), 0)

        row = {
            "bedrooms":         float(body.get("bedrooms", 3)),
            "bathrooms":        float(body.get("bathrooms", 2)),
            "land_size_p":      float(body.get("land_size_p", 10)),
            "floor_area_sqft":  float(body.get("floor_area", 1200)),
            "storeys":          float(body.get("storeys", 1)),
            "district_enc":     district_enc,
            "district_tier":    district_tier,
            "colombo_premium":  colombo_prem,
            "property_type_enc":prop_type_enc,
            "negotiable":       int(body.get("negotiable", 0)),
            "has_parking":      int(body.get("has_parking", 0)),
            "has_pool":         int(body.get("has_pool", 0)),
            "has_garden":       int(body.get("has_garden", 0)),
            "has_furnished":    int(body.get("has_furnished", 0)),
            "has_ac":           int(body.get("has_ac", 0)),
            "has_security":     int(body.get("has_security", 0)),
            "has_water":        int(body.get("has_water", 0)),
            "has_highway":      int(body.get("has_highway", 0)),
            "has_generator":    int(body.get("has_generator", 0)),
            "has_solar":        int(body.get("has_solar", 0)),
        }

        # Build DataFrame in correct feature order
        X = pd.DataFrame([row])[features]

        # ── Predict ────────────────────────────────────────────
        log_pred        = model.predict(X)[0]
        predicted_price = float(np.expm1(log_pred))

        # ── SHAP explanation ───────────────────────────────────
        shap_vals = explainer.shap_values(X)[0]

        # Top 8 features by absolute SHAP value
        shap_pairs = sorted(
            zip(features, shap_vals),
            key=lambda x: abs(x[1]),
            reverse=True
        )[:8]

        explanation = [
            {
                "feature":    feat,
                "shap_value": round(float(val), 4),
                "direction":  "positive" if val >= 0 else "negative",
            }
            for feat, val in shap_pairs
        ]

        return jsonify({
            "predicted_price_lkr": round(predicted_price),
            "predicted_price_mn":  round(predicted_price / 1_000_000, 2),
            "explanation":         explanation,
            "input_summary": {
                "district":      district,
                "property_type": property_type,
                "bedrooms":      row["bedrooms"],
                "bathrooms":     row["bathrooms"],
                "land_size_p":   row["land_size_p"],
                "floor_area":    row["floor_area_sqft"],
            }
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    print("\n🚀 EstateVision API running on http://localhost:5000")
    print("   Test it: http://localhost:5000/")
    print("   Press Ctrl+C to stop\n")
    app.run(debug=True, port=5000)
