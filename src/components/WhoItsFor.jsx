import { motion } from 'framer-motion';

const audiences = [
  {
    title: 'The Novelist',
    icon: '◈',
    desc: 'Managing sprawling series and multi-generational family trees without losing the thread. Tracking POV shifts across six books.',
  },
  {
    title: 'The Roleplayer',
    icon: '⌗',
    desc: 'Orchestrating complex character dynamics and shared narratives. Building worlds that feel alive when multiple hands shape them.',
  },
  {
    title: 'The Worldbuilder',
    icon: '◎',
    desc: 'Creating deep lore for TTRPGs, indie games, or shared universes where every detail matters and every secret has a keeper.',
  },
  {
    title: 'The Poet of Prose',
    icon: '✦',
    desc: 'Crafting literary fiction where every sentence must earn its place. Tracking thematic resonance across chapters and decades.',
  },
];

export default function WhoItsFor() {
  return (
    <section className="relative py-24 px-6 border-t border-parchment/8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-sepia/40" />
            <span className="text-ornament">FOR THE ARCHITECTS</span>
            <div className="h-px w-8 bg-sepia/40" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif text-parchment-light">
            Built for those who build <span className="italic text-sepia/70">worlds</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6">
          {audiences.map((aud, i) => (
            <motion.div
              key={aud.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center p-6 card-paper rounded-sm group hover:border-parchment/15 transition-all"
            >
              <div className="society-seal mx-auto mb-4 text-xl group-hover:border-sepia/30 transition-colors">
                {aud.icon}
              </div>
              <h3 className="text-sm font-serif text-parchment/80 mb-3 group-hover:text-parchment transition-colors">
                {aud.title}
              </h3>
              <p className="text-xs text-parchment/50 leading-relaxed font-light">
                {aud.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}