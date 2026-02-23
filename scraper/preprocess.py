"""
preprocess.py  —  Clean and transform raw_properties.csv
=========================================================
Run with:  python preprocess.py
Input:     raw_properties.csv
Outputs:   clean_properties.csv
           feature_names.pkl
           district_encoder.pkl
           eda_plots.png
"""

import re
import joblib
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import LabelEncoder

print("=" * 55)
print("  PREPROCESSING PIPELINE")
print("=" * 55)

df = pd.read_csv("raw_properties.csv")
print(f"\n✅ Loaded: {df.shape[0]} rows × {df.shape[1]} columns")

# ═══════════════════════════════════════════════════════
# 1. DROP USELESS COLUMNS & BAD ROWS
# ═══════════════════════════════════════════════════════
# Drop furnishing — 598/601 are null, useless for model
df.drop(columns=["furnishing"], inplace=True)

# Drop rows with no price (can't train without target)
df.dropna(subset=["price_lkr"], inplace=True)
print(f"  After dropping null prices: {len(df)} rows")

# Drop rows with no location
df.dropna(subset=["location"], inplace=True)
print(f"  After dropping null location: {len(df)} rows")

# ═══════════════════════════════════════════════════════
# 2. PRICE FILTERING — remove outliers
# ═══════════════════════════════════════════════════════
before = len(df)
df = df[df["price_lkr"].between(500_000, 600_000_000)]
print(f"  After price filter (Rs.500K–600M): {len(df)} rows (removed {before - len(df)})")

# Log-transform price — reduces skewness, improves model
df["log_price"] = np.log1p(df["price_lkr"])

print(f"\n  Price stats:")
print(f"    Min:    Rs. {df['price_lkr'].min():>15,.0f}")
print(f"    Median: Rs. {df['price_lkr'].median():>15,.0f}")
print(f"    Max:    Rs. {df['price_lkr'].max():>15,.0f}")

# ═══════════════════════════════════════════════════════
# 3. MISSING VALUE IMPUTATION
# ═══════════════════════════════════════════════════════
df["bedrooms"]       = df["bedrooms"].fillna(df["bedrooms"].median())
df["bathrooms"]      = df["bathrooms"].fillna(df["bathrooms"].median())
df["land_size_p"]    = df["land_size_p"].fillna(df["land_size_p"].median())
df["floor_area_sqft"]= df["floor_area_sqft"].fillna(0)   # 0 = land only
df["storeys"]        = df["storeys"].fillna(df["storeys"].median())

print(f"\n✅ Missing values imputed")

# ═══════════════════════════════════════════════════════
# 4. CAP EXTREME VALUES (winsorise at 99th percentile)
# ═══════════════════════════════════════════════════════
for col in ["bedrooms", "bathrooms", "land_size_p", "floor_area_sqft"]:
    cap = df[col].quantile(0.99)
    df[col] = df[col].clip(upper=cap)

# ═══════════════════════════════════════════════════════
# 5. DISTRICT TIER — location quality score
# ═══════════════════════════════════════════════════════
DISTRICT_TIERS = {
    "Colombo": 1,
    "Gampaha": 2, "Kalutara": 2, "Kandy": 2, "Galle": 2, "Matara": 2,
    "Kurunegala": 3, "Ratnapura": 3, "Trincomalee": 3, "Puttalam": 3,
    "Kegalle": 3, "Negombo": 3,
    "Badulla": 4, "Anuradhapura": 4, "Polonnaruwa": 4, "Ampara": 4,
    "Batticaloa": 4, "Jaffna": 4, "Hambantota": 4, "Monaragala": 4,
    "Nuwara Eliya": 4, "Matale": 4, "Mullaitivu": 4, "Vavuniya": 4,
    "Mannar": 4, "Kilinochchi": 4,
}
df["district_tier"] = df["district"].map(DISTRICT_TIERS).fillna(4).astype(int)

# Colombo premium areas (Colombo 1–7)
PREMIUM = ["colombo 1", "colombo 2", "colombo 3", "colombo 4",
           "colombo 5", "colombo 6", "colombo 7", "cinnamon",
           "kollupitiya", "bambalapitiya", "havelock", "borella",
           "rajagiriya", "battaramulla", "nawala", "nugegoda",
           "dehiwala", "mount lavinia"]
df["colombo_premium"] = df["location"].str.lower().apply(
    lambda x: int(any(p in str(x) for p in PREMIUM))
)

# ═══════════════════════════════════════════════════════
# 6. ENCODE DISTRICT
# ═══════════════════════════════════════════════════════
le = LabelEncoder()
df["district_enc"] = le.fit_transform(df["district"].fillna("Other"))
joblib.dump(le, "district_encoder.pkl")
print(f"\n✅ District encoder saved")
print(f"   Districts found: {list(le.classes_)}")

# ═══════════════════════════════════════════════════════
# 7. ENCODE PROPERTY TYPE
# ═══════════════════════════════════════════════════════
TYPE_MAP = {"houses": 0, "house": 0, "apartments": 1, "apartment": 1, "land": 2}
df["property_type_enc"] = df["property_type"].str.lower().map(TYPE_MAP).fillna(0).astype(int)

print(f"\n   Property type distribution:")
print(df["property_type"].value_counts().to_string())

# ═══════════════════════════════════════════════════════
# 8. AMENITY FEATURES FROM DESCRIPTION
# ═══════════════════════════════════════════════════════
AMENITIES = {
    "has_parking":   ["parking", "garage", "car port", "carport"],
    "has_pool":      ["pool", "swimming"],
    "has_garden":    ["garden", "lawn"],
    "has_furnished": ["furnished", "furniture"],
    "has_ac":        ["air condition", "aircondition", "a/c", " ac "],
    "has_security":  ["security", "cctv", "gated", "guard"],
    "has_water":     ["water board", "city water", "tube well", "well water"],
    "has_highway":   ["highway", "expressway", "e01", "e03"],
    "has_generator": ["generator", "genset"],
    "has_solar":     ["solar"],
}

combined = (df["title"].fillna("") + " " + df["description"].fillna("")).str.lower()
for feat, keywords in AMENITIES.items():
    df[feat] = combined.apply(lambda t: int(any(kw in t for kw in keywords)))

print(f"\n✅ Amenity features extracted:")
for feat in AMENITIES:
    print(f"   {feat:<20} {df[feat].sum():>4} listings ({df[feat].mean()*100:.1f}%)")

# ═══════════════════════════════════════════════════════
# 9. FINAL FEATURE SET
# ═══════════════════════════════════════════════════════
FEATURES = [
    "bedrooms", "bathrooms", "land_size_p", "floor_area_sqft", "storeys",
    "district_enc", "district_tier", "colombo_premium", "property_type_enc",
    "negotiable",
] + list(AMENITIES.keys())

TARGET = "log_price"   # we train on log(price), convert back after

df_clean = df[FEATURES + [TARGET, "price_lkr"]].dropna()
print(f"\n✅ Final dataset: {df_clean.shape[0]} rows × {len(FEATURES)} features")
print(f"   Dropped {len(df) - len(df_clean)} rows with remaining nulls")

df_clean.to_csv("clean_properties.csv", index=False)
joblib.dump(FEATURES, "feature_names.pkl")
print(f"✅ Saved → clean_properties.csv")
print(f"✅ Saved → feature_names.pkl")

# ═══════════════════════════════════════════════════════
# 10. EDA PLOTS
# ═══════════════════════════════════════════════════════
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.suptitle("Sri Lanka Property Price — EDA", fontsize=14, fontweight="bold")

# Price distribution (raw)
axes[0,0].hist(df_clean["price_lkr"]/1e6, bins=40, color="#f97316", edgecolor="white")
axes[0,0].set_title("Price Distribution (Rs. Millions)")
axes[0,0].set_xlabel("Price (Mn LKR)")
axes[0,0].set_ylabel("Count")

# Log price distribution
axes[0,1].hist(df_clean["log_price"], bins=40, color="#2d9f6a", edgecolor="white")
axes[0,1].set_title("Log(Price) — More Normal")
axes[0,1].set_xlabel("log(1 + Price)")

# Price by district tier
df_clean.boxplot(column="price_lkr", by="district_tier", ax=axes[0,2])
axes[0,2].set_title("Price by District Tier")
axes[0,2].set_xlabel("Tier (1=Colombo, 4=Rural)")
axes[0,2].set_ylabel("Price (LKR)")
plt.sca(axes[0,2]); plt.title("Price by District Tier")

# Price by property type
df_clean.boxplot(column="price_lkr", by="property_type_enc", ax=axes[1,0])
axes[1,0].set_title("Price by Property Type")
axes[1,0].set_xlabel("0=House, 1=Apartment, 2=Land")
plt.sca(axes[1,0]); plt.title("Price by Property Type")

# Bedrooms vs price
axes[1,1].scatter(df_clean["bedrooms"], df_clean["price_lkr"]/1e6,
                  alpha=0.4, color="#f97316")
axes[1,1].set_title("Bedrooms vs Price")
axes[1,1].set_xlabel("Bedrooms")
axes[1,1].set_ylabel("Price (Mn LKR)")

# Land size vs price
axes[1,2].scatter(df_clean["land_size_p"], df_clean["price_lkr"]/1e6,
                  alpha=0.4, color="#1a3c5e")
axes[1,2].set_title("Land Size (Perches) vs Price")
axes[1,2].set_xlabel("Land Size (perches)")
axes[1,2].set_ylabel("Price (Mn LKR)")

plt.tight_layout()
plt.savefig("eda_plots.png", dpi=150, bbox_inches="tight")
print(f"✅ Saved → eda_plots.png")

print("\n" + "=" * 55)
print("  PREPROCESSING COMPLETE!")
print("  Next: python train_model.py")
print("=" * 55)
