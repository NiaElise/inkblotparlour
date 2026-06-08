import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const writingFragments = [
  '"The ink whispered secrets the author never meant to tell."',
  '"She built worlds in margins, between the lines of a life she was escaping."',
  '"Every story is an argument with silence."',
  '"The best characters are the ones who refuse to obey."',
];

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 50 }, (_, i) => currentYear - 14 - i);

function calculateAge(birthMonth, birthYear) {
  if (!birthMonth || !birthYear) return 0;
  const now = new Date();
  const birth = new Date(birthYear, months.indexOf(birthMonth), 1);
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < 1)) {
    age--;
  }
  return age;
}

export default function Hero() {
  const [fragmentIndex, setFragmentIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [ageError, setAgeError] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setFragmentIndex((prev) => (prev + 1) % writingFragments.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const age = calculateAge(birthMonth, birthYear);
  const isOldEnough = age >= 15;
  const canSubmit = email && isOldEnough && agreedToTerms;

  const handleBirthMonthChange = (e) => {
    setBirthMonth(e.target.value);
    const newAge = calculateAge(e.target.value, birthYear);
    if (e.target.value && birthYear && newAge < 15) {
      setAgeError('You must be at least 15 to enter the Parlour.');
    } else {
      setAgeError('');
    }
  };

  const handleBirthYearChange = (e) => {
    setBirthYear(e.target.value);
    const newAge = calculateAge(birthMonth, e.target.value);
    if (birthMonth && e.target.value && newAge < 15) {
      setAgeError('You must be at least 15 to enter the Parlour.');
    } else {
      setAgeError('');
    }
  };

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

            {/* Signup Form */}
            <div className="space-y-5">
              {/* Email */}
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="relative group w-full sm:w-auto">
                  <div className="absolute -inset-1 bg-gradient-to-r from-sepia/20 to-blood/10 rounded-sm blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@inkwell.com"
                    className="relative w-full sm:w-72 input-inkwell"
                  />
                </div>
                <button
                  disabled={!canSubmit}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 group transition-all duration-300 ${
                    canSubmit
                      ? 'btn-blood cursor-pointer'
                      : 'border border-parchment/10 bg-ink-warm/30 text-parchment/30 cursor-not-allowed'
                  }`}
                  style={{
                    padding: '12px 24px',
                    fontSize: '13px',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    borderRadius: '2px',
                  }}
                >
                  Enter the Parlour
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" className="group-hover:translate-x-1 transition-transform">
                    <path d="M1 7h12M7 1l6 6-6 6" />
                  </svg>
                </button>
              </div>

              {/* Age & Terms Row */}
              <div className="space-y-3">
                {/* Age Verification — Month/Year */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-parchment/30 uppercase tracking-wider shrink-0">Birth:</span>
                  <select
                    value={birthMonth}
                    onChange={handleBirthMonthChange}
                    className="bg-ink-warm/40 border border-parchment/15 rounded-sm px-2.5 py-1.5 text-xs text-parchment/60 focus:outline-none focus:border-sepia/50 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Month</option>
                    {months.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <select
                    value={birthYear}
                    onChange={handleBirthYearChange}
                    className="bg-ink-warm/40 border border-parchment/15 rounded-sm px-2.5 py-1.5 text-xs text-parchment/60 focus:outline-none focus:border-sepia/50 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Year</option>
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  {birthMonth && birthYear && (
                    <span className={`text-[10px] ${isOldEnough ? 'text-emerald-500/60' : 'text-blood/60'}`}>
                      {isOldEnough ? '✓ of age' : '✗ too young'}
                    </span>
                  )}
                </div>

                {/* Error message */}
                {ageError && (
                  <p className="text-[10px] text-blood/60 flex items-center gap-1">
                    <span>✗</span> {ageError}
                  </p>
                )}

                {/* Terms Checkbox */}
                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <div className="relative shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-all duration-200 ${
                      agreedToTerms
                        ? 'bg-sepia/30 border-sepia/50'
                        : 'bg-ink-warm/30 border-parchment/15 group-hover:border-parchment/30'
                    }`}>
                      {agreedToTerms && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#e8ddd0" strokeWidth="1.5">
                          <path d="M2 5l2 2 4-4" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] text-parchment/40 leading-relaxed">
                    I agree to the{' '}
                    <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-sepia/60 hover:text-sepia underline underline-offset-2 transition-colors">
                      Terms of Service
                    </a>
                    {' '}and{' '}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-sepia/60 hover:text-sepia underline underline-offset-2 transition-colors">
                      Privacy Policy
                    </a>
                  </span>
                </label>
              </div>
            </div>

            <p className="mt-4 text-xs text-parchment/30 tracking-wider uppercase">
              Limited keys for the Architect Beta — <span className="text-sepia/60">7 remaining</span>
            </p>

            {/* Social proof - handwritten style */}
            <div className="mt-8 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-ink bg-gradient-to-br from-sepia/30 to-inkwell
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