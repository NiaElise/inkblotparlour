import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchStats, fetchStoryworlds, createStoryworld, fetchAsks } from '../../api';

export default function SanctuaryDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ storyworlds: 0, characters: 0, fragments: 0 });
  const [worlds, setWorlds] = useState([]);
  const [asks, setAsks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [s, w, a] = await Promise.all([
          fetchStats(),
          fetchStoryworlds(),
          fetchAsks()
        ]);
        setStats(s);
        setWorlds(w);
        setAsks(a);
      } catch (err) {
        console.error("Dashboard load failed", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const handleCreateWorld = async () => {
    const title = prompt("Enter Storyworld Title:");
    if (!title) return;
    try {
      const newWorld = await createStoryworld(title, "A new realm of imagination.");
      setWorlds([...worlds, newWorld]);
      setStats({ ...stats, storyworlds: stats.storyworlds + 1 });
    } catch (err) {
      alert("Failed to create world: " + err.message);
    }
  };

  if (loading) return <div className="text-sepia font-serif italic text-center py-20">Opening the gates...</div>;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-parchment-light mb-2 italic">Welcome back, Architect</h1>
          <p className="text-parchment/40 text-sm max-w-xl">
            The ink is fresh and the margins are waiting. Your narratives continue here.
          </p>
        </div>
        
        <div className="flex gap-8 px-6 py-4 rounded-sm border border-parchment/8 bg-ink-warm/20">
          <div className="text-center">
            <div className="text-xl font-serif text-sepia/80 leading-none mb-1">{stats.storyworlds}</div>
            <div className="text-[9px] uppercase tracking-widest text-parchment/20">Worlds</div>
          </div>
          <div className="h-8 w-px bg-parchment/10" />
          <div className="text-center">
            <div className="text-xl font-serif text-sepia/80 leading-none mb-1">{stats.characters}</div>
            <div className="text-[9px] uppercase tracking-widest text-parchment/20">Characters</div>
          </div>
          <div className="h-8 w-px bg-parchment/10" />
          <div className="text-center">
            <div className="text-xl font-serif text-sepia/80 leading-none mb-1">{stats.fragments}</div>
            <div className="text-[9px] uppercase tracking-widest text-parchment/20">Fragments</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Left column - Storyworlds */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs uppercase tracking-[0.2em] text-parchment/30 font-bold">Active Projects</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {worlds.map((world, i) => (
              <motion.div
                key={world.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/sanctuary/studio/${world.id}`)}
                className="group card-paper rounded-sm p-5 cursor-pointer hover:border-sepia/30 transition-all border border-parchment/8"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-8 h-8 rounded-sm border border-parchment/10 flex items-center justify-center text-sepia/40 bg-ink-warm/20 group-hover:text-sepia/80 transition-colors font-serif italic text-lg">
                    {world.title.substring(0, 1)}
                  </div>
                  <span className="text-[9px] text-parchment/20 font-mono">ID: {world.id.substring(0, 8)}</span>
                </div>
                
                <h3 className="text-sm font-serif text-parchment/80 mb-1 group-hover:text-parchment transition-colors">
                  {world.title}
                </h3>
                <p className="text-[10px] text-parchment/40 line-clamp-2 mb-4 font-light leading-relaxed">
                  {world.description || "No description provided."}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-parchment/5">
                   <div className="flex gap-3 text-[9px] text-parchment/30">
                     <span>Active</span>
                     <span>Studio Ready</span>
                   </div>
                   <span className="text-[10px] text-sepia/40 group-hover:translate-x-1 transition-transform italic">Enter →</span>
                </div>
              </motion.div>
            ))}
            
            <button 
              onClick={handleCreateWorld}
              className="group flex flex-col items-center justify-center gap-3 p-8 border border-dashed border-parchment/10 rounded-sm hover:border-sepia/30 hover:bg-sepia/5 transition-all min-h-[160px]"
            >
              <span className="text-2xl text-parchment/10 group-hover:text-sepia/40 transition-colors">+</span>
              <span className="text-[10px] uppercase tracking-widest text-parchment/20 group-hover:text-sepia/60 transition-colors">Ink New World</span>
            </button>
          </div>
        </div>

        {/* Right column - Inbox & Activity */}
        <div className="space-y-8">
          <div className="card-paper rounded-sm p-5 border border-parchment/8">
            <h2 className="text-[10px] uppercase tracking-widest text-parchment/30 mb-6 flex items-center gap-2 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-sepia/40" />
              Pending Asks
            </h2>
            
            <div className="space-y-4">
              {asks.length > 0 ? asks.filter(a => !a.answer).slice(0, 3).map((ask, i) => (
                <div key={ask.id} className="text-xs text-parchment/50 hover:bg-ink-warm/30 rounded-sm p-2 -mx-2 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-1.5 text-[9px] text-parchment/20 mb-1.5">
                    <span className="text-parchment/40">Fragment Inquiry</span>
                    <span>· Just now</span>
                  </div>
                  <p className="line-clamp-2 text-parchment/60 italic group-hover:text-parchment transition-colors">
                    &ldquo;{ask.question}&rdquo;
                  </p>
                </div>
              )) : (
                <div className="py-4 text-center">
                  <p className="text-[10px] text-parchment/20 italic">No pending inquiries at this time.</p>
                </div>
              )}
            </div>
            
            <button className="mt-6 w-full py-2 text-[9px] uppercase tracking-widest text-sepia/40 border border-sepia/10 hover:bg-sepia/5 hover:text-sepia transition-all">
              View All Communications
            </button>
          </div>

          <div className="card-paper rounded-sm p-5 border border-parchment/8 bg-blood/5">
            <h2 className="text-[10px] uppercase tracking-widest text-blood/40 mb-4 flex items-center gap-2 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-blood/40" />
              Archives Update
            </h2>
            <p className="text-[10px] text-parchment/40 leading-relaxed italic">
              "Every story is an argument with silence." 
              Keep writing, architect. The Parlour is listening.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
