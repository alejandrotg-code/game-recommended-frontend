import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  BrainCircuit,
  Compass,
  Gamepad2,
  Wheat,
  Swords,
  Rocket,
  Puzzle,
  Ghost,
  Dices,
  Zap,
  Coins,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { getRagRecommendations } from '../services/steamService';
import { getInstantGamingUrl, getG2aUrl, getSteamStoreUrl } from '../config/affiliates';
import SeoHead from './SeoHead';
import { getBreadcrumbJsonLd } from '../services/seo/seoService';

export default function Recomendar() {
  const [query, setQuery] = useState('');
  const [topK, setTopK] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const abortRef = useRef(null);
  const resultsTopRef = useRef(null);

  const ejemplos = [
    { text: 'Un juego relajante para tener mi propia granja y plantar hortalizas', label: 'Granja / Relax', Icon: Wheat },
    { text: 'Un RPG de fantasía con combates por turnos y una historia profunda', label: 'RPG / Fantasía', Icon: Swords },
    { text: 'Un shooter cooperativo espacial con mucha acción para jugar con amigos', label: 'Acción / Co-op', Icon: Rocket },
    { text: 'Un juego de puzles y misterio con una gran banda sonora atmosférica', label: 'Puzles / Misterio', Icon: Puzzle },
    { text: 'Un juego de terror psicológico espacial tipo ciencia ficción', label: 'Terror / Sci-Fi', Icon: Ghost },
    { text: 'Estrategia por turnos con construcción de mazos de cartas', label: 'Deckbuilding', Icon: Dices },
  ];

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim() || query.trim().length < 3) {
      setError('Escribe al menos 3 caracteres para describir la experiencia que buscas.');
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setCurrentPage(1);

    try {
      const data = await getRagRecommendations(query, topK, controller.signal);
      setResult(data);
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('Error al obtener recomendación RAG:', err);
      setError(err.message || 'Error al conectar con el servidor RAG.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEjemploClick = (text) => {
    setQuery(text);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (resultsTopRef.current && typeof resultsTopRef.current.scrollIntoView === 'function') {
      resultsTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const totalItems = result?.games?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedGames = result?.games ? result.games.slice(startIndex, startIndex + itemsPerPage) : [];

  const breadcrumbLd = getBreadcrumbJsonLd([
    { name: 'Recomendador por IA', path: '/recomendar' },
  ]);

  return (
    <>
      <SeoHead
        title="Recomendador de Videojuegos por IA"
        description="Encuentra videojuegos en Steam según tu estado de ánimo o preferencia por lenguaje natural. Motor RAG conversacional impulsado por LLM y NLP."
        canonicalPath="/recomendar"
        keywords={[
          'Recomendador de Videojuegos',
          'IA Steam',
          'RAG Juegos PC',
          'Búsqueda Semántica Videojuegos',
          'Juegos por Estado de Ánimo',
          'Groq LLM',
        ]}
        jsonLd={breadcrumbLd}
      />

      <div className="py-8 sm:py-12 animate-fade-in space-y-10">
        {/* HERO SECTION */}
        <section className="relative py-10 px-6 sm:px-10 rounded-3xl text-center space-y-4 overflow-hidden border border-line bg-surface/50 shadow-lg">
          <div aria-hidden="true" className="hero-light" />

          <div className="relative inline-flex items-center gap-2 bg-surface border border-line text-accent text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm">
            <Sparkles className="size-4 text-accent animate-pulse" />
            <span>Búsqueda Semántica por Lenguaje Natural & Groq LLM</span>
          </div>

          <h1 className="relative text-3xl sm:text-5xl font-display font-black tracking-tight text-ink">
            Recomendador de Juegos por <span className="text-gradient">IA</span>
          </h1>
          <p className="relative text-sm sm:text-base text-ink-soft max-w-xl mx-auto leading-relaxed font-normal">
            Describe qué sensación o ambientación buscas hoy. Nuestra IA vectorizará tu consulta sobre el catálogo de Steam y argumentará cada recomendación.
          </p>
        </section>

        {/* FORMULARIO DE BÚSQUEDA TÁCTICA */}
        <section className="tactical-card p-5 sm:p-8 max-w-3xl mx-auto space-y-5 sm:space-y-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2.5">
              <label htmlFor="rag-query-input" className="text-xs font-display font-bold uppercase tracking-wider text-ink flex items-center gap-2">
                <BrainCircuit className="size-4 text-accent shrink-0" />
                <span>¿Qué experiencia o género deseas jugar?</span>
              </label>
              <textarea
                id="rag-query-input"
                rows="3"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ej: Busco un juego para desconectar tras el trabajo, donde pueda construir una granja pacífica o explorar cuevas misteriosas..."
                className="w-full bg-surface-2 border border-line focus:border-accent rounded-2xl p-4 text-sm text-ink placeholder-ink-faint outline-none transition-all resize-none leading-relaxed shadow-inner glow-focus"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
            </div>

            {/* SELECTOR DE CANTIDAD DE RESULTADOS & BOTÓN BUSCAR */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-line">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-ink-soft uppercase tracking-wider">
                  Resultados:
                </span>
                <div className="flex items-center gap-1 bg-surface-2 p-1 rounded-xl border border-line">
                  {[4, 10, 20].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setTopK(num)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        topK === num
                          ? 'bg-accent text-white shadow-sm'
                          : 'text-ink-soft hover:text-ink hover:bg-surface'
                      }`}
                    >
                      {num} juegos
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="w-full sm:w-auto bg-accent hover:bg-accent-2 disabled:bg-surface-2 disabled:text-ink-faint disabled:border-line disabled:cursor-not-allowed text-white text-xs font-black px-6 py-3 min-h-[44px] rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-accent/25 active:scale-95"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin text-white" />
                    <span>Buscando en Steam...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    <span>Recomiéndame ({topK})</span>
                  </>
                )}
              </button>
            </div>

            {/* PRESETS DE EJEMPLO */}
            <div className="flex flex-wrap gap-2 items-center pt-3 border-t border-line/60">
              <span className="text-[10px] text-ink-faint font-bold uppercase tracking-wider mr-1 flex items-center gap-1">
                <Compass className="size-3.5 text-accent shrink-0" />
                <span>Ideas Rápidas:</span>
              </span>
              {ejemplos.map((ej, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleEjemploClick(ej.text)}
                  className="text-xs font-bold text-ink-soft hover:text-ink bg-surface-2 border border-line hover:border-accent hover:bg-surface px-3 py-1.5 rounded-xl transition-all cursor-pointer active:scale-95 shadow-sm flex items-center gap-1.5"
                >
                  <ej.Icon className="size-3.5 text-accent shrink-0" />
                  <span>{ej.label}</span>
                </button>
              ))}
            </div>
          </form>

          {error && (
            <div className="bg-negative/10 border border-negative/30 p-4 rounded-2xl text-negative text-xs flex gap-3 items-start shadow-md">
              <AlertCircle className="size-5 shrink-0 text-negative mt-0.5" />
              <p className="opacity-90 leading-relaxed font-semibold">{error}</p>
            </div>
          )}
        </section>

        {/* MUESTRA DESTACADA: STARDEW VALLEY */}
        {!isLoading && !result && (
          <div className="tactical-card border-positive/30 p-5 sm:p-6 max-w-3xl mx-auto rounded-3xl shadow-xl space-y-4 text-left bg-gradient-to-r from-positive/5 via-surface to-surface">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-positive/20 border border-positive/40 flex items-center justify-center shrink-0 text-positive">
                  <Wheat className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-display font-extrabold text-ink flex items-center gap-2 flex-wrap">
                    <span>Stardew Valley</span>
                    <span className="text-[10px] bg-surface-2 text-ink-faint border border-line px-2 py-0.5 rounded font-mono font-bold">
                      AppID: 413150
                    </span>
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-ink-faint mt-0.5">
                    <span>Dossier de Ejemplo</span>
                    <span>·</span>
                    <span className="text-positive font-bold flex items-center gap-1">
                      <ShieldCheck className="size-3" />
                      <span>Verificado por IA</span>
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-xs font-display font-bold bg-positive/15 text-positive border border-positive/30 px-3 py-1 rounded-xl shrink-0 self-start sm:self-center">
                Extremadamente Recomendado
              </span>
            </div>

            <div className="pt-3 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="text-ink font-bold block font-display">
                  Síntesis Inteligente de la Comunidad
                </span>
                <span className="text-ink-soft text-xs font-normal">
                  Resumen ejecutivo y pros/contras extraídos de reseñas reales en español
                </span>
              </div>

              <Link
                to="/?game=413150&name=Stardew+Valley"
                className="flex items-center justify-center gap-1.5 text-xs font-bold text-positive hover:text-white bg-positive/15 hover:bg-positive border border-positive/30 px-4 py-2 rounded-xl transition-all cursor-pointer group btn-tactical shrink-0 shadow-sm"
              >
                <span>Ver Análisis y Resumen</span>
                <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        )}

        {/* ESTADO DE CARGA */}
        {isLoading && (
          <div className="py-16 tactical-card shadow-2xl flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto animate-fade-up">
            <div className="relative flex items-center justify-center w-16 h-16">
              <div className="absolute inset-0 rounded-full border-2 border-accent/20 animate-ping opacity-50" />
              <Loader2 className="size-8 text-accent animate-spin" />
            </div>
            <p className="text-sm font-display font-bold text-ink">Vectorizando consulta y explorando Steam...</p>
            <p className="text-xs text-ink-faint">Búsqueda semántica RAG acelerada por Groq Cloud AI</p>
          </div>
        )}

        {/* RESULTADO RAG */}
        {!isLoading && result && (
          <div ref={resultsTopRef} className="space-y-8 max-w-4xl mx-auto animate-fade-up">
            {/* RESUMEN DE IA */}
            {result.summary && (
              <div className="tactical-card p-5 sm:p-7 space-y-2.5 border-l-4 border-l-accent shadow-xl bg-surface-2/40">
                <span className="text-xs font-display font-bold uppercase tracking-wider text-accent flex items-center gap-2">
                  <BrainCircuit className="size-4 text-accent" />
                  <span>Diagnóstico del Recomendador IA</span>
                </span>
                <p className="text-ink text-xs sm:text-sm leading-relaxed font-normal">
                  {result.summary}
                </p>
              </div>
            )}

            {/* JUEGOS RECOMENDADOS */}
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-line flex-wrap gap-2">
                <h3 className="text-xs sm:text-sm font-display font-bold text-ink uppercase tracking-wider flex items-center gap-2">
                  <Gamepad2 className="size-4 text-accent" />
                  <span>Selección IA ({totalItems} Títulos Encontrados)</span>
                </h3>
                {totalPages > 1 && (
                  <span className="text-xs text-ink-faint font-mono font-medium">
                    Mostrando {startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalItems)} de {totalItems} recomendaciones
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {paginatedGames.map((game) => {
                  const steamUrl = getSteamStoreUrl(game.app_id);
                  const instantGamingUrl = getInstantGamingUrl(game.name, game.app_id);
                  const g2aUrl = getG2aUrl(game.name);

                  return (
                    <div
                      key={game.app_id}
                      className="tactical-card p-5 sm:p-6 flex flex-col justify-between space-y-4 group hover:border-accent/60 shadow-lg"
                    >
                      <div className="flex gap-3.5 items-start">
                        {game.header_image ? (
                          <img
                            src={game.header_image}
                            alt={game.name}
                            className="w-28 h-16 object-cover rounded-xl border border-line shrink-0 group-hover:scale-105 transition-transform shadow-sm"
                          />
                        ) : (
                          <div className="w-28 h-16 bg-surface-2 rounded-xl shrink-0 flex items-center justify-center text-ink-faint text-xs font-bold border border-line">
                            <Gamepad2 className="size-5" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm sm:text-base font-display font-bold text-ink truncate group-hover:text-accent transition-colors">
                            {game.name}
                          </h4>
                          <span className="text-xs font-bold text-positive block mt-0.5">
                            {game.price || 'Gratis'}
                          </span>
                          {game.genres && (
                            <p className="text-[11px] text-ink-faint truncate mt-1 font-medium">
                              {game.genres}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="bg-surface-2 border border-line rounded-xl p-3.5 space-y-1 shadow-inner">
                        <span className="text-[10px] font-display font-bold text-accent uppercase tracking-wider block">
                          Por qué encaja:
                        </span>
                        <p className="text-xs text-ink-soft leading-relaxed font-normal">
                          {game.reason_ai}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-line flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                        <Link
                          to={`/?game=${game.app_id}&name=${encodeURIComponent(game.name)}`}
                          className="text-xs font-bold text-accent hover:text-white hover:bg-accent bg-accent/10 border border-accent/30 px-3 py-1.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 group btn-tactical"
                        >
                          <span>Síntesis IA</span>
                          <ChevronRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <div className="flex items-center gap-1.5 justify-end">
                          <a
                            href={instantGamingUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] font-bold text-warn bg-surface-2 border border-line hover:border-warn/60 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                            title="Comprar en Instant Gaming"
                          >
                            <Zap className="size-3 shrink-0" />
                            <span>Instant</span>
                          </a>
                          <a
                            href={g2aUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] font-bold text-accent-2 bg-surface-2 border border-line hover:border-accent-2/60 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                            title="Comprar en G2A"
                          >
                            <Coins className="size-3 shrink-0" />
                            <span>G2A</span>
                          </a>
                          <a
                            href={steamUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] font-bold text-accent bg-surface-2 border border-line hover:border-accent/60 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                            title="Ver en Steam"
                          >
                            <Gamepad2 className="size-3 shrink-0" />
                            <span>Steam</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* PAGINACIÓN TÁCTICA */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-line">
                  <p className="text-xs text-ink-faint font-mono">
                    Página {currentPage} de {totalPages} ({totalItems} resultados)
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="px-3.5 py-1.5 rounded-xl border border-line bg-surface text-xs font-bold text-ink hover:text-accent disabled:opacity-40 transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
                    >
                      <ChevronLeft className="size-4" />
                      <span>Anterior</span>
                    </button>

                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="px-3.5 py-1.5 rounded-xl border border-line bg-surface text-xs font-bold text-ink hover:text-accent disabled:opacity-40 transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
                    >
                      <span>Siguiente</span>
                      <ChevronRight className="size-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}