import { motion } from 'framer-motion';

const featureList = [
  {
    icon: '◈',
    title: 'Continuity Memory',
    desc: 'Real-time alerts when you contradict your own lore, character history, or established world rules. The ink remembers what you forget.',
    tier: 'All Tiers',
  },
  {
    icon: '⚡',
    title: 'Tension Mapping',
    desc: 'Visualize the push and pull of every relationship arc. Ensure stakes never drop below critical mass. Track emotional voltage across chapters.',
    tier: 'Architect+',
  },
  {
    icon: '◎',
    title: 'The Secret Web',
    desc: 'A dedicated layer for mysteries, tracking who knows what, when it was learned, and the precise moment it must be revealed.',
    tier: 'Architect+',
  },
  {
    icon: '⌗',
    title: 'Timeline Orchestration',
    desc: 'Connect events across parallel timelines. Track causality, paradoxes, and temporal echoes. Every cause has its consequence.',
    tier: 'Architect+',
  },
  {
    icon: '♟',
    title: 'Character Cabinet',
    desc: 'Deep psychological profiles including internal vs. external motivations, secret wounds, and the lies they tell themselves.',
    tier: 'All Tiers',
  },
  {
    icon: '☰',
    title: 'Social Loops',
    desc: 'Protected communities based on your commitment level. Draftsmen with Draftsmen. Architects with Architects. Your circle, your depth.',
    tier: 'All Tiers',
  },
  {
    icon: '✦',
    title: 'Asks & Journals',
    desc: 'Send questions to fellow writers. Keep private journals that can be selectively shared. Write in community or solitude.',
    tier: 'All Tiers',
  },
  {
    icon: '◈',
    title: 'Secret Societies',
    desc: 'Private lore groups organized by genre, process, or obsession. Find your order and guard its secrets together.',
    tier: 'Architect+',
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-sepia/40" />
            <span className="text-ornament">THE METHOD</span>
            <div className="h-px w-8 bg-sepia/40" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-parchment-light mb-4">
            Tools for the <span className="italic text-sepia/70">architecture</span> of fiction
          </h2>
          <p className="text-parchment/40 max-w-lg mx-auto">
            Every feature designed to keep you in the flow state — not fighting your tools, but building your world.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featureList.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              viewport={{ once: true }}
              className="card-paper rounded-sm p-5 group hover:border-parchment/15 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-xl text-sepia/50 group-hover:text-sepia/70 transition-colors">
                  {feat.icon}
                </span>
                <span className="text-[7px] uppercase tracking-widest text-parchment/20 border border-parchment/5 px-1 py-0.5 rounded-sm">
                  {feat.tier}
                </span>
              </div>
              <h3 className="text-sm font-serif text-parchment/80 mb-2 group-hover:text-parchment transition-colors">
                {feat.title}
              </h3>
              <p className="text-xs text-parchment/50 leading-relaxed font-light">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}