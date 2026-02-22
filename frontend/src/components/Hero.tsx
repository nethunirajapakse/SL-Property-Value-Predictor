export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse-slow delay-1000 pointer-events-none" />

      {/* Grid lines overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      {/* Badge */}
      <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs tracking-widest uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse inline-block"></span>
        AI-Powered · Real-Time · Sri Lanka
      </div>

      {/* Headline */}
      <h1 className="font-display text-5xl md:text-7xl font-extrabold leading-none tracking-tight max-w-4xl">
        <span className="block text-white">Predict Property</span>
        <span className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-400 bg-clip-text text-transparent mt-2">
          Values Instantly
        </span>
      </h1>

      <p className="mt-8 text-base md:text-lg text-gray-400 max-w-xl leading-relaxed">
        Harness advanced machine learning trained on Sri Lankan real estate data to get
        precise property valuations — by district, amenities, and market trends.
      </p>

      {/* CTA Buttons */}
      <div className="mt-12 flex flex-col sm:flex-row gap-4 items-center">
        <button className="group relative px-10 py-4 rounded-2xl font-semibold text-base overflow-hidden shadow-lg shadow-cyan-500/20">
          <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600"></span>
          <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <span className="relative text-white flex items-center gap-2">
            Predict Now
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </button>
        <button className="px-10 py-4 rounded-2xl font-semibold text-base border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-200">
          Learn More
        </button>
      </div>

      {/* Stats row */}
      <div className="mt-20 flex flex-wrap justify-center gap-12">
        {[
          { value: "98%", label: "Prediction Accuracy" },
          { value: "10K+", label: "Properties Analyzed" },
          { value: "25", label: "Districts Covered" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-3xl font-bold font-display bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
              {stat.value}
            </div>
            <div className="text-xs text-gray-500 tracking-widest uppercase mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-gray-600 to-transparent animate-bounce"></div>
      </div>
    </section>
  );
}
