import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const tiers = [
  {
    name: 'The Draftsman',
    price: 'Free',
    period: 'always',
    tagline: 'For those beginning their first great architecture.',
    features: [
      '1 Storyworld',
      'Limited Character Slots',
      'Limited Lore Slots',
      'Basic Lore Tracking',
      'Post Feed Access',
      'Drafting Loop (Free tier)',
      'Read Journals',
    ],
    tier: 'draftsman',
  },
  {
    name: 'The Architect',
    price: '$10',
    period: '/mo',
    tagline: 'For serious fiction architects.',
    popular: true,
    features: [
      'Unlimited Storyworlds',
      'Unlimited Character & Lore Slots',
      'Tension Mapping',
      'The Secret Web',
      'Timeline Orchestration',
      'Continuity Alerts',
      'Exclusive Writer Circles',
      'Send & Receive Asks',
      'Write & Publish Journals',
      'Architect Loop (Paid tier)',
    ],
    tier: 'architect',
  },
  {
    name: 'The Collective',
    price: '$15',
    period: '/mo',
    tagline: 'For collaborative worldbuilding studios.',
    features: [
      'Everything in Architect',
      'Collaborative Worldbuilding',
      'Priority Feed Placement',
      'Aesthetic Customization',
      'Custom CSS / Profile Skins',
      'Moderate & Manage Circles',
      'Create & Manage Circles',
      'Collective Loop (Premium)',
      'Dedicated Support',
    ],
    tier: 'collective',
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-24 px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-inkwell/10 via-transparent to-inkwell/20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-sepia/40" />
            <span className="text-ornament">ACCESS LEVELS</span>
            <div className="h-px w-8 bg-sepia/40" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-parchment-light mb-4">
            Choose your <span className="italic text-sepia/70">station</span>
          </h2>
          <p className="text-parchment/40 max-w-lg mx-auto">
            All tiers share the same social ecosystem. Your tools and circles deepen with your commitment.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              viewport={{ once: true }}
              className={cn(
                "card-paper rounded-sm p-6 md:p-8 flex flex-col relative transition-all duration-500",
                plan.popular && "border-sepia/30 bg-gradient-to-b from-ink-warm/50 to-ink-light/30"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-sepia/80 to-sepia text-parchment-light text-[8px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-sm shadow-lg">
                  Most Desired
                </div>
              )}

              {/* Header */}
              <div className="mb-6">
                <h3 className="text-xl font-serif text-parchment/80 mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-3xl font-serif font-bold text-parchment-light">{plan.price}</span>
                  <span className="text-parchment/30 text-sm">{plan.period}</span>
                </div>
                <p className="text-sm text-parchment/50 font-light">{plan.tagline}</p>
              </div>

              {/* Loop indicator */}
              <div className={cn(
                "px-3 py-2 rounded-sm border text-[10px] uppercase tracking-wider mb-6 text-center",
                plan.tier === 'draftsman' && 'border-parchment/10 bg-ink-warm/30 text-parchment/40',
                plan.tier === 'architect' && 'border-sepia/20 bg-sepia/10 text-sepia/70',
                plan.tier === 'collective' && 'border-parchment/20 bg-parchment/5 text-parchment/60',
              )}>
                {plan.tier === 'draftsman' && '✦ Drafting Loop (Free members only)'}
                {plan.tier === 'architect' && '◈ Architect Loop (Paid members only)'}
                {plan.tier === 'collective' && '⬟ Collective Loop (Premium tier)'}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-3 text-xs text-parchment/60">
                    <span className="text-sepia/40 mt-0.5">—</span>
                    <span className="font-light">{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button className={cn(
                "w-full py-3 rounded-sm text-xs font-medium uppercase tracking-widest transition-all duration-300",
                plan.popular
                  ? "bg-gradient-to-r from-sepia/80 to-sepia/60 text-parchment-light hover:from-sepia hover:to-sepia/80 shadow-lg shadow-sepia/10"
                  : "border border-parchment/15 text-parchment/60 hover:bg-ink-warm/60 hover:border-parchment/30"
              )}>
                {plan.price === 'Free' ? 'Begin Your Draft' : 'Reserve Your Station'}
              </button>

              <p className="text-[9px] text-center text-parchment/20 mt-3">
                {plan.price === 'Free' ? 'No card needed. Join the circle.' : 'Limited beta spots available.'}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="text-center mt-10">
          <div className="old-paper inline-block rounded-sm px-6 py-4 border border-parchment/8">
            <p className="text-xs text-parchment/40 italic">
              <span className="text-parchment/60 font-medium not-italic">All tiers</span> share the full social ecosystem — The Feed, Asks, and Journals. The Draftsman tier faces upgrade pressure through <span className="text-parchment/60">feature depth</span> (unlimited worlds, Tension Mapping, Secret Web, Timeline Orchestration) and <span className="text-parchment/60">project limits</span> (1 storyworld, limited character/lore slots).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}