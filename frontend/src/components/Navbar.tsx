export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-10 py-5 backdrop-blur-xl bg-slate-950/60 border-b border-white/5">
      <div className="flex flex-col">
        <span className="text-xl font-bold tracking-widest uppercase text-white font-display">
          Estate<span className="text-cyan-400">Vision</span>
        </span>
        <span className="text-[10px] tracking-[0.3em] text-cyan-400/70 uppercase">
          Ceylon Property Valuator
        </span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm text-gray-400 tracking-wide">
        <a href="#features" className="hover:text-white transition-colors duration-200">Features</a>
        <a href="#how" className="hover:text-white transition-colors duration-200">How It Works</a>
        <a href="#insights" className="hover:text-white transition-colors duration-200">Insights</a>
      </div>
      <button className="relative group px-6 py-2.5 rounded-xl text-sm font-semibold tracking-wide overflow-hidden">
        <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 transition-opacity duration-300"></span>
        <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        <span className="relative text-white">Get Started</span>
      </button>
    </nav>
  );
}
