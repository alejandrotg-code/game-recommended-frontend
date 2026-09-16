import { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useSearchParams, Link } from 'react-router-dom';
import { AlertTriangle, Search, ChevronRight, Wheat } from 'lucide-react';
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
    'Clasificando opiniones como positivas o negativas...',
    'Clasificando cada opinión como Positiva o Negativa...',
    'Comparando con la aprobación de Steam...',
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
    <div className="min-h-screen bg-bg text-ink flex flex-col font-sans antialiased overflow-x-hidden selection:bg-accent selection:text-white">
      <Header />

      <main className="w-full max-w-5xl mx-auto px-3 sm:px-6 flex-1 flex flex-col">
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
                <div className="relative pt-6 sm:pt-14 pb-6 text-center overflow-hidden">
                  {/* Luz estática del héroe */}
                  <div aria-hidden="true" className="hero-light" />

                  {/* Badge de Estado Táctico */}
                  <div className="relative inline-flex items-center gap-2 bg-bg border border-line text-ink-soft text-[11px] sm:text-xs font-semibold px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full mb-4 sm:mb-5 shadow-sm max-w-full">
                    <span className="w-2 h-2 bg-positive rounded-full animate-pulse shrink-0" />
                    <span className="tracking-wide truncate">Reseñas de Steam · Leídas en español</span>
                  </div>

                  {/* Título Principal */}
                  <h1 className="relative text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight mb-3 sm:mb-4 leading-[1.15] text-ink">
                    Decodifica la Opinión Real de la <span className="text-gradient" style={{ textShadow: '0 0 28px color-mix(in srgb, var(--accent) 35%, transparent)' }}>Comunidad de Steam</span>
                  </h1>

                  {/* Subtítulo */}
                  <p className="relative text-xs sm:text-base md:text-lg text-ink-soft max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8 font-normal px-1">
                    Leemos cientos de reseñas recientes en español y te mostramos, con datos, si un juego realmente merece tu dinero y tu tiempo.
                  </p>

                  {/* Buscador de Juego */}
                  <div className="relative w-full max-w-2xl mx-auto z-[100]">
                    <GameSearch
                      onGameSelect={(game) => handleGameSelect(game, limit)}
                      isLoading={isLoading}
                    />
                  </div>

                  {/* Selector de cantidad de reseñas */}
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-5 sm:mt-6 text-xs text-ink-faint relative z-[90]">
                    <span className="font-semibold text-ink-faint whitespace-nowrap">Muestra a analizar:</span>
                    <div className="flex items-center gap-1 bg-surface border border-line p-1 rounded-xl">
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
                          className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                            limit === num
                              ? 'bg-accent text-white shadow-sm'
                              : 'text-ink-faint hover:text-ink hover:bg-surface-2'
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
                  <div className="w-full bg-negative/10 border border-negative/30 p-4 rounded-xl text-negative text-sm flex gap-3 items-start my-4">
                    <AlertTriangle className="size-5 text-negative shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-negative mb-0.5">Error en el análisis</h4>
                      <p className="opacity-90 leading-relaxed text-xs sm:text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {/* CARGANDO */}
                {isLoading && (
                  <div className="w-full py-12 flex flex-col items-center justify-center space-y-6">
                    <div className="relative flex items-center justify-center">
                      <div className="w-12 h-12 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                    </div>

                    <div className="text-center space-y-1.5 max-w-sm">
                      <p className="text-sm font-bold text-ink">{loadingTexts[loadingStep]}</p>
                      <p className="text-xs text-ink-faint">Procesando datos en tiempo real desde Steam...</p>
                    </div>

                    <div className="w-full max-w-xs bg-surface-2 border border-line rounded-full h-1 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent via-accent-2 to-accent rounded-full transition-all duration-[1800ms] ease-linear"
                        style={{ width: `${((loadingStep + 1) / loadingTexts.length) * 100}%` }}
                      />
                    </div>

                    <div className="flex flex-wrap justify-center gap-1.5 max-w-md">
                      {loadingTexts.map((text, i) => {
                        const shortLabel = text.length > 28 ? text.slice(0, 26) + '…' : text;
                        const isDone = i < loadingStep;
                        const isCurrent = i === loadingStep;
                        return (
                          <span
                            key={i}
                            className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full border transition-colors ${
                              isCurrent
                                ? 'bg-accent/15 text-accent border-accent/40'
                                : isDone
                                  ? 'bg-surface-2 text-ink-faint border-line line-through'
                                  : 'bg-surface-2 text-ink-faint/70 border-line'
                            }`}
                            title={text}
                          >
                            {isDone && <span className="text-positive mr-0.5">✓</span>}
                            {shortLabel}
                          </span>
                        );
                      })}
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
                  <div className="space-y-4 max-w-lg mx-auto w-full my-4">
                    <div className="text-center py-6 sm:py-8 px-4 sm:px-6 border border-dashed border-line rounded-2xl bg-surface/50 transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/10 dark:hover:shadow-black/40">
                      <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                        <Search className="size-5" />
                      </div>
                      <h3 className="text-xs font-display font-bold text-ink-soft uppercase tracking-wider mb-1">
                        Empieza a analizar
                      </h3>
                      <p className="text-xs text-ink-faint max-w-xs mx-auto leading-relaxed mb-4">
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
                            className="text-xs font-semibold text-ink-soft border border-line hover:border-accent/40 hover:text-accent bg-surface px-3 py-1 rounded-lg transition-all cursor-pointer btn-tactical"
                          >
                            {game.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* MUESTRA DESTACADA: STARDEW VALLEY */}
                    <div className="bg-surface border border-positive/30 p-3.5 sm:p-4 rounded-2xl text-left space-y-3 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/50">
                      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-positive/20 border border-positive/40 flex items-center justify-center text-positive shrink-0">
                            <Wheat className="size-4" />
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-display font-bold text-ink flex flex-wrap items-center gap-1.5">
                              <span>Stardew Valley</span>
                              <span className="text-[10px] bg-bg text-ink-faint border border-line px-1.5 py-0.5 rounded font-mono">
                                AppID: 413150
                              </span>
                            </h4>
                            <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-ink-faint mt-0.5">
                              <span>Análisis Muestra</span>
                              <span>•</span>
                              <span className="text-positive font-semibold">Modelo IA</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-display font-bold bg-positive/15 text-positive border border-positive/30 px-2 py-0.5 rounded shrink-0">
                          Extremadamente Recomendado
                        </span>
                      </div>

                      <div className="pt-2 border-t border-line flex items-center justify-between gap-2 text-xs">
                        <span className="text-ink-faint text-[11px] font-medium">
                          Síntesis Inteligente de la Comunidad
                        </span>
                        <button
                          type="button"
                          onClick={() => handleGameSelect({ name: 'Stardew Valley', id: '413150' })}
                          className="flex items-center gap-1.5 text-xs font-black text-positive hover:text-positive/80 bg-positive/10 hover:bg-positive/20 border border-positive/30 px-3 py-1.5 rounded-xl transition-all cursor-pointer group btn-tactical"
                        >
                          <span>Ver Resumen IA</span>
                          <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
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

      <footer className="w-full py-8 text-center border-t border-line mt-auto bg-bg/80 space-y-3">
        <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-ink-faint font-medium">
          <Link to="/" className="hover:text-accent transition-colors">Inicio</Link>
          <span>·</span>
          <Link to="/recomendar" className="hover:text-accent transition-colors">Recomendar</Link>
          <span>·</span>
          <Link to="/como-funciona" className="hover:text-accent transition-colors">¿Cómo Funciona?</Link>
          <span>·</span>
          <a href="/como-funciona#aviso-legal" className="hover:text-accent transition-colors">Aviso Legal & Transparencia</a>
          <span>·</span>
          <Link to="/estado" className="hover:text-accent transition-colors">Estado</Link>
        </div>
        <p className="text-xs text-ink-faint">
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