import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { checkBackendHealth } from '../services/healthService';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');
  const menuRef = useRef(null);

  // Detectar scroll para el glassmorphism
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Health check al montar y cada 60 segundos
  useEffect(() => {
    const runCheck = async () => {
      const result = await checkBackendHealth();
      setBackendStatus(result.status);
    };
    runCheck();
    const interval = setInterval(runCheck, 60_000);
    return () => clearInterval(interval);
  }, []);

  // Cerrar menú móvil con tecla Escape o clic fuera
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
      // Evitar scroll en body en móvil cuando el menú está abierto
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

  // Determinar la página activa según la ruta
  let activePage = 'home';
  if (location.pathname === '/como-funciona') {
    activePage = 'how-it-works';
  } else if (location.pathname === '/changelog') {
    activePage = 'changelog';
  } else if (location.pathname === '/recomendar') {
    activePage = 'recommend';
  }

  const navItems = [
    {
      key: 'home',
      label: 'Analizar Juego',
      shortLabel: 'Analizar',
      path: '/',
      description: 'Buscador y análisis de opiniones',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      key: 'recommend',
      label: 'Recomendar por IA',
      shortLabel: 'Recomendador',
      path: '/recomendar',
      isBeta: true,
      description: 'Encuentra títulos mediante RAG & NLP',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      )
    },
    {
      key: 'how-it-works',
      label: '¿Cómo funciona?',
      shortLabel: 'Cómo Funciona',
      path: '/como-funciona',
      description: 'Pipeline técnico y modelo ML',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      key: 'changelog',
      label: 'Changelog',
      shortLabel: 'Changelog',
      path: '/changelog',
      description: 'Historial de versiones y mejoras',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  ];

  const statusConfig = {
    checking: { color: 'bg-slate-500', glow: '', label: 'Comprobando...' },
    online: { color: 'bg-emerald-400', glow: '0 0 6px 1px rgba(52,211,153,0.7)', label: 'Servicio disponible' },
    offline: { color: 'bg-rose-500', glow: '0 0 6px 1px rgba(244,63,94,0.7)', label: 'Servicio no disponible' },
  };
  const st = statusConfig[backendStatus];

  return (
    <header
      ref={menuRef}
      className={`w-full sticky top-0 z-50 transition-all duration-300 ${
        scrolled || mobileMenuOpen
          ? 'bg-[#030712]/95 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.8)]'
          : 'bg-transparent border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">

        {/* ── LOGO ── */}
        <button
          onClick={() => {
            navigate('/');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-2.5 cursor-pointer bg-transparent border-0 p-0 text-left outline-none group shrink-0"
          aria-label="Ir al inicio"
        >
          <div className="relative p-2 rounded-xl border border-blue-500/20 bg-blue-600/10 group-hover:border-blue-500/40 group-hover:bg-blue-600/15 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="size-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            {/* Punto de estado del backend */}
            <span
              title={st.label}
              className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 ${st.color} rounded-full border-2 border-[#030712] transition-all duration-500`}
              style={{ boxShadow: st.glow }}
            />
          </div>

          <div className="flex flex-col leading-none">
            <span className="text-[11px] text-slate-400 font-medium tracking-wider uppercase">Game Recommended</span>
            <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-50 group-hover:text-white transition-colors">
              <span>Análisis con </span>
              <span className="text-blue-400">IA</span>
            </span>
          </div>
        </button>

        {/* ── NAVEGACIÓN DESKTOP (md+) ── */}
        <nav className="hidden md:flex items-center gap-1 bg-white/[0.04] border border-white/[0.08] backdrop-blur-md rounded-full p-1 shadow-inner" aria-label="Navegación principal">
          {navItems.map(({ key, label, path, isBeta }) => (
            <button
              key={key}
              onClick={() => navigate(path)}
              className={`relative px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer outline-none flex items-center gap-1.5 ${
                activePage === key
                  ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)] scale-102'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`}
            >
              <span>{label}</span>
              {isBeta && (
                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 text-slate-950 tracking-wider shadow-[0_0_10px_rgba(52,211,153,0.5)] animate-pulse">
                  NOVEDAD
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* ── ACCIONES DESKTOP & BOTÓN MÓVIL ── */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Badge de estado — visible en desktop */}
          <div
            title={st.label}
            className="hidden md:flex items-center gap-1.5 text-[10px] font-medium text-slate-400 border border-[#1e293b] bg-white/[0.02] px-2.5 py-1 rounded-full"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${st.color} transition-all duration-500`}
              style={{ boxShadow: st.glow }}
            />
            {backendStatus === 'checking' ? 'Comprobando...' : backendStatus === 'online' ? 'Servicio disponible' : 'Servicio no disponible'}
          </div>

          {/* Portfolio */}
          <a
            href="https://portfolio.alejandrotg.es"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium text-slate-400 hover:text-slate-100 transition-colors hidden md:inline-flex items-center gap-1.5 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
            </svg>
            Portfolio
          </a>

          {/* GitHub Desktop */}
          <a
            href="https://github.com/alejandrotg-code"
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 border border-white/10 bg-white/[0.05] hover:bg-white/[0.09] hover:border-white/20 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white transition-all duration-200 shadow-sm"
          >
            <svg className="size-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            <span>GitHub</span>
          </a>

          {/* Botón menú hamburguesa para móviles (< md) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden flex items-center justify-center p-2.5 rounded-xl border border-white/10 bg-white/[0.05] hover:bg-white/10 text-slate-200 focus:outline-none transition-all duration-200 active:scale-95 cursor-pointer"
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="size-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="size-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>

      </div>

      {/* ── MENÚ MÓVIL DESPLEGABLE (< md) ── */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full border-t border-white/10 bg-[#030712]/98 backdrop-blur-2xl px-4 py-4 space-y-3 animate-fade-up shadow-2xl max-h-[85vh] overflow-y-auto">
          {/* Items de Navegación */}
          <div className="space-y-1.5">
            {navItems.map(({ key, label, path, isBeta, description, icon }) => {
              const isActive = activePage === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    navigate(path);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600/20 via-blue-500/15 to-indigo-600/20 border border-blue-500/30 text-white shadow-lg'
                      : 'bg-white/[0.02] border border-white/5 text-slate-300 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl border ${isActive ? 'bg-blue-500/20 border-blue-400/40 text-blue-300' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                      {icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold leading-none">{label}</span>
                        {isBeta && (
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 text-slate-950 tracking-wider animate-pulse">
                            NOVEDAD
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 font-normal leading-tight">{description}</p>
                    </div>
                  </div>

                  <svg xmlns="http://www.w3.org/2000/svg" className={`size-4 transition-transform ${isActive ? 'text-blue-400 translate-x-0.5' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              );
            })}
          </div>

          {/* Divisor */}
          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            {/* Estado del Backend en móvil */}
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-white/[0.02] text-xs">
              <span className="text-slate-400 font-medium">Estado del servicio</span>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300">
                <span
                  className={`w-2 h-2 rounded-full ${st.color}`}
                  style={{ boxShadow: st.glow }}
                />
                {st.label}
              </div>
            </div>

            {/* Enlaces externos en móvil */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href="https://portfolio.alejandrotg.es"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                </svg>
                Portfolio
              </a>
              <a
                href="https://github.com/alejandrotg-code"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all"
              >
                <svg className="size-4 fill-current text-purple-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                GitHub
              </a>
            </div>
          </div>

        </div>
      )}

    </header>
  );
}
