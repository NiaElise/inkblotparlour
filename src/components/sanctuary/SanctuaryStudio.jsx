import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';

// Mock data
const worldData = {
  'the-forgotten-city': {
    name: 'The Forgotten City',
    icon: '⌗',
    tagline: 'A city that remembers what the map forgot.',
    charCount: 8,
    loreCount: 23,
    proseCount: 45000,
    characters: [
      { id: 'elias-thorne', name: 'Elias Thorne', role: 'Protagonist', status: 'In Peril', tension: 92 },
      { id: 'the-weaver', name: 'The Weaver', role: 'Antagonist', status: 'Hidden', tension: 87 },
      { id: 'clara-vale', name: 'Clara Vale', role: 'Mentor', status: 'Departed', tension: 45 },
      { id: 'forgotten-king', name: 'The Forgotten King', role: 'Unknown', status: 'Awakening', tension: 76 },
    ],
    tensionPairs: [
      { pair: 'Elias vs. The Weaver', value: 92 },
      { pair: "Clara's Betrayal Arc", value: 45 },
      { pair: 'Forgotten King Rising', value: 76 },
      { pair: 'Bloodline Pact', value: 31 },
    ],
    timeline: [
      { event: 'Bloodline Pact Signed', chapter: 'Ch 3', era: 'Age of Accord', type: 'major' },
      { event: 'First Sun Sets', chapter: 'Ch 4', era: 'Age of Shadows', type: 'major' },
      { event: 'Weaver Emerges', chapter: 'Ch 7', era: 'Age of Shadows', type: 'major' },
      { event: 'Elias Enters City', chapter: 'Ch 12', era: 'Present Day', type: 'current' },
      { event: 'Clara Reveals Truth', chapter: 'Ch 14', era: 'Present Day', type: 'upcoming' },
    ],
    secretWeb: [
      { secret: 'The Weaver is Elias\'s father', knownBy: ['The Weaver', 'Clara Vale'], revealed: false },
      { secret: 'The Forgotten City is a prison', knownBy: ['The Weaver'], revealed: false },
      { secret: 'Clara betrayed Elias at the Bloodline Pact', knownBy: ['Clara Vale', 'The Weaver'], revealed: false },
      { secret: 'The third sun can be reignited', knownBy: ['The Forgotten King'], revealed: false },
    ],
  },
  'the-bloodline-pact': {
    name: 'The Bloodline Pact',
    icon: '◉',
    tagline: 'Blood binds. Secrets unravel.',
    charCount: 5,
    loreCount: 12,
    proseCount: 21000,
    characters: [],
    tensionPairs: [],
    timeline: [],
    secretWeb: [],
  },
  'echoes-of-ash': {
    name: 'Echoes of Ash',
    icon: '✦',
    tagline: 'From the ashes, a new world rises.',
    charCount: 3,
    loreCount: 7,
    proseCount: 8700,
    characters: [],
    tensionPairs: [],
    timeline: [],
    secretWeb: [],
  },
};

export default function SanctuaryStudio() {
  const { worldId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const world = worldData[worldId] || worldData['the-forgotten-city'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-4 mb-4">
          <div className="society-seal w-12 h-12 text-xl">{world.icon}</div>
          <div>
            <h1 className="text-2xl md:text-3xl font-serif text-parchment-light">{world.name}</h1>
            <p className="text-sm text-sepia/60 italic">&ldquo;{world.tagline}&rdquo;</p>
          </div>
          <div className="flex items-center gap-3 ml-auto text-[10px] text-parchment/30">
            <span>{world.charCount} characters</span>
            <span className="w-px h-3 bg-parchment/10" />
            <span>{world.loreCount} lore entries</span>
            <span className="w-px h-3 bg-parchment/10" />
            <span>{world.proseCount.toLocaleString()} words</span>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex items-center border-b border-parchment/8 mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: '◈' },
            { id: 'tension', label: 'Tension Map', icon: '⚡', badge: 'Architect+' },
            { id: 'secrets', label: 'Secret Web', icon: '◎', badge: 'Architect+' },
            { id: 'timeline', label: 'Timeline', icon: '⌇', badge: 'Architect+' },
            { id: 'ledger', label: 'World Ledger', icon: '◉' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`desk-tab flex items-center gap-1.5 ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="text-[6px] uppercase tracking-widest text-parchment/20 border border-parchment/10 px-1 rounded-sm ml-1">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tab content */}
      <motion.div key={activeTab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        {activeTab === 'overview' && <OverviewTab world={world} worldId={worldId} />}
        {activeTab === 'tension' && <TensionTab world={world} />}
        {activeTab === 'secrets' && <SecretsTab world={world} />}
        {activeTab === 'timeline' && <TimelineTab world={world} />}
        {activeTab === 'ledger' && <LedgerTab />}
      </motion.div>
    </div>
  );
}

function OverviewTab({ world, worldId }) {
  const navigate = useNavigate();
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        {/* Characters quick list */}
        <div className="card-paper rounded-sm p-4">
          <h3 className="text-[10px] uppercase tracking-widest text-parchment/30 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sepia/40" />
            Characters
          </h3>
          <div className="space-y-2">
            {world.characters?.slice(0, 4).map((char) => (
              <div
                key={char.id}
                className="flex items-center justify-between p-2.5 bg-ink-warm/30 border border-parchment/5 rounded-sm hover:bg-ink-warm/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sepia/20 to-inkwell border border-parchment/8 flex items-center justify-center text-[8px] text-parchment/50">
                    {char.name[0]}
                  </div>
                  <div>
                    <div className="text-xs text-parchment/70">{char.name}</div>
                    <div className="text-[9px] text-parchment/30">{char.role}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-sm border ${
                    char.status === 'Hidden' ? 'border-blood/30 text-blood/60' :
                    char.status === 'In Peril' ? 'border-blood/40 text-blood/70' :
                    char.status === 'Awakening' ? 'border-sepia/30 text-sepia/60' :
                    'border-parchment/15 text-parchment/40'
                  }`}>{char.status}</span>
                  <span className={`text-[9px] font-mono ${
                    char.tension > 80 ? 'text-blood/60' : char.tension > 60 ? 'text-sepia/60' : 'text-parchment/30'
                  }`}>{char.tension}%</span>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-3 text-[9px] uppercase tracking-widest text-sepia/40 hover:text-sepia transition-colors">
            View All Characters →
          </button>
        </div>

        {/* Recent fragments / prose */}
        <div className="card-paper rounded-sm p-4">
          <h3 className="text-[10px] uppercase tracking-widest text-parchment/30 mb-4">Recent Prose</h3>
          <div className="space-y-3">
            {[
              { text: 'The ink remembers what the author forgets. Every word leaves a residue, a ghost of intention that lingers between the lines...', chapter: 'Ch 13', date: '2h ago' },
              { text: 'He didn\'t notice the threads pulling tighter with every choice. That\'s the tragedy — we never see our own strings.', chapter: 'Ch 12', date: '1d ago' },
            ].map((frag, i) => (
              <div key={i} className="border-l-2 border-sepia/20 pl-3 py-1">
                <p className="text-xs text-parchment/50 italic leading-relaxed">&ldquo;{frag.text}&rdquo;</p>
                <div className="flex items-center gap-2 text-[9px] text-parchment/20 mt-1">
                  <span>{frag.chapter}</span>
                  <span>·</span>
                  <span>{frag.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="space-y-6">
        <div className="card-paper rounded-sm p-4">
          <h3 className="text-[10px] uppercase tracking-widest text-parchment/30 mb-4">Quick Stats</h3>
          <div className="space-y-3">
            {[
              { label: 'Total Characters', value: world.charCount },
              { label: 'Lore Entries', value: world.loreCount },
              { label: 'Total Prose', value: `${(world.proseCount / 1000).toFixed(1)}K` },
              { label: 'Tension Avg', value: `${Math.round(world.tensionPairs?.reduce((a, b) => a + b.value, 0) / (world.tensionPairs?.length || 1))}%` },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center justify-between text-xs">
                <span className="text-parchment/40">{stat.label}</span>
                <span className="text-parchment/70 font-serif">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-paper rounded-sm p-4">
          <h3 className="text-[10px] uppercase tracking-widest text-parchment/30 mb-4">Write Fragment</h3>
          <textarea
            placeholder="A line for the world..."
            className="w-full bg-ink-warm/40 border border-parchment/8 rounded-sm p-3 text-xs text-parchment/60 placeholder:text-parchment/20 resize-none h-24 focus:outline-none focus:border-sepia/30 transition-colors"
          />
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[9px] text-parchment/20">Ch. <input className="w-10 bg-ink-warm/40 border border-parchment/8 rounded-sm px-1.5 py-0.5 text-[9px] text-parchment/40" placeholder="14" /></span>
            <button className="ml-auto text-[9px] uppercase tracking-widest text-sepia/40 hover:text-sepia transition-colors">Save Fragment</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TensionTab({ world }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {world.tensionPairs?.length > 0 ? world.tensionPairs.map((item, i) => (
        <div key={i} className="card-paper rounded-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-serif text-parchment/70">{item.pair}</h3>
            <span className={`text-base font-serif ${
              item.value > 80 ? 'text-blood/60' : item.value > 60 ? 'text-sepia/60' : 'text-parchment/30'
            }`}>{item.value}%</span>
          </div>
          <div className="tension-bar h-2">
            <div className="tension-fill" style={{ width: `${item.value}%` }} />
          </div>
          <div className="flex items-center gap-2 mt-4">
            <input
              className="flex-1 bg-ink-warm/40 border border-parchment/8 rounded-sm px-2 py-1 text-[10px] text-parchment/40 placeholder:text-parchment/20"
              placeholder="Note on this tension..."
            />
            <button className="text-[9px] text-sepia/40 hover:text-sepia transition-colors">Update</button>
          </div>
        </div>
      )) : (
        <div className="md:col-span-2 text-center py-16 text-parchment/30">
          <span className="text-2xl block mb-2">⚡</span>
          <p className="text-sm italic">No tension data yet. Start tracking character relationships.</p>
        </div>
      )}
    </div>
  );
}

function SecretsTab({ world }) {
  const [revealed, setRevealed] = useState({});

  return (
    <div className="space-y-4">
      {world.secretWeb?.length > 0 ? world.secretWeb.map((secret, i) => {
        const isRevealed = revealed[i];
        return (
          <div key={i} className={`card-paper rounded-sm p-4 transition-all ${isRevealed ? 'border-emerald-500/20' : ''}`}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-sm ${isRevealed ? 'text-emerald-500/50' : 'text-blood/50'}`}>
                  {isRevealed ? '◈' : '◎'}
                </span>
                <h3 className={`text-sm font-serif ${isRevealed ? 'text-parchment/60' : 'text-parchment/80'}`}>
                  {isRevealed ? secret.secret : '•••••• (hidden secret)'}
                </h3>
              </div>
              <label className="flex items-center gap-1.5 text-[9px] text-parchment/20 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRevealed}
                  onChange={() => setRevealed(prev => ({ ...prev, [i]: !prev[i] }))}
                  className="accent-sepia/60"
                />
                Revealed
              </label>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-parchment/30">
              <span>Known by:</span>
              {secret.knownBy.map((name) => (
                <span key={name} className="bg-ink-warm/40 px-1.5 py-0.5 rounded-sm border border-parchment/5">{name}</span>
              ))}
            </div>
            <div className="mt-2">
              <input
                className="w-full bg-ink-warm/30 border border-parchment/8 rounded-sm px-2 py-1 text-[10px] text-parchment/40 placeholder:text-parchment/20"
                placeholder="When should this be revealed?"
              />
            </div>
          </div>
        );
      }) : (
        <div className="text-center py-16 text-parchment/30">
          <span className="text-2xl block mb-2">◎</span>
          <p className="text-sm italic">No secrets yet. Start weaving your mysteries.</p>
        </div>
      )}
    </div>
  );
}

function TimelineTab({ world }) {
  return (
    <div className="space-y-3">
      {world.timeline?.length > 0 ? world.timeline.map((event, i) => (
        <div key={i} className="card-paper rounded-sm p-4 flex items-start gap-4 hover:border-parchment/15 transition-all">
          <div className="flex flex-col items-center">
            <div className={`w-3 h-3 rounded-full border-2 ${
              event.type === 'current' ? 'border-sepia bg-sepia/30' :
              event.type === 'major' ? 'border-blood/40 bg-blood/20' :
              event.type === 'upcoming' ? 'border-parchment/20 bg-ink-warm' :
              'border-parchion/15'
            }`} />
            {i < world.timeline.length - 1 && <div className="w-px flex-1 bg-parchment/8 my-1" />}
          </div>
          <div className="flex-1 min-w-0 pb-4">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-serif text-parchment/70">{event.event}</h4>
              <span className="text-[9px] text-parchment/20 font-mono">{event.chapter}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-parchment/30">
              <span className={`px-1.5 py-0.5 rounded-sm border ${
                event.era === 'Present Day' ? 'border-sepia/20 text-sepia/50' :
                event.era === 'Age of Shadows' ? 'border-blood/20 text-blood/40' :
                'border-parchment/10 text-parchment/30'
              }`}>{event.era}</span>
              <span className={`text-[9px] ${
                event.type === 'current' ? 'text-sepia/60' :
                event.type === 'upcoming' ? 'text-parchment/30' : ''
              }`}>
                {event.type === 'current' ? '← You are here' : event.type === 'upcoming' ? '(upcoming)' : ''}
              </span>
            </div>
          </div>
        </div>
      )) : (
        <div className="text-center py-16 text-parchment/30">
          <span className="text-2xl block mb-2">⌇</span>
          <p className="text-sm italic">No timeline events yet. Start orchestrating.</p>
        </div>
      )}

      <button className="w-full py-3 border border-dashed border-parchment/10 rounded-sm text-xs text-parchment/30 hover:text-parchment/60 hover:border-parchment/20 transition-all">
        + Add Timeline Event
      </button>
    </div>
  );
}

function LedgerTab() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {[
        { category: 'Currency', entries: [{ key: 'Main Currency', value: 'Obols' }, { key: 'Rare', value: 'Sun-Crowns' }] },
        { category: 'Religion', entries: [{ key: 'Primary Faith', value: 'The Void' }, { key: 'Heresy', value: 'The Light-Bearers' }] },
        { category: 'Geography', entries: [{ key: 'Capital', value: 'The Forgotten City' }, { key: 'Continent', value: 'Aethra' }] },
        { category: 'Magic System', entries: [{ key: 'Source', value: 'Ancestral Blood' }, { key: 'Limitation', value: 'One gift per lifetime' }] },
        { category: 'Languages', entries: [{ key: 'Common', value: 'Old Aethran' }, { key: 'Secret', value: 'The Weaver\'s Cant' }] },
        { category: 'History', entries: [{ key: 'Founding Era', value: 'Age of Accord' }, { key: 'Current Era', value: 'Age of Shadows' }] },
      ].map((section) => (
        <div key={section.category} className="card-paper rounded-sm p-4">
          <h3 className="text-[10px] uppercase tracking-widest text-parchment/30 mb-3">{section.category}</h3>
          <div className="space-y-2">
            {section.entries.map((entry) => (
              <div key={entry.key}>
                <label className="text-[9px] text-parchment/30 block mb-0.5">{entry.key}</label>
                <input
                  className="w-full bg-ink-warm/40 border border-parchment/8 rounded-sm px-2.5 py-1.5 text-xs text-parchment/60 focus:outline-none focus:border-sepia/30 transition-colors"
                  defaultValue={entry.value}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}