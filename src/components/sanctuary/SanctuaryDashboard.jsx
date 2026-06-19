import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchStats, fetchStoryworlds, createStoryworld, fetchAsks, fetchLoreTemplates, applyLoreTemplate } from '../../api';

export default function SanctuaryDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ worlds: 0, characters: 0, fragments: 0 });
  const [worlds, setWorlds] = useState([]);
  const [asks, setAsks] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [statsData, worldsData, asksData, templatesData] = await Promise.all([
          fetchStats(),
          fetchStoryworlds(),
          fetchAsks(),
          fetchLoreTemplates()
        ]);
        setStats(statsData);
        setWorlds(worldsData);
        setAsks(asksData);
        setTemplates(templatesData);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const handleCreateWithTemplate = async (templateId = null) => {
    const title = prompt("Name your new storyworld:");
    if (!title) return;

    try {
      const newWorld = await createStoryworld({ 
        title, 
        description: templateId 
          ? `A world inspired by the ${templates.find(t => t.id === templateId)?.name} template.`
          : "A new blank canvas for your imagination." 
      });
      
      if (templateId) {
        await applyLoreTemplate(newWorld.id, templateId);
      }
      
      navigate(`/sanctuary/studio/${newWorld.id}`);
    } catch (err) {
      alert(err.message || "Failed to create storyworld. Check your tier limits.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-parchment/30 italic font-serif">
        Breating life into the sanctuary...
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif text-parchment/90 mb-2">Welcome Back, Architect</h1>
          <p className="text-sm text-parchment/40 italic">The ink never dries in the parlor of dreams.</p>
        </div>
        <div className="flex gap-4">
          {showTemplateModal ? (
            <div className="flex gap-2 bg-ink-well/60 p-2 border border-parchment/10 rounded-sm animate-in fade-in slide-in-from-right-4">
              <button 
                onClick={() => handleCreateWithTemplate(null)}
                className="px-4 py-1.5 hover:bg-sepia/10 text-[10px] uppercase tracking-widest text-parchment/60 transition-all"
              >
                Blank Slate
              </button>
              {templates.map(t => (
                <button 
                  key={t.id}
                  onClick={() => handleCreateWithTemplate(t.id)}
                  className="px-4 py-1.5 hover:bg-sepia/20 border-l border-parchment/5 text-[10px] uppercase tracking-widest text-sepia transition-all"
                  title={t.description}
                >
                  {t.name}
                </button>
              ))}
              <button 
                onClick={() => setShowTemplateModal(false)}
                className="px-2 py-1.5 text-blood/40 hover:text-blood transition-all"
              >
                ✕
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowTemplateModal(true)}
              className="px-6 py-2.5 bg-sepia/20 hover:bg-sepia/30 border border-sepia/40 text-sepia text-xs uppercase tracking-widest transition-all duration-300"
            >
              Ink New World
            </button>
          )}
        </div>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Active Worlds', value: stats.worlds, icon: '⬟' },
          { label: 'Cast Members', value: stats.characters, icon: '♟' },
          { label: 'Lore Fragments', value: stats.fragments, icon: '📜' },
        ].map((stat) => (
          <div key={stat.label} className="p-6 border border-parchment/5 bg-ink-warm/20 rounded-sm">
            <div className="text-[10px] uppercase tracking-[0.2em] text-parchment/30 mb-4 flex items-center gap-2">
              <span className="text-sepia/50">{stat.icon}</span>
              {stat.label}
            </div>
            <div className="text-3xl font-serif text-parchment/80">{stat.value}</div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Storyworlds */}
        <section className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-serif text-parchment/70 border-b border-parchment/5 pb-2">Recent Storyworlds</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {worlds.map((world) => (
              <div 
                key={world.id}
                onClick={() => navigate(`/sanctuary/studio/${world.id}`)}
                className="group p-5 border border-parchment/8 bg-ink-well/40 hover:border-sepia/40 hover:bg-sepia/5 transition-all cursor-pointer"
              >
                <h3 className="text-parchment/80 font-serif mb-2 group-hover:text-sepia transition-colors">{world.title}</h3>
                <p className="text-[11px] text-parchment/40 line-clamp-2 italic mb-4 leading-relaxed">
                  {world.description}
                </p>
                <div className="flex items-center gap-4 text-[9px] uppercase tracking-widest text-parchment/20">
                  <span>Characters: {world.characters_count || 0}</span>
                  <span>Lore: {world.lore_count || 0}</span>
                </div>
              </div>
            ))}
            {worlds.length === 0 && (
              <div className="col-span-2 py-12 border border-dashed border-parchment/10 flex flex-col items-center justify-center text-parchment/20">
                <span className="text-2xl mb-2">⬟</span>
                <p className="text-xs italic">No storyworlds created yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* Community Asks */}
        <section className="space-y-6">
          <h2 className="text-lg font-serif text-parchment/70 border-b border-parchment/5 pb-2">Recent Asks</h2>
          <div className="space-y-4">
            {asks.map((ask) => (
              <div key={ask.id} className="p-4 border-l-2 border-sepia/30 bg-ink-warm/20 space-y-2">
                <div className="text-[10px] text-sepia/60 italic font-serif">
                  From {ask.sender_name || 'Anonymous'}
                </div>
                <p className="text-[11px] text-parchment/70 leading-relaxed">
                  "{ask.content}"
                </p>
                <button className="text-[9px] uppercase tracking-widest text-parchment/30 hover:text-sepia transition-colors">
                  Respond in Journal
                </button>
              </div>
            ))}
            {asks.length === 0 && (
              <div className="py-8 text-center border border-parchment/5 bg-ink-well/20 text-parchment/20 italic text-[11px]">
                No pending inquiries.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
