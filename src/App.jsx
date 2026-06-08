import { useState, useEffect, useRef } from 'react';
import './App.css';
import Header from './components/Header';
import GameSearch from './components/Input';
import RecommendationCard from './components/RecommendationCard';
import HowItWorks from './components/HowItWorks';
import Changelog from './components/Changelog';
import { analyzeGame } from './services/steamService';

function App() {
  const [selectedGameInfo, setSelectedGameInfo] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [activePage, setActivePage] = useState('home');

  const analyzeAbortRef = useRef(null);
  const resultsRef = useRef(null);

  const loadingTexts = [
    "Conectando con los servidores de Steam...",
    "Buscando reseñas escritas en español...",
    "Descargando las opiniones más recientes...",
    "Limpiando el texto de ruido (hashtags, emojis)...",
    "Enviando reseñas al modelo Naive Bayes...",
    "Clasificando cada opinión como Positiva o Negativa...",
    "Comparando con la valoración oficial de Steam...",
    "Generando informe interactivo...",
  ];

  const handleGameSelect = async (game) => {
    if (analyzeAbortRef.current) analyzeAbortRef.current.abort();
    const controller = new AbortController();
    analyzeAbortRef.current = controller;

    setError(null);
    setAnalysisResult(null);
    setSelectedGameInfo(game);
    setLoadingStep(0);
    setIsLoading(true);

    const params = new URLSearchParams();
    params.set('game', game.id);
    if (game.name) params.set('name', encodeURIComponent(game.name));
    window.history.pushState({}, '', `?${params.toString()}`);

    try {
      const data = await analyzeGame(game.id, 30, controller.signal);
      setAnalysisResult(data);
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('Error al analizar el juego:', err);
      setError(
        err.message ||
        'No se pudo conectar con el servidor. Comprueba si el backend está activo o si el AppID es correcto.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get('game');
    const gameName = params.get('name');
    if (gameId) {
      handleGameSelect({ id: gameId, name: gameName ? decodeURIComponent(gameName) : `Juego (ID: ${gameId})` });
    }
  }, []);

  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingTexts.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLoading, loadingTexts.length]);

  useEffect(() => {
    if (!isLoading && analysisResult && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isLoading, analysisResult]);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans antialiased overflow-x-hidden">
      <Header activePage={activePage} setActivePage={setActivePage} />

      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 flex-1 flex flex-col">

        {/* ── CÓMO FUNCIONA ── */}
        {activePage === 'how-it-works' && (
          <div className="py-10 sm:py-14">
            <HowItWorks />
          </div>
        )}

        {/* ── CHANGELOG ── */}
        {activePage === 'changelog' && <Changelog />}

        {/* ── INICIO ── */}
        {activePage === 'home' && (
          <>
            {/* HERO */}
            <div className="relative pt-12 sm:pt-20 pb-8 sm:pb-12 text-center">
              {/* Blobs de fondo */}
              <div className="blob absolute top-[-40px] left-[10%] w-72 h-72 opacity-20 pointer-events-none select-none"
                style={{ background: 'radial-gradient(circle, #2563eb 0%, transparent 70%)' }} />
              <div className="blob absolute top-[-20px] right-[5%] w-64 h-64 opacity-15 pointer-events-none select-none"
                style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)', animationDelay: '3s' }} />
              <div className="blob absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-40 opacity-10 pointer-events-none select-none"
                style={{ background: 'radial-gradient(circle, #0ea5e9 0%, transparent 70%)', animationDelay: '5s' }} />

              {/* Badge de estado */}
              <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[11px] font-semibold px-3 py-1.5 rounded-full mb-5 animate-fade-up">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" style={{ boxShadow: '0 0 6px 1px rgba(52,211,153,0.6)' }} />
                Modelo Naive Bayes · Activo
              </div>

              {/* Título */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4 animate-fade-up" style={{ animationDelay: '60ms' }}>
                <span className="gradient-text">Análisis de reseñas</span>
                <br />
                <span className="text-slate-100">con inteligencia artificial</span>
              </h1>

              {/* Subtítulo */}
              <p className="text-base md:text-lg text-slate-400 max-w-lg mx-auto leading-relaxed mb-6 animate-fade-up" style={{ animationDelay: '120ms' }}>
                Nuestro modelo de Machine Learning analiza las opiniones en{' '}
                <span className="text-slate-200 font-medium">español</span> y te dice si el juego de verdad merece la pena.
              </p>

              {/* Chips de tecnología */}
              <div className="flex items-center justify-center flex-wrap gap-2 mb-8 animate-fade-up" style={{ animationDelay: '180ms' }}>
                {['Naive Bayes', 'FastAPI', 'Steam API', 'NLP · Python'].map((tech) => (
                  <span key={tech} className="text-[11px] font-semibold text-slate-500 border border-[#1e293b] bg-white/[0.02] px-3 py-1 rounded-full">
                    {tech}
                  </span>
                ))}
              </div>

              {/* Buscador */}
              <div className="w-full animate-fade-up relative z-[100]" style={{ animationDelay: '240ms' }}>
                <GameSearch onGameSelect={handleGameSelect} isLoading={isLoading} />
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="w-full bg-rose-500/8 border border-rose-500/25 p-4 sm:p-5 rounded-2xl text-rose-400 text-sm flex gap-3 items-start animate-fade-up">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h4 className="font-bold text-rose-300 mb-0.5">Error al analizar</h4>
                  <p className="opacity-85 leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            {/* CARGANDO */}
            {isLoading && (
              <div className="w-full py-12 flex flex-col items-center justify-center space-y-8 animate-fade-in">
                <div className="relative flex items-center justify-center">
                  <div className="w-14 h-14 border-[3px] border-blue-600/20 border-t-blue-500 rounded-full animate-spin" />
                  <div className="absolute w-20 h-20 border border-blue-600/10 rounded-full animate-ping opacity-30" />
                  <div className="absolute w-8 h-8 bg-blue-600/20 rounded-full blur-md" />
                </div>

                <div className="text-center space-y-2 max-w-sm">
                  <p className="text-base font-bold text-slate-100">{loadingTexts[loadingStep]}</p>
                  <p className="text-xs text-slate-600">Esto puede tardar unos segundos con los servidores de Steam...</p>
                </div>

                <div className="w-full max-w-xs bg-slate-900 border border-[#1e293b] rounded-full h-1 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-[2000ms] ease-linear"
                    style={{ width: `${((loadingStep + 1) / loadingTexts.length) * 100}%` }}
                  />
                </div>

                <div className="w-full max-w-2xl space-y-3">
                  <div className="bg-[#0a1628]/60 border border-[#1e293b]/60 p-5 rounded-2xl space-y-4">
                    <div className="flex gap-4">
                      <div className="w-24 h-14 rounded-xl animate-shimmer shrink-0" />
                      <div className="flex-1 space-y-2.5 pt-1">
                        <div className="h-4 w-3/4 rounded-full animate-shimmer" />
                        <div className="h-3 w-1/2 rounded-full animate-shimmer" />
                      </div>
                    </div>
                    <div className="h-2.5 w-full rounded-full animate-shimmer mt-2" />
                    <div className="h-2.5 w-5/6 rounded-full animate-shimmer" />
                    <div className="h-2.5 w-4/6 rounded-full animate-shimmer" />
                  </div>
                </div>
              </div>
            )}

            {/* RESULTADO — con ref para auto-scroll */}
            {!isLoading && analysisResult && (
              <div ref={resultsRef} style={{ scrollMarginTop: '80px' }}>
                <RecommendationCard result={analysisResult} gameInfo={selectedGameInfo} />
              </div>
            )}

            {/* ESTADO VACÍO INICIAL */}
            {!isLoading && !analysisResult && !error && (
              <div className="text-center py-12 sm:py-16 px-6 border border-dashed border-[#1e293b]/70 rounded-3xl bg-white/[0.01] max-w-xl mx-auto w-full animate-fade-up" style={{ animationDelay: '300ms' }}>
                <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-slate-300 mb-2">Listo para analizar</h3>
                <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                  Busca por nombre, pega el ID de Steam o la URL completa de la tienda
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-5">
                  {[
                    { name: 'Elden Ring', id: '1245620' },
                    { name: 'Stardew Valley', id: '413150' },
                    { name: 'Cyberpunk 2077', id: '1091500' },
                  ].map((game) => (
                    <button
                      key={game.id}
                      onClick={() => handleGameSelect(game)}
                      className="text-[11px] font-medium text-slate-500 border border-[#1e293b] hover:border-blue-500/40 hover:text-blue-400 bg-white/[0.02] px-3 py-1.5 rounded-full transition-all cursor-pointer"
                    >
                      {game.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="w-full py-8 text-center border-t border-[#1e293b]/60 mt-auto">
        <p className="text-xs text-slate-600">
          Game Recommended AI © {new Date().getFullYear()} ·{' '}
        </p>
      </footer>
    </div>
  );
}

export default App;
