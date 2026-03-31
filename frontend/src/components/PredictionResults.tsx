export default function PredictionResults({ result, form }: any) {
  const maxShap = result ? Math.max(...result.explanation.map((e: any) => Math.abs(e.shap_value))) : 1;

  return (
    <div id="result" className="flex flex-col gap-6">
      {result ? (
        <>
          <div className="relative overflow-hidden bg-stone-900 rounded-3xl p-8 text-white shadow-2xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500 rounded-full blur-[80px] opacity-20 pointer-events-none" />
            <p className="text-xs tracking-[0.3em] uppercase text-orange-400 font-semibold mb-4">Estimated Market Value</p>
            <div className="text-6xl font-bold mb-2" style={{ fontFamily: "Syne, sans-serif" }}>Rs. {result.predicted_price_lkr.toLocaleString()}</div>
            <div className="text-orange-400 font-semibold text-lg">{result.predicted_price_mn} Million LKR</div>
            <div className="mt-6 pt-6 border-t border-white/10 flex gap-6 text-sm text-stone-400">
                <div><div className="text-white font-semibold">{form.district}</div><div>District</div></div>
                <div><div className="text-white font-semibold capitalize">{form.property_type}</div><div>Type</div></div>
                <div><div className="text-white font-semibold">{form.bedrooms}b / {form.bathrooms}b</div><div>Rooms</div></div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-orange-100 shadow-xl shadow-orange-50 p-8">
            <h3 className="text-base font-bold text-stone-900 mb-1" style={{ fontFamily: "Syne, sans-serif" }}>🔍 Why this price?</h3>
            <p className="text-xs text-stone-400 mb-6">SHAP values show price impact (🟠 Up / ⚫ Down)</p>
            <div className="space-y-3">
              {result.explanation.map((e: any, i: number) => {
                const pct = (Math.abs(e.shap_value) / maxShap) * 100;
                const positive = e.shap_value >= 0;
                return (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-stone-700 capitalize">{e.feature.replace(/_/g, " ").replace("has ", "✓ ")}</span>
                      <span className={`font-bold ${positive ? "text-orange-500" : "text-stone-400"}`}>{positive ? "+" : ""}{e.shap_value.toFixed(3)}</span>
                    </div>
                    <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-700 ${positive ? "bg-orange-400" : "bg-stone-400"}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-3xl border border-orange-100 shadow-xl shadow-orange-50 p-12 text-center">
          <div className="text-6xl mb-4">🏘️</div>
          <h3 className="text-lg font-bold text-stone-900 mb-2" style={{ fontFamily: "Syne, sans-serif" }}>Ready to Predict</h3>
          <p className="text-stone-400 text-sm max-w-xs mx-auto">Fill in details and click predict for an AI-powered estimate.</p>
          <div className="mt-8 flex justify-center gap-4">
             {["XGBoost", "SHAP", "LK Data"].map((tag) => (
               <span key={tag} className="px-3 py-2 rounded-xl bg-orange-50 border border-orange-100 text-xs font-semibold text-orange-600">{tag}</span>
             ))}
          </div>
        </div>
      )}
    </div>
  );
}
