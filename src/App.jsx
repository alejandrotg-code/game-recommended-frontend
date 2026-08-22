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
    "Buscando reseñas escritas en español...",
    "Descargando las opiniones más recientes...",
    "Limpiando el texto de ruido (hashtags, emojis)...",
    "Enviando reseñas al modelo Naive Bayes...",
    "Clasificando cada opinión como Positiva o Negativa...",
    "Comparando con la valoración oficial de Steam...",
    "Generando informe interactivo...",
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
      const isDifferentGame = !selectedGameInfo || selectedGameInfo.id !== gameId;
      const isDifferentLimit = lastAnalyzedLimitRef.current !== activeLimit;

      if (isDifferentGame || isDifferentLimit) {
        Promise.resolve().then(() => {
          handleGameSelect({
            id: gameId,
            name: gameName || `Juego (ID: ${gameId})`
          }, activeLimit);
        });
      }
    } else {
      // Si no hay parámetros query en la URL, limpiar el estado
      if (selectedGameInfo || analysisResult) {
        Promise.resolve().then(() => {
          setSelectedGameInfo(null);
          setAnalysisResult(null);
          setError(null);
        });
      }
    }
  }, [searchParams, selectedGameInfo, analysisResult, handleGameSelect]);

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
      <Header />

      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 flex-1 flex flex-col">
        <Routes>
          {/* RUTA INICIO */}
          <Route path="/" element={
            <>
              {/* HERO */}
              <div className="relative pt-12 sm:pt-20 pb-8 sm:pb-12 text-center">
                {/* Blobs de luz ambiental en el fondo */}
                <div className="blob-cyan" />
                <div className="blob-violet" />
                <div className="blob-blue" />

                {/* Badge de estado */}
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-emerald-500/10 border border-blue-500/25 text-blue-300 text-[11px] font-bold px-4 py-1.5 rounded-full mb-6 animate-fade-up shadow-[0_0_20px_rgba(37,99,235,0.25)] backdrop-blur-md">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  <span>Machine Learning & NLP · Motor de Inteligencia IA</span>
                </div>

                {/* Título Principal */}
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight mb-5 animate-fade-up leading-[1.1]" style={{ animationDelay: '60ms' }}>
                  <span className="text-white">Decodifica la </span>
                  <span className="text-blue-400">Opinión Real</span>
                  <br />
                  <span className="text-slate-200">de la Comunidad de Steam</span>
                </h1>

                {/* Subtítulo */}
                <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8 animate-fade-up font-normal" style={{ animationDelay: '120ms' }}>
                  Analizamos quirúrgicamente miles de opiniones en <span className="text-blue-400 font-bold">español</span> utilizando IA para predecir si un juego verdaderamente merece tu tiempo y dinero.
                </p>

                {/* Chips de tecnología */}
                <div className="flex items-center justify-center flex-wrap gap-2.5 mb-10 animate-fade-up" style={{ animationDelay: '180ms' }}>
                  {[
                    { label: 'Naive Bayes & Keras', color: 'border-blue-500/20 text-blue-300 bg-blue-500/5' },
                    { label: 'FastAPI Async Engine', color: 'border-emerald-500/20 text-emerald-300 bg-emerald-500/5' },
                    { label: 'Steam Web API', color: 'border-violet-500/20 text-violet-300 bg-violet-500/5' },
                    { label: 'TF-IDF NLP Vectorizer', color: 'border-amber-500/20 text-amber-300 bg-amber-500/5' }
                  ].map(({ label, color }) => (
                    <span key={label} className={`text-[11px] font-bold border px-3.5 py-1.5 rounded-full backdrop-blur-sm shadow-sm transition-all duration-300 hover:scale-105 ${color}`}>
                      {label}
                    </span>
                  ))}
                </div>

                {/* Buscador */}
                <div className="w-full max-w-3xl mx-auto animate-fade-up relative z-[100]" style={{ animationDelay: '240ms' }}>
                  <GameSearch onGameSelect={(game) => handleGameSelect(game, limit)} isLoading={isLoading} />
                </div>

                {/* Selector de cantidad de reseñas */}
                <div className="flex items-center justify-center gap-3 mt-4 text-xs text-slate-400 animate-fade-up relative z-[90]" style={{ animationDelay: '270ms' }}>
                  <span>Analizar últimas reseñas:</span>
                  <div className="flex bg-[#0a1628]/85 border border-[#1e293b] p-1 rounded-xl">
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
                        className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                          limit === num
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
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

              {/* RESULTADO */}
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
          } />

          {/* RUTA RECOMENDAR */}
          <Route path="/recomendar" element={<Recomendar />} />

          {/* RUTA CÓMO FUNCIONA */}
          <Route path="/como-funciona" element={
            <div className="py-10 sm:py-14">
              <HowItWorks />
            </div>
          } />

          {/* RUTA CHANGELOG */}
          <Route path="/changelog" element={<Changelog />} />
        </Routes>
      </main>


      <footer className="w-full py-8 text-center border-t border-[#1e293b]/60 mt-auto">
        <p className="text-xs text-slate-600">
          Game Recommended AI © {new Date().getFullYear()} ·{' '}
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
