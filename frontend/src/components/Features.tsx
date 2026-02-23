import { BarChart3, MapPin, Zap } from "lucide-react";

const features = [
  {
    icon: <BarChart3 className="w-6 h-6 text-orange-600" />,
    title: "Accurate Predictions",
    desc: "XGBoost and ensemble models deliver reliable valuations trained on thousands of verified Sri Lankan property listings.",
    bg: "bg-orange-50",
    border: "border-orange-200",
    iconBg: "bg-orange-100",
  },
  {
    icon: <MapPin className="w-6 h-6 text-amber-600" />,
    title: "Location Intelligence",
    desc: "Granular analysis across all 25 districts — factoring proximity to schools, hospitals, transport, and commercial zones.",
    bg: "bg-amber-50",
    border: "border-amber-200",
    iconBg: "bg-amber-100",
  },
  {
    icon: <Zap className="w-6 h-6 text-stone-600" />,
    title: "Data-Driven Insights",
    desc: "Interactive dashboards reveal price trends, growth corridors, and yield forecasts across the Sri Lankan market.",
    bg: "bg-stone-50",
    border: "border-stone-200",
    iconBg: "bg-stone-100",
  },
];

export default function Features() {
  return (
    <section id="features" className="px-8 md:px-14 py-24 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-orange-500 font-semibold mb-3">
            Why Estate Vision
          </p>
          <h2
            className="text-4xl md:text-6xl font-bold text-stone-900"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Built for Sri Lanka's
            <br />
            <span className="text-orange-500">Real Estate Market</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className={`group p-8 rounded-3xl border ${f.border} ${f.bg} hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-orange-100`}
            >
              <div
                className={`inline-flex w-12 h-12 items-center justify-center rounded-2xl ${f.iconBg} mb-6`}
              >
                {f.icon}
              </div>
              <h3
                className="text-lg font-bold text-stone-900 mb-3"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                {f.title}
              </h3>
              <p className="text-stone-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
