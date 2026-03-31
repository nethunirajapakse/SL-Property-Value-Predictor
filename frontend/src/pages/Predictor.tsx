import { useState } from "react";
import axios from "axios";
import Footer from "../components/Footer";
import PredictorNavbar from "../components/PredictorNavbar";
import PredictorHeader from "../components/PredictorHeader";
import PropertyForm from "../components/PropertyForm";
import PredictionResults from "../components/PredictionResults";

interface PredictResult {
  predicted_price_lkr: number;
  predicted_price_mn: number;
  explanation: { feature: string; shap_value: number }[];
}

export default function Predictor() {
  const [form, setForm] = useState({
    district: "Colombo",
    property_type: "house",
    bedrooms: 3,
    bathrooms: 2,
    land_size_p: 10,
    floor_area: 1200,
    has_parking: 0,
    has_pool: 0,
    has_garden: 0,
    has_furnished: 0,
    has_ac: 0,
    has_security: 0,
    has_highway: 0,
    has_generator: 0,
    has_solar: 0,
  });
  const [result, setResult] = useState<PredictResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const predict = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const payload = { ...form };
      const res = await axios.post("http://localhost:5000/predict", payload);
      setResult(res.data);
      setTimeout(
        () =>
          document
            .getElementById("result")
            ?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    } catch {
      setError(
        "Could not connect to the prediction API. Make sure Flask is running on port 5000.",
      );
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen bg-[#faf7f2]"
      style={{ fontFamily: "DM Sans, sans-serif" }}
    >
      <PredictorNavbar />
      <div className="max-w-6xl mx-auto px-6 md:px-14 pt-32 pb-20">
        <PredictorHeader />
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <PropertyForm
            form={form}
            setForm={setForm}
            predict={predict}
            loading={loading}
            error={error}
          />
          <PredictionResults result={result} form={form} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
