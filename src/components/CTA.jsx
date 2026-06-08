import { motion } from 'framer-motion';
import { useState } from 'react';

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

export default function CTA() {
  const [email, setEmail] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [ageError, setAgeError] = useState('');

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
    <section className="relative py-24 px-6 border-t border-parchment/8">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.02] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: "url('/assets/paper-texture.webp')" }}
      />

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-8 bg-sepia/40" />
            <span className="text-ornament">THE INVITATION</span>
            <div className="h-px w-8 bg-sepia/40" />
          </div>

          <h2 className="text-4xl md:text-6xl font-serif text-parchment-light mb-6 leading-tight">
            Your story deserves a <br />
            <span className="italic text-sepia/70">better foundation</span>
          </h2>

          <p className="text-parchment/50 text-lg mb-10 max-w-xl mx-auto font-light">
            Join 2,000+ fiction architects who have already claimed their seat in the Parlour. 
            The doors open soon.
          </p>

          <div className="max-w-md mx-auto space-y-5">
            {/* Email + Button */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative group flex-1 w-full">
                <div className="absolute -inset-1 bg-gradient-to-r from-sepia/20 to-blood/10 rounded-sm blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@inkwell.com"
                  className="relative input-inkwell w-full"
                />
              </div>
              <button
                disabled={!canSubmit}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 transition-all duration-300 ${
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
                <span>Enter the Parlour</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" className="group-hover:translate-x-1 transition-transform">
                  <path d="M1 7h12M7 1l6 6-6 6" />
                </svg>
              </button>
            </div>

            {/* Age Verification */}
            <div className="flex items-center justify-center gap-3">
              <span className="text-[10px] text-parchment/30 uppercase tracking-wider">Birth:</span>
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

            {ageError && (
              <p className="text-[10px] text-blood/60 flex items-center justify-center gap-1">
                <span>✗</span> {ageError}
              </p>
            )}

            {/* Terms Checkbox */}
            <label className="flex items-start justify-center gap-2.5 cursor-pointer group">
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
              <span className="text-[11px] text-parchment/40 leading-relaxed text-left">
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

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-parchment/30">
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-sepia/40" />
              No spam. Just letters from the Parlour.
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-sepia/40" />
              Unsubscribe anytime.
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}