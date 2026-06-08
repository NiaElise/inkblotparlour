import { motion } from 'framer-motion';
import { useState } from 'react';

const skinOptions = [
  { id: 'noir', name: 'Noir', primary: '#0c090a', secondary: '#e8ddd0', accent: '#8b6f47', desc: 'Classic dark parchment' },
  { id: 'ember', name: 'Ember', primary: '#1a0e0a', secondary: '#f0d5b8', accent: '#b84040', desc: 'Warm blood-orange glow' },
  { id: 'abyss', name: 'Abyss', primary: '#05070a', secondary: '#c8d0e0', accent: '#5a7a9a', desc: 'Deep oceanic blue-black' },
  { id: 'violet', name: 'Violet', primary: '#0e0a12', secondary: '#e0d0e8', accent: '#8b5cf6', desc: 'Royal twilight tones' },
  { id: 'sepia', name: 'Sepia', primary: '#120e0a', secondary: '#d4c4a8', accent: '#6b5536', desc: 'Aged photograph warmth' },
  { id: 'custom', name: 'Custom', primary: '#0c090a', secondary: '#e8ddd0', accent: '#8b6f47', desc: 'Your own palette' },
];

const fontPairs = [
  { id: 'editorial', display: 'Playfair Display', body: 'Source Serif 4', desc: 'Classic literary' },
  { id: 'modern', display: 'Cormorant Garamond', body: 'Inter', desc: 'Elegant minimal' },
  { id: 'vintage', display: 'Cinzel', body: 'Crimson Pro', desc: 'Old-world charm' },
  { id: 'poetic', display: 'EB Garamond', body: 'Lora', desc: 'Soft & readable' },
];

export default function AestheticCustomization() {
  const [activeSkin, setActiveSkin] = useState('noir');
  const [activeFonts, setActiveFonts] = useState('editorial');
  const [showCustomizer, setShowCustomizer] = useState(false);

  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-transparent via-ink-well/20 to-transparent">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-sepia/40" />
            <span className="text-ornament">AESTHETIC CUSTOMIZATION</span>
            <span className="text-[8px] uppercase tracking-widest text-sepia/50 border border-sepia/20 px-1.5 py-0.5 rounded-sm">
              Collective+
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-parchment-light mb-4">
            Make the parlour <span className="italic text-sepia/70">yours</span>
          </h2>
          <p className="text-parchment/50 max-w-xl font-light leading-relaxed">
            Every writer's sanctuary should feel different. Customize your profile, journal, 
            and personal workspace with skins, fonts, and handcrafted themes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Preview Panel */}
          <div className="md:col-span-3">
            <div
              className="card-paper rounded-sm p-6 border transition-colors duration-700"
              style={{
                backgroundColor: skinOptions.find(s => s.id === activeSkin)?.primary,
                borderColor: `${skinOptions.find(s => s.id === activeSkin)?.accent}20`,
              }}
            >
              {/* Profile Preview */}
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-serif border-2"
                  style={{
                    backgroundColor: `${skinOptions.find(s => s.id === activeSkin)?.accent}20`,
                    borderColor: `${skinOptions.find(s => s.id === activeSkin)?.accent}40`,
                    color: skinOptions.find(s => s.id === activeSkin)?.secondary,
                  }}
                >
                  E
                </div>
                <div>
                  <h3
                    className="text-lg font-serif"
                    style={{ color: skinOptions.find(s => s.id === activeSkin)?.secondary }}
                  >
                    Elias Thorne
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: `${skinOptions.find(s => s.id === activeSkin)?.secondary}80` }}
                  >
                    @eliaswrites · Architect
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: `${skinOptions.find(s => s.id === activeSkin)?.secondary}50` }}
                  >
                    Building the Forgotten City. Tracking the threads.
                  </p>
                </div>
              </div>

              {/* Journal Preview */}
              <div
                className="p-4 rounded-sm mb-4"
                style={{
                  backgroundColor: `${skinOptions.find(s => s.id === activeSkin)?.accent}08`,
                  borderLeft: `2px solid ${skinOptions.find(s => s.id === activeSkin)?.accent}40`,
                }}
              >
                <p
                  className="text-xs tracking-widest uppercase mb-2"
                  style={{ color: `${skinOptions.find(s => s.id === activeSkin)?.accent}60` }}
                >
                  LATEST JOURNAL ENTRY
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: `${skinOptions.find(s => s.id === activeSkin)?.secondary}70` }}
                >
                  "The ink remembers what the author forgets. Every word leaves a residue, 
                  a ghost of intention that lingers between the lines..."
                </p>
              </div>

              {/* Tags */}
              <div className="flex gap-2">
                {['#worldbuilding', '#darkfantasy', '#wip'].map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-sm border"
                    style={{
                      color: `${skinOptions.find(s => s.id === activeSkin)?.accent}70`,
                      borderColor: `${skinOptions.find(s => s.id === activeSkin)?.accent}20`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Font Preview */}
            <div className="mt-4">
              <p className="text-xs text-parchment/40 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sepia/40" />
                Font preview: <span className="text-parchment/60">{fontPairs.find(f => f.id === activeFonts)?.desc}</span>
              </p>
              <div
                className="p-4 rounded-sm border border-parchment/10 bg-ink-warm/40"
                style={{ fontFamily: fontPairs.find(f => f.id === activeFonts)?.display }}
              >
                <p className="text-lg">The Parlour of Lost Words</p>
                <p
                  className="text-sm mt-1"
                  style={{ fontFamily: fontPairs.find(f => f.id === activeFonts)?.body }}
                >
                  A serif for titles, a sans for the story. Every font pair chosen for readability and mood.
                </p>
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="md:col-span-2 space-y-6">
            {/* Skins */}
            <div className="card-paper rounded-sm p-4">
              <h4 className="text-xs uppercase tracking-widest text-parchment/50 mb-3">Profile Skins</h4>
              <div className="grid grid-cols-2 gap-2">
                {skinOptions.map((skin) => (
                  <button
                    key={skin.id}
                    onClick={() => setActiveSkin(skin.id)}
                    className={`p-2.5 rounded-sm border text-left transition-all duration-300 ${
                      activeSkin === skin.id
                        ? 'border-sepia/50 bg-ink-warm/60'
                        : 'border-parchment/8 bg-ink-warm/20 hover:bg-ink-warm/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-3 h-3 rounded-full border"
                        style={{ backgroundColor: skin.primary, borderColor: skin.accent }}
                      />
                      <span className="text-xs text-parchment/70">{skin.name}</span>
                    </div>
                    <p className="text-[9px] text-parchment/30">{skin.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Pairs */}
            <div className="card-paper rounded-sm p-4">
              <h4 className="text-xs uppercase tracking-widest text-parchment/50 mb-3">Font Pairing</h4>
              <div className="space-y-2">
                {fontPairs.map((pair) => (
                  <button
                    key={pair.id}
                    onClick={() => setActiveFonts(pair.id)}
                    className={`w-full p-2.5 rounded-sm border text-left transition-all duration-300 ${
                      activeFonts === pair.id
                        ? 'border-sepia/50 bg-ink-warm/60'
                        : 'border-parchment/8 bg-ink-warm/20 hover:bg-ink-warm/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-parchment/70">{pair.desc}</span>
                      <span className="text-[9px] text-parchment/30 font-mono">{pair.display.split(' ')[0]}</span>
                    </div>
                    <div className="flex gap-2 mt-1 text-[9px] text-parchment/40">
                      <span>{pair.display}</span>
                      <span>+</span>
                      <span>{pair.body}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* CSS Customizer */}
            <div className="card-paper rounded-sm p-4">
              <button
                onClick={() => setShowCustomizer(!showCustomizer)}
                className="w-full flex items-center justify-between"
              >
                <h4 className="text-xs uppercase tracking-widest text-parchment/50">
                  Advanced CSS
                </h4>
                <span className="text-sepia/50 text-xs">{showCustomizer ? '−' : '+'}</span>
              </button>

              {showCustomizer && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3"
                >
                  <div className="bg-ink/80 border border-parchment/8 rounded-sm p-3 font-mono text-[10px] text-parchment/40">
                    <div className="flex items-center gap-2 mb-2 text-parchment/30">
                      <span className="w-2 h-2 rounded-full bg-blood/40" />
                      <span className="w-2 h-2 rounded-full bg-sepia/30" />
                      <span className="w-2 h-2 rounded-full bg-parchment/20" />
                      <span className="text-parchment/20 ml-2">custom.css</span>
                    </div>
                    <pre className="leading-relaxed">
                      <span className="text-sepia/40">:root</span> {'{'}{'\n'}
                      {'  '}--bg-primary: <span className="text-parchment/50">#0c090a</span>;{'\n'}
                      {'  '}--bg-secondary: <span className="text-parchment/50">#1a1315</span>;{'\n'}
                      {'  '}--text-primary: <span className="text-parchment/50">#e8ddd0</span>;{'\n'}
                      {'  '}--accent: <span className="text-parchment/50">#8b6f47</span>;{'\n'}
                      {'  '}--border-radius: <span className="text-parchment/50">2px</span>;{'\n'}
                      {'}'}
                    </pre>
                  </div>
                  <p className="text-[9px] text-parchment/30 mt-2">
                    Full CSS customization available for Collective tier.
                  </p>
                </motion.div>
              )}
            </div>

            <button className="btn-ink w-full text-xs">
              Apply Theme
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}