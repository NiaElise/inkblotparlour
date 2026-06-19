import { motion } from 'framer-motion';
import { useState } from 'react';

const templates = [
  {
    title: 'The Gothic Manor',
    hook: 'The house has been waiting. Every window watches. Every floorboard knows your name. The previous resident left something behind — or perhaps they never left at all. The manor breathes, and you have just unlocked the front door.',
    vibes: 'Candlelight flickering against peeling wallpaper. Velvet curtains heavy with dust. A grandfather clock that ticks in reverse. Perfume lingering in an empty room.',
    fragments: [
      'The library contains 3,000 books, none of which have titles on their spines. When you pull one at random, it opens to a page describing your own arrival.',
      'The portrait gallery shows ancestors who age in real-time. The newest portrait — dated last week — bears a striking resemblance to you.',
      'The west wing was sealed in 1892. The lock is warm to the touch.',
      'Every mirror in the house reflects a different version of the room behind you. In one of them, the room is on fire.',
      'The cellar stairs have 13 steps. Every time you descend, there are 14.',
    ],
    characters: [
      { name: 'The Groundskeeper', role: 'Guide / Red Herring', desc: 'Silent, appears without warning, knows every secret but speaks in riddles. May or may not be a ghost.' },
      { name: 'The Architect', role: 'Antagonist / Tragic Figure', desc: 'Built the manor 200 years ago. Still here. Made a deal that trapped everyone inside — including themselves.' },
      { name: 'The Last Guest', role: 'Ally / Wildcard', desc: 'Arrived before you. Cannot remember how long they have been here. Holds the key to the west wing but does not know it.' },
    ],
  },
  {
    title: 'The Sunless Sea',
    hook: 'Beneath the world, an ocean without light stretches to an unseen horizon. Cities built on the backs of leviathans drift through the abyss. The Sunless Sea has no surface — only depths. Your ship sails by memory and starlight reflected from crystals that grow in the dark.',
    vibes: 'Bioluminescent creatures drifting past portholes. The creak of wooden hulls under impossible pressure. Distant whale-song that sounds like a language. Lantern-light on dark water.',
    fragments: [
      'The leviathans sleep for centuries and wake for minutes. When they wake, whole cities must reroute or be swallowed.',
      'The Deep-Fisher collect "light-memories" — preserved moments of surface sunlight trapped in crystal. A single memory costs more than a ship.',
      'There is a trench so deep that time flows differently within it. Ships that venture too close emerge before they left.',
      'The Church of the Shallows preaches that the surface is a myth. Their heretics are exiled upward — no one has ever returned.',
    ],
    characters: [
      { name: 'The Navigator', role: 'Captain / Mentor', desc: 'Has sailed the Sunless Sea for sixty years. Has never seen the surface. Reads the dark like a map.' },
      { name: 'The Collector', role: 'Merchant / Antagonist', desc: 'Trades in light-memories. Knows the value of hope and sells it dearly.' },
      { name: 'The Drowned Saint', role: 'Prophet / Mystery', desc: 'A figure who walks on the sea floor. Appears to desperate crews. May be a hallucination or a god.' },
    ],
  },
  {
    title: 'The Clockwork Court',
    hook: 'The kingdom runs on gear and decree. Every citizen has a designated purpose, assigned at birth by the Grand Chronometer. But the gears are grinding slower this century, and for the first time in history, the Court is accepting petitions for reassignment. You have come to request a new fate.',
    vibes: 'The constant ticking of a thousand clocks. Brass and mahogany. Steam rising through grates in marble floors. Uniforms with too many buttons. The smell of oil and old paper.',
    fragments: [
      'The Grand Chronometer occupies the entire central tower. Its mechanism is so complex that no single person understands it entirely — not even the Clockmakers who tend it.',
      'Petitioners are given a "trial week" in their desired role. If they fail, they are assigned to the Foundry permanently. There is no appeal from the Foundry.',
      'The King has not been seen in seventeen years. The Court is run by his mechanical double, which repeats the same decrees daily.',
      'A faction called the Rust-Eaters believes the Grand Chronometer should be stopped. They meet in the sewers, where the ticking is silent.',
    ],
    characters: [
      { name: 'The Chief Clockmaker', role: 'Authority / Ally', desc: 'Knows the Chronometer is failing. Needs someone outside the system to fix it. Speaks in gears and metaphors.' },
      { name: 'The King\'s Voice', role: 'Antagonist / Bureaucrat', desc: 'The mechanical double that runs the Court. It follows the letter of the law but has forgotten its spirit.' },
      { name: 'The Rust-Eater', role: 'Rebel / Ally', desc: 'A contact in the underground. Wants to free the kingdom from mechanical destiny. May have other motives.' },
    ],
  },
  {
    title: 'The Last Bookshop',
    hook: 'When stories began disappearing from the world, only one place remained where they could still be found: The Last Bookshop. It exists between street numbers, in a city that may or may not be real. The books here remember everything. And some of them are writing back.',
    vibes: 'The smell of old paper and dust. Warm amber light through fogged windows. Stacks of books that rearrange themselves when you are not looking. A cat that has been here longer than anyone.',
    fragments: [
      'Books that are never checked out eventually begin to rewrite themselves. The fiction section is the most unstable — whole genres have been known to merge overnight.',
      'The basement is locked. The owner says it contains "the books that read you." Employees who have been in the basement do not speak about what they saw.',
      'Every book in the shop has one blank page at the end. If you write on it, the story continues. Some patrons have been writing in the same book for years.',
      'There is a section labeled "Future History" that is growing. The shop owner will not let anyone browse it.',
    ],
    characters: [
      { name: 'The Shopkeeper', role: 'Guardian / Mystery', desc: 'Has owned the shop for as long as anyone remembers. Cannot leave. Speaks as if every conversation has already happened before.' },
      { name: 'The Phantom Patron', role: 'Ally / Tragic', desc: 'A former novelist who has been reading the same book for decades. Afraid to reach the last page.' },
      { name: 'The Indexer', role: 'Antagonist / Order', desc: 'A bureaucrat from the Department of Unreal Estate. Wants to catalog and regulate The Last Bookshop. Believes stories should be orderly.' },
    ],
  },
  {
    title: 'The Ferris Wheel at the End of the World',
    hook: 'An amusement park built on the edge of a continent that is slowly crumbling into a fog-filled abyss. The Ferris wheel still turns, powered by a generator that should have failed years ago. The park closes in seven days. Until then, the rides are free. The caretaker is the last resident. And the Ferris wheel shows you things it should not.',
    vibes: 'Faded neon against perpetual twilight. The sound of a calliope playing a song that repeats but is different each time. Salt-wind and rust. Cotton candy that tastes faintly of static.',
    fragments: [
      'The Ferris wheel has 24 cars. Riders who reach the top report seeing different views: some see the abyss, some see a city that has not existed in centuries, and one saw their own childhood home.',
      'The bumper cars move on their own after midnight. The patterns they trace spell out a message. No two nights spell the same message.',
      'The hall of mirrors contains a mirror that shows you who you would have been if you had made one different choice. The mirror is cracked from a fist impact on the inside.',
      'The ticket booth is staffed by a mannequin that changes clothes daily. The tickets it dispenses have different dates from different years.',
    ],
    characters: [
      { name: 'The Caretaker', role: 'Guardian / Tragic', desc: 'Has been maintaining the park alone for thirty years. Knows the Ferris wheel is alive but will not admit it.' },
      { name: 'The Fortuneteller', role: 'Ally / Oracle', desc: 'A hologram in a machine that should not work. Gives accurate fortunes but only in riddles.' },
      { name: 'The Abyss', role: 'Antagonist / Force', desc: 'The fog that is consuming the continent. It is patient. It has already taken everything else.' },
    ],
  },
];

export default function LoreTemplateLibrary() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [expanded, setExpanded] = useState({});

  return (
    <section className="relative py-24 px-6" id="templates">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.015] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: "url('/assets/paper-texture.webp')" }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-sepia/40" />
            <span className="text-ornament">WORLDBUILDING SEEDS</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-parchment-light mb-4">
            The Lore <span className="italic text-sepia/70">Template Library</span>
          </h2>
          <p className="text-parchment/50 max-w-xl font-light leading-relaxed">
            Atmospheric starting points for new fiction architects. Each template contains lore fragments, 
            character archetypes, and a guiding aesthetic — like finding a half-written world in a drawer.
          </p>
        </motion.div>

        {/* Template Grid */}
        {!selectedTemplate ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {templates.map((template, i) => (
              <motion.div
                key={template.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                className="card-paper rounded-sm p-5 group hover:border-sepia/20 transition-all cursor-pointer"
                onClick={() => setSelectedTemplate(template)}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-base font-serif text-parchment/80 group-hover:text-parchment transition-colors">
                    {template.title}
                  </h3>
                  <span className="text-parchment/15 text-lg group-hover:text-sepia/30 transition-colors">◈</span>
                </div>
                <p className="text-xs text-parchment/50 leading-relaxed font-light line-clamp-3 mb-4">
                  {template.hook}
                </p>
                <div className="flex items-center gap-2 text-[9px] text-parchment/30">
                  <span>{template.fragments.length} lore fragments</span>
                  <span className="w-px h-3 bg-parchment/10" />
                  <span>{template.characters.length} character archetypes</span>
                </div>
                <div className="mt-3 text-[9px] text-sepia/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  Open template →
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Template Detail View */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <button
              onClick={() => setSelectedTemplate(null)}
              className="flex items-center gap-1.5 text-[10px] text-parchment/30 hover:text-parchment/60 transition-colors mb-6 uppercase tracking-widest"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M7 2L3 6l4 4" />
              </svg>
              Back to Templates
            </button>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                {/* Title + Hook */}
                <div className="card-paper rounded-sm p-6">
                  <h2 className="text-2xl font-serif text-parchment-light mb-3">{selectedTemplate.title}</h2>
                  <p className="text-sm text-parchment/60 leading-relaxed italic font-light border-l-2 border-sepia/30 pl-4">
                    {selectedTemplate.hook}
                  </p>
                </div>

                {/* Lore Fragments */}
                <div className="card-paper rounded-sm p-6">
                  <h3 className="text-xs uppercase tracking-widest text-parchment/30 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sepia/40" />
                    Lore Fragments
                  </h3>
                  <div className="space-y-3">
                    {selectedTemplate.fragments.map((frag, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm text-parchment/60 leading-relaxed font-light border-l-2 border-parchment/10 hover:border-sepia/30 transition-colors pl-3 py-1">
                        <span className="text-sepia/40 text-xs mt-0.5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                        <p>{frag}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Vibes */}
                <div className="card-paper rounded-sm p-5">
                  <h3 className="text-xs uppercase tracking-widest text-parchment/30 mb-3">Aesthetic</h3>
                  <p className="text-xs text-parchment/50 italic leading-relaxed">
                    {selectedTemplate.vibes}
                  </p>
                </div>

                {/* Characters */}
                <div className="card-paper rounded-sm p-5">
                  <h3 className="text-xs uppercase tracking-widest text-parchment/30 mb-4">Character Archetypes</h3>
                  <div className="space-y-4">
                    {selectedTemplate.characters.map((char, i) => (
                      <div key={i} className="border-b border-parchment/8 pb-3 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-parchment/70">{char.name}</span>
                          <span className="text-[8px] uppercase tracking-wider text-sepia/50 border border-sepia/20 px-1 py-0.5 rounded-sm">{char.role}</span>
                        </div>
                        <p className="text-[11px] text-parchment/40 leading-relaxed">{char.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Use button */}
                <button className="btn-blood w-full text-xs flex items-center justify-center gap-2">
                  <span>Use This Template</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 6h10M6 1l5 5-5 5" />
                  </svg>
                </button>
                <p className="text-[9px] text-parchment/20 text-center italic">
                  Starts a new Storyworld with pre-filled lore and characters
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Footer note */}
        <div className="text-center mt-10">
          <div className="flex items-center justify-center gap-4 text-[10px] text-parchment/20">
            <span>✦ Templates are starting points — make them yours</span>
            <span className="w-px h-3 bg-parchment/10" />
            <span>More templates added each moon</span>
          </div>
        </div>
      </div>
    </section>
  );
}