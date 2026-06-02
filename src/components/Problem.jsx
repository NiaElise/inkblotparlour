import { motion } from 'framer-motion';

export default function Problem() {
  return (
    <section className="relative py-24 px-6 border-t border-parchment/8">
      <div className="absolute inset-0 bg-gradient-to-b from-ink-well/20 via-transparent to-ink-well/10 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-sepia/40" />
              <span className="text-ornament">THE PROBLEM</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-serif text-parchment-light leading-tight mb-6">
              The mess behind <br />the<span className="italic text-sepia/70"> masterpiece</span>.
            </h2>

            <p className="text-parchment/50 leading-relaxed mb-8 font-light">
              Great fiction isn't just written — it's woven. But when your characters start 
              losing their eye color, secrets unravel too early, and tension plateaus in 
              the middle of Act II, the story breaks. And without a community to share the 
              burden, you're untangling it alone.
            </p>

            <ul className="space-y-4">
              {[
                'Scattered notes across five different apps and a notebook you lost',
                'Continuity errors that kill reader immersion before Chapter 3',
                'Flat character arcs with stakes that plateau and dissolve',
                'The "Middle Slump" — where narrative tension goes to die',
                'No circle of writers who understand the depth of your architecture',
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3 text-sm text-parchment/60"
                >
                  <span className="text-blood/50 mt-0.5 text-xs">✗</span>
                  <span className="font-light">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="old-paper rounded-sm border border-parchment/10 p-8">
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-sepia/20" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-sepia/20" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-sepia/20" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-sepia/20" />

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blood/20 to-ink-well border border-blood/30 flex items-center justify-center mx-auto mb-6">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-blood/50">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <p className="text-lg font-serif italic text-parchment/60 leading-relaxed">
                  "I spent three weeks mapping a genealogy tree in a spreadsheet before I realized I should be writing instead."
                </p>
                <div className="mt-6 text-xs text-parchment/30">
                  <span className="text-parchment/50">— A frustrated novelist</span>
                </div>

                <div className="mt-8 pt-6 border-t border-parchment/8">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { stat: '78%', label: 'of writers report continuity errors in first draft' },
                      { stat: '5+', label: 'apps used to track one storyworld' },
                      { stat: '92%', label: 'want a dedicated community of peers' },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="text-xl font-serif text-sepia/60">{item.stat}</div>
                        <div className="text-[9px] text-parchment/30 mt-1 leading-tight">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}