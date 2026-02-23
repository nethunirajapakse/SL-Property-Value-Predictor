import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 md:px-14 py-4 bg-[#faf7f2]/80 backdrop-blur-xl border-b border-orange-100">
      <div onClick={() => navigate("/")} className="cursor-pointer">
        <span className="text-xl font-bold tracking-widest uppercase" style={{ fontFamily: "Syne, sans-serif" }}>
          Estate<span className="text-orange-500">Vision</span>
        </span>
        <div className="text-[9px] tracking-[0.3em] text-orange-400 uppercase mt-0.5">Ceylon Property Valuator</div>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm text-stone-500 font-medium">
        <a href="#features" className="hover:text-orange-500 transition-colors">Features</a>
        <a href="#how" className="hover:text-orange-500 transition-colors">How It Works</a>
        <a href="#insights" className="hover:text-orange-500 transition-colors">Insights</a>
      </div>
      <button
        onClick={() => navigate("/predict")}
        className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200 shadow-md shadow-orange-200"
      >
        Get Started
      </button>
    </nav>
  );
}
