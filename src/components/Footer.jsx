export default function Footer() {
  return (
    <footer className="relative py-12 px-6 border-t border-parchment/8">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.015] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: "url('/assets/paper-texture.webp')" }}
      />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-sepia/60" />
              <span className="text-sm font-serif text-parchment/70">
                Inkblot <span className="italic text-sepia/60">Parlour</span>
              </span>
            </div>
            <p className="text-[10px] text-parchment/30 leading-relaxed max-w-[180px]">
              A literary sanctuary for fiction architects. Build your world. Track the tension. Find your circle.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[9px] uppercase tracking-[0.2em] text-parchment/30 mb-4">The Parlour</h4>
            <ul className="space-y-2">
              {['The Feed', 'Asks', 'Journals', 'Societies'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-xs text-parchment/40 hover:text-parchment/70 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Method */}
          <div>
            <h4 className="text-[9px] uppercase tracking-[0.2em] text-parchment/30 mb-4">The Method</h4>
            <ul className="space-y-2">
              {['Continuity Memory', 'Tension Mapping', 'Secret Web', 'Character Cabinet'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-xs text-parchment/40 hover:text-parchment/70 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-[9px] uppercase tracking-[0.2em] text-parchment/30 mb-4">Connect</h4>
            <ul className="space-y-2">
              {['Manifesto', 'Twitter', 'Discord', 'Privacy'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-xs text-parchment/40 hover:text-parchment/70 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-parchment/8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[9px] text-parchment/20 tracking-widest">
            © 2025 INKBLOT PARLOUR STUDIO. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4 text-[9px] text-parchment/20">
            <span>Crafted with ink and patience</span>
            <span className="w-px h-3 bg-parchment/10" />
            <span>v0.1.0 — Beta</span>
          </div>
        </div>
      </div>
    </footer>
  );
}