import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Sparkles,
  Cpu,
  History,
  Menu,
  X,
  Activity,
} from 'lucide-react';
import { LATEST_CHANGELOG_VERSION } from '../constants/changelog';

function GithubIcon({ className = "size-3.5" }) {
  return (
    <svg className={`${className} fill-current`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasUnreadChangelog, setHasUnreadChangelog] = useState(() => {
    try {
      const seen = localStorage.getItem('seen_changelog_version');
      return seen !== LATEST_CHANGELOG_VERSION;
    } catch {
      return false;
    }
  });
  const menuRef = useRef(null);

  const handleNavClick = (path, key) => {
    if (key === 'changelog') {
      try {
        localStorage.setItem('seen_changelog_version', LATEST_CHANGELOG_VERSION);
      } catch (err) {
        console.error('LocalStorage error:', err);
      }
      setHasUnreadChangelog(false);
    }
    navigate(path);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    try {
      const seen = localStorage.getItem('seen_changelog_version');
      if (seen !== LATEST_CHANGELOG_VERSION) {
        setHasUnreadChangelog(true);
      } else {
        setHasUnreadChangelog(false);
      }
    } catch {
      // LocalStorage fallback
    }
  }, [location.pathname]);

  const handleNavClick = (path, key) => {
    if (key === 'changelog') {
      try {
        localStorage.setItem('seen_changelog_version', LATEST_CHANGELOG_VERSION);
      } catch {}
      setHasUnreadChangelog(false);
    }
    navigate(path);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  let activePage = 'home';
  if (location.pathname === '/como-funciona') {
    activePage = 'how-it-works';
  } else if (location.pathname === '/changelog') {
    activePage = 'changelog';
  } else if (location.pathname === '/recomendar') {
    activePage = 'recommend';
  } else if (location.pathname === '/estado') {
    activePage = 'status';
  }

  const navItems = [
    {
      key: 'home',
      label: 'Analizar Juego',
      path: '/',
      description: 'Buscador y análisis de opiniones',
      icon: <Search className="size-3.5" />,
    },
    {
      key: 'recommend',
      label: 'Recomendar por IA',
      path: '/recomendar',
      isBeta: true,
      description: 'Encuentra títulos mediante RAG & NLP',
      icon: <Sparkles className="size-3.5" />,
    },
    {
      key: 'how-it-works',
      label: '¿Cómo funciona?',
      path: '/como-funciona',
      description: 'Pipeline técnico y modelo ML',
      icon: <Cpu className="size-3.5" />,
    },
    {
      key: 'changelog',
      label: 'Changelog',
      path: '/changelog',
      description: 'Historial de versiones y mejoras',
      icon: <History className="size-3.5" />,
    },
    {
      key: 'status',
      label: 'Estado',
      path: '/estado',
      description: 'Estado de los servicios e infraestructura en tiempo real',
      icon: <Activity className="size-3.5" />,
    },
  ];

  return (
    <header
      ref={menuRef}
      className={`w-full sticky top-0 z-50 transition-all duration-200 ${
        scrolled || mobileMenuOpen
          ? 'bg-[#080b11]/90 backdrop-blur-md border-b border-[#1b2434] shadow-md py-3'
          : 'bg-transparent border-b border-transparent py-4'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* LOGO MARCA IZQUIERDA */}
        <button
          onClick={() => {
            navigate('/');
            setMobileMenuOpen(false);
          }}
          className="flex items-center cursor-pointer bg-transparent border-0 p-0 text-left outline-none group shrink-0 whitespace-nowrap"
          aria-label="Ir al inicio de Game Recommended AI"
        >
          <span className="text-sm sm:text-base font-extrabold tracking-tight text-slate-100 group-hover:text-white transition-colors whitespace-nowrap">
            Game Recommended <span className="text-blue-400 font-black">AI</span>
          </span>
        </button>

        {/* NAVEGACIÓN DESKTOP EN EL CENTRO CON ESTADO DEL SERVICIO */}
        <nav
          className="hidden md:flex items-center gap-1 bg-[#0f1520] border border-[#1b2434] rounded-xl p-1 shrink-0 mx-auto"
          aria-label="Navegación principal"
        >
          {navItems.map(({ key, label, path, isBeta, icon }) => {
            const isActive = activePage === key;
            const isChangelogUnread = key === 'changelog' && hasUnreadChangelog;
            return (
              <button
                key={key}
                onClick={() => handleNavClick(path, key)}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer outline-none flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-[#151d2c]'
                }`}
              >
                <span className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`}>{icon}</span>
                <span className="whitespace-nowrap">{label}</span>
                {isBeta && (
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap shrink-0">
                    BETA
                  </span>
                )}
                {isChangelogUnread && (
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 whitespace-nowrap shrink-0 animate-pulse">
                    NUEVO
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* ACCIONES DESKTOP DERECHA */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Link GitHub */}
          <a
            href="https://github.com/alejandrotg-code"
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 border border-[#1b2434] bg-[#0f1520] hover:bg-[#151d2c] px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-200 transition-all whitespace-nowrap shrink-0"
          >
            <GithubIcon className="size-3.5 text-slate-300 shrink-0" />
            <span className="whitespace-nowrap">GitHub</span>
          </a>

          {/* Botón Menú Móvil */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden flex items-center justify-center p-2 rounded-lg border border-[#1b2434] bg-[#0f1520] text-slate-200 cursor-pointer"
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="size-4 text-blue-400" />
            ) : (
              <Menu className="size-4 text-slate-300" />
            )}
          </button>
        </div>
      </div>

      {/* MENÚ MÓVIL DESPLEGABLE */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full border-t border-[#1b2434] bg-[#080b11] px-4 py-4 space-y-2 shadow-2xl animate-fade-up">
          <div className="space-y-1">
            {navItems.map(({ key, label, path, isBeta, description, icon }) => {
              const isActive = activePage === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    navigate(path);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-[#0f1520] text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {icon}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold leading-none">{label}</span>
                        {isBeta && (
                          <span className="text-[9px] font-bold uppercase px-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            BETA
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] opacity-75 mt-0.5 font-normal">{description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
