export default function Header({ activePage, setActivePage }) {
  return (
    // 1. Contenedor principal: ocupa todo el ancho, fondo semitransparente con desenfoque de cristal (backdrop-blur)
    <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-brand-border backdrop-blur-md sticky top-0 z-50">

      {/* 2. LOGO (Izquierda) - Hace clic para volver al inicio */}
      <button
        onClick={() => setActivePage('home')}
        className="flex items-center gap-2 cursor-pointer bg-transparent border-0 p-0 text-left outline-none group"
      >
        {/* Icono de IA */}
        <div className="p-2 bg-brand-accent/10 text-blue-400 rounded-xl border border-brand-accent/20 group-hover:border-blue-500/40 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-50">
          <span className="hidden sm:inline">Game Recommended </span>
          <span className="inline sm:hidden">GR </span>
          <span className="text-blue-400">AI</span>
        </span>
      </button>

      {/* 3. MENÚ DE ENLACES (Centro) - Adaptativo en móviles y pantallas grandes */}
      <nav className="flex items-center gap-3 sm:gap-8 text-xs sm:text-sm font-medium text-slate-400">
        <button
          onClick={() => setActivePage('home')}
          className={`hover:text-slate-50 transition-colors cursor-pointer bg-transparent border-0 p-0 text-left outline-none font-medium ${activePage === 'home' ? 'text-blue-400 font-semibold' : ''}`}
        >
          <span className="hidden sm:inline">Analizar Juego</span>
          <span className="inline sm:hidden">Analizar</span>
        </button>
        <button
          onClick={() => setActivePage('how-it-works')}
          className={`hover:text-slate-50 transition-colors cursor-pointer bg-transparent border-0 p-0 text-left outline-none font-medium ${activePage === 'how-it-works' ? 'text-blue-400 font-semibold' : ''}`}
        >
          <span className="hidden sm:inline">¿Cómo funciona?</span>
          <span className="inline sm:hidden">Cómo funciona</span>
        </button>
      </nav>

      {/* 4. BOTÓN GITHUB Y PORTFOLIO */}
      <div className="flex items-center gap-3 sm:gap-6">
        <a
          href="https://portfolio.alejandrotg.es"
          target="_blank"
          rel="noreferrer"
          className="text-xs sm:text-sm font-medium text-slate-400 hover:text-slate-50 transition-colors hidden sm:inline"
        >
          Portfolio
        </a>
        <a
          href="https://github.com/alejandrotg-code"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 border border-brand-border bg-slate-900/50 px-2.5 py-2 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-all shadow-sm"
        >
          {/* Icono de GitHub simple en SVG */}
          <svg className="size-4 fill-current animate-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          <span className="hidden sm:inline">GitHub</span>
        </a>
      </div>

    </header>
  );
}