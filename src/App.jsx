import { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useSearchParams, Link } from 'react-router-dom';
import { AlertTriangle, ChevronRight, Wheat, Sparkles } from 'lucide-react';
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
                <div className="relative pt-8 sm:pt-14 pb-6 text-left overflow-hidden hero-enter">
                  {/* Luz ambiental del héroe */}
                  <div aria-hidden="true" className="hero-light" />

                  {/* Estado en vivo */}
                  <div className="relative inline-flex items-center gap-2 bg-surface border border-line text-ink-soft text-xs font-semibold px-3.5 py-1.5 rounded-full mb-4 shadow-sm max-w-full">
                    <span className="w-2 h-2 bg-positive rounded-full animate-pulse shrink-0 shadow-sm shadow-positive" />
                    <span className="truncate">Análisis en vivo de reseñas en español</span>
                  </div>

                  {/* Título principal */}
                  <h1 className="relative text-3xl sm:text-5xl md:text-[3.4rem] font-display font-bold tracking-tight mb-3 sm:mb-4 leading-[1.08] text-ink max-w-3xl">
                    Lee lo que piensa la comunidad antes de comprar
                  </h1>

                  {/* Subtítulo */}
                  <p className="relative text-sm sm:text-base md:text-lg text-ink-soft max-w-2xl leading-relaxed mb-6 sm:mb-8 font-normal measure">
                    Escribe un título de Steam, elige cuántas reseñas quieres leer y pulsa Analizar. Clasificamos el sentimiento con IA y te damos un veredicto claro.
                  </p>

                  {/* Buscador de Juego */}
                  <div className="relative w-full max-w-2xl z-[100]">
                    <GameSearch
                      onGameSelect={(game) => handleGameSelect(game, limit)}
                      isLoading={isLoading}
                    />
                  </div>

                  {/* Selector de cantidad de reseñas */}
                  <fieldset className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4 sm:mt-5 text-xs text-ink-faint relative z-[90]">
                    <legend className="sr-only">Cuántas reseñas quieres analizar</legend>
                    <span className="font-semibold text-ink-soft whitespace-nowrap" aria-hidden="true">Reseñas por análisis:</span>
                    <div className="flex items-center gap-1 bg-surface border border-line p-1 rounded-xl shadow-sm" role="radiogroup" aria-label="Reseñas por análisis">
                      {[10, 20, 30].map((num) => (
                        <button
                          key={num}
                          type="button"
                          role="radio"
                          aria-checked={limit === num}
                          onClick={() => {
                            setSearchParams({
                              game: selectedGameInfo?.id || '',
                              name: selectedGameInfo?.name || '',
                              limit: num.toString(),
                            });
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                            limit === num
                              ? 'bg-accent text-white shadow-sm'
                              : 'text-ink-soft hover:text-ink hover:bg-surface-2'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                </div>

                {/* ERROR */}
                {error && (
                  <div className="w-full bg-negative/10 border border-negative/30 p-4 rounded-2xl text-sm flex gap-3 items-start my-4" role="alert">
                    <AlertTriangle className="size-5 text-negative shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-ink mb-0.5">No se pudo completar el análisis</h4>
                      <p className="leading-relaxed text-xs sm:text-sm text-ink-soft">{error}</p>
                      <p className="text-xs text-ink-soft mt-1.5">Comprueba el AppID o prueba con otro título.</p>
                    </div>
                  </div>
                )}

                {/* Estado de carga */}
                {isLoading && (
                  <div className="w-full py-12 flex flex-col items-center justify-center space-y-5" role="status" aria-live="polite">
                    <div className="relative flex items-center justify-center w-20 h-20" aria-hidden="true">
                      <div className="absolute inset-0 rounded-full border-2 border-accent/20 animate-ping opacity-60" />
                      <div className="w-12 h-12 rounded-full border-2 border-accent/30 border-t-accent animate-spin flex items-center justify-center">
                        <Sparkles className="size-5 text-accent" />
                      </div>
                    </div>

                    <div className="text-center space-y-1.5 max-w-sm">
                      <p className="text-xs text-ink-faint">Paso {loadingStep + 1} de {loadingTexts.length}</p>
                      <p className="text-sm font-display font-semibold text-ink">{loadingTexts[loadingStep]}</p>
                    </div>

                    <div className="w-full max-w-sm bg-surface-2 border border-line rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${((loadingStep + 1) / loadingTexts.length) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* RESULTADO DEL ANÁLISIS */}
                {!isLoading && analysisResult && (
                  <div ref={resultsRef} style={{ scrollMarginTop: '80px' }}>
                    <RecommendationCard result={analysisResult} gameInfo={selectedGameInfo} />
                  </div>
                )}

                {/* Estado vacío inicial */}
                {!isLoading && !analysisResult && !error && (
                  <div className="space-y-5 max-w-2xl w-full my-6">
                    <div className="tactical-card p-6 sm:p-7 text-left space-y-4">
                      <div className="space-y-1">
                        <h3 className="text-base font-display font-semibold text-ink">
                          Prueba con un ejemplo
                        </h3>
                        <p className="text-sm text-ink-soft leading-relaxed measure">
                          Elige un título para ver cómo queda un informe. Tarda unos segundos.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                        {[
                          { name: 'Elden Ring', id: '1245620', meta: '96', tag: 'Action RPG' },
                          { name: 'Stardew Valley', id: '413150', meta: '89', tag: 'Simulación' },
                          { name: 'Cyberpunk 2077', id: '1091500', meta: '86', tag: 'Sci-Fi RPG' },
                        ].map((game) => (
                          <button
                            key={game.id}
                            type="button"
                            onClick={() => handleGameSelect(game)}
                            className="bg-surface-2 hover:bg-surface border border-line hover:border-accent p-3 rounded-xl transition-all cursor-pointer text-left group tactical-card-interactive flex flex-col justify-between space-y-2"
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="code-datum text-ink-faint">{game.id}</span>
                              <span className="text-xs font-semibold text-positive">
                                {game.meta}/100
                              </span>
                            </div>
                            <div>
                              <h4 className="text-sm font-display font-semibold text-ink group-hover:text-accent transition-colors">
                                {game.name}
                              </h4>
                              <span className="text-xs text-ink-faint">{game.tag}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ejemplo destacado */}
                    <div className="tactical-card p-4 sm:p-5 text-left space-y-3">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-positive/10 border border-positive/25 flex items-center justify-center text-positive shrink-0">
                            <Wheat className="size-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-display font-semibold text-ink flex flex-wrap items-center gap-2">
                              <span>Stardew Valley</span>
                              <span className="code-datum bg-surface-2 text-ink-faint border border-line px-2 py-0.5 rounded">
                                413150
                              </span>
                            </h4>
                            <p className="text-xs text-ink-faint mt-0.5">
                              Informe de ejemplo verificado por IA
                            </p>
                          </div>
                        </div>

                        <span className="text-xs font-semibold bg-positive/10 text-positive border border-positive/25 px-3 py-1 rounded-xl shrink-0">
                          Muy recomendado
                        </span>
                      </div>

                      <div className="pt-3 border-t border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                        <span className="text-ink-soft text-sm">
                          Mira elogios, críticas y resumen de la comunidad.
                        </span>
                        <button
                          type="button"
                          onClick={() => handleGameSelect({ name: 'Stardew Valley', id: '413150' })}
                          className="flex items-center gap-1.5 text-sm font-semibold text-white bg-positive hover:brightness-110 border border-positive/30 px-3.5 py-2 rounded-xl transition-all cursor-pointer btn-tactical shrink-0 w-full sm:w-auto justify-center"
                        >
                          <span>Ver informe de ejemplo</span>
                          <ChevronRight className="size-4" />
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

      {/* Footer */}
      <footer className="w-full py-8 border-t border-line mt-auto bg-surface/70 backdrop-blur-md">
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-ink-soft font-medium px-4" aria-label="Navegación secundaria">
          <Link to="/" className="hover:text-accent transition-colors">Inicio</Link>
          <Link to="/recomendar" className="hover:text-accent transition-colors">Recomendador</Link>
          <Link to="/como-funciona" className="hover:text-accent transition-colors">Cómo funciona</Link>
          <a href="/como-funciona#aviso-legal" className="hover:text-accent transition-colors">Aviso legal</a>
          <Link to="/estado" className="hover:text-accent transition-colors">Estado</Link>
        </nav>
        <p className="text-xs text-ink-faint text-center mt-3 px-4">
          Game Recommended AI © {new Date().getFullYear()} — Lee reseñas en español antes de comprar en Steam
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