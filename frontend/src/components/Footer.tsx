export default function Footer() {
  return (
    <footer className="bg-stone-900 text-white px-8 md:px-14 py-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <div className="text-xl font-bold tracking-widest uppercase" style={{ fontFamily: "Syne, sans-serif" }}>
            Estate<span className="text-orange-400">Vision</span>
          </div>
          <div className="text-xs text-stone-500 mt-1 tracking-widest">© 2025 Ceylon Property Valuator</div>
        </div>
        <div className="flex gap-8 text-sm text-stone-400">
          <a href="/privacy" className="hover:text-orange-400 transition-colors">Privacy</a>
          <a href="/terms" className="hover:text-orange-400 transition-colors">Terms</a>
          <a href="/contact" className="hover:text-orange-400 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
