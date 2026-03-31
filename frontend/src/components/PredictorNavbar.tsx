import { useNavigate } from "react-router-dom";

export default function PredictorNavbar() {
  const navigate = useNavigate();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 md:px-14 py-4 bg-[#faf7f2]/80 backdrop-blur-xl border-b border-orange-100">
      <div onClick={() => navigate("/")} className="cursor-pointer">
        <span className="text-xl font-bold tracking-widest uppercase" style={{ fontFamily: "Syne, sans-serif" }}>
          Estate<span className="text-orange-500">Vision</span>
        </span>
      </div>
      <button onClick={() => navigate("/")} className="text-sm text-stone-500 hover:text-orange-500 font-medium">
        Back to Home
      </button>
    </nav>
  );
}
