import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const writingFragments = [
  '"The ink whispered secrets the author never meant to tell."',
  '"She built worlds in margins, between the lines of a life she was escaping."',
  '"Every story is an argument with silence."',
  '"The best characters are the ones who refuse to obey."',
];

export default function Hero() {
  const [fragmentIndex, setFragmentIndex] = useState(0);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate(`/signup?email=${encodeURIComponent(email)}`);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setFragmentIndex((prev) => (prev + 1) % writingFragments.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background texture overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: "url('/assets/paper-texture.webp')" }}
      />

      {/* Ambient vignette glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-radial from-sepia/5 via-transparent to-transparent opacity-60 pointer-events-none" />

      {/* Ink bleed decorations */}
      <div className="ink-bleed-decoration top-20 left-10" />
      <div className="ink-bleed-decoration bottom-20 right-10 w-48 h-48" />

      <div className="relative w-full max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          {/* Left — Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="md:col-span-7"
          >
            {/* Ornament */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-sepia/40" />
              <span className="text-ornament">A Social Sanctuary</span>
              <div className="h-px flex-1 bg-parchment/10" />
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[1.1] mb-6 text-parchment-light">
              A parlour for{' '}
              <span className="italic text-sepia/70 block md:inline">fiction</span>
              <br />
              <span className="text-4xl md:text-5xl lg:text-6xl text-parchment/60 font-normal italic">
                architects & dreamers
              </span>
            </h1>

            <p className="text-lg md:text-xl text-parchment/50 max-w-xl leading-relaxed mb-10 font-light">
              A quiet corner of the internet where novelists, roleplayers, and worldbuilders 
              gather. Build your lore, track your tensions, and share fragments with those 
              who understand the craft.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="relative group w-full sm:w-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-sepia/20 to-blood/10 rounded-sm blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <input
                  type="email"
                  placeholder="your@inkwell.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="relative w-full sm:w-72 input-inkwell"
                />
              </div>
              <button 
                onClick={handleEnter}
                className="btn-blood w-full sm:w-auto flex items-center justify-center gap-2 group"
              >
                Enter the Parlour
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" className="group-hover:translate-x-1 transition-transform">
                  <path d="M1 7h12M7 1l6 6-6 6" />
                </svg>
              </button>
            </div>

            <p className="mt-4 text-xs text-parchment/30 tracking-wider uppercase">
              Limited keys for the Architect Beta — <span className="text-sepia/60">7 remaining</span>
            </p>

            {/* Social proof - handwritten style */}
            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-ink bg-gradient-to-br from-sepia/30 to-ink-well
                               flex items-center justify-center text-[10px] font-serif italic text-parchment/60"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="text-xs text-parchment/40">
                <span className="text-parchment/80 font-medium">2,000+</span> fiction architects inside
              </div>
            </div>
          </motion.div>

          {/* Right — Rotating Fragment / Feed Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            className="md:col-span-5 relative"
          >
            {/* Typewriter / rotating fragment vignette */}
            <div className="relative old-paper rounded-sm p-6 md:p-8 border border-parchment/10">
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-sepia/20" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-sepia/20" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-sepia/20" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-sepia/20" />

              <div className="flex items-center gap-2 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-sepia/50" />
                <span className="text-ornament">A FRAGMENT</span>
              </div>

              <AnimatedFragment text={writingFragments[fragmentIndex]} />

              <div className="mt-6 pt-4 border-t border-parchment/8 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-parchment/30">
                  <span className="font-mono">~</span>
                  <span className="italic">from the feed</span>
                </div>
                <div className="flex gap-1">
                  {writingFragments.map((_, i) => (
                    <span
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${
                        i === fragmentIndex ? 'bg-sepia/60' : 'bg-parchment/10'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative element */}
            <div className="mt-6 flex items-center gap-4 text-parchment/20 text-xs font-mono tracking-widest">
              <span>{'/*'}</span>
              <span className="italic font-serif">where stories breathe</span>
              <span>{'*/'}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function AnimatedFragment({ text }) {
  return (
    <motion.div
      key={text}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6 }}
    >
      <p className="text-xl md:text-2xl font-serif italic text-parchment/80 leading-relaxed">
        {text}
      </p>
    </motion.div>
  );
}