import { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useSearchParams, Link } from 'react-router-dom';
import { AlertTriangle, Search, ChevronRight, Wheat, Flame, Sparkles, Gamepad2, ShieldCheck, Check } from 'lucide-react';
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
    'Vectorizando términos con modelo TF-IDF...',
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
      }, 1600);
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

                {/* HERO PRINCIPAL */}
                <div className="relative pt-8 sm:pt-14 pb-6 text-center overflow-hidden">
                  {/* Luz ambiental del héroe */}
                  <div aria-hidden="true" className="hero-light" />

                  {/* Badge de Estado Táctico */}
                  <div className="relative inline-flex items-center gap-2 bg-surface border border-line text-ink-soft text-xs font-semibold px-3.5 py-1.5 rounded-full mb-4 shadow-sm max-w-full">
                    <span className="w-2 h-2 bg-positive rounded-full animate-pulse shrink-0 shadow-sm shadow-positive" />
                    <span className="tracking-wide truncate">Reseñas de Steam · NLP en Español en Tiempo Real</span>
                  </div>

                  {/* Título Principal */}
                  <h1 className="relative text-3xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight mb-3 sm:mb-4 leading-[1.12] text-ink">
                    Decodifica la Opinión Real de la{' '}
                    <span className="text-gradient">Comunidad de Steam</span>
                  </h1>

                  {/* Subtítulo */}
                  <p className="relative text-sm sm:text-base md:text-lg text-ink-soft max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8 font-normal px-2">
                    Analizamos cientos de opiniones recientes en español con modelos de Machine Learning para saber si un videojuego realmente merece tu dinero y tu tiempo.
                  </p>

                  {/* Buscador de Juego */}
                  <div className="relative w-full max-w-2xl mx-auto z-[100]">
                    <GameSearch
                      onGameSelect={(game) => handleGameSelect(game, limit)}
                      isLoading={isLoading}
                    />
                  </div>

                  {/* Selector de cantidad de reseñas */}
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-4 sm:mt-5 text-xs text-ink-faint relative z-[90]">
                    <span className="font-semibold text-ink-soft whitespace-nowrap">Muestra a analizar:</span>
                    <div className="flex items-center gap-1 bg-surface border border-line p-1 rounded-xl shadow-sm">
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
                              ? 'bg-accent text-white shadow-sm'
                              : 'text-ink-soft hover:text-ink hover:bg-surface-2'
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
                  <div className="w-full bg-negative/10 border border-negative/30 p-4 rounded-2xl text-negative text-sm flex gap-3 items-start my-4 shadow-lg animate-fade-up">
                    <AlertTriangle className="size-5 text-negative shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-negative mb-0.5">Error en el análisis</h4>
                      <p className="opacity-90 leading-relaxed text-xs sm:text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {/* TELEMETRÍA DE CARGA TÁCTICA */}
                {isLoading && (
                  <div className="w-full py-12 flex flex-col items-center justify-center space-y-6 animate-fade-up">
                    {/* Anillos de radar concéntricos */}
                    <div className="relative flex items-center justify-center w-20 h-20">
                      <div className="absolute inset-0 rounded-full border-2 border-accent/20 animate-ping opacity-60" />
                      <div className="absolute inset-2 rounded-full border border-accent-2/40 animate-pulse" />
                      <div className="w-12 h-12 rounded-full border-2 border-accent/30 border-t-accent animate-spin flex items-center justify-center shadow-lg shadow-accent/20">
                        <Sparkles className="size-5 text-accent animate-pulse" />
                      </div>
                    </div>

                    <div className="text-center space-y-1.5 max-w-sm">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-[11px] font-mono font-bold">
                        <span>Paso {loadingStep + 1} de {loadingTexts.length}</span>
                      </div>
                      <p className="text-sm font-display font-bold text-ink">{loadingTexts[loadingStep]}</p>
                      <p className="text-xs text-ink-faint">Extrayendo y clasificando reseñas en tiempo real...</p>
                    </div>

                    {/* Barra de progreso con gradiente y resplandor */}
                    <div className="w-full max-w-sm bg-surface-2 border border-line rounded-full h-1.5 overflow-hidden p-0.5 shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-accent via-accent-2 to-positive rounded-full transition-all duration-700 ease-out shadow-sm shadow-accent"
                        style={{ width: `${((loadingStep + 1) / loadingTexts.length) * 100}%` }}
                      />
                    </div>

                    {/* Chips de pasos completados */}
                    <div className="flex flex-wrap justify-center gap-1.5 max-w-lg">
                      {loadingTexts.map((text, i) => {
                        const shortLabel = text.length > 28 ? text.slice(0, 26) + '…' : text;
                        const isDone = i < loadingStep;
                        const isCurrent = i === loadingStep;
                        return (
                          <span
                            key={i}
                            className={`inline-flex items-center gap-1 text-[10px] font-mono px-2.5 py-0.5 rounded-full border transition-all ${
                              isCurrent
                                ? 'bg-accent/15 text-accent border-accent/50 font-bold shadow-sm'
                                : isDone
                                  ? 'bg-surface-2 text-ink-faint border-line line-through opacity-70'
                                  : 'bg-surface-2 text-ink-faint/60 border-line/60'
                            }`}
                            title={text}
                          >
                            {isDone && <Check className="size-2.5 text-positive mr-0.5" />}
                            {shortLabel}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* RESULTADO DEL ANÁLISIS */}
                {!isLoading && analysisResult && (
                  <div ref={resultsRef} style={{ scrollMarginTop: '80px' }}>
                    <RecommendationCard result={analysisResult} gameInfo={selectedGameInfo} />
                  </div>
                )}

                {/* ESTADO VACÍO INICIAL */}
                {!isLoading && !analysisResult && !error && (
                  <div className="space-y-6 max-w-2xl mx-auto w-full my-6 animate-fade-up">
                    {/* Caja de sugerencias de inicio */}
                    <div className="tactical-card p-6 sm:p-7 text-center space-y-4">
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-accent/10 border border-accent/25 flex items-center justify-center text-accent shadow-sm">
                        <Search className="size-5" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-display font-bold text-ink uppercase tracking-wider">
                          Sugerencias Rápidas para Analizar
                        </h3>
                        <p className="text-xs text-ink-faint max-w-md mx-auto leading-relaxed">
                          Selecciona cualquiera de estos títulos populares para ver el modelo NLP en acción de inmediato:
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        {[
                          { name: 'Elden Ring', id: '1245620', meta: '96', tag: 'Action RPG' },
                          { name: 'Stardew Valley', id: '413150', meta: '89', tag: 'Simulación' },
                          { name: 'Cyberpunk 2077', id: '1091500', meta: '86', tag: 'Sci-Fi RPG' },
                        ].map((game) => (
                          <button
                            key={game.id}
                            type="button"
                            onClick={() => handleGameSelect(game)}
                            className="bg-surface-2 hover:bg-surface border border-line hover:border-accent p-3 rounded-xl transition-all cursor-pointer text-left group tactical-card-interactive flex flex-col justify-between space-y-2 shadow-sm"
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[10px] font-mono text-ink-faint font-semibold">ID: {game.id}</span>
                              <span className="text-[10px] font-mono font-bold bg-positive/15 text-positive border border-positive/30 px-1.5 py-0.2 rounded">
                                Meta {game.meta}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-xs sm:text-sm font-display font-bold text-ink group-hover:text-accent transition-colors">
                                {game.name}
                              </h4>
                              <span className="text-[10px] text-ink-faint">{game.tag}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* MUESTRA DESTACADA: STARDEW VALLEY */}
                    <div className="tactical-card border-positive/30 p-4 sm:p-5 text-left space-y-3.5 shadow-xl bg-gradient-to-r from-positive/5 via-surface to-surface">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-positive/15 border border-positive/30 flex items-center justify-center text-positive shrink-0 shadow-sm">
                            <Wheat className="size-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-display font-bold text-ink flex flex-wrap items-center gap-2">
                              <span>Stardew Valley</span>
                              <span className="text-[10px] bg-surface-2 text-ink-faint border border-line px-2 py-0.5 rounded font-mono font-semibold">
                                AppID: 413150
                              </span>
                            </h4>
                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-ink-faint mt-0.5">
                              <span>Informe Destacado</span>
                              <span>·</span>
                              <span className="text-positive font-bold flex items-center gap-1">
                                <ShieldCheck className="size-3" />
                                <span>Verificado por IA</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        <span className="text-xs font-display font-bold bg-positive/15 text-positive border border-positive/30 px-3 py-1 rounded-xl shrink-0 shadow-sm">
                          Extremadamente Recomendado
                        </span>
                      </div>

                      <div className="pt-3 border-t border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                        <span className="text-ink-soft text-xs font-medium">
                          Consulta el desglose de elogios, críticas y resumen ejecutivo Groq AI.
                        </span>
                        <button
                          type="button"
                          onClick={() => handleGameSelect({ name: 'Stardew Valley', id: '413150' })}
                          className="flex items-center gap-1.5 text-xs font-bold text-positive hover:text-white bg-positive/15 hover:bg-positive border border-positive/30 px-3.5 py-2 rounded-xl transition-all cursor-pointer group btn-tactical shrink-0 w-full sm:w-auto justify-center shadow-sm"
                        >
                          <span>Ver Informe IA</span>
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
              <div className="py-6 sm:py-8">
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

      {/* FOOTER MODERNO CON CONTRASTE ACCESIBLE */}
      <footer className="w-full py-8 text-center border-t border-line mt-auto bg-surface/70 backdrop-blur-md space-y-3">
        <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-ink-soft font-semibold">
          <Link to="/" className="hover:text-accent transition-colors">Inicio</Link>
          <span className="text-line-strong">·</span>
          <Link to="/recomendar" className="hover:text-accent transition-colors">Recomendar por IA</Link>
          <span className="text-line-strong">·</span>
          <Link to="/como-funciona" className="hover:text-accent transition-colors">¿Cómo Funciona?</Link>
          <span className="text-line-strong">·</span>
          <a href="/como-funciona#aviso-legal" className="hover:text-accent transition-colors">Aviso Legal & Transparencia</a>
          <span className="text-line-strong">·</span>
          <Link to="/estado" className="hover:text-accent transition-colors">Estado del Servicio</Link>
        </div>
        <p className="text-xs text-ink-faint">
          Game Recommended AI © {new Date().getFullYear()} · Inteligencia de Sentimiento y Recomendación para Steam
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