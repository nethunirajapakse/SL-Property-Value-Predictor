const steps = [
  {
    num: "01",
    title: "Enter Property Details",
    desc: "Input location, size, property type, and key features like bedrooms, bathrooms, and lot area.",
    icon: "🏠",
  },
  {
    num: "02",
    title: "AI Model Analyzes",
    desc: "Our XGBoost model processes 40+ data points against real Sri Lankan market data in milliseconds.",
    icon: "🤖",
  },
  {
    num: "03",
    title: "Get Your Valuation",
    desc: "Receive an accurate price estimate with a confidence range and comparable properties nearby.",
    icon: "💰",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="px-8 md:px-14 py-24 bg-[#faf7f2]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-orange-500 font-semibold mb-3">The Process</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-stone-900" style={{ fontFamily: "Syne, sans-serif" }}>
            Three Steps to Your{" "}
            <span className="text-orange-500">True Value</span>
          </h2>
        </div>

        <div className="relative grid md:grid-cols-3 gap-8">
          {/* Dotted line connector */}
          <div className="hidden md:block absolute top-10 left-[20%] right-[20%] border-t-2 border-dashed border-orange-200" />

          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="relative w-20 h-20 flex flex-col items-center justify-center rounded-full bg-white border-2 border-orange-200 shadow-md mb-6 z-10">
                <span className="text-2xl">{step.icon}</span>
                <span className="text-xs font-bold text-orange-400 absolute -top-2 -right-2 bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px]">
                  {step.num}
                </span>
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2" style={{ fontFamily: "Syne, sans-serif" }}>{step.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <button className="group px-10 py-4 rounded-2xl font-semibold bg-orange-500 hover:bg-orange-600 text-white text-sm transition-all duration-200 shadow-lg shadow-orange-200 inline-flex items-center gap-2">
            Start Your Prediction
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
