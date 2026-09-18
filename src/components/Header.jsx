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
  Sun,
  Moon,
  Gamepad2,
} from 'lucide-react';
import { LATEST_CHANGELOG_VERSION } from '../constants/changelog';

function GithubIcon({ className = 'size-4' }) {
  return (
    <svg className={`${className} fill-current`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function useThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    try {
      return document.documentElement.classList.contains('dark');
    } catch {
      return true;
    }
  });

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      try {
        document.documentElement.classList.toggle('dark', next);
        localStorage.setItem('gr_theme', next ? 'dark' : 'light');
      } catch (err) {
        console.error('Theme toggle error:', err);
      }
      return next;
    });
  };

  return { isDark, toggleTheme };
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
  const { isDark, toggleTheme } = useThemeToggle();
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
    const onScroll = () => setScrolled(window.scrollY > 12);
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
      description: 'Buscador y análisis de opiniones de Steam',
      icon: <Search className="size-4 shrink-0" />,
    },
    {
      key: 'recommend',
      label: 'Recomendar por IA',
      path: '/recomendar',
      isBeta: true,
      description: 'Búsqueda semántica con Groq & RAG',
      icon: <Sparkles className="size-4 shrink-0" />,
    },
    {
      key: 'how-it-works',
      label: '¿Cómo funciona?',
      path: '/como-funciona',
      description: 'Pipeline NLP y arquitectura de ML',
      icon: <Cpu className="size-4 shrink-0" />,
    },
    {
      key: 'changelog',
      label: 'Changelog',
      path: '/changelog',
      description: 'Historial de versiones y mejoras continuas',
      icon: <History className="size-4 shrink-0" />,
    },
    {
      key: 'status',
      label: 'Estado',
      path: '/estado',
      description: 'Monitoreo de latencia y salud en vivo',
      icon: <Activity className="size-4 shrink-0" />,
    },
  ];

  return (
    <header
      ref={menuRef}
      className={`w-full sticky top-0 z-50 transition-all duration-300 ${
        scrolled || mobileMenuOpen
          ? 'bg-surface/85 backdrop-blur-xl border-b border-line shadow-md py-2.5'
          : 'bg-bg/60 backdrop-blur-md border-b border-line/40 py-3.5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* LOGO MARCA */}
        <button
          onClick={() => {
            navigate('/');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-2.5 cursor-pointer bg-transparent border-0 p-1 text-left outline-none group shrink-0 rounded-xl"
          aria-label="Ir al inicio de Game Recommended AI"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent to-accent-2 flex items-center justify-center text-white shadow-md shadow-accent/25 group-hover:scale-105 transition-transform">
            <Gamepad2 className="size-4" />
          </div>
          <span className="text-sm sm:text-base font-display font-extrabold tracking-tight text-ink group-hover:text-accent transition-colors flex items-center gap-1">
            <span>Game Recommended</span>
            <span className="text-gradient font-black">AI</span>
          </span>
        </button>

        {/* NAVEGACIÓN DESKTOP SEGMENTADA */}
        <nav
          className="hidden md:flex items-center gap-1 bg-surface-2/90 border border-line rounded-xl p-1 shrink-0 mx-auto shadow-sm backdrop-blur-sm"
          aria-label="Navegación principal"
        >
          {navItems.map(({ key, label, path, isBeta, icon }) => {
            const isActive = activePage === key;
            const isChangelogUnread = key === 'changelog' && hasUnreadChangelog;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleNavClick(path, key)}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer outline-none flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-accent text-white shadow-md shadow-accent/25'
                    : 'text-ink-soft hover:text-ink hover:bg-surface'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-ink-faint'}>{icon}</span>
                <span>{label}</span>
                {isBeta && (
                  <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-white/20 text-white' : 'bg-positive/20 text-positive border border-positive/30'
                  }`}>
                    BETA
                  </span>
                )}
                {isChangelogUnread && (
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-accent/20 text-accent border border-accent/40 animate-pulse">
                    NUEVO
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* ACCIONES DESKTOP DERECHA */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Toggle de tema */}
          <button
            type="button"
            onClick={toggleTheme}
            className="hidden sm:inline-flex items-center justify-center p-2 min-w-[38px] min-h-[38px] rounded-xl border border-line bg-surface hover:bg-surface-2 text-ink-soft hover:text-ink transition-all cursor-pointer shrink-0 shadow-sm"
            aria-label="Cambiar tema claro/oscuro"
            title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {isDark ? (
              <Sun className="size-4 text-warn transition-transform rotate-0 hover:rotate-45" />
            ) : (
              <Moon className="size-4 text-accent transition-transform rotate-0 hover:-rotate-12" />
            )}
          </button>

          {/* Link GitHub */}
          <a
            href="https://github.com/aletgdev"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 border border-line bg-surface hover:bg-surface-2 px-3 py-1.5 min-h-[38px] rounded-xl text-xs font-semibold text-ink-soft hover:text-ink transition-all shrink-0 shadow-sm"
            aria-label="Ver perfil y repositorios en GitHub"
          >
            <GithubIcon className="size-4 text-ink-soft shrink-0" />
            <span className="hidden lg:inline">GitHub</span>
          </a>

          {/* Botón Menú Móvil */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden flex items-center justify-center p-2.5 min-h-[44px] min-w-[44px] rounded-xl border border-line bg-surface text-ink-soft cursor-pointer shadow-sm active:scale-95"
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="size-5 text-accent" />
            ) : (
              <Menu className="size-5 text-ink-soft" />
            )}
          </button>
        </div>
      </div>

      {/* MENÚ MÓVIL DESPLEGABLE CON ANIMACIÓN FLUIDA */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full border-t border-line bg-surface px-4 py-4 space-y-3 shadow-2xl animate-fade-up">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex-1 flex items-center justify-center gap-2 p-2.5 min-h-[44px] rounded-xl border border-line bg-surface-2 text-ink-soft hover:text-ink font-bold text-xs cursor-pointer"
              aria-label="Cambiar tema"
            >
              {isDark ? <Sun className="size-4 text-warn" /> : <Moon className="size-4 text-accent" />}
              <span>{isDark ? 'Modo Claro' : 'Modo Oscuro'}</span>
            </button>

            <a
              href="https://github.com/aletgdev"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 p-2.5 min-h-[44px] px-4 rounded-xl border border-line bg-surface-2 text-ink-soft hover:text-ink font-bold text-xs"
            >
              <GithubIcon className="size-4" />
              <span>GitHub</span>
            </a>
          </div>

          <div className="space-y-1.5 pt-1">
            {navItems.map(({ key, label, path, isBeta, description, icon }) => {
              const isActive = activePage === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleNavClick(path, key)}
                  className={`w-full flex items-center justify-between p-3 min-h-[48px] rounded-xl text-left transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-accent text-white shadow-md shadow-accent/20'
                      : 'bg-surface-2 hover:bg-surface-3 text-ink'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-white' : 'text-accent'}>{icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold leading-none">{label}</span>
                        {isBeta && (
                          <span className="text-[9px] font-bold uppercase px-1 rounded bg-positive/20 text-positive border border-positive/30">
                            BETA
                          </span>
                        )}
                      </div>
                      <p className={`text-[11px] mt-0.5 font-normal ${isActive ? 'text-white/80' : 'text-ink-faint'}`}>
                        {description}
                      </p>
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