# EstateVision — Sri Lankan Property Value Predictor 🏡🇱🇰

[![Python](https://img.shields.io/badge/python-3.11-blue)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/flask-2.3-green)](https://flask.palletsprojects.com/)
[![XGBoost](https://img.shields.io/badge/xgboost-1.7-orange)](https://xgboost.readthedocs.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

EstateVision is a **full-stack AI property valuation system** for the Sri Lankan real estate market. It predicts property prices using machine learning and provides transparency for buyers, sellers, and investors.

---

## 🌟 Demo

![EstateVision Demo](./docs/demo.gif)
*Enter property details → See predicted value → Explore SHAP insights.*

<img width="400" height="198" alt="0628(1)" src="https://github.com/user-attachments/assets/20264c7d-057a-44a7-99fc-744bbfc1e254" />


---

## Features

* ✅ **AI-Powered Predictions** — XGBoost model trained on 20 key property features.
* ✅ **Exploratory Data Analysis & Explainability** — SHAP visualizations show feature impact.
* ✅ **Real-Time Data Scraping** — Python scrapers to collect property listings.
* ✅ **Responsive Frontend** — Built with Vite for smooth user experience.
* ✅ **Multi-District Support** — Colombo, Kandy, Galle, Jaffna, and more.

---

## 🗂 Project Structure

```text
SL-Property-Value-Predictor/
│
├─ api/
│  ├─ app.py
│  ├─ xgb_model.pkl
│  ├─ feature_names.pkl
│  ├─ district_encoder.pkl
│  └─ shap_explainer.pkl
│
├─ data/
│  ├─ clean_properties.csv
│  └─ raw_properties.csv
│
├─ frontend/
│  ├─ public/
│  ├─ src/
│  ├─ index.html
│  ├─ package.json
│  └─ vite.config.ts
│
├─ plots/
│  ├─ actual_vs_predicted.png
│  ├─ eda_plots.png
│  ├─ feature_importance.png
│  ├─ shap_bar.png
│  ├─ shap_summary.png
│  └─ shap_waterfall.png
│
├─ scraper/
│  ├─ scraper.py
│  ├─ resume_scraper.py
│  ├─ preprocess.py
│  └─ train_model.py
│
├─ .gitignore
└─ README.md
```

---

## 🚀 Getting Started

### Backend (Flask API)

1. Create a Python virtual environment:

```bash
python -m venv venv
```

2. Activate it:

```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Run the API:

```bash
python api/app.py
```

**API Endpoint:**

```
POST http://localhost:5000/predict
```

---

### Frontend (Vite)

1. Navigate to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to use the app.

---

## 🧰 Usage

1. Launch backend API.
2. Launch frontend server.
3. Enter property details → Click “Predict” → See the estimated price.
4. View SHAP plots for feature impact.

---

## 📊 Additional Features

* **Data Scraper:** Collects property listings from Sri Lankan real estate websites.
* **Preprocessing:** Cleans and prepares data for model training.
* **Model Training:** Train your own XGBoost model using `train_model.py`.
* **Plots:** SHAP and EDA visualizations are stored in `plots/`.

---

## 🛠 Tech Stack

* **Backend:** Python, Flask, XGBoost, SHAP
* **Frontend:** Vite, TypeScript/JavaScript, HTML, CSS
* **Data:** Sri Lankan property listings (scraped + cleaned)

---

## ⚠️ Notes

* Flask runs in **debug mode** — suitable for development only. Use a production WSGI server for deployment.
* Both frontend and backend need to be running for predictions to work.

---

## 📄 License

MIT License — free to use, modify, and share.

---
