const houses = [
  {
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
    label: "Colombo 7 Villa",
    price: "LKR 48.5M",
    tag: "Luxury",
    rotate: "-rotate-2",
    float: "animate-float",
  },
  {
    img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80",
    label: "Kandy Highlands",
    price: "LKR 22.1M",
    tag: "Hill Country",
    rotate: "rotate-1",
    float: "animate-float-delay",
  },
  {
    img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80",
    label: "Galle Beachside",
    price: "LKR 35.8M",
    tag: "Coastal",
    rotate: "-rotate-1",
    float: "animate-float",
  },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-[#faf7f2] overflow-hidden flex flex-col lg:flex-row items-center px-8 md:px-14 pt-28 pb-16 gap-12">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-150 h-150 bg-orange-100 rounded-full blur-[120px] opacity-60 pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-100 h-100 bg-amber-100 rounded-full blur-[100px] opacity-50 pointer-events-none translate-y-1/2 -translate-x-1/3" />

      {/* Dot grid texture */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #d97706 1px, transparent 1px)", backgroundSize: "30px 30px" }}
      />

      {/* LEFT: Text content */}
      <div className="relative flex-1 max-w-xl z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-orange-600 text-xs tracking-widest uppercase font-semibold mb-8 animate-fade-up">
          AI · Real-Time · Sri Lanka
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold leading-none tracking-tight text-stone-900 animate-fade-up delay-200" style={{ fontFamily: "Syne, sans-serif" }}>
          Discover Your<br />
          <span className="text-orange-500">True Property</span><br />
          Value
        </h1>

        <p className="mt-6 text-base text-stone-500 leading-relaxed max-w-md animate-fade-up delay-400">
          AI-powered valuations for Sri Lankan real estate — trained on thousands of verified listings across all 25 districts.
        </p>

        <div className="mt-10 flex flex-wrap gap-4 animate-fade-up delay-600">
          <button className="group px-8 py-3.5 rounded-2xl font-semibold text-sm bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200 shadow-lg shadow-orange-200 flex items-center gap-2">
            Predict Now
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          <button className="px-8 py-3.5 rounded-2xl font-semibold text-sm border-2 border-stone-200 text-stone-600 hover:border-orange-300 hover:text-orange-600 transition-all duration-200 bg-white">
            Learn More
          </button>
        </div>
      </div>

      {/* RIGHT: House cards */}
      <div className="relative flex-1 flex items-center justify-center z-10 min-h-[420px] w-full lg:w-auto">
        <div className="relative w-full max-w-lg h-[420px]">
          {houses.map((h, i) => (
            <div
              key={i}
              className={`absolute bg-white rounded-3xl shadow-xl overflow-hidden border border-orange-50 ${h.rotate} ${h.float} transition-shadow hover:shadow-2xl hover:shadow-orange-200/50`}
              style={{
                width: i === 0 ? "62%" : "52%",
                top: i === 0 ? "0%" : i === 1 ? "28%" : "auto",
                bottom: i === 2 ? "0%" : "auto",
                left: i === 0 ? "0%" : i === 2 ? "0%" : "auto",
                right: i === 1 ? "0%" : "auto",
                zIndex: i === 0 ? 10 : i === 1 ? 20 : 15,
              }}
            >
              <img src={h.img} alt={h.label} className="w-full h-40 object-cover" />
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-stone-800" style={{ fontFamily: "Syne, sans-serif" }}>{h.label}</span>
                  <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full font-medium">{h.tag}</span>
                </div>
                <div className="text-orange-500 font-bold text-base mt-1">{h.price}</div>
              </div>
            </div>
          ))}

          {/* Floating badge */}
          <div className="absolute top-1/2 right-0 translate-x-4 -translate-y-1/2 bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-2xl shadow-lg shadow-orange-300 z-30 rotate-6">
            🏡 AI Predicted
          </div>
        </div>
      </div>
    </section>
  );
}
