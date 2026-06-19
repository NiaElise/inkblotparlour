import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchMe, fetchStoryworlds, logout } from '../../api';

const sidebarLinks = [
  { to: '/sanctuary', label: 'Dashboard', icon: '◈', end: true },
  { to: '/sanctuary/journal', label: 'Chronicler Journal', icon: '✒' },
];

const bottomLinks = [
  { to: '/sanctuary/cabinet', label: 'Character Cabinet', icon: '♟' },
  { to: '/sanctuary/settings', label: 'Settings', icon: '⚙' },
];

export default function SanctuaryLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [worlds, setWorlds] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const userData = await fetchMe();
        setUser(userData);
        const worldsData = await fetchStoryworlds();
        setWorlds(worldsData);
      } catch (err) {
        console.error("Failed to load sanctuary data", err);
      }
    }
    loadData();
  }, []);

  const handleLogout = () => {
    logout();
  };

  let customization = {};
  try {
    customization = user?.customization ? JSON.parse(user.customization) : {};
    if (!customization || typeof customization !== 'object') customization = {};
  } catch (e) {
    customization = {};
  }
  
  const customStyles = `
    :root {
      --sanctuary-font: ${customization.font || 'inherit'};
      --sanctuary-font-color: ${customization.fontColor || '#e8ddd0'};
      --sanctuary-page-color: ${customization.pageColor || '#0c090a'};
      --sanctuary-accent-color: ${customization.accentColor || '#704214'};
    }
    .sanctuary-custom {
      font-family: var(--sanctuary-font);
      color: var(--sanctuary-font-color);
    }
    .sanctuary-accent {
      color: var(--sanctuary-accent-color);
    }
    .sanctuary-accent-bg {
      background-color: var(--sanctuary-accent-color);
    }
  `;

  return (
    <div className="flex h-screen overflow-hidden sanctuary-custom" style={{ backgroundColor: customization.pageColor || '#0c090a', color: customization.fontColor || '#e8ddd0' }}>
      <style>{customStyles}</style>
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-parchment/8 bg-black/40 flex flex-col">
        {/* Brand */}
        <div className="px-5 py-6 border-b border-parchment/8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 group"
          >
            <span className="w-1.5 h-1.5 rounded-full transition-colors" style={{ backgroundColor: customization.accentColor || '#704214' }} />
            <span className="text-sm font-serif text-parchment/70">
              Inkblot <span className="italic opacity-60" style={{ color: customization.accentColor || '#704214' }}>Parlour</span>
            </span>
          </button>
          <p className="text-[9px] text-parchment/20 tracking-widest uppercase mt-2 ml-3.5">
            Your Sanctuary
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto font-serif">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs transition-all duration-200 ${
                  isActive
                    ? 'bg-white/5 text-parchment/80 border-l-2'
                    : 'text-parchment/30 hover:text-parchment/60 hover:bg-white/5 border-l-2 border-transparent'
                }`
              }
              style={({ isActive }) => isActive ? { borderLeftColor: customization.accentColor || '#704214', backgroundColor: (customization.accentColor || '#704214') + '1a' } : {}}
            >
              <span className="text-sm w-5 text-center shrink-0">{link.icon}</span>
              <span className="truncate">{link.label}</span>
            </NavLink>
          ))}

          <div className="pt-4 pb-2 px-3 text-[10px] uppercase tracking-widest text-parchment/15 font-bold">
            My Worlds
          </div>
          {worlds.map((world) => (
            <NavLink
              key={world.id}
              to={`/sanctuary/studio/${world.id}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs transition-all duration-200 ${
                  isActive
                    ? 'bg-white/5 text-parchment/80 border-l-2'
                    : 'text-parchment/30 hover:text-parchment/60 hover:bg-white/5 border-l-2 border-transparent'
                }`
              }
              style={({ isActive }) => isActive ? { borderLeftColor: customization.accentColor || '#704214', backgroundColor: (customization.accentColor || '#704214') + '1a' } : {}}
            >
              <span className="text-sm w-5 text-center shrink-0">⬟</span>
              <span className="truncate">{world.title}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-parchment/8 space-y-1 font-serif">
          {bottomLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs transition-all duration-200 ${
                  isActive
                    ? 'bg-white/5 text-parchment/80 border-l-2'
                    : 'text-parchment/30 hover:text-parchment/60 hover:bg-white/5 border-l-2 border-transparent'
                }`
              }
              style={({ isActive }) => isActive ? { borderLeftColor: customization.accentColor || '#704214', backgroundColor: (customization.accentColor || '#704214') + '1a' } : {}}
            >
              <span className="text-sm w-5 text-center shrink-0">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
          
          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs text-parchment/30 hover:text-parchment/60 transition-all duration-200"
            >
              <span className="text-sm w-5 text-center shrink-0">🏛</span>
              <span>Archives (Admin)</span>
            </NavLink>
          )}
        </div>

        {/* User */}
        <div className="px-4 py-4 border-t border-parchment/8 flex items-center gap-3">
          {user?.avatar ? (
            <img src={user.avatar} alt="Avatar" className="w-7 h-7 rounded-full border border-parchment/10 object-cover" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sepia/30 to-black border border-parchment/10 flex items-center justify-center text-[9px] font-serif text-parchment/60 shrink-0 uppercase">
              {user?.username?.substring(0, 2) || '...'}
            </div>
          )}
          <div className="min-w-0 font-serif">
            <div className="text-[11px] text-parchment/60 truncate">{user?.username || 'Loading...'}</div>
            <div className="text-[8px] text-parchment/20 uppercase tracking-wider">{user?.tier || '...'}</div>
          </div>
          <button
            onClick={handleLogout}
            className="ml-auto text-parchment/20 hover:text-red-500 transition-colors"
            title="Exit Sanctuary"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M10 3l-7 7M3 3l7 7" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto relative">
        {user?.banner && (
          <div className="absolute top-0 left-0 w-full h-48 z-0">
            <img src={user.banner} alt="Banner" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-void" style={{ backgroundImage: `linear-gradient(to bottom, transparent, ${customization.pageColor || '#0c090a'})` }}></div>
          </div>
        )}
        <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
