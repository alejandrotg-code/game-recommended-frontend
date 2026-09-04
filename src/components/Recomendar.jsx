import { useState, useRef, useEffect } from 'react';
import { getRagRecommendations } from '../services/steamService';
import { getInstantGamingUrl, getG2aUrl, getSteamStoreUrl } from '../config/affiliates';

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
    { text: 'Un juego de puzles y misterio con una gran banda sonora atmosférica', label: '🧩 Puzles / Misterio' }
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

  return (
    <div className="py-8 sm:py-12 animate-fade-in space-y-10">
      {/* HEADER SECCIÓN */}
      <div className="text-center relative">
        <div 
          className="blob absolute top-[-30px] left-1/2 -translate-x-1/2 w-72 h-72 opacity-20 pointer-events-none select-none"
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} 
        />
        
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/15 via-indigo-500/15 to-purple-600/15 border border-purple-500/30 text-purple-300 text-xs font-bold px-4 py-1.5 rounded-full mb-4 shadow-[0_0_20px_rgba(139,92,246,0.25)]">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span>Recomendador IA</span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
          Recomendador por <span className="gradient-text">Lenguaje Natural & Estado de Ánimo</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Escribe cómo te sientes o describe el tipo de juego que quieres jugar. La IA traducirá tu búsqueda al catálogo de Steam e IA de Groq razonará por qué cada juego es ideal para ti.
        </p>
      </div>

      {/* FORMULARIO DE BÚSQUEDA */}
      <div className="max-w-3xl mx-auto bg-[#0a1628]/60 border border-[#1e293b]/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl relative z-10 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="rag-query-input" className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>¿Qué juego o sensación buscas hoy?</span>
              <span className="text-[10px] text-purple-400 lowercase font-medium">ej: "un juego relajante para tener mi granja..."</span>
            </label>
            <div className="relative">
              <textarea
                id="rag-query-input"
                rows="3"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ej. Busco un juego para desconectar después de un día agotador, donde pueda tener mi propia granja y plantar hortalizas..."
                className="w-full bg-[#030712] border border-[#1e293b] hover:border-slate-700 focus:border-purple-500 rounded-2xl px-4 py-3.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition-all resize-none leading-relaxed shadow-inner"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
            </div>
          </div>

          {/* SELECTOR DE CANTIDAD DE RECOMENDACIONES (4, 10, 20) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-[#1e293b]/60">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Cantidad a buscar:
              </span>
              <div className="flex items-center gap-1.5 bg-[#030712] p-1 rounded-xl border border-[#1e293b]">
                {[4, 10, 20].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setTopK(num)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      topK === num
                        ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(139,92,246,0.5)]'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    {num} juegos
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            {/* Ejemplos rápidos */}
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-[11px] text-slate-500 font-semibold mr-1">Prueba con:</span>
              {ejemplos.map((ej, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleEjemploClick(ej.text)}
                  className="text-[11px] font-medium text-slate-350 bg-[#0d1e36] border border-[#1e293b] hover:border-purple-500/40 hover:text-purple-300 px-3 py-1 rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  {ej.label}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-extrabold px-7 py-3.5 rounded-xl transition-all shadow-[0_4px_20px_-4px_rgba(139,92,246,0.5)] cursor-pointer shrink-0"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Cargando recomendaciones...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Recomiéndame ({topK})</span>
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-5 bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl text-rose-400 text-xs flex gap-2.5 items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="opacity-90">{error}</p>
          </div>
        )}
      </div>

      {/* ESTADO DE CARGA */}
      {isLoading && (
        <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
          <div className="relative">
            <div className="w-14 h-14 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            <div className="absolute inset-0 w-14 h-14 border border-purple-500/20 rounded-full animate-ping opacity-30" />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-300 font-bold">Consultando Steam & Groq IA...</p>
            <p className="text-xs text-slate-500">Analizando {topK} juegos para ti...</p>
          </div>
        </div>
      )}

      {/* RESULTADO DE LA RECOMENDACIÓN RAG */}
      {!isLoading && result && (
        <div ref={resultsTopRef} className="space-y-8 max-w-5xl mx-auto animate-fade-up">
          {/* RESUMEN DE LA IA */}
          {result.summary && (
            <div className="bg-gradient-to-r from-purple-950/40 via-[#0a1628]/80 to-indigo-950/40 border border-purple-500/30 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-2">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wider">
                <span>🤖 Diagnóstico de IA</span>
              </div>
              <p className="text-slate-200 text-sm leading-relaxed font-medium">
                {result.summary}
              </p>
            </div>
          )}

          {/* LISTA DE JUEGOS RECOMENDADOS */}
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-lg font-extrabold text-slate-200 flex items-center gap-2">
                <span>Juegos Recomendados</span>
                <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-full font-bold">
                  {totalItems} Títulos
                </span>
              </h3>

              {totalPages > 1 && (
                <span className="text-xs text-slate-400 font-medium">
                  Página <strong className="text-purple-400">{currentPage}</strong> de <strong className="text-slate-200">{totalPages}</strong>
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
                    className="bg-[#0a1628]/60 border border-[#1e293b]/80 hover:border-purple-500/40 rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_8px_30px_rgba(139,92,246,0.12)] space-y-4"
                  >
                    {/* IMAGEN Y TÍTULO */}
                    <div className="flex gap-4 items-start">
                      {game.header_image ? (
                        <img 
                          src={game.header_image} 
                          alt={game.name} 
                          className="w-28 h-16 sm:w-32 sm:h-18 object-cover rounded-xl shrink-0 border border-white/10 shadow-md"
                        />
                      ) : (
                        <div className="w-28 h-16 sm:w-32 sm:h-18 bg-slate-900 rounded-xl shrink-0 flex items-center justify-center text-slate-600 text-xs font-bold">
                          Steam Game
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-extrabold text-slate-100 truncate hover:text-purple-300 transition-colors">
                          {game.name}
                        </h4>
                        <p className="text-xs font-bold text-amber-400 mt-0.5">
                          {game.price || 'Free to Play'}
                        </p>
                        {game.genres && (
                          <p className="text-[11px] text-slate-400 truncate mt-1">
                            {game.genres}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* RAZÓN DE LA IA */}
                    <div className="bg-[#030712]/80 border border-purple-500/20 rounded-2xl p-3.5 space-y-1">
                      <div className="flex items-center gap-1.5 text-purple-400 text-[11px] font-bold">
                        <span>✨ Por qué encaja contigo:</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {game.reason_ai}
                      </p>
                    </div>

                    {/* BOTONERA DE TIENDAS Y AFILIADOS */}
                    <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Comprar en:</span>
                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href={instantGamingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-600/20 to-amber-600/20 hover:from-orange-500/30 hover:to-amber-500/30 border border-orange-500/40 text-orange-300 text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm"
                          title="Buscar en Instant Gaming (Enlace de afiliado: igr=game-recommended)"
                        >
                          <span>⚡ Instant Gaming</span>
                        </a>

                        <a
                          href={g2aUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500/15 to-yellow-500/15 hover:from-amber-500/25 hover:to-yellow-500/25 border border-amber-500/30 text-amber-300 text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm"
                          title="Buscar en G2A (Enlace de afiliado: gname=gamerecommended)"
                        >
                          <span>🟡 G2A</span>
                        </a>

                        <a
                          href={steamUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 bg-[#0d1e36] hover:bg-purple-600/20 border border-[#1e293b] hover:border-purple-500/40 text-purple-300 text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                          title="Abrir página oficial de Steam"
                        >
                          <span>🎮 Steam</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CONTROLES DE PAGINACIÓN */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#1e293b]/80">
                <p className="text-xs text-slate-400">
                  Mostrando <span className="text-slate-200 font-bold">{startIndex + 1}</span> - <span className="text-slate-200 font-bold">{Math.min(startIndex + itemsPerPage, totalItems)}</span> de <span className="text-purple-400 font-bold">{totalItems}</span> recomendaciones
                </p>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-3.5 py-1.5 rounded-xl border border-[#1e293b] bg-[#0a1628] text-xs font-bold text-slate-300 hover:border-purple-500/50 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                  >
                    &larr; Anterior
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        currentPage === pageNum
                          ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_10px_rgba(139,92,246,0.4)]'
                          : 'bg-[#0a1628] border-[#1e293b] text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-3.5 py-1.5 rounded-xl border border-[#1e293b] bg-[#0a1628] text-xs font-bold text-slate-300 hover:border-purple-500/50 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                  >
                    Siguiente &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
