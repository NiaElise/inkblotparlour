import { useState, useEffect } from "react";
import { fetchMe, updateProfile, updateSecurity, updateCustomization } from "../api";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  
  // Profile state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [banner, setBanner] = useState("");
  
  // Security state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Customization state
  const [font, setFont] = useState("inherit");
  const [fontColor, setFontColor] = useState("#e8ddd0");
  const [pageColor, setPageColor] = useState("#0c090a");
  const [accentColor, setAccentColor] = useState("#704214");

  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    async function loadUser() {
      try {
        const me = await fetchMe();
        setUser(me);
        setUsername(me.username);
        setEmail(me.email || "");
        setAvatar(me.avatar || "");
        setBanner(me.banner || "");
        
        if (me.customization) {
          const cust = JSON.parse(me.customization);
          setFont(cust.font || "inherit");
          setFontColor(cust.fontColor || "#e8ddd0");
          setPageColor(cust.pageColor || "#0c090a");
          setAccentColor(cust.accentColor || "#704214");
        }
      } catch (err) {
        setMessage({ type: "error", text: "Failed to load user records." });
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ username, email, avatar, banner });
      setMessage({ type: "success", text: "Profile records updated in the archives." });
      setUser({ ...user, username, email, avatar, banner });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const handleSecurityUpdate = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }
    try {
      await updateSecurity({ password });
      setMessage({ type: "success", text: "Security credentials updated." });
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const isPaidTier = user?.tier === "Architect" || user?.tier === "Collective" || user?.role === "admin";

  const handleCustomizationUpdate = async (e) => {
    e.preventDefault();
    try {
      const customization = { font, fontColor, pageColor, accentColor };
      await updateCustomization(customization);
      setMessage({ type: "success", text: "Aesthetic settings applied." });
      // We could use a context but a reload is simpler to apply root CSS
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  if (loading) return <div className="p-10 text-sepia font-serif italic">Consulting the archives...</div>;

  const tabs = [
    { id: "profile", label: "Profile", icon: "◈" },
    { id: "aesthetic", label: "Aesthetic", icon: "✒" },
    { id: "security", label: "Security", icon: "⚔" },
  ];

  const freeFonts = [
    { value: "inherit", label: "Default (Sans)" },
    { value: "'Inter', sans-serif", label: "Modern (Inter)" },
    { value: "'Lora', serif", label: "Classic (Lora)" },
    { value: "'Courier New', monospace", label: "Typewriter (Courier)" },
  ];

  const premiumFonts = [
    { value: "'Playfair Display', serif", label: "Elegant (Playfair)" },
    { value: "'EB Garamond', serif", label: "Literary (Garamond)" },
    { value: "'Cinzel', serif", label: "Mythic (Cinzel)" },
    { value: "'Crimson Pro', serif", label: "Scholarly (Crimson)" },
    { value: "'Source Serif 4', serif", label: "Editorial (Source)" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <header className="border-b border-parchment/10 pb-6">
        <h1 className="text-3xl font-serif text-parchment-light">Sanctuary Settings</h1>
        <p className="text-sepia italic text-sm">Configure your personal corner of the Parlour</p>
      </header>

      <div className="flex gap-4 border-b border-parchment/5 pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setMessage({ type: "", text: "" }); }}
            className={`px-6 py-3 text-xs uppercase tracking-widest transition-all relative ${
              activeTab === tab.id ? "text-parchment-light" : "text-parchment/30 hover:text-parchment/50"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="text-sm">{tab.icon}</span>
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-sepia"
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="card-paper p-8 border border-parchment/10 rounded-sm"
        >
          {message.text && (
            <div className={`mb-6 p-4 border rounded-sm text-sm ${
              message.type === "success" ? "bg-emerald-900/10 border-emerald-900/30 text-emerald-400" : "bg-blood/10 border-blood/30 text-blood"
            }`}>
              {message.text}
            </div>
          )}

          {activeTab === "profile" && (
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-widest text-sepia">Pen Name</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-void/50 border border-parchment/10 p-3 text-parchment focus:border-sepia outline-none transition-colors rounded-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-widest text-sepia">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-void/50 border border-parchment/10 p-3 text-parchment focus:border-sepia outline-none transition-colors rounded-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-widest text-sepia">Avatar URL</label>
                  <input
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-void/50 border border-parchment/10 p-3 text-parchment focus:border-sepia outline-none transition-colors rounded-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-widest text-sepia">Banner URL</label>
                  <input
                    type="text"
                    value={banner}
                    onChange={(e) => setBanner(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-void/50 border border-parchment/10 p-3 text-parchment focus:border-sepia outline-none transition-colors rounded-sm"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-6 pt-4">
                <div className="w-20 h-20 rounded-full border border-parchment/10 overflow-hidden bg-void/50 flex items-center justify-center">
                  {avatar ? <img src={avatar} alt="Preview" className="w-full h-full object-cover" /> : <span className="text-parchment/10">Avatar</span>}
                </div>
                <div className="flex-1 h-20 rounded-sm border border-parchment/10 overflow-hidden bg-void/50 flex items-center justify-center">
                  {banner ? <img src={banner} alt="Preview" className="w-full h-full object-cover" /> : <span className="text-parchment/10 text-xs">Banner Preview</span>}
                </div>
              </div>

              <button
                type="submit"
                className="bg-sepia text-void px-8 py-3 rounded-sm font-serif hover:bg-parchment-light transition-all shadow-lg shadow-sepia/10"
              >
                Seal Records
              </button>
            </form>
          )}

          {activeTab === "aesthetic" && (
            <form onSubmit={handleCustomizationUpdate} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-serif text-parchment-light border-b border-parchment/5 pb-2">Typography</h3>
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase tracking-widest text-sepia">Base Font Family</label>
                    <select
                      value={font}
                      onChange={(e) => setFont(e.target.value)}
                      className="w-full bg-void/50 border border-parchment/10 p-3 text-parchment focus:border-sepia outline-none transition-colors rounded-sm appearance-none"
                    >
                      <optgroup label="Standard Fonts">
                        {freeFonts.map(f => (
                          <option key={f.value} value={f.value}>{f.label}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Premium Fonts (Architect/Collective)">
                        {premiumFonts.map(f => (
                          <option key={f.value} value={f.value} disabled={!isPaidTier}>{f.label} {!isPaidTier ? "🔒" : ""}</option>
                        ))}
                      </optgroup>
                    </select>
                    {!isPaidTier && (
                      <p className="text-[9px] text-sepia italic">Extra fonts require the Architect or Collective tier.</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-serif text-parchment-light border-b border-parchment/5 pb-2">Palette</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase tracking-widest text-sepia">Font Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={fontColor}
                          onChange={(e) => setFontColor(e.target.value)}
                          className="h-10 w-10 bg-transparent border-none p-0 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={fontColor}
                          onChange={(e) => setFontColor(e.target.value)}
                          className="flex-1 bg-void/30 border border-parchment/5 p-2 text-[10px] text-parchment font-mono"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase tracking-widest text-sepia">Page Background</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={pageColor}
                          onChange={(e) => setPageColor(e.target.value)}
                          className="h-10 w-10 bg-transparent border-none p-0 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={pageColor}
                          onChange={(e) => setPageColor(e.target.value)}
                          className="flex-1 bg-void/30 border border-parchment/5 p-2 text-[10px] text-parchment font-mono"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <label className="block text-[10px] uppercase tracking-widest text-sepia">Accent Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={accentColor}
                          onChange={(e) => setAccentColor(e.target.value)}
                          className="h-10 w-10 bg-transparent border-none p-0 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={accentColor}
                          onChange={(e) => setAccentColor(e.target.value)}
                          className="flex-1 bg-void/30 border border-parchment/5 p-2 text-[10px] text-parchment font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border border-parchment/5 bg-void/20 rounded-sm">
                <h4 className="text-[10px] uppercase tracking-widest text-parchment/30 mb-4">Aesthetic Preview</h4>
                <div 
                  className="p-8 rounded-sm shadow-inner min-h-[160px]"
                  style={{ backgroundColor: pageColor, color: fontColor, fontFamily: font }}
                >
                  <h2 className="text-xl mb-2" style={{ color: accentColor }}>A Chapter in the Night</h2>
                  <p className="text-sm opacity-80 italic leading-relaxed">
                    The ink pooled like shadows on the parchment, telling tales of forgotten architectures.
                    This is how your sanctuary will appear to you.
                  </p>
                  <div className="mt-4 flex gap-2">
                     <span className="px-3 py-1 text-[9px] rounded-full" style={{ backgroundColor: accentColor + '33', border: `1px solid ${accentColor}`, color: accentColor }}>Lore Tag</span>
                     <span className="px-3 py-1 text-[9px] rounded-full" style={{ backgroundColor: accentColor + '33', border: `1px solid ${accentColor}`, color: accentColor }}>Fragment</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="bg-sepia text-void px-8 py-3 rounded-sm font-serif hover:bg-parchment-light transition-all shadow-lg shadow-sepia/10"
              >
                Apply Aesthetic
              </button>
            </form>
          )}

          {activeTab === "security" && (
            <form onSubmit={handleSecurityUpdate} className="space-y-6 max-w-md">
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-sepia">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-void/50 border border-parchment/10 p-3 text-parchment focus:border-sepia outline-none transition-colors rounded-sm"
                  placeholder="Leave blank to keep current"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-sepia">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-void/50 border border-parchment/10 p-3 text-parchment focus:border-sepia outline-none transition-colors rounded-sm"
                />
              </div>
              <button
                type="submit"
                className="bg-sepia text-void px-8 py-3 rounded-sm font-serif hover:bg-parchment-light transition-all shadow-lg shadow-sepia/10"
              >
                Update Key
              </button>
            </form>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
