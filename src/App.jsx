import { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useSearchParams, Link } from 'react-router-dom';
import { AlertTriangle, Search } from 'lucide-react';
import './App.css';
import Header from './components/Header';
import GameSearch from './components/Input';
import RecommendationCard from './components/RecommendationCard';
import HowItWorks from './components/HowItWorks';
import Changelog from './components/Changelog';
import Recomendar from './components/Recomendar';
import Status from './components/Status';
import ErrorBoundary from './components/ErrorBoundary';
import SeoHead from './components/SeoHead';
import { analyzeGame } from './services/steamService';
import { getWebSiteJsonLd, getWebApplicationJsonLd, getGameAnalysisJsonLd } from './services/seo/seoService';

function AppContent() {
  const [selectedGameInfo, setSelectedGameInfo] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();

  const gameLimitParam = parseInt(searchParams.get('limit') || '30', 10);
  const limit = [10, 20, 30].includes(gameLimitParam) ? gameLimitParam : 30;

  const analyzeAbortRef = useRef(null);
  const resultsRef = useRef(null);
  const lastAnalyzedLimitRef = useRef(30);

  const loadingTexts = [
    'Conectando con los servidores de Steam...',
    'Buscando opiniones escritas en español...',
    'Descargando las opiniones más recientes...',
    'Limpiando el texto de ruido y caracteres nulos...',
    'Procesando con el clasificador de Inteligencia IA...',
    'Clasificando cada opinión como Positiva o Negativa...',
    'Comparando con la valoración de la muestra...',
    'Generando el informe interactivo...',
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

    setSearchParams({
      game: game.id,
      name: game.name || '',
      limit: customLimit.toString(),
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
          name: gameName || `Juego (ID: ${gameId})`,
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

  // Estructuras JSON-LD para SEO
  const webSiteLd = getWebSiteJsonLd();
  const webAppLd = getWebApplicationJsonLd();
  const gameAnalysisLd = analysisResult ? getGameAnalysisJsonLd(selectedGameInfo, analysisResult) : null;

  const dynamicTitle = selectedGameInfo?.name
    ? `Análisis de Reseñas de ${selectedGameInfo.name}`
    : null;

  const dynamicDesc = selectedGameInfo?.name
    ? `Resultados del análisis de sentimiento NLP en español para ${selectedGameInfo.name} en Steam. Veredicto: ${analysisResult?.recommendation_level || 'Procesando'}.`
    : undefined;

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col font-sans antialiased overflow-x-hidden selection:bg-blue-600 selection:text-white">
      <Header />

      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 flex-1 flex flex-col">
        <Routes>
          {/* RUTA INICIO */}
          <Route
            path="/"
            element={
              <>
                <SeoHead
                  title={dynamicTitle}
                  description={dynamicDesc}
                  canonicalPath="/"
                  jsonLd={[webSiteLd, webAppLd, gameAnalysisLd].filter(Boolean)}
                />

                {/* HERO */}
                <div className="relative pt-8 sm:pt-14 pb-6 text-center">
                  {/* Badge de Estado Táctico */}
                  <div className="inline-flex items-center gap-2 bg-[#0f1520] border border-[#1b2434] text-slate-300 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-5 shadow-sm">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="tracking-wide">Motor NLP & Análisis de Sentimiento para Steam</span>
                  </div>

                  {/* Título Principal */}
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 leading-[1.15] text-slate-100">
                    Decodifica la Opinión Real de la <span className="text-blue-500">Comunidad de Steam</span>
                  </h1>

                  {/* Subtítulo */}
                  <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8 font-normal">
                    Analizamos quirúrgicamente las opiniones más recientes en <strong className="text-slate-200">español</strong> con modelos de Inteligencia IA para determinar si un juego realmente merece tu tiempo.
                  </p>

                  {/* Buscador de Juego */}
                  <div className="w-full max-w-2xl mx-auto relative z-[100]">
                    <GameSearch
                      onGameSelect={(game) => handleGameSelect(game, limit)}
                      isLoading={isLoading}
                    />
                  </div>

                  {/* Selector de cantidad de reseñas */}
                  <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-xs text-slate-400 relative z-[90]">
                    <span className="font-semibold text-slate-400 whitespace-nowrap">Muestra a analizar:</span>
                    <div className="flex items-center gap-1 bg-[#0f1520] border border-[#1b2434] p-1 rounded-xl">
                      {[10, 20, 30].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => {
                            setSearchParams({
                              game: selectedGameInfo?.id || '',
                              name: selectedGameInfo?.name || '',
                              limit: num.toString(),
                            });
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                            limit === num
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-[#151d2c]'
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
                  <div className="w-full bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl text-rose-400 text-sm flex gap-3 items-start my-4">
                    <AlertTriangle className="size-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-rose-300 mb-0.5">Error en el análisis</h4>
                      <p className="opacity-90 leading-relaxed text-xs sm:text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {/* CARGANDO */}
                {isLoading && (
                  <div className="w-full py-12 flex flex-col items-center justify-center space-y-6">
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
                  <div className="text-center py-10 px-6 border border-dashed border-[#1b2434] rounded-2xl bg-[#0f1520]/40 max-w-lg mx-auto w-full my-4">
                    <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <Search className="size-5" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Empieza a analizar
                    </h3>
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
            }
          />

          {/* RUTA RECOMENDAR */}
          <Route path="/recomendar" element={<Recomendar />} />

          {/* RUTA CÓMO FUNCIONA */}
          <Route
            path="/como-funciona"
            element={
              <div className="py-8">
                <HowItWorks />
              </div>
            }
          />

          {/* RUTA CHANGELOG */}
          <Route path="/changelog" element={<Changelog />} />

          {/* RUTA ESTADO DEL SERVICIO */}
          <Route path="/estado" element={<Status />} />
        </Routes>
      </main>

      <footer className="w-full py-8 text-center border-t border-[#1b2434] mt-auto bg-[#080b11]/80 space-y-3">
        <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-slate-400 font-medium">
          <Link to="/" className="hover:text-blue-400 transition-colors">Inicio</Link>
          <span>·</span>
          <Link to="/recomendar" className="hover:text-blue-400 transition-colors">Recomendar</Link>
          <span>·</span>
          <Link to="/como-funciona" className="hover:text-blue-400 transition-colors">¿Cómo Funciona?</Link>
          <span>·</span>
          <a href="/como-funciona#aviso-legal" className="hover:text-blue-400 transition-colors">Aviso Legal & Transparencia</a>
          <span>·</span>
          <Link to="/estado" className="hover:text-blue-400 transition-colors">Estado</Link>
        </div>
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
