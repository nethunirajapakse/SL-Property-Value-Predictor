const DISTRICTS = ["Colombo", "Gampaha", "Kalutara", "Kandy", "Galle", "Matara", "Kurunegala", "Ratnapura", "Negombo", "Other"];
const PROPERTY_TYPES = ["house", "apartment"];
const AMENITIES = [
  { key: "has_parking", label: "🚗 Parking" },
  { key: "has_pool", label: "🏊 Pool" },
  { key: "has_garden", label: "🌳 Garden" },
  { key: "has_furnished", label: "🛋️ Furnished" },
  { key: "has_ac", label: "❄️ AC" },
  { key: "has_security", label: "🔒 Security" },
  { key: "has_highway", label: "🛣️ Highway" },
  { key: "has_generator", label: "⚡ Generator" },
  { key: "has_solar", label: "☀️ Solar" },
];

export default function PropertyForm({ form, setForm, predict, loading, error }: any) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev: any) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const toggleAmenity = (key: string) => {
    setForm((prev: any) => ({ ...prev, [key]: prev[key] === 1 ? 0 : 1 }));
  };

  return (
    <div className="bg-white rounded-3xl border border-orange-100 shadow-xl shadow-orange-50 p-8">
      <h2 className="text-lg font-bold text-stone-900 mb-6" style={{ fontFamily: "Syne, sans-serif" }}>
        Property Details
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">District</label>
          <select name="district" value={form.district} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all">
            {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Type</label>
          <select name="property_type" value={form.property_type} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all capitalize">
            {PROPERTY_TYPES.map((t) => <option key={t} className="capitalize">{t}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        {[
          { label: "Bedrooms", name: "bedrooms", min: 1, max: 15 },
          { label: "Bathrooms", name: "bathrooms", min: 1, max: 10 },
          { label: "Land Size", name: "land_size_p", min: 1, max: 500, unit: "perches" },
          { label: "Floor Area", name: "floor_area", min: 0, max: 20000, unit: "sq ft" },
        ].map((f) => (
          <div key={f.name}>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
              {f.label} {f.unit && <span className="normal-case text-stone-400">({f.unit})</span>}
            </label>
            <input type="number" name={f.name} value={form[f.name]} onChange={handleChange} min={f.min} max={f.max} className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all" />
          </div>
        ))}
      </div>

      <div className="mb-7">
        <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Amenities</label>
        <div className="flex flex-wrap gap-2">
          {AMENITIES.map((a) => (
            <button key={a.key} type="button" onClick={() => toggleAmenity(a.key)} className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${form[a.key] === 1 ? "bg-orange-500 text-white border-orange-500" : "bg-stone-50 text-stone-500 border-stone-200"}`}>
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <button onClick={predict} disabled={loading} className="w-full py-4 rounded-2xl font-bold text-sm bg-orange-500 hover:bg-orange-600 disabled:bg-stone-300 text-white transition-all shadow-lg flex items-center justify-center gap-2">
        {loading ? "Analysing Property..." : "🔮 Predict Market Value"}
      </button>

      {error && <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">⚠️ {error}</div>}
    </div>
  );
}
