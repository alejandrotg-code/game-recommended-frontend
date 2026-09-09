import { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  BrainCircuit,
  Compass,
  Gamepad2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
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
    { text: 'Un juego relajante para tener mi propia granja y plantar hortalizas', label: '🌾 Granja / Relajante' },
    { text: 'Un RPG de fantasía con combates por turnos y una historia profunda', label: '⚔️ RPG / Fantasía' },
    { text: 'Un shooter cooperativo espacial con mucha acción para jugar con amigos', label: '🚀 Acción / Co-op' },
    { text: 'Un juego de puzles y misterio con una gran banda sonora atmosférica', label: '🧩 Puzles / Misterio' },
    { text: 'Un juego de terror psicológico espacial tipo ciencia ficción', label: '👻 Terror / Sci-Fi' },
    { text: 'Estrategia por turnos con construcción de mazos de cartas', label: '🃏 Deckbuilding' },
  ];

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim() || query.trim().length < 3) {
      setError('Escribe al menos 3 caracteres para describir lo que buscas.');
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
        {/* HEADER SECCIÓN CON TARJETA DE FONDO */}
        <section className="py-10 px-6 sm:px-10 rounded-3xl bg-gradient-to-b from-[#111726]/90 via-[#0f1520]/80 to-[#080b11] border border-[#1e2d4a] shadow-2xl text-center space-y-4">
          <div className="inline-flex items-center gap-2.5 bg-[#080b11] border border-[#1e2d4a] text-blue-400 text-xs font-black px-4 py-2 rounded-full shadow-md">
            <Sparkles className="size-4 text-blue-400 animate-pulse" />
            <span>Búsqueda Semántica por Lenguaje Natural & IA</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Recomendador de Videojuegos por IA
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed font-normal">
            Describe con tus propias palabras qué deseas jugar. La IA traducirá tu petición al catálogo de Steam y razonará por qué encaja contigo.
          </p>
        </section>

        {/* FORMULARIO DE BÚSQUEDA */}
        <section className="bg-[#111726] p-6 sm:p-8 max-w-3xl mx-auto rounded-3xl border border-[#1e2d4a] shadow-2xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2.5">
              <label htmlFor="rag-query-input" className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <BrainCircuit className="size-4 text-blue-400" />
                <span>¿Qué experiencia o sensación buscas hoy?</span>
              </label>
              <textarea
                id="rag-query-input"
                rows="3"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ej. Busco un juego para desconectar después de un día agotador, donde pueda tener mi propia granja y plantar hortalizas..."
                className="w-full bg-[#080b11] border border-[#1e2d4a] focus:border-blue-500 rounded-2xl p-4 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all resize-none leading-relaxed shadow-inner"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
            </div>

            {/* SELECTOR DE CANTIDAD DE RESULTADOS */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#1e2d4a]">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-slate-300 uppercase tracking-wider">
                  Resultados:
                </span>
                <div className="flex items-center gap-1 bg-[#080b11] p-1 rounded-xl border border-[#1e2d4a]">
                  {[4, 10, 20].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setTopK(num)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        topK === num
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-[#182238]'
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
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 disabled:bg-[#182238] disabled:text-slate-600 text-white text-xs font-black px-6 py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-blue-900/40 active:scale-95"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Buscando juegos...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    <span>Recomiéndame ({topK})</span>
                  </>
                )}
              </button>
            </div>

            {/* EJEMPLOS RÁPIDOS */}
            <div className="flex flex-wrap gap-2.5 items-center pt-3 border-t border-[#1e2d4a]/60">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider mr-1 flex items-center gap-1">
                <Compass className="size-3.5 text-blue-400" />
                <span>Ejemplos:</span>
              </span>
              {ejemplos.map((ej, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleEjemploClick(ej.text)}
                  className="text-[11px] font-bold text-slate-200 bg-[#080b11] border border-[#1e2d4a] hover:border-blue-500 hover:text-blue-300 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer active:scale-95 shadow-sm"
                >
                  {ej.label}
                </button>
              ))}
            </div>
          </form>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-2xl text-rose-300 text-xs flex gap-3 items-start shadow-md">
              <AlertCircle className="size-5 shrink-0 text-rose-400 mt-0.5" />
              <p className="opacity-90 leading-relaxed font-medium">{error}</p>
            </div>
          )}
        </section>

        {/* CARGANDO */}
        {isLoading && (
          <div className="py-16 bg-[#111726] border border-[#1e2d4a] rounded-3xl shadow-2xl flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto">
            <Loader2 className="size-10 text-blue-400 animate-spin" />
            <p className="text-sm font-black text-white">Consultando catálogo de Steam & Groq IA...</p>
            <p className="text-xs text-slate-400">Búsqueda semántica vectorizada sobre descripciones de juegos</p>
          </div>
        )}

        {/* RESULTADO RAG */}
        {!isLoading && result && (
          <div ref={resultsTopRef} className="space-y-8 max-w-4xl mx-auto animate-fade-up">
            {/* RESUMEN DE IA EN TARJETA INDEPENDIENTE */}
            {result.summary && (
              <div className="bg-[#111726] border border-[#1e2d4a] rounded-3xl p-6 sm:p-8 space-y-3 border-l-8 border-l-blue-500 shadow-2xl">
                <span className="text-xs font-black uppercase tracking-wider text-blue-400 flex items-center gap-2">
                  <BrainCircuit className="size-4 text-blue-400" />
                  <span>Diagnóstico del Recomendador IA</span>
                </span>
                <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-normal">
                  {result.summary}
                </p>
              </div>
            )}

            {/* JUEGOS RECOMENDADOS */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#1e2d4a]">
                <h3 className="text-xs sm:text-sm font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Gamepad2 className="size-4 text-blue-400" />
                  <span>Selección IA ({totalItems} Títulos)</span>
                </h3>
                {totalPages > 1 && (
                  <span className="text-xs text-slate-400 font-mono font-medium">
                    Mostrando {startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalItems)} de {totalItems} recomendaciones
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paginatedGames.map((game) => {
                  const steamUrl = getSteamStoreUrl(game.app_id);
                  const instantGamingUrl = getInstantGamingUrl(game.name, game.app_id);
                  const g2aUrl = getG2aUrl(game.name);

                  return (
                    <div
                      key={game.app_id}
                      className="bg-[#111726] border border-[#1e2d4a] hover:border-blue-500/60 rounded-3xl p-6 flex flex-col justify-between space-y-5 transition-all shadow-xl group"
                    >
                      <div className="flex gap-4 items-start">
                        {game.header_image ? (
                          <img
                            src={game.header_image}
                            alt={game.name}
                            className="w-28 h-16 object-cover rounded-xl border border-[#1e2d4a] shrink-0 group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-28 h-16 bg-[#080b11] rounded-xl shrink-0 flex items-center justify-center text-slate-500 text-xs font-bold border border-[#1e2d4a]">
                            Steam Game
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-black text-white truncate group-hover:text-blue-300 transition-colors">
                            {game.name}
                          </h4>
                          <span className="text-xs font-bold text-emerald-400 block mt-0.5">
                            {game.price || 'Gratis'}
                          </span>
                          {game.genres && (
                            <p className="text-[11px] text-slate-400 truncate mt-1 font-medium">
                              {game.genres}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="bg-[#080b11] border border-[#1e2d4a] rounded-2xl p-4 space-y-1.5 shadow-inner">
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-wider block">
                          Por qué encaja:
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed font-normal">
                          {game.reason_ai}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#1e2d4a] flex items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Comprar:</span>
                        <div className="flex items-center gap-2">
                          <a
                            href={instantGamingUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] font-bold text-orange-300 bg-[#080b11] border border-[#1e2d4a] hover:border-orange-500/60 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1"
                          >
                            <span>⚡ Instant</span>
                          </a>
                          <a
                            href={g2aUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] font-bold text-amber-300 bg-[#080b11] border border-[#1e2d4a] hover:border-amber-500/60 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1"
                          >
                            <span>🟡 G2A</span>
                          </a>
                          <a
                            href={steamUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] font-bold text-blue-300 bg-[#080b11] border border-[#1e2d4a] hover:border-blue-500/60 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1"
                          >
                            <span>🎮 Steam</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* PAGINACIÓN */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-[#1e2d4a]">
                  <p className="text-xs text-slate-400 font-mono">
                    Página {currentPage} de {totalPages} ({totalItems} resultados)
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="px-4 py-2 rounded-xl border border-[#1e2d4a] bg-[#111726] text-xs font-bold text-slate-200 hover:text-white disabled:opacity-40 transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
                    >
                      <ChevronLeft className="size-4" />
                      <span>Anterior</span>
                    </button>

                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="px-4 py-2 rounded-xl border border-[#1e2d4a] bg-[#111726] text-xs font-bold text-slate-200 hover:text-white disabled:opacity-40 transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
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
