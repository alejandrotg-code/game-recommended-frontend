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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const runCheck = async () => {
      if (document.hidden) return;
      const result = await checkBackendHealth();
      setBackendStatus(result.status);
    };
    runCheck();
    const interval = setInterval(runCheck, 60_000);
    return () => clearInterval(interval);
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
    checking: { color: 'bg-slate-500', label: 'Comprobando' },
    online: { color: 'bg-emerald-400', label: 'Servicio en línea' },
    offline: { color: 'bg-rose-500', label: 'Servicio fuera de línea' },
  };
  const st = statusConfig[backendStatus];

  return (
    <header
      ref={menuRef}
      className={`w-full sticky top-0 z-50 transition-all duration-200 ${
        scrolled || mobileMenuOpen
          ? 'bg-[#080b11]/90 backdrop-blur-md border-b border-[#1b2434] shadow-md'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">

        {/* LOGO */}
        <button
          onClick={() => {
            navigate('/');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-2.5 cursor-pointer bg-transparent border-0 p-0 text-left outline-none group shrink-0"
          aria-label="Ir al inicio"
        >
          <div className="relative p-2 rounded-lg border border-[#1b2434] bg-[#0f1520] group-hover:border-blue-500/40 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.75 3.5m5.84 10.87a6 6 0 01-7.37 5.83m0 0a6 6 0 01-7.38-5.84v-4.8m7.38 10.64a14.98 14.98 0 00-12.12-6.16" />
            </svg>
            <span
              title={st.label}
              className={`absolute -top-0.5 -right-0.5 w-2 h-2 ${st.color} rounded-full border border-[#080b11]`}
            />
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Steam Review AI</span>
            <span className="text-sm sm:text-base font-extrabold tracking-tight text-slate-100 group-hover:text-white transition-colors">
              Game Recommended
            </span>
          </div>
        </button>

        {/* NAVEGACIÓN DESKTOP */}
        <nav className="hidden md:flex items-center gap-1 bg-[#0f1520] border border-[#1b2434] rounded-lg p-1" aria-label="Navegación principal">
          {navItems.map(({ key, label, path, isBeta }) => (
            <button
              key={key}
              onClick={() => navigate(path)}
              className={`relative px-3.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer outline-none flex items-center gap-1.5 btn-tactical ${
                activePage === key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-[#151d2c]'
              }`}
            >
              <span>{label}</span>
              {isBeta && (
                <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  NUEVO
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* ACCIONES DESKTOP & BOTÓN MÓVIL */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            title={st.label}
            className="hidden md:flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 border border-[#1b2434] bg-[#0f1520] px-2.5 py-1 rounded-md"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${st.color}`} />
            {st.label}
          </div>

          <a
            href="https://portfolio.alejandrotg.es"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-slate-400 hover:text-slate-100 transition-colors hidden md:inline-flex items-center gap-1"
          >
            Portfolio
          </a>

          <a
            href="https://github.com/alejandrotg-code"
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 border border-[#1b2434] bg-[#0f1520] hover:bg-[#151d2c] px-3 py-1 rounded-md text-xs font-semibold text-slate-200 transition-all"
          >
            <svg className="size-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            <span>GitHub</span>
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden flex items-center justify-center p-2 rounded-lg border border-[#1b2434] bg-[#0f1520] text-slate-200 cursor-pointer"
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>

      </div>

      {/* MENÚ MÓVIL */}
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
                            NUEVO
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
