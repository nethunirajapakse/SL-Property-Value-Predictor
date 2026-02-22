const steps = [
  {
    num: "01",
    title: "Enter Property Details",
    desc: "Input location, size, property type, and key features like bedrooms, bathrooms, and lot area.",
  },
  {
    num: "02",
    title: "AI Model Analyzes",
    desc: "Our XGBoost model processes 40+ data points against real Sri Lankan market data in milliseconds.",
  },
  {
    num: "03",
    title: "Get Your Valuation",
    desc: "Receive an accurate price estimate with a confidence range and comparable properties nearby.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="px-6 py-28 bg-slate-950/40">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-cyan-400 mb-4">The Process</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
            Three Steps to Your{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              True Property Value
            </span>
          </h2>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

          <div className="grid md:grid-cols-3 gap-10">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="relative w-24 h-24 flex items-center justify-center mb-6">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30" />
                  <span className="font-display text-3xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                    {step.num}
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 text-center">
          <button className="group relative px-10 py-4 rounded-2xl font-semibold text-base overflow-hidden shadow-lg shadow-cyan-500/20">
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600" />
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative text-white flex items-center gap-2 mx-auto w-fit">
              Start Your Prediction
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
