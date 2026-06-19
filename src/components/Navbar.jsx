import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../api';
import { useState, useEffect } from 'react';

const navLinks = [
  { label: 'The Parlour', href: '/feed' },
  { label: 'Circles', href: '/circles' },
  { label: 'Method', href: '/method' },
  { label: 'Access', href: '/tiers' },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('inkblot_token'));

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('inkblot_token'));
  }, [location]);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-parchment/8 bg-[#0c090a]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="w-2 h-2 rounded-full bg-sepia/60 group-hover:bg-sepia transition-colors" />
          <span className="text-lg font-serif tracking-tight text-parchment-light">
            Inkblot<span className="text-sepia/60 italic font-normal"> Parlour</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`text-xs uppercase tracking-[0.2em] transition-colors duration-300 ${
                location.pathname === link.href ? 'text-sepia' : 'text-parchment/40 hover:text-parchment/80'
              }`}
            >
              {link.label}
            </Link>
          ))}
          
          {isLoggedIn ? (
            <div className="flex items-center gap-6">
              <Link to="/sanctuary" className="text-xs uppercase tracking-[0.2em] text-parchment/60 hover:text-parchment transition-colors">Sanctuary</Link>
              <button 
                onClick={handleLogout}
                className="text-xs uppercase tracking-[0.2em] text-blood/60 hover:text-blood transition-colors"
              >
                Depart
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-xs uppercase tracking-[0.2em] text-parchment/40 hover:text-parchment/80 transition-colors">
              Login
            </Link>
          )}

          {!isLoggedIn && (
            <Link to="/signup" className="group relative px-6 py-2.5 text-xs uppercase tracking-[0.15em]">
              <span className="absolute inset-0 border border-parchment/15 rounded-sm group-hover:border-sepia/40 transition-colors" />
              <span className="absolute inset-0 bg-gradient-to-r from-sepia/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-sm" />
              <span className="relative text-parchment/80 group-hover:text-parchment transition-colors">
                Join the Circle
              </span>
            </Link>
          )}
        </div>

        <button className="md:hidden text-parchment/60 hover:text-parchment">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 5h14M3 10h14M3 15h10" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
