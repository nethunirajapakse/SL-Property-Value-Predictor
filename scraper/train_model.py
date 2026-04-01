"""
train_model.py  —  Train XGBoost + Generate SHAP Plots
=======================================================
Run with:  python train_model.py
Input:     clean_properties.csv, feature_names.pkl
Outputs:   xgb_model.pkl
           actual_vs_predicted.png
           shap_summary.png
           shap_bar.png
           shap_waterfall.png
           feature_importance.png
           model_results.txt
"""

import joblib
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import xgboost as xgb
import shap
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

print("=" * 55)
print("  XGBOOST TRAINING PIPELINE")
print("=" * 55)

df       = pd.read_csv("clean_properties.csv")
FEATURES = joblib.load("feature_names.pkl")

X = df[FEATURES]
y = df["log_price"]
y_actual = df["price_lkr"]

print(f"\n✅ Loaded: {X.shape[0]} rows × {X.shape[1]} features")
print(f"   Features: {FEATURES}")

X_train, X_temp, y_train, y_temp, ya_train, ya_temp = train_test_split(
    X, y, y_actual, test_size=0.30, random_state=42
)
X_val, X_test, y_val, y_test, ya_val, ya_test = train_test_split(
    X_temp, y_temp, ya_temp, test_size=0.50, random_state=42
)

print(f"\n   Train: {X_train.shape[0]} rows")
print(f"   Val:   {X_val.shape[0]} rows")
print(f"   Test:  {X_test.shape[0]} rows")


print("\n🔍 Hyperparameter tuning (30 iterations)...")

param_grid = {
    "n_estimators":     [100, 200, 300, 500],
    "max_depth":        [3, 4, 5, 6, 7],
    "learning_rate":    [0.01, 0.05, 0.1, 0.15],
    "subsample":        [0.7, 0.8, 0.9, 1.0],
    "colsample_bytree": [0.7, 0.8, 0.9, 1.0],
    "reg_alpha":        [0, 0.1, 0.5, 1.0],
    "reg_lambda":       [1, 2, 5, 10],
    "min_child_weight": [1, 3, 5],
}

base_model = xgb.XGBRegressor(
    objective="reg:squarederror",
    random_state=42,
    n_jobs=-1,
    verbosity=0,
)

search = RandomizedSearchCV(
    base_model,
    param_grid,
    n_iter=30,
    cv=5,
    scoring="r2",
    random_state=42,
    verbose=1,
    n_jobs=-1,
)
search.fit(X_train, y_train)
best_model = search.best_estimator_

print(f"\n✅ Best parameters found:")
for k, v in search.best_params_.items():
    print(f"   {k:<22} {v}")

def evaluate(model, X, y_log, y_real, label):
    pred_log  = model.predict(X)
    pred_real = np.expm1(pred_log)
    mae  = mean_absolute_error(y_real, pred_real)
    rmse = np.sqrt(mean_squared_error(y_real, pred_real))
    r2   = r2_score(y_log, pred_log)   # R² on log scale
    print(f"\n  {label}:")
    print(f"    MAE  = Rs. {mae:>15,.0f}  (avg prediction error)")
    print(f"    RMSE = Rs. {rmse:>15,.0f}  (penalises big errors)")
    print(f"    R²   = {r2:.4f}           (1.0 = perfect)")
    return pred_real, mae, rmse, r2

print("\n📊 EVALUATION RESULTS:")
_, train_mae, train_rmse, train_r2 = evaluate(best_model, X_train, y_train, ya_train, "Train")
_, val_mae,   val_rmse,   val_r2   = evaluate(best_model, X_val,   y_val,   ya_val,   "Validation")
test_preds, test_mae, test_rmse, test_r2 = evaluate(best_model, X_test, y_test, ya_test, "Test (final)")

results_text = f"""
XGBoost Model Results
=====================
Dataset: {X.shape[0]} rows × {X.shape[1]} features
Split: 70% train / 15% validation / 15% test

Best Hyperparameters:
{chr(10).join(f'  {k}: {v}' for k, v in search.best_params_.items())}

Evaluation Metrics:
              MAE (Rs.)        RMSE (Rs.)       R²
Train:        {train_mae:>15,.0f}   {train_rmse:>15,.0f}   {train_r2:.4f}
Validation:   {val_mae:>15,.0f}   {val_rmse:>15,.0f}   {val_r2:.4f}
Test:         {test_mae:>15,.0f}   {test_rmse:>15,.0f}   {test_r2:.4f}

Interpretation:
- R² of {test_r2:.2f} means the model explains {test_r2*100:.0f}% of price variation
- Average prediction error on unseen data: Rs. {test_mae:,.0f}
- {'Good model — train and test R² are close (no overfitting)' if abs(train_r2 - test_r2) < 0.15 else 'Some overfitting detected — train R² significantly higher than test'}
"""
with open("model_results.txt", "w") as f:
    f.write(results_text)
print(results_text)

plt.figure(figsize=(8, 7))
plt.scatter(ya_test/1e6, test_preds/1e6, alpha=0.6, color="#f97316",
            edgecolors="white", linewidths=0.5, s=60)
max_val = max(ya_test.max(), test_preds.max()) / 1e6
plt.plot([0, max_val], [0, max_val], "k--", linewidth=1.5, label="Perfect prediction")
plt.xlabel("Actual Price (Rs. Millions)", fontsize=12)
plt.ylabel("Predicted Price (Rs. Millions)", fontsize=12)
plt.title(f"Actual vs Predicted Property Prices\nTest Set R² = {test_r2:.3f}", fontsize=13)
plt.legend()
plt.tight_layout()
plt.savefig("actual_vs_predicted.png", dpi=150)
plt.clf()
print("✅ Saved → actual_vs_predicted.png")

importance = pd.Series(best_model.feature_importances_, index=FEATURES)
importance = importance.sort_values(ascending=True)

plt.figure(figsize=(10, 7))
colors = ["#f97316" if v == importance.max() else "#fed7aa" for v in importance.values]
importance.plot(kind="barh", color=colors)
plt.title("XGBoost Feature Importance", fontsize=13)
plt.xlabel("Importance Score")
plt.tight_layout()
plt.savefig("feature_importance.png", dpi=150)
plt.clf()
print("✅ Saved → feature_importance.png")

print("\n🔍 Generating SHAP explanations...")
explainer   = shap.TreeExplainer(best_model)
shap_values = explainer.shap_values(X_test)

plt.figure()
shap.summary_plot(shap_values, X_test, show=False, plot_size=(12, 7))
plt.title("SHAP Summary Plot — Feature Impact on Price Prediction", fontsize=12)
plt.tight_layout()
plt.savefig("shap_summary.png", dpi=150, bbox_inches="tight")
plt.clf()
print("✅ Saved → shap_summary.png")

plt.figure()
shap.summary_plot(shap_values, X_test, plot_type="bar", show=False, plot_size=(12, 7))
plt.title("SHAP Feature Importance (Mean |SHAP Value|)", fontsize=12)
plt.tight_layout()
plt.savefig("shap_bar.png", dpi=150, bbox_inches="tight")
plt.clf()
print("✅ Saved → shap_bar.png")

most_exp_idx = ya_test.values.argmax()
exp = shap.Explanation(
    values=shap_values[most_exp_idx],
    base_values=explainer.expected_value,
    data=X_test.iloc[most_exp_idx],
    feature_names=FEATURES,
)
plt.figure()
shap.waterfall_plot(exp, show=False)
plt.title(f"SHAP Waterfall — Single Prediction\nActual: Rs. {ya_test.iloc[most_exp_idx]/1e6:.1f}M | Predicted: Rs. {test_preds[most_exp_idx]/1e6:.1f}M")
plt.tight_layout()
plt.savefig("shap_waterfall.png", dpi=150, bbox_inches="tight")
plt.clf()
print("✅ Saved → shap_waterfall.png")

joblib.dump(best_model, "xgb_model.pkl")
joblib.dump(explainer,  "shap_explainer.pkl")
joblib.dump(FEATURES,   "feature_names.pkl")
print("\n✅ Saved → xgb_model.pkl")
print("✅ Saved → shap_explainer.pkl")

print("\n" + "=" * 55)
print("  TRAINING COMPLETE!")
print(f"  Test R² = {test_r2:.4f}")
print(f"  Test MAE = Rs. {test_mae:,.0f}")
print("  Next: python api/app.py")
print("=" * 55)
