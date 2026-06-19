import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const characterData = {
  'elias-thorne': {
    name: 'Elias Thorne',
    role: 'Protagonist',
    tagline: 'A cartographer searching for a city that should not exist.',
    status: 'In Peril',
    age: '32',
    occupation: 'Cartographer / Relic Hunter',
    world: 'The Forgotten City',
    tension: 92,
    motivation: 'Find his father, who disappeared into the Forgotten City twenty years ago.',
    flaw: 'Refuses to ask for help. Trusts his maps over people.',
    arc: 'From certainty to surrender. Elias must learn that the city cannot be mapped — only felt.',
    traits: ['Obsessive', 'Resourceful', 'Loyal to a fault', 'Colorblind to lies'],
    relationships: [
      { name: 'The Weaver', type: 'Father / Antagonist', tension: 92, note: 'Does not know the Weaver is his father' },
      { name: 'Clara Vale', type: 'Mentor', tension: 45, note: 'Trusts her completely — she has already betrayed him' },
    ],
    secrets: [
      'Elias carries a map that belonged to his father, but it is a trap.',
      'He can read the old language but does not know he can.',
    ],
    notes: `Elias's arc mirrors the city itself: what appears broken is actually a design.`,
  },
  'the-weaver': {
    name: 'The Weaver',
    role: 'Antagonist',
    tagline: 'The architect of the cage.',
    status: 'Hidden',
    age: 'Unknown',
    occupation: 'God-thread / Prison Architect',
    world: 'The Forgotten City',
    tension: 87,
    motivation: 'Keep the Forgotten King imprisoned. Protect the secret of the Bloodline Pact.',
    flaw: 'Underestimates the power of love as a motivation.',
    arc: 'From control to sacrifice. The Weaver must choose between his design and his son.',
    traits: ['Patient', 'Manipulative', 'Genuinely loves Elias', 'Bound by the Pact'],
    relationships: [
      { name: 'Elias Thorne', type: 'Son / Unknowing pawn', tension: 92, note: 'Watches from the threads' },
      { name: 'The Forgotten King', type: 'Prisoner / Old ally', tension: 76, note: `The only person who knows the Weaver's true name` },
    ],
    secrets: [
      'The Weaver built the prison to protect the world, not to cage an enemy.',
      'The Pact requires his life to maintain the barrier.',
    ],
    notes: 'The Weaver is not evil. He is a father who made an impossible choice.',
  },
  'clara-vale': {
    name: 'Clara Vale',
    role: 'Mentor',
    tagline: 'She knows the way. She cannot show it.',
    status: 'Departed',
    age: '58',
    occupation: 'Scholar of the Old Ways',
    world: 'The Forgotten City',
    tension: 45,
    motivation: 'Guide Elias to the truth — but only when the threads align.',
    flaw: 'Bound by an oath that prevents her from speaking directly.',
    arc: 'From cryptic guide to revealed betrayer to redemption.',
    traits: ['Wise', 'Enigmatic', 'Bound', 'Genuinely cares for Elias'],
    relationships: [
      { name: 'Elias Thorne', type: 'Student', tension: 45, note: 'She has already betrayed him to the Weaver' },
      { name: 'The Weaver', type: 'Oath-Bound', tension: 60, note: 'Made a pact to protect Elias by keeping him ignorant' },
    ],
    secrets: [
      'Clara was the one who sealed the first pact.',
      'She has been trying to break it for thirty years.',
    ],
    notes: 'Clara is the moral center who made an immoral choice.',
  },
};

const loreCategories = [
  { name: 'History', icon: '⌇' },
  { name: 'Geography', icon: '◈' },
  { name: 'Magic', icon: '⚡' },
  { name: 'Religion', icon: '◉' },
  { name: 'Politics', icon: '♟' },
  { name: 'Culture', icon: '✦' },
];

export default function SanctuaryCabinet() {
  const [activeSection, setActiveSection] = useState('characters');
  const [selectedChar, setSelectedChar] = useState('elias-thorne');
  const char = characterData[selectedChar];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-px w-6 bg-sepia/40" />
          <span className="text-ornament">THE CABINET</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-serif text-parchment-light">
          Characters & <span className="italic text-sepia/70">Lore</span>
        </h1>
      </motion.div>

      {/* Section tabs */}
      <div className="flex items-center border-b border-parchment/8 mb-6">
        {[
          { id: 'characters', label: 'Character Cabinet', icon: '♟' },
          { id: 'lore', label: 'World Ledger', icon: '⌇' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`desk-tab ${activeSection === tab.id ? 'active' : ''}`}
          >
            <span className="mr-1.5 text-xs">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeSection === 'characters' && (
        <div className="grid md:grid-cols-12 gap-6">
          {/* Character list */}
          <div className="md:col-span-4 space-y-2">
            {Object.entries(characterData).map(([id, c]) => (
              <button
                key={id}
                onClick={() => setSelectedChar(id)}
                className={`w-full flex items-center gap-3 p-3 rounded-sm border text-left transition-all ${
                  selectedChar === id
                    ? 'border-sepia/40 bg-sepia/10 text-parchment/80'
                    : 'border-parchment/8 bg-ink-warm/30 text-parchment/50 hover:bg-ink-warm/50'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sepia/20 to-inkwell border border-parchment/10 flex items-center justify-center text-xs font-serif shrink-0">
                  {c.name[0]}
                </div>
                <div className="min-w-0 text-left">
                  <div className="text-xs truncate">{c.name}</div>
                  <div className="text-[9px] text-parchment/30 truncate">{c.role}</div>
                </div>
                <span className={`ml-auto text-[9px] px-1.5 py-0.5 rounded-sm border shrink-0 ${
                  c.status === 'Hidden' ? 'border-blood/30 text-blood/60' :
                  c.status === 'In Peril' ? 'border-blood/40 text-blood/70' :
                  'border-parchment/15 text-parchment/40'
                }`}>{c.status}</span>
              </button>
            ))}
            <button className="w-full py-2.5 border border-dashed border-parchment/10 rounded-sm text-xs text-parchment/20 hover:text-parchment/40 transition-colors">
              + New Character
            </button>
          </div>

          {/* Character detail */}
          <div className="md:col-span-8">
            {char ? (
              <motion.div key={selectedChar} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="card-paper rounded-sm p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sepia/30 to-inkwell border border-parchment/10 flex items-center justify-center text-lg font-serif text-parchment/60">
                      {char.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-serif text-parchment-light">{char.name}</h2>
                        <span className="text-[9px] uppercase tracking-wider text-parchment/30 border border-parchment/10 px-1.5 py-0.5 rounded-sm">{char.role}</span>
                      </div>
                      <p className="text-xs text-sepia/50 italic mt-1">&ldquo;{char.tagline}&rdquo;</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-parchment/30">
                    <div className="text-center">
                      <div className="text-lg font-serif text-blood/60">{char.tension}%</div>
                      <div className="text-[8px] uppercase tracking-wider">Tension</div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left column */}
                  <div className="space-y-5">
                    <div>
                      <h4 className="text-[9px] uppercase tracking-widest text-parchment/30 mb-2">Details</h4>
                      <div className="space-y-2">
                        {[
                          { label: 'Age', value: char.age },
                          { label: 'Occupation', value: char.occupation },
                          { label: 'World', value: char.world },
                        ].map((detail) => (
                          <div key={detail.label} className="flex items-center justify-between text-xs border-b border-parchment/5 pb-1.5">
                            <span className="text-parchment/30">{detail.label}</span>
                            <input className="bg-transparent text-parchment/70 text-right w-40 focus:outline-none focus:text-parchment border-b border-transparent focus:border-sepia/30" defaultValue={detail.value} />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[9px] uppercase tracking-widest text-parchment/30 mb-2">Motivation</h4>
                      <textarea className="w-full bg-ink-warm/30 border border-parchment/8 rounded-sm p-2.5 text-xs text-parchment/60 resize-none h-16 focus:outline-none focus:border-sepia/30" defaultValue={char.motivation} />
                    </div>

                    <div>
                      <h4 className="text-[9px] uppercase tracking-widest text-parchment/30 mb-2">Flaw</h4>
                      <textarea className="w-full bg-ink-warm/30 border border-parchment/8 rounded-sm p-2.5 text-xs text-parchment/60 resize-none h-16 focus:outline-none focus:border-sepia/30" defaultValue={char.flaw} />
                    </div>

                    <div>
                      <h4 className="text-[9px] uppercase tracking-widest text-parchment/30 mb-2">Arc</h4>
                      <textarea className="w-full bg-ink-warm/30 border border-parchment/8 rounded-sm p-2.5 text-xs text-parchment/60 resize-none h-20 focus:outline-none focus:border-sepia/30" defaultValue={char.arc} />
                    </div>

                    <div>
                      <h4 className="text-[9px] uppercase tracking-widest text-parchment/30 mb-2">Traits</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {char.traits.map((trait) => (
                          <span key={trait} className="text-[9px] text-sepia/50 border border-sepia/15 px-1.5 py-0.5 rounded-sm">{trait}</span>
                        ))}
                        <button className="text-[9px] text-parchment/20 hover:text-parchment/40 transition-colors border border-dashed border-parchment/10 px-1.5 py-0.5 rounded-sm">
                          + Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right column */}
                  <div className="space-y-5">
                    <div>
                      <h4 className="text-[9px] uppercase tracking-widest text-parchment/30 mb-2">Relationships</h4>
                      <div className="space-y-2">
                        {char.relationships.map((rel) => (
                          <div key={rel.name} className="bg-ink-warm/30 border border-parchment/8 rounded-sm p-3">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs text-parchment/70">{rel.name}</span>
                              <span className={`text-[9px] font-mono ${
                                rel.tension > 80 ? 'text-blood/60' : rel.tension > 60 ? 'text-sepia/60' : 'text-parchment/30'
                              }`}>{rel.tension}%</span>
                            </div>
                            <div className="text-[9px] text-parchment/30">{rel.type}</div>
                            <div className="text-[9px] text-parchment/40 italic mt-1">{rel.note}</div>
                          </div>
                        ))}
                        <button className="text-[9px] text-parchment/20 hover:text-parchment/40 transition-colors">+ Add Relationship</button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[9px] uppercase tracking-widest text-parchment/30 mb-2">Known Secrets</h4>
                      <div className="space-y-2">
                        {char.secrets.map((secret, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-parchment/50 bg-ink-warm/30 border border-parchment/8 rounded-sm p-2.5">
                            <span className="text-blood/40 mt-0.5">◎</span>
                            <span>{secret}</span>
                          </div>
                        ))}
                        <button className="text-[9px] text-parchment/20 hover:text-parchment/40 transition-colors">+ Add Secret</button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[9px] uppercase tracking-widest text-parchment/30 mb-2">Writer's Notes</h4>
                      <textarea className="w-full bg-ink-warm/30 border border-parchment/8 rounded-sm p-2.5 text-xs text-parchment/60 resize-none h-24 focus:outline-none focus:border-sepia/30" defaultValue={char.notes} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-16 text-parchment/30">
                <span className="text-2xl block mb-2">♟</span>
                <p className="text-sm italic">Select a character to edit their profile.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSection === 'lore' && (
        <div className="grid md:grid-cols-3 gap-6">
          {loreCategories.map((cat) => (
            <div key={cat.name} className="card-paper rounded-sm p-4 group hover:border-parchment/15 transition-all">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg text-sepia/50">{cat.icon}</span>
                <h3 className="text-sm font-serif text-parchment/70">{cat.name}</h3>
              </div>
              <div className="space-y-3">
                {[
                  { key: 'Entry 1', value: '—' },
                  { key: 'Entry 2', value: '—' },
                ].map((entry) => (
                  <div key={entry.key}>
                    <label className="text-[9px] text-parchment/20 block mb-0.5">{entry.key}</label>
                    <input
                      className="w-full bg-ink-warm/30 border border-parchment/8 rounded-sm px-2 py-1.5 text-xs text-parchment/50 focus:outline-none focus:border-sepia/30 transition-colors"
                      placeholder="Add entry..."
                      defaultValue={entry.value === '—' ? '' : entry.value}
                    />
                  </div>
                ))}
                <button className="text-[9px] text-parchment/20 hover:text-parchment/40 transition-colors">+ Add Entry</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}