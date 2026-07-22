import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { checkBackendHealth } from '../services/healthService';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, scrolledSet] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');

  // Detectar scroll para el glassmorphism
  useEffect(() => {
    const onScroll = () => scrolledSet(window.scrollY > 10);
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
    { key: 'home', label: 'Analizar Juego', shortLabel: 'Analizar', path: '/' },
    { key: 'recommend', label: 'Recomendar por IA', shortLabel: 'Recomendador', path: '/recomendar' },
    { key: 'how-it-works', label: '¿Cómo funciona?', shortLabel: 'Cómo Funciona', path: '/como-funciona' },
    { key: 'changelog', label: 'Changelog', shortLabel: 'Changelog', path: '/changelog' },
  ];


  const statusConfig = {
    checking: { color: 'bg-slate-500', glow: '', label: 'Comprobando...' },
    online: { color: 'bg-emerald-400', glow: '0 0 6px 1px rgba(52,211,153,0.7)', label: 'Servicio disponible' },
    offline: { color: 'bg-rose-500', glow: '0 0 6px 1px rgba(244,63,94,0.7)', label: 'Servicio no disponible' },
  };
  const st = statusConfig[backendStatus];

  return (
    <header
      className={`w-full sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-[#030712]/90 backdrop-blur-xl border-b border-white/5 shadow-[0_1px_40px_-10px_rgba(0,0,0,0.8)]'
        : 'bg-transparent border-b border-white/5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">

        {/* ── LOGO ── */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 cursor-pointer bg-transparent border-0 p-0 text-left outline-none group"
          aria-label="Ir al inicio"
        >
          <div className="relative p-2 rounded-xl border border-blue-500/20 bg-blue-600/10 group-hover:border-blue-500/40 group-hover:bg-blue-600/15 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="size-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            {/* Punto de estado del backend */}
            <span
              title={st.label}
              className={`absolute -top-0.5 -right-0.5 w-2 h-2 ${st.color} rounded-full border border-[#030712] transition-all duration-500`}
              style={{ boxShadow: st.glow }}
            />
          </div>

          <div className="flex flex-col leading-none">
            <span className="text-[11px] text-slate-500 font-medium hidden sm:block tracking-widest uppercase">Game Recommended</span>
            <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-50 group-hover:text-white transition-colors">
              <span className="hidden sm:inline">Análisis con </span>
              <span className="text-blue-400">IA</span>
            </span>
          </div>
        </button>

        {/* ── NAVEGACIÓN ── */}
        <nav className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.08] backdrop-blur-md rounded-full p-1 shadow-inner" aria-label="Navegación principal">
          {navItems.map(({ key, label, shortLabel, path }) => (
            <button
              key={key}
              onClick={() => navigate(path)}
              className={`relative px-3.5 sm:px-4.5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer outline-none flex items-center gap-1.5 ${activePage === key
                ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)] scale-102'
                : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                }`}
            >
              <span className="hidden sm:inline">{label}</span>
              <span className="inline sm:hidden">{shortLabel}</span>
              {key === 'recommend' && (
                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 tracking-wider shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse">
                  BETA
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* ── ACCIONES ── */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Badge de estado — visible en desktop */}
          <div
            title={st.label}
            className="hidden md:flex items-center gap-1.5 text-[10px] font-medium text-slate-500 border border-[#1e293b] bg-white/[0.02] px-2.5 py-1 rounded-full"
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

          {/* GitHub */}
          <a
            href="https://github.com/alejandrotg-code"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 border border-white/10 bg-white/[0.05] hover:bg-white/[0.09] hover:border-white/20 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white transition-all duration-200 shadow-sm"
          >
            <svg className="size-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>

      </div>
    </header>
  );
}