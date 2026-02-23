import { useNavigate } from "react-router-dom";

const houses = [
  {
    img: "https://th.bing.com/th/id/R.f475a4d5955a149db00f850cf5ff6bd7?rik=zMCMxHNdYA6CAQ&pid=ImgRaw&r=0",
    label: "Colombo 7 Villa",
    price: "LKR 48.5M",
    tag: "Luxury",
    rotate: "-rotate-6",
    float: "animate-float",
    pos: { top: "5%", left: "5%", zIndex: 10 },
  },
  {
    img: "https://www.indusexperiences.co.uk/app/uploads/2019/04/KANDY-HOUSE-s-1800x1200-c-center.jpg",
    label: "Kandy Highlands",
    price: "LKR 22.1M",
    tag: "Hill Country",
    rotate: "rotate-12",
    float: "animate-float-delay",
    pos: { top: "15%", right: "2%", zIndex: 20 },
  },
  {
    img: "https://i.pinimg.com/originals/3c/8a/c6/3c8ac691bb867963c6a4b3a493ccb770.jpg",
    label: "Galle Beachside",
    price: "LKR 35.8M",
    tag: "Coastal",
    rotate: "-rotate-3",
    float: "animate-float",
    pos: { bottom: "8%", left: "2%", zIndex: 30 },
  },
  {
    img: "https://lankarealestate.com/sale/wp-content/uploads/2022/01/Traditional-house-near-the-beach-in-Gintota-for-sale-sri-lanka-1_1170x870_acf_cropped.jpg",
    label: "Negombo Retreat",
    price: "LKR 18.9M",
    tag: "Suburban",
    rotate: "rotate-6",
    float: "animate-float-delay",
    pos: { bottom: "8%", right: "5%", zIndex: 40 },
  },
];

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen bg-[#faf7f2] overflow-hidden flex flex-col lg:flex-row items-center px-8 md:px-14 pt-28 pb-16 gap-12">
      <div className="absolute top-0 right-0 w-150 h-150 bg-orange-100 rounded-full blur-[120px] opacity-60 pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-100 h-100 bg-amber-100 rounded-full blur-[100px] opacity-50 pointer-events-none translate-y-1/2 -translate-x-1/3" />
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #d97706 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      {/* LEFT: Text */}
      <div className="relative flex-1 max-w-xl z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-orange-600 text-xs tracking-widest uppercase font-semibold mb-8 animate-fade-up">
          AI · Contemporary · Sri Lanka
        </div>
        <h1
          className="text-5xl md:text-7xl font-bold leading-none tracking-tight text-stone-900 animate-fade-up delay-200"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Discover Your
          <br />
          <span className="text-orange-500">True Property</span>
          <br />
          Value
        </h1>
        <p className="mt-6 text-base text-stone-500 leading-relaxed max-w-md animate-fade-up delay-400">
          AI-powered valuations for Sri Lankan real estate — trained on
          thousands of verified listings across all 25 districts.
        </p>
        <div className="mt-10 flex flex-wrap gap-4 animate-fade-up delay-600">
          <button
            onClick={() => navigate("/predict")}
            className="group px-8 py-3.5 rounded-2xl font-semibold text-sm bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200 shadow-lg shadow-orange-200 flex items-center gap-2"
          >
            Predict Now
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
          <a
            href="#features"
            className="px-8 py-3.5 rounded-2xl font-semibold text-sm border-2 border-stone-200 text-stone-600 hover:border-orange-300 hover:text-orange-600 transition-all duration-200 bg-white"
          >
            Learn More
          </a>
        </div>
      </div>

      {/* RIGHT: Scattered Cards */}
      <div className="relative flex-1 flex items-center justify-center z-10 min-h-[580px] w-full lg:w-auto">
        <div className="relative w-full max-w-xl h-[580px]">
          {houses.map((h, i) => (
            <div
              key={i}
              className={`absolute bg-white rounded-3xl shadow-xl overflow-hidden border border-orange-50 ${h.rotate} ${h.float} transition-all duration-300 hover:shadow-2xl hover:shadow-orange-200/50 hover:z-50 hover:scale-105`}
              style={{
                width: "55%", // Bigger cards
                ...h.pos, // Applied scatter positions
              }}
            >
              <img
                src={h.img}
                alt={h.label}
                className="w-full h-40 object-cover" // Slightly taller image for bigger cards
              />
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <span
                    className="text-sm font-semibold text-stone-800"
                    style={{ fontFamily: "Syne, sans-serif" }}
                  >
                    {h.label}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full font-medium">
                    {h.tag}
                  </span>
                </div>
                <div className="text-orange-500 font-bold text-base mt-1">
                  {h.price}
                </div>
              </div>
            </div>
          ))}

          {/* Center badge */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-stone-900 text-white text-[10px] uppercase tracking-[0.2em] font-black px-6 py-3 rounded-full shadow-2xl z-[40] rotate-[-4deg] border border-stone-700 whitespace-nowrap">
            ✨ AI Predicted
          </div>
        </div>
      </div>
    </section>
  );
}
