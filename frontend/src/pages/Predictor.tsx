import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DISTRICTS = [
  "Colombo", "Gampaha", "Kalutara", "Kandy", "Galle",
  "Matara", "Kurunegala", "Ratnapura", "Negombo", "Other"
];

const PROPERTY_TYPES = ["house", "apartment", "land"];

const AMENITIES = [
  { key: "has_parking",   label: "🚗 Parking",   },
  { key: "has_pool",      label: "🏊 Pool",       },
  { key: "has_garden",    label: "🌳 Garden",     },
  { key: "has_furnished", label: "🛋️ Furnished",  },
  { key: "has_ac",        label: "❄️ AC",          },
  { key: "has_security",  label: "🔒 Security",   },
  { key: "has_highway",   label: "🛣️ Highway",    },
  { key: "has_generator", label: "⚡ Generator",  },
  { key: "has_solar",     label: "☀️ Solar",      },
];

interface PredictResult {
  predicted_price_lkr: number;
  predicted_price_mn: number;
  explanation: { feature: string; shap_value: number }[];
}

export default function Predictor() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    district: "Colombo",
    property_type: "house",
    bedrooms: 3,
    bathrooms: 2,
    land_size_p: 10,
    floor_area: 1200,
    has_parking: 0, has_pool: 0, has_garden: 0,
    has_furnished: 0, has_ac: 0, has_security: 0,
    has_highway: 0, has_generator: 0, has_solar: 0,
  });
  const [result, setResult] = useState<PredictResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const toggleAmenity = (key: string) => {
    setForm(prev => ({ ...prev, [key]: prev[key as keyof typeof prev] === 1 ? 0 : 1 }));
  };

const predict = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const payload = {
        ...form,
        bedrooms:       Number(form.bedrooms),
        bathrooms:      Number(form.bathrooms),
        land_size_p:    Number(form.land_size_p),
        floor_area:     Number(form.floor_area),
      };
      const res = await axios.post("http://localhost:5000/predict", payload);
      setResult(res.data);
      setTimeout(() => document.getElementById("result")?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch {
      setError("Could not connect to the prediction API. Make sure Flask is running on port 5000.");
    }
    setLoading(false);
  };

  const maxShap = result ? Math.max(...result.explanation.map(e => Math.abs(e.shap_value))) : 1;

  return (
    <div className="min-h-screen bg-[#faf7f2]" style={{ fontFamily: "DM Sans, sans-serif" }}>

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 md:px-14 py-4 bg-[#faf7f2]/80 backdrop-blur-xl border-b border-orange-100">
        <div onClick={() => navigate("/")} className="cursor-pointer">
          <span className="text-xl font-bold tracking-widest uppercase" style={{ fontFamily: "Syne, sans-serif" }}>
            Estate<span className="text-orange-500">Vision</span>
          </span>
          <div className="text-[9px] tracking-[0.3em] text-orange-400 uppercase mt-0.5">Ceylon Property Valuator</div>
        </div>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-stone-500 hover:text-orange-500 transition-colors font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-6 md:px-14 pt-32 pb-20">

        {/* ── PAGE HEADER ── */}
        <div className="mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-orange-500 font-semibold mb-3">AI Valuation Tool</p>
          <h1 className="text-4xl md:text-6xl font-bold text-stone-900" style={{ fontFamily: "Syne, sans-serif" }}>
            Property Price<br />
            <span className="text-orange-500">Predictor</span>
          </h1>
          <p className="text-stone-500 mt-4 max-w-lg">
            Enter your property details below and our XGBoost model will estimate the market value — with a full AI explanation of what drives the price.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">

          {/* ── LEFT: FORM ── */}
          <div className="bg-white rounded-3xl border border-orange-100 shadow-xl shadow-orange-50 p-8">
            <h2 className="text-lg font-bold text-stone-900 mb-6" style={{ fontFamily: "Syne, sans-serif" }}>
              Property Details
            </h2>

            {/* District + Type */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">District</label>
                <select
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                >
                  {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Type</label>
                <select
                  name="property_type"
                  value={form.property_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all capitalize"
                >
                  {PROPERTY_TYPES.map(t => <option key={t} className="capitalize">{t}</option>)}
                </select>
              </div>
            </div>

            {/* Numeric fields */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              {[
                { label: "Bedrooms", name: "bedrooms", min: 1, max: 15, unit: "" },
                { label: "Bathrooms", name: "bathrooms", min: 1, max: 10, unit: "" },
                { label: "Land Size", name: "land_size_p", min: 1, max: 500, unit: "perches" },
                { label: "Floor Area", name: "floor_area", min: 0, max: 20000, unit: "sq ft" },
              ].map(f => (
                <div key={f.name}>
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                    {f.label} {f.unit && <span className="normal-case text-stone-400">({f.unit})</span>}
                  </label>
                  <input
                    type="number"
                    name={f.name}
                    value={form[f.name as keyof typeof form]}
                    onChange={handleChange}
                    min={f.min}
                    max={f.max}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>
              ))}
            </div>

            {/* Amenities */}
            <div className="mb-7">
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Amenities</label>
              <div className="flex flex-wrap gap-2">
                {AMENITIES.map(a => {
                  const active = form[a.key as keyof typeof form] === 1;
                  return (
                    <button
                      key={a.key}
                      type="button"
                      onClick={() => toggleAmenity(a.key)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                        active
                          ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-200"
                          : "bg-stone-50 text-stone-500 border-stone-200 hover:border-orange-300 hover:text-orange-500"
                      }`}
                    >
                      {a.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={predict}
              disabled={loading}
              className="w-full py-4 rounded-2xl font-bold text-sm bg-orange-500 hover:bg-orange-600 disabled:bg-stone-300 text-white transition-all duration-200 shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Analysing Property...
                </>
              ) : (
                <>
                  🔮 Predict Market Value
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* ── RIGHT: RESULTS ── */}
          <div id="result" className="flex flex-col gap-6">
            {result ? (
              <>
                {/* Price card */}
                <div className="relative overflow-hidden bg-stone-900 rounded-3xl p-8 text-white shadow-2xl">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500 rounded-full blur-[80px] opacity-20 pointer-events-none" />
                  <p className="text-xs tracking-[0.3em] uppercase text-orange-400 font-semibold mb-4">Estimated Market Value</p>
                  <div className="text-6xl font-bold mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
                    Rs. {result.predicted_price_lkr.toLocaleString()}
                  </div>
                  <div className="text-orange-400 font-semibold text-lg">
                    {result.predicted_price_mn} Million LKR
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/10 flex gap-6 text-sm text-stone-400">
                    <div>
                      <div className="text-white font-semibold">{form.district}</div>
                      <div>District</div>
                    </div>
                    <div>
                      <div className="text-white font-semibold capitalize">{form.property_type}</div>
                      <div>Type</div>
                    </div>
                    <div>
                      <div className="text-white font-semibold">{form.bedrooms} bed / {form.bathrooms} bath</div>
                      <div>Rooms</div>
                    </div>
                    <div>
                      <div className="text-white font-semibold">{form.land_size_p}p</div>
                      <div>Land</div>
                    </div>
                  </div>
                </div>

                {/* SHAP explanation */}
                <div className="bg-white rounded-3xl border border-orange-100 shadow-xl shadow-orange-50 p-8">
                  <h3 className="text-base font-bold text-stone-900 mb-1" style={{ fontFamily: "Syne, sans-serif" }}>
                    🔍 Why this price?
                  </h3>
                  <p className="text-xs text-stone-400 mb-6">
                    SHAP values show which features push the price up (🟠) or down (⚫)
                  </p>
                  <div className="space-y-3">
                    {result.explanation.map((e, i) => {
                      const pct = Math.abs(e.shap_value) / maxShap * 100;
                      const positive = e.shap_value >= 0;
                      return (
                        <div key={i}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-stone-700 capitalize">
                              {e.feature.replace(/_/g, " ").replace("has ", "✓ ")}
                            </span>
                            <span className={`font-bold ${positive ? "text-orange-500" : "text-stone-400"}`}>
                              {positive ? "+" : ""}{e.shap_value.toFixed(3)}
                            </span>
                          </div>
                          <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${positive ? "bg-orange-400" : "bg-stone-400"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="mt-6 text-xs text-stone-400 leading-relaxed">
                    This explanation is generated by SHAP (SHapley Additive exPlanations) — an explainable AI technique that shows the contribution of each feature to the final price prediction.
                  </p>
                </div>
              </>
            ) : (
              /* Placeholder when no result yet */
              <div className="bg-white rounded-3xl border border-orange-100 shadow-xl shadow-orange-50 p-12 text-center">
                <div className="text-6xl mb-4">🏘️</div>
                <h3 className="text-lg font-bold text-stone-900 mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
                  Ready to Predict
                </h3>
                <p className="text-stone-400 text-sm leading-relaxed max-w-xs mx-auto">
                  Fill in your property details on the left and click "Predict Market Value" to get an AI-powered price estimate with full explainability.
                </p>
                <div className="mt-8 grid grid-cols-3 gap-4">
                  {["XGBoost Model", "SHAP Explainability", "Real LK Data"].map((tag, i) => (
                    <div key={i} className="px-3 py-2 rounded-xl bg-orange-50 border border-orange-100 text-xs font-semibold text-orange-600">
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
