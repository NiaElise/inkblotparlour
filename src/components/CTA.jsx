import { motion } from 'framer-motion';

export default function CTA() {
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

          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-sepia/20 to-blood/10 rounded-sm blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <input
                type="email"
                placeholder="your@inkwell.com"
                className="relative input-inkwell w-full sm:w-72"
              />
            </div>
            <button className="btn-blood w-full sm:w-auto flex items-center justify-center gap-2 group">
              <span>Enter the Parlour</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" className="group-hover:translate-x-1 transition-transform">
                <path d="M1 7h12M7 1l6 6-6 6" />
              </svg>
            </button>
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