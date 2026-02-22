const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Accurate Predictions",
    desc: "XGBoost and ensemble models deliver reliable valuations trained on thousands of verified Sri Lankan property listings.",
    accent: "from-cyan-400 to-blue-500",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Location Intelligence",
    desc: "Granular analysis across all 25 districts — factoring proximity to schools, hospitals, transport, and commercial zones.",
    accent: "from-blue-400 to-violet-500",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Data-Driven Insights",
    desc: "Interactive dashboards reveal price trends, growth corridors, and yield forecasts across the Sri Lankan market.",
    accent: "from-violet-400 to-cyan-400",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative px-6 py-28 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-xs tracking-[0.3em] uppercase text-cyan-400 mb-4">Why Estate Vision</p>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
          Built for Sri Lanka's<br />
          <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
            Real Estate Market
          </span>
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <div
            key={i}
            className="group relative p-8 rounded-3xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            {/* Glow on hover */}
            <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br ${f.accent} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500`} />

            {/* Icon */}
            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${f.accent} text-white mb-6 shadow-lg`}>
              {f.icon}
            </div>

            <h3 className="text-lg font-semibold text-white mb-3 font-display">{f.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
