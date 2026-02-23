import { useNavigate } from "react-router-dom";
import { Home, Cpu, CircleDollarSign } from "lucide-react"; // Import icons

const steps = [
  {
    num: "01",
    title: "Enter Property Details",
    desc: "Input location, size, property type, and key features like bedrooms, bathrooms, and lot area.",
    icon: <Home className="w-8 h-8 text-orange-500" />, // Use component
  },
  {
    num: "02",
    title: "AI Model Analyzes",
    desc: "Our XGBoost model processes 40+ data points against real Sri Lankan market data in milliseconds.",
    icon: <Cpu className="w-8 h-8 text-orange-500" />,
  },
  {
    num: "03",
    title: "Get Your Valuation",
    desc: "Receive an accurate price estimate with a confidence range and comparable properties nearby.",
    icon: <CircleDollarSign className="w-8 h-8 text-orange-500" />,
  },
];

export default function HowItWorks() {
  const navigate = useNavigate();

  return (
    <section id="how" className="px-8 md:px-14 py-24 bg-[#faf7f2]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-orange-500 font-semibold mb-3">
            The Process
          </p>
          <h2
            className="text-4xl md:text-6xl font-bold text-stone-900"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Three Steps to Your{" "}
            <span className="text-orange-500">True Value</span>
          </h2>
        </div>

        <div className="relative grid md:grid-cols-3 gap-8">
          <div className="hidden md:block absolute top-10 left-[20%] right-[20%] border-t-2 border-dashed border-orange-200" />

          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="relative w-20 h-20 flex flex-col items-center justify-center rounded-full bg-white border-2 border-orange-200 shadow-md mb-6 z-10">
                {step.icon} {/* Render the icon component directly */}
                <span className="text-xs font-bold text-white absolute -top-2 -right-2 bg-orange-500 w-6 h-6 rounded-full flex items-center justify-center text-[10px]">
                  {step.num}
                </span>
              </div>
              <h3
                className="text-base font-bold text-stone-900 mb-2"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                {step.title}
              </h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
        {/* ... rest of your code */}
      </div>
    </section>
  );
}
