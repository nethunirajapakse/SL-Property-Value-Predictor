export default function Footer() {
  return (
    <footer className="border-t border-white/5 px-10 py-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <div className="text-lg font-bold tracking-widest uppercase font-display">
            Estate<span className="text-cyan-400">Vision</span>
          </div>
          <div className="text-xs text-gray-600 mt-1 tracking-widest">© 2025 Ceylon Property Valuator</div>
        </div>
        <div className="flex gap-8 text-sm text-gray-500">
          <a href="#" className="hover:text-cyan-400 transition-colors">Privacy</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Terms</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
