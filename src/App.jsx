import { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useSearchParams } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import GameSearch from './components/Input';
import RecommendationCard from './components/RecommendationCard';
import HowItWorks from './components/HowItWorks';
import Changelog from './components/Changelog';
import Recomendar from './components/Recomendar';
import ErrorBoundary from './components/ErrorBoundary';
import { analyzeGame } from './services/steamService';


function AppContent() {
  const [selectedGameInfo, setSelectedGameInfo] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();

  // El límite se deriva directamente de la URL (searchParams) para evitar estados redundantes
  const gameLimitParam = parseInt(searchParams.get('limit') || '30', 10);
  const limit = [10, 20, 30].includes(gameLimitParam) ? gameLimitParam : 30;

  const analyzeAbortRef = useRef(null);
  const resultsRef = useRef(null);
  const lastAnalyzedLimitRef = useRef(30);

  const loadingTexts = [
    "Conectando con los servidores de Steam...",
    "Buscando opiniones escritas en español...",
    "Descargando las opiniones más recientes...",
    "Limpiando el texto de ruido y caracteres nulos...",
    "Procesando con el clasificador de Inteligencia IA...",
    "Clasificando cada opinión como Positiva o Negativa...",
    "Comparando con la valoración de la muestra...",
    "Generando el informe interactivo...",
  ];

  const handleGameSelect = useCallback(async (game, customLimit = limit) => {
    if (analyzeAbortRef.current) analyzeAbortRef.current.abort();
    const controller = new AbortController();
    analyzeAbortRef.current = controller;

    lastAnalyzedLimitRef.current = customLimit;

    setError(null);
    setAnalysisResult(null);
    setSelectedGameInfo(game);
    setLoadingStep(0);
    setIsLoading(true);

    // Actualizar parámetros de búsqueda en la URL
    setSearchParams({
      game: game.id,
      name: game.name || '',
      limit: customLimit.toString()
    });

    try {
      const data = await analyzeGame(game.id, customLimit, controller.signal);
      setAnalysisResult(data);
      lastAnalyzedLimitRef.current = customLimit;
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
  }, [limit, setSearchParams]);

  // Efecto para escuchar cambios en la URL (parámetros de búsqueda)
  useEffect(() => {
    const gameId = searchParams.get('game');
    const gameName = searchParams.get('name');
    const gameLimit = parseInt(searchParams.get('limit') || '30', 10);
    const activeLimit = [10, 20, 30].includes(gameLimit) ? gameLimit : 30;

    if (gameId) {
      const isDifferentGame = !selectedGameInfo || String(selectedGameInfo.id) !== String(gameId);
      const isDifferentLimit = lastAnalyzedLimitRef.current !== activeLimit;

      if (isDifferentGame || isDifferentLimit) {
        handleGameSelect({
          id: gameId,
          name: gameName || `Juego (ID: ${gameId})`
        }, activeLimit);
      }
    } else {
      if (selectedGameInfo) {
        queueMicrotask(() => {
          setSelectedGameInfo(null);
          setAnalysisResult(null);
          setError(null);
        });
      }
    }
  }, [searchParams, selectedGameInfo, handleGameSelect]);

  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingTexts.length);
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [isLoading, loadingTexts.length]);

  useEffect(() => {
    if (!isLoading && analysisResult && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isLoading, analysisResult]);

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col font-sans antialiased overflow-x-hidden">
      <Header />

      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 flex-1 flex flex-col">
        <Routes>
          {/* RUTA INICIO */}
          <Route path="/" element={
            <>
              {/* HERO */}
              <div className="relative pt-10 sm:pt-16 pb-6 text-center">
                {/* Badge de estado táctico */}
                <div className="inline-flex items-center gap-2 bg-[#0f1520] border border-[#1b2434] text-slate-300 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-5 animate-fade-up shadow-sm">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="tracking-wide">Motor NLP & Análisis de Sentimiento para Steam</span>
                </div>

                {/* Título Principal */}
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 animate-fade-up leading-[1.15] text-slate-100" style={{ animationDelay: '50ms' }}>
                  Decodifica la Opinión Real de la <span className="text-blue-500">Comunidad de Steam</span>
                </h1>

                {/* Subtítulo */}
                <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8 animate-fade-up font-normal" style={{ animationDelay: '100ms' }}>
                  Analizamos quirúrgicamente las opiniones más recientes en <strong className="text-slate-200">español</strong> con modelos de Inteligencia IA para determinar si un juego realmente merece tu tiempo.
                </p>

                {/* Buscador de Juego */}
                <div className="w-full max-w-2xl mx-auto animate-fade-up relative z-[100]" style={{ animationDelay: '150ms' }}>
                  <GameSearch onGameSelect={(game) => handleGameSelect(game, limit)} isLoading={isLoading} />
                </div>

                {/* Selector de cantidad de reseñas */}
                <div className="flex items-center justify-center gap-3 mt-4 text-xs text-slate-400 animate-fade-up relative z-[90]" style={{ animationDelay: '200ms' }}>
                  <span className="font-medium text-slate-500">Muestra a analizar:</span>
                  <div className="flex bg-[#0f1520] border border-[#1b2434] p-1 rounded-lg">
                    {[10, 20, 30].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => {
                          setSearchParams({
                            game: selectedGameInfo?.id || '',
                            name: selectedGameInfo?.name || '',
                            limit: num.toString()
                          });
                        }}
                        className={`px-3 py-0.5 rounded text-xs font-bold transition-all cursor-pointer ${
                          limit === num
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {num} reseñas
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ERROR */}
              {error && (
                <div className="w-full bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl text-rose-400 text-sm flex gap-3 items-start animate-fade-up my-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <h4 className="font-bold text-rose-300 mb-0.5">Error en el análisis</h4>
                    <p className="opacity-90 leading-relaxed text-xs sm:text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* CARGANDO */}
              {isLoading && (
                <div className="w-full py-12 flex flex-col items-center justify-center space-y-6 animate-fade-in">
                  <div className="relative flex items-center justify-center">
                    <div className="w-12 h-12 border-2 border-blue-600/30 border-t-blue-500 rounded-full animate-spin" />
                  </div>

                  <div className="text-center space-y-1.5 max-w-sm">
                    <p className="text-sm font-bold text-slate-200">{loadingTexts[loadingStep]}</p>
                    <p className="text-xs text-slate-500">Procesando datos en tiempo real desde Steam...</p>
                  </div>

                  <div className="w-full max-w-xs bg-[#0f1520] border border-[#1b2434] rounded-full h-1 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-[1800ms] ease-linear"
                      style={{ width: `${((loadingStep + 1) / loadingTexts.length) * 100}%` }}
                    />
                  </div>

                  <div className="w-full max-w-2xl space-y-3 pt-2">
                    <div className="tactical-card p-5 space-y-3">
                      <div className="flex gap-4 items-center">
                        <div className="w-20 h-12 rounded-lg animate-shimmer shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-2/3 rounded animate-shimmer" />
                          <div className="h-3 w-1/3 rounded animate-shimmer" />
                        </div>
                      </div>
                      <div className="h-2 w-full rounded animate-shimmer mt-2" />
                      <div className="h-2 w-5/6 rounded animate-shimmer" />
                    </div>
                  </div>
                </div>
              )}

              {/* RESULTADO */}
              {!isLoading && analysisResult && (
                <div ref={resultsRef} style={{ scrollMarginTop: '80px' }}>
                  <RecommendationCard result={analysisResult} gameInfo={selectedGameInfo} />
                </div>
              )}

              {/* ESTADO VACÍO INICIAL */}
              {!isLoading && !analysisResult && !error && (
                <div className="text-center py-10 px-6 border border-dashed border-[#1b2434] rounded-2xl bg-[#0f1520]/40 max-w-lg mx-auto w-full animate-fade-up my-4" style={{ animationDelay: '250ms' }}>
                  <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Empieza a analizar</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed mb-4">
                    Escribe el título de cualquier videojuego, introduce su AppID o pega la URL de la tienda
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {[
                      { name: 'Elden Ring', id: '1245620' },
                      { name: 'Stardew Valley', id: '413150' },
                      { name: 'Cyberpunk 2077', id: '1091500' },
                    ].map((game) => (
                      <button
                        key={game.id}
                        type="button"
                        onClick={() => handleGameSelect(game)}
                        className="text-xs font-semibold text-slate-400 border border-[#1b2434] hover:border-blue-500/40 hover:text-blue-400 bg-[#0f1520] px-3 py-1 rounded-lg transition-all cursor-pointer btn-tactical"
                      >
                        {game.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          } />

          {/* RUTA RECOMENDAR */}
          <Route path="/recomendar" element={<Recomendar />} />

          {/* RUTA CÓMO FUNCIONA */}
          <Route path="/como-funciona" element={
            <div className="py-8">
              <HowItWorks />
            </div>
          } />

          {/* RUTA CHANGELOG */}
          <Route path="/changelog" element={<Changelog />} />
        </Routes>
      </main>

      <footer className="w-full py-6 text-center border-t border-[#1b2434] mt-auto">
        <p className="text-xs text-slate-500">
          Game Recommended AI © {new Date().getFullYear()} · Inteligencia para Decidir tus Juegos
        </p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </Router>
  );
}

export default App;
