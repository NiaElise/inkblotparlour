import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const sidebarLinks = [
  { to: '/sanctuary', label: 'Sanctuary', icon: '◈', end: true },
  { to: '/sanctuary/studio/the-forgotten-city', label: 'The Forgotten City', icon: '⌗' },
  { to: '/sanctuary/studio/the-bloodline-pact', label: 'The Bloodline Pact', icon: '◉' },
  { to: '/sanctuary/studio/echoes-of-ash', label: 'Echoes of Ash', icon: '✦' },
];

const bottomLinks = [
  { to: '/sanctuary/cabinet', label: 'Character Cabinet', icon: '♟' },
];

export default function SanctuaryLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-[#0c090a] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-parchment/8 bg-ink-well/40 flex flex-col">
        {/* Brand */}
        <div className="px-5 py-6 border-b border-parchment/8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 group"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sepia/60 group-hover:bg-sepia transition-colors" />
            <span className="text-sm font-serif text-parchment/70">
              Inkblot <span className="italic text-sepia/60">Parlour</span>
            </span>
          </button>
          <p className="text-[9px] text-parchment/20 tracking-widest uppercase mt-2 ml-3.5">
            Your Sanctuary
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs transition-all duration-200 ${
                  isActive
                    ? 'bg-sepia/10 text-parchment/80 border-l-2 border-sepia/50'
                    : 'text-parchment/30 hover:text-parchment/60 hover:bg-ink-warm/40 border-l-2 border-transparent'
                }`
              }
            >
              <span className="text-sm w-5 text-center shrink-0">{link.icon}</span>
              <span className="truncate">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-parchment/8 space-y-1">
          {bottomLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs transition-all duration-200 ${
                  isActive
                    ? 'bg-sepia/10 text-parchment/80 border-l-2 border-sepia/50'
                    : 'text-parchment/30 hover:text-parchment/60 hover:bg-ink-warm/40 border-l-2 border-transparent'
                }`
              }
            >
              <span className="text-sm w-5 text-center shrink-0">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>

        {/* User */}
        <div className="px-4 py-4 border-t border-parchment/8 flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sepia/30 to-inkwell border border-parchment/10 flex items-center justify-center text-[9px] font-serif text-parchment/60 shrink-0">
            ET
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-parchment/60 truncate">Elias Thorne</div>
            <div className="text-[8px] text-parchment/20 uppercase tracking-wider">Architect</div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="ml-auto text-parchment/20 hover:text-parchment/50 transition-colors"
            title="Exit Sanctuary"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M10 3l-7 7M3 3l7 7" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}