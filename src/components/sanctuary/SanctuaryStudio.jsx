import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  fetchStoryworld, 
  fetchCharacters, 
  fetchLore, 
  fetchSecrets, 
  fetchTensionMaps, 
  fetchTimelines,
  fetchMe
} from '../../api';

export default function SanctuaryStudio() {
  const { worldId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [world, setWorld] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [lore, setLore] = useState([]);
  const [secrets, setSecrets] = useState([]);
  const [tension, setTension] = useState([]);
  const [timelines, setTimelines] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadStudio() {
      try {
        const [w, c, l, me] = await Promise.all([
          fetchStoryworld(worldId),
          fetchCharacters(worldId),
          fetchLore(worldId),
          fetchMe()
        ]);
        setWorld(w);
        setCharacters(c);
        setLore(l);
        setUser(me);

        // Tier-gated features
        if (me.tier !== 'Draftsman' || me.role === 'admin') {
          try {
            const [s, t, tl] = await Promise.all([
              fetchSecrets(worldId),
              fetchTensionMaps(worldId),
              fetchTimelines(worldId)
            ]);
            setSecrets(s);
            setTension(t);
            setTimelines(tl);
          } catch (gateErr) {
            console.warn("Tier gating active or error fetching restricted data", gateErr);
          }
        }
      } catch (err) {
        console.error("Studio load failed", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadStudio();
  }, [worldId]);

  if (loading) return <div className="text-sepia font-serif italic text-center py-20 text-xl">Entering the Vault...</div>;
  if (error) return <div className="text-blood font-serif italic text-center py-20">Error: {error}</div>;
  if (!world) return <div className="text-parchment/40 font-serif italic text-center py-20">World not found.</div>;

  const tabs = ['Overview', 'Characters', 'Lore', 'Secret Web', 'Tension Map', 'Timelines'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-sm border border-sepia/30 bg-sepia/5 flex items-center justify-center text-sepia/60 text-2xl font-serif">
            {world.title.substring(0, 1)}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-serif text-parchment-light">{world.title}</h1>
            <p className="text-xs text-parchment/30 uppercase tracking-widest mt-1">
              Studio Station · {world.description || "Active Archive"}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
           <button className="px-4 py-2 text-[10px] uppercase tracking-widest text-parchment/40 border border-parchment/10 hover:bg-parchment/5 transition-all">
             Share Fragment
           </button>
           <button className="px-4 py-2 text-[10px] uppercase tracking-widest bg-sepia/80 text-void hover:bg-sepia transition-all">
             New Entry
           </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Characters', val: characters.length },
          { label: 'Lore Entries', val: lore.length },
          { label: 'Secrets', val: secrets.length },
          { label: 'Tension Nodes', val: tension.length },
        ].map(s => (
          <div key={s.label} className="card-paper p-4 border border-parchment/8 bg-ink-warm/10">
            <div className="text-xl font-serif text-parchment/80">{s.val}</div>
            <div className="text-[9px] uppercase tracking-widest text-parchment/20">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-parchment/8 flex gap-8 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-[10px] uppercase tracking-[0.2em] transition-all relative ${
              activeTab === tab ? 'text-sepia' : 'text-parchment/30 hover:text-parchment/60'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-sepia/60" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'Overview' && <OverviewTab world={world} />}
        {activeTab === 'Characters' && <CharactersTab characters={characters} />}
        {activeTab === 'Lore' && <LoreTab lore={lore} />}
        {activeTab === 'Secret Web' && <SecretWebTab secrets={secrets} isLocked={user.tier === 'Draftsman' && user.role !== 'admin'} />}
        {activeTab === 'Tension Map' && <TensionMapTab tension={tension} isLocked={user.tier === 'Draftsman' && user.role !== 'admin'} />}
        {activeTab === 'Timelines' && <TimelinesTab timelines={timelines} isLocked={user.tier === 'Draftsman' && user.role !== 'admin'} />}
      </div>
    </div>
  );
}

function OverviewTab({ world }) {
  return (
    <div className="grid md:grid-cols-2 gap-10">
      <div className="space-y-6">
        <h3 className="text-sm font-serif text-sepia/70 italic">World Narrative</h3>
        <p className="text-sm text-parchment/50 leading-relaxed font-light">
          {world.description || "Describe your world here..."}
        </p>
        <div className="p-6 border border-parchment/8 bg-ink-warm/5 rounded-sm">
          <h4 className="text-[10px] uppercase tracking-widest text-parchment/20 mb-4 font-bold">Metadata</h4>
          <div className="space-y-3">
             <div className="flex justify-between text-xs">
               <span className="text-parchment/30">ID</span>
               <span className="text-parchment/60 font-mono">{world.id}</span>
             </div>
             <div className="flex justify-between text-xs">
               <span className="text-parchment/30">Created</span>
               <span className="text-parchment/60">Recently</span>
             </div>
          </div>
        </div>
      </div>
      <div className="card-paper p-8 border border-sepia/10 flex flex-col items-center justify-center text-center">
         <div className="text-3xl text-sepia/20 mb-4 font-serif italic">The Inkwell</div>
         <p className="text-xs text-parchment/40 max-w-xs mb-6">
           Every story begins with a single drop of ink. Expand your world's horizons.
         </p>
         <button className="text-[10px] uppercase tracking-[0.2em] text-sepia/60 hover:text-sepia transition-colors">
           Access Lorebooks →
         </button>
      </div>
    </div>
  );
}

function CharactersTab({ characters }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {characters.map(char => (
        <div key={char.id} className="card-paper p-5 border border-parchment/8 hover:border-sepia/20 transition-all group">
          <div className="flex justify-between items-start mb-3">
             <div className="w-10 h-10 rounded-full border border-parchment/10 bg-ink-warm/20 flex items-center justify-center text-parchment/20 group-hover:text-sepia/40 transition-colors">
               👤
             </div>
             <span className="text-[9px] text-parchment/20 uppercase tracking-widest">{char.role || "Cast"}</span>
          </div>
          <h4 className="text-sm font-serif text-parchment/70 group-hover:text-parchment transition-colors">{char.name}</h4>
          <p className="text-[10px] text-parchment/40 mt-1 line-clamp-2">{char.description || "No description yet."}</p>
        </div>
      ))}
      <button className="flex flex-col items-center justify-center gap-2 p-6 border border-dashed border-parchment/10 rounded-sm hover:bg-parchment/5 transition-all text-parchment/20 hover:text-parchment/40">
        <span className="text-xl">+</span>
        <span className="text-[10px] uppercase tracking-widest">Ink Character</span>
      </button>
    </div>
  );
}

function LoreTab({ lore }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {lore.map(entry => (
        <div key={entry.id} className="card-paper p-5 border border-parchment/8 hover:border-sepia/20 transition-all group">
          <div className="flex items-center gap-3 mb-3">
             <span className="text-sepia/40">📜</span>
             <h4 className="text-sm font-serif text-parchment/70 group-hover:text-parchment transition-colors">{entry.title}</h4>
          </div>
          <p className="text-[10px] text-parchment/40 line-clamp-3 leading-relaxed">{entry.content || "An unwritten legend."}</p>
        </div>
      ))}
      <button className="flex items-center justify-center gap-3 p-6 border border-dashed border-parchment/10 rounded-sm hover:bg-parchment/5 transition-all text-parchment/20 hover:text-parchment/40">
        <span className="text-xl">+</span>
        <span className="text-[10px] uppercase tracking-widest">Document Lore</span>
      </button>
    </div>
  );
}

function LockedView({ title }) {
  return (
    <div className="py-20 flex flex-col items-center text-center">
       <div className="text-4xl mb-6 grayscale">🗝️</div>
       <h3 className="text-xl font-serif text-parchment/60 mb-2 italic">{title} Restricted</h3>
       <p className="text-xs text-parchment/30 max-w-sm mb-8">
         Deep architectural tools like the Secret Web and Tension Mapping require an **Architect** station.
       </p>
       <button className="px-6 py-2 bg-sepia/10 border border-sepia/20 text-sepia/80 text-[10px] uppercase tracking-widest hover:bg-sepia/20 transition-all">
         Upgrade Your Station
       </button>
    </div>
  );
}

function SecretWebTab({ secrets, isLocked }) {
  if (isLocked) return <LockedView title="Secret Web" />;
  return (
    <div className="space-y-4">
      {secrets.length > 0 ? secrets.map(s => (
        <div key={s.id} className="card-paper p-5 border border-blood/10 bg-blood/5">
           <h4 className="text-sm font-serif text-parchment/70">{s.title}</h4>
           <p className="text-[10px] text-parchment/40 mt-2 italic">{s.content}</p>
        </div>
      )) : (
        <div className="text-center py-20 text-parchment/20 italic">No secrets recorded in the web.</div>
      )}
    </div>
  );
}

function TensionMapTab({ tension, isLocked }) {
  if (isLocked) return <LockedView title="Tension Map" />;
  return <div className="text-center py-20 text-parchment/20 italic font-serif">Tension Mapping Grid Active. Records: {tension.length}</div>;
}

function TimelinesTab({ timelines, isLocked }) {
  if (isLocked) return <LockedView title="Timelines" />;
  return <div className="text-center py-20 text-parchment/20 italic font-serif">Temporal Orchestration Active. Timelines: {timelines.length}</div>;
}
