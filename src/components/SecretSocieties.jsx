import { motion } from 'framer-motion';

const societies = [
  {
    name: 'The Order of the Inkwell',
    members: 47,
    tagline: 'For those who write by candlelight.',
    description: `A private circle dedicated to literary dark fantasy and gothic worldbuilding. Members share fragments, critique each other's lore depth, and collaborate on shared mythologies.`,
    seal: '◈',
    founders: ['E. Thorne', 'M. Harrow'],
    topics: ['Dark Fantasy', 'Gothic', 'Lore Deepening'],
    tier: 'Architect',
  },
  {
    name: `The Cartographer's Guild`,
    members: 33,
    tagline: 'Every world needs its mapmakers.',
    description: `A society for worldbuilders who obsess over geography, history, and the spaces between. We believe the map tells the story before a single character speaks.`,
    seal: '⌗',
    founders: ['Clara Vale', 'R. Ashford'],
    topics: ['Worldbuilding', 'Cartography', 'Geography'],
    tier: 'Architect',
  },
  {
    name: 'The Broken Quill Society',
    members: 22,
    tagline: 'We finish what others abandon.',
    description: 'For writers of epic series who refuse to let the Middle Slump win. Accountability, shared plotting, and collective motivation to cross the finish line.',
    seal: '⚜',
    founders: ['The Weaver', 'L. Morningstar'],
    topics: ['Plotting', 'Accountability', 'Long-form'],
    tier: 'Collective',
  },
];

export default function SecretSocieties() {
  return (
    <section className="relative py-24 px-6 border-t border-parchment/8">
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
            <span className="text-ornament">SECRET SOCIETIES</span>
            <span className="text-[8px] uppercase tracking-widest text-sepia/50 border border-sepia/20 px-1.5 py-0.5 rounded-sm">
              Architect+
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-parchment-light mb-4">
            Find your <span className="italic text-sepia/70">order</span>
          </h2>
          <p className="text-parchment/50 max-w-xl font-light leading-relaxed">
            Private lore societies within the Parlour. Join a circle of writers who share your 
            genre, process, and obsession. Each society guards its own secrets.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {societies.map((society, i) => (
            <motion.div
              key={society.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              viewport={{ once: true }}
              className="card-paper rounded-sm p-6 group hover:border-sepia/20 transition-all duration-500"
            >
              {/* Seal */}
              <div className="flex items-start justify-between mb-5">
                <div className="society-seal text-2xl">
                  {society.seal}
                </div>
                <span className="text-[8px] uppercase tracking-widest text-parchment/30 border border-parchment/10 px-1.5 py-0.5 rounded-sm">
                  {society.tier}
                </span>
              </div>

              <h3 className="text-lg font-serif text-parchment/80 mb-1">{society.name}</h3>
              <p className="text-xs text-sepia/50 italic mb-3">&ldquo;{society.tagline}&rdquo;</p>
              <p className="text-sm text-parchment/50 leading-relaxed font-light mb-5">
                {society.description}
              </p>

              {/* Founders */}
              <div className="mb-4">
                <span className="text-[9px] uppercase tracking-widest text-parchment/30 block mb-2">Founded by</span>
                <div className="flex flex-wrap gap-2">
                  {society.founders.map((f) => (
                    <span key={f} className="text-xs text-parchment/60 bg-ink-warm/40 px-2 py-1 border border-parchment/5 rounded-sm">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Topics */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {society.topics.map((t) => (
                  <span key={t} className="text-[9px] text-sepia/50 border border-sepia/15 px-1.5 py-0.5 rounded-sm">
                    {t}
                  </span>
                ))}
              </div>

              {/* Members + Action */}
              <div className="flex items-center justify-between pt-4 border-t border-parchment/8">
                <span className="text-xs text-parchment/40">
                  <span className="text-parchment/60">{society.members}</span> members
                </span>
                <button className="text-xs text-sepia/50 hover:text-sepia transition-colors uppercase tracking-wider">
                  Request Seal →
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-xs text-parchment/30 italic mb-4">
            Societies are private. Your membership is visible only within your Social Loop.
          </p>
          <button className="btn-ink text-xs">Browse All Societies</button>
        </div>
      </div>
    </section>
  );
}