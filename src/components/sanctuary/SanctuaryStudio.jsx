import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchStoryworld, fetchCharacters, fetchLore, fetchMe, archiveLore, inviteStoryworldMember, removeStoryworldMember } from '../../api';

export default function SanctuaryStudio() {
  const { worldId } = useParams();
  const [world, setWorld] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [lore, setLore] = useState([]);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudio() {
      try {
        const [worldData, charactersData, loreData, userData] = await Promise.all([
          fetchStoryworld(worldId),
          fetchCharacters(worldId),
          fetchLore(worldId),
          fetchMe()
        ]);
        setWorld(worldData);
        setCharacters(charactersData);
        setLore(loreData);
        setUser(userData);
      } catch (err) {
        console.error("Failed to load studio data", err);
      } finally {
        setLoading(false);
      }
    }
    loadStudio();
  }, [worldId]);

  const handleArchiveLore = async (loreId) => {
    try {
      await archiveLore(loreId, true);
      setLore(lore.filter(l => l.id !== loreId));
    } catch (err) {
      alert("Failed to archive lore");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-parchment/30 italic font-serif text-sm">
        Summoning the architecture of {worldId}...
      </div>
    );
  }

  const isTierRestricted = (tab) => {
    const restrictedTabs = ['Secret Web', 'Tension Map', 'Timelines'];
    if (restrictedTabs.includes(tab)) {
      return user?.tier === 'Draftsman' && user?.role !== 'admin';
    }
    return false;
  };

  const tabs = ['Overview', 'Cast', 'Lore', 'Secret Web', 'Tension Map', 'Timelines'];

  return (
    <div className="space-y-8">
      {/* Studio Header */}
      <header className="border-b border-parchment/10 pb-6">
        <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-sepia/60 mb-3">
          <span>Storyworld</span>
          <span className="opacity-30">/</span>
          <span>Studio</span>
        </div>
        <h1 className="text-4xl font-serif text-parchment/90 mb-4">{world?.title}</h1>
        <p className="text-sm text-parchment/40 max-w-2xl leading-relaxed italic">
          {world?.description}
        </p>
      </header>

      {/* Studio Navigation */}
      <nav className="flex items-center gap-8 border-b border-parchment/5">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-[11px] uppercase tracking-widest transition-all relative ${
              activeTab === tab 
                ? 'text-sepia' 
                : 'text-parchment/30 hover:text-parchment/60'
            }`}
          >
            {tab}
            {isTierRestricted(tab) && (
              <span className="ml-2 text-[8px] text-blood/50 font-bold uppercase tracking-normal">Locked</span>
            )}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sepia/50" />
            )}
          </button>
        ))}
      </nav>

      {/* Studio Workspace */}
      <div className="min-h-[400px]">
        {isTierRestricted(activeTab) ? (
          <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-12 h-12 rounded-full border border-blood/20 flex items-center justify-center text-blood/40 text-xl">
              ⚖
            </div>
            <div>
              <h3 className="text-parchment/80 font-serif text-lg mb-2">Architectural Access Required</h3>
              <p className="text-xs text-parchment/40 max-w-xs mx-auto leading-relaxed italic">
                Advanced worldbuilding tools like {activeTab} are reserved for those on the Architect or Collective tiers.
              </p>
            </div>
            <button className="px-5 py-2 border border-sepia/30 text-[10px] uppercase tracking-widest text-sepia hover:bg-sepia/10 transition-all">
              Upgrade Your Access
            </button>
          </div>
        ) : (
          <div className="py-6">
            {activeTab === 'Overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="p-6 bg-ink-warm/10 border border-parchment/5">
                    <h3 className="text-sm font-serif text-parchment/60 mb-4 border-b border-parchment/5 pb-2 uppercase tracking-widest">Atmosphere</h3>
                    <p className="text-xs text-parchment/40 leading-loose">
                      Describe the mood, tone, and sensory details of this world.
                    </p>
                  </div>

                  {/* Collaboration Section */}
                  <div className="p-6 bg-ink-well/20 border border-parchment/5 space-y-4">
                    <h3 className="text-sm font-serif text-parchment/60 mb-2 border-b border-parchment/5 pb-2 uppercase tracking-widest">The Collective</h3>
                    <div className="flex gap-2">
                      <input 
                        id="invite-identifier"
                        placeholder="Username or Email..."
                        className="flex-1 bg-void/40 border border-parchment/10 rounded-sm px-3 py-1.5 text-xs text-parchment/60 placeholder:text-parchment/20 focus:outline-none focus:border-sepia/30"
                      />
                      <button 
                        onClick={async () => {
                          const idnt = document.getElementById('invite-identifier').value;
                          if (!idnt) return;
                          try {
                            await inviteStoryworldMember(worldId, idnt);
                            alert(`Invitation sent to ${idnt}`);
                            document.getElementById('invite-identifier').value = '';
                          } catch (err) {
                            alert(err.message || "Failed to invite. Only Collective tier can invite.");
                          }
                        }}
                        className="px-4 py-1.5 bg-sepia/20 border border-sepia/30 text-sepia text-[10px] uppercase tracking-widest hover:bg-sepia/30"
                      >
                        Invite
                      </button>
                    </div>
                    <p className="text-[9px] text-parchment/20 italic">
                      Share your storyworld with fellow architects. Collective tier required to invite.
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="p-6 bg-ink-well/20 border border-parchment/5">
                    <h3 className="text-sm font-serif text-parchment/60 mb-4 border-b border-parchment/5 pb-2 uppercase tracking-widest">Quick Stats</h3>
                    <dl className="space-y-3">
                      {[
                        ['Total Cast', characters.length],
                        ['Lore Fragments', lore.length],
                        ['Last Inked', new Date(world?.updated_at || Date.now()).toLocaleDateString()],
                      ].map(([label, val]) => (
                        <div key={label} className="flex justify-between text-[11px]">
                          <span className="text-parchment/30">{label}</span>
                          <span className="text-parchment/60 font-serif">{val}</span>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Cast' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {characters.map((char) => (
                  <div key={char.id} className="p-4 border border-parchment/10 bg-ink-warm/20 group hover:border-sepia/30 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-ink-well border border-parchment/10 mb-3 flex items-center justify-center text-parchment/20">
                      ♟
                    </div>
                    <h4 className="text-parchment/80 font-serif text-sm group-hover:text-sepia transition-colors">{char.name}</h4>
                    <p className="text-[10px] text-parchment/30 italic uppercase tracking-wider mb-2">{char.role}</p>
                    <p className="text-[11px] text-parchment/50 line-clamp-2 leading-relaxed">{char.description}</p>
                  </div>
                ))}
                <button className="p-6 border border-dashed border-parchment/10 flex flex-col items-center justify-center gap-2 hover:bg-parchment/5 transition-all text-parchment/20">
                  <span className="text-lg">+</span>
                  <span className="text-[10px] uppercase tracking-widest">Manifest Character</span>
                </button>
              </div>
            )}

            {activeTab === 'Lore' && (
              <div className="space-y-4 max-w-3xl">
                {lore.map((entry) => (
                  <div key={entry.id} className="p-6 border-b border-parchment/5 space-y-3 hover:bg-ink-warm/10 transition-colors">
                    <div className="flex justify-between items-center">
                      <h4 className="text-parchment/80 font-serif text-base">{entry.title}</h4>
                      <span className="text-[9px] uppercase tracking-widest text-parchment/20">{entry.category}</span>
                    </div>
                    <p className="text-[12px] text-parchment/50 leading-relaxed italic">
                      {entry.content}
                    </p>
                  </div>
                ))}
                <button className="w-full py-8 border border-dashed border-parchment/10 flex flex-col items-center justify-center gap-2 hover:bg-parchment/5 transition-all text-parchment/20">
                  <span className="text-lg">📜</span>
                  <span className="text-[10px] uppercase tracking-widest">Inscribe Lore Fragment</span>
                </button>
              </div>
            )}

            {(activeTab === 'Secret Web' || activeTab === 'Tension Map' || activeTab === 'Timelines') && !isTierRestricted(activeTab) && (
              <div className="py-20 text-center text-parchment/30 italic font-serif">
                Advanced Tools: {activeTab} workspace is being prepared...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
