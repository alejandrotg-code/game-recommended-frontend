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
    <div className="py-6 sm:py-10 animate-fade-in space-y-8">
      {/* HEADER SECCIÓN */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-[#0f1520] border border-[#1b2434] text-slate-300 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-3">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <span>Búsqueda Semántica por Lenguaje Natural & IA</span>
        </div>
        
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2 text-slate-100">
          Recomendador por Estado de Ánimo
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Describe con tus propias palabras qué deseas jugar. La IA traducirá tu petición al catálogo de Steam y razonará por qué encaja contigo.
        </p>
      </div>

      {/* FORMULARIO DE BÚSQUEDA */}
      <div className="tactical-card p-5 sm:p-6 max-w-3xl mx-auto space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="rag-query-input" className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>¿Qué experiencia o sensación buscas hoy?</span>
            </label>
            <textarea
              id="rag-query-input"
              rows="3"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ej. Busco un juego para desconectar después de un día agotador, donde pueda tener mi propia granja y plantar hortalizas..."
              className="w-full bg-[#080b11] border border-[#1b2434] focus:border-blue-500 rounded-lg p-3 text-xs sm:text-sm text-slate-200 placeholder-slate-500 outline-none transition-colors resize-none leading-relaxed"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
          </div>

          {/* SELECTOR DE CANTIDAD */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#1b2434]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Recomendaciones:
              </span>
              <div className="flex items-center gap-1 bg-[#080b11] p-1 rounded border border-[#1b2434]">
                {[4, 10, 20].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setTopK(num)}
                    className={`px-2.5 py-0.5 rounded text-xs font-bold transition-all cursor-pointer ${
                      topK === num
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
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
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 disabled:bg-[#151d2c] disabled:text-slate-600 text-white text-xs font-bold px-5 py-2 rounded-lg transition-all btn-tactical cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
            >
              {isLoading ? (
                <span>Buscando juegos...</span>
              ) : (
                <span>Recomiéndame ({topK})</span>
              )}
            </button>
          </div>

          {/* EJEMPLOS RÁPIDOS */}
          <div className="flex flex-wrap gap-1.5 items-center pt-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mr-1">Ejemplos:</span>
            {ejemplos.map((ej, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleEjemploClick(ej.text)}
                className="text-[11px] font-semibold text-slate-400 bg-[#080b11] border border-[#1b2434] hover:border-blue-500/40 hover:text-blue-400 px-2.5 py-1 rounded transition-all cursor-pointer btn-tactical"
              >
                {ej.label}
              </button>
            ))}
          </div>
        </form>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-lg text-rose-400 text-xs flex gap-2 items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="opacity-90">{error}</p>
          </div>
        )}
      </div>

      {/* CARGANDO */}
      {isLoading && (
        <div className="py-10 flex flex-col items-center justify-center space-y-3 text-center">
          <div className="w-10 h-10 border-2 border-blue-600/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-300">Consultando catálogo de Steam & Groq IA...</p>
        </div>
      )}

      {/* RESULTADO RAG */}
      {!isLoading && result && (
        <div ref={resultsTopRef} className="space-y-6 max-w-4xl mx-auto animate-fade-up">
          {/* RESUMEN DE IA */}
          {result.summary && (
            <div className="tactical-card p-4 sm:p-5 space-y-1.5 border-l-4 border-l-blue-500">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">Diagnóstico del Recomendador IA</span>
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                {result.summary}
              </p>
            </div>
          )}

          {/* JUEGOS RECOMENDADOS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                Juegos Selección IA ({totalItems} Títulos)
              </h3>
              {totalPages > 1 && (
                <span className="text-xs text-slate-500 font-mono">
                  Mostrando {startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalItems)} de {totalItems} recomendaciones
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paginatedGames.map((game) => {
                const steamUrl = getSteamStoreUrl(game.app_id);
                const instantGamingUrl = getInstantGamingUrl(game.name, game.app_id);
                const g2aUrl = getG2aUrl(game.name);

                return (
                  <div 
                    key={game.app_id}
                    className="tactical-card tactical-card-interactive p-4 flex flex-col justify-between space-y-3"
                  >
                    <div className="flex gap-3 items-start">
                      {game.header_image ? (
                        <img 
                          src={game.header_image} 
                          alt={game.name} 
                          className="w-24 h-14 object-cover rounded border border-[#1b2434] shrink-0"
                        />
                      ) : (
                        <div className="w-24 h-14 bg-[#080b11] rounded shrink-0 flex items-center justify-center text-slate-500 text-xs font-bold">
                          Steam Game
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-100 truncate">
                          {game.name}
                        </h4>
                        <span className="text-xs font-semibold text-emerald-400">
                          {game.price || 'Gratis'}
                        </span>
                        {game.genres && (
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">
                            {game.genres}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="bg-[#080b11] border border-[#1b2434] rounded p-2.5 space-y-1">
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Por qué encaja:</span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {game.reason_ai}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#1b2434] flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Comprar:</span>
                      <div className="flex items-center gap-1.5">
                        <a
                          href={instantGamingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] font-bold text-orange-300 bg-[#080b11] border border-[#1b2434] hover:border-orange-500/40 px-2 py-1 rounded transition-colors"
                        >
                          ⚡ Instant Gaming
                        </a>
                        <a
                          href={g2aUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] font-bold text-amber-300 bg-[#080b11] border border-[#1b2434] hover:border-amber-500/40 px-2 py-1 rounded transition-colors"
                        >
                          🟡 G2A
                        </a>
                        <a
                          href={steamUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] font-bold text-blue-300 bg-[#080b11] border border-[#1b2434] hover:border-blue-500/40 px-2 py-1 rounded transition-colors"
                        >
                          🎮 Steam
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* PAGINACIÓN */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-[#1b2434]">
                <p className="text-xs text-slate-500 font-mono">
                  Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalItems)} de {totalItems}
                </p>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-3 py-1 rounded border border-[#1b2434] bg-[#0f1520] text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    &larr; Anterior
                  </button>

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-3 py-1 rounded border border-[#1b2434] bg-[#0f1520] text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
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
