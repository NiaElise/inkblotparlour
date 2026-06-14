import { useState, useEffect } from "react";
import { fetchMe, updateCustomization } from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        const me = await fetchMe();
        setUser(me);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    try {
      if (user.tier === 'Collective' || user.role === 'admin') {
        await updateCustomization({ theme: 'dark-sepia' });
        setSuccess("Profile settings saved to the archives.");
      } else {
        setError("Aesthetic customization requires the Collective tier.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="min-h-screen bg-void flex items-center justify-center text-sepia font-serif italic">Reading user records...</div>;
  if (!user) return <div className="min-h-screen bg-void text-red-400 p-8 text-center border border-red-900/20 m-10 rounded">User not found. Please log in.</div>;

  return (
    <div className="min-h-screen bg-void text-parchment">
      <Navbar />
      <main className="max-w-2xl mx-auto space-y-12 py-32 px-6">
        <header className="border-b border-sepia/20 pb-6">
          <h1 className="text-3xl font-serif text-parchment-light">Account Settings</h1>
          <p className="text-sepia italic text-sm">Manage your presence in the parlour</p>
        </header>

        <form onSubmit={handleUpdateProfile} className="space-y-8">
          {error && <div className="p-3 bg-red-900/20 border border-red-900/50 text-red-400 text-sm rounded">{error}</div>}
          {success && <div className="p-3 bg-emerald-900/20 border border-emerald-900/50 text-emerald-400 text-sm rounded">{success}</div>}

          <section className="space-y-6">
            <h2 className="text-xs uppercase tracking-widest text-parchment/30">Identity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sepia text-[10px] uppercase tracking-widest mb-2">Pen Name</label>
                <input 
                  type="text" 
                  value={user.username}
                  disabled
                  className="w-full bg-void/50 border border-parchment/10 p-3 text-parchment/50 rounded cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sepia text-[10px] uppercase tracking-widest mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={user.email || ''}
                  disabled
                  className="w-full bg-void/50 border border-parchment/10 p-3 text-parchment/50 rounded cursor-not-allowed"
                />
              </div>
            </div>
          </section>

          <section className="space-y-6 pt-6 border-t border-sepia/10">
            <h2 className="text-xs uppercase tracking-widest text-parchment/30">Current Station</h2>
            <div className="card-paper p-6 flex items-center justify-between border border-parchment/10 rounded-sm">
              <div>
                <div className="text-xl font-serif text-parchment-light mb-1">{user.tier}</div>
                <p className="text-xs text-parchment/40 italic">Member since {new Date(user.created_at).toLocaleDateString()}</p>
              </div>
              <a href="/tiers" className="text-[10px] uppercase tracking-widest border border-sepia/30 px-4 py-2 hover:bg-sepia hover:text-void transition-all rounded-sm">
                Change Station
              </a>
            </div>
          </section>

          <section className="space-y-6 pt-6 border-t border-sepia/10">
            <h2 className="text-xs uppercase tracking-widest text-parchment/30">Aesthetic Customization</h2>
            <div className={`card-paper p-6 border border-parchment/10 rounded-sm ${user.tier !== 'Collective' && user.role !== 'admin' ? 'opacity-50 grayscale' : ''}`}>
              <p className="text-sm text-parchment/60 mb-4 font-serif">
                Unlock the ability to skin your sanctuary and journals with custom CSS and dark literary themes.
              </p>
              {user.tier === 'Collective' || user.role === 'admin' ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-sepia/20 border border-sepia rounded-sm shadow-inner shadow-black"></div>
                    <div>
                      <div className="text-sm text-parchment/80 font-serif">Default (Dark Sepia)</div>
                      <div className="text-[10px] text-sepia italic text-emerald-500/60 font-mono tracking-tighter">Currently Active</div>
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="text-[10px] uppercase tracking-widest bg-sepia text-void px-6 py-2.5 font-bold hover:bg-parchment-light transition-colors rounded-sm shadow-lg shadow-sepia/10"
                  >
                    Save Aesthetic Settings
                  </button>
                </div>
              ) : (
                <div className="text-xs text-sepia italic flex items-center gap-2">
                  <span className="text-lg">◈</span> Requires the Collective tier.
                </div>
              )}
            </div>
          </section>
        </form>
      </main>
      <Footer />
    </div>
  );
}
