import { useState, useRef, useEffect } from 'react';
import { getRecommendations } from '../services/steamService';

export default function Recomendar() {
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const abortRef = useRef(null);

  const ejemplos = [
    { text: 'un guerrero con espada que explora cuevas y lucha contra dragones', label: 'Rol / Fantasía' },
    { text: 'quiero plantar hortalizas y cuidar animales en un campo tranquilo', label: 'Simulador / Relajante' },
    { text: 'un juego de guerra en primera persona de apuntar y disparar con fusiles', label: 'Acción / Shooter' },
  ];

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!description.trim() || description.trim().length < 3) {
      setError('La descripción debe tener al menos 3 caracteres.');
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await getRecommendations(description, controller.signal);
      setResult(data);
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('Error al obtener recomendaciones:', err);
      setError(err.message || 'Error al conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEjemploClick = (text) => {
    setDescription(text);
  };

  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  return (
    <div className="py-8 sm:py-12 animate-fade-in space-y-12">
      {/* HEADER SECCIÓN */}
      <div className="text-center relative">
        <div className="blob absolute top-[-30px] left-1/2 -translate-x-1/2 w-64 h-64 opacity-15 pointer-events-none select-none"
          style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }} />
        
        <div className="inline-flex items-center gap-2 bg-purple-600/10 border border-purple-500/20 text-purple-400 text-[11px] font-semibold px-3 py-1.5 rounded-full mb-4">
          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
          Modelo Keras Multi-etiqueta Activo
        </div>
        
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
          Recomendador de Juegos por <span className="gradient-text">Descripción</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
          Escribe detalladamente qué tipo de experiencia buscas y nuestra red neuronal de Keras identificará el género predominante para recomendarte los mejores títulos en Steam.
        </p>
      </div>

      {/* FORMULARIO DE BÚSQUEDA */}
      <div className="max-w-2xl mx-auto bg-[#0a1628]/45 border border-[#1e293b]/70 rounded-3xl p-6 sm:p-8 backdrop-blur-xl relative z-10">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="description-input" className="text-xs font-bold uppercase tracking-wider text-slate-400">
              ¿Qué juego quieres jugar hoy?
            </label>
            <div className="relative">
              <textarea
                id="description-input"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej. Un juego de naves espaciales con exploración interestelar, combates tácticos en 3D y comercio en mundos alienígenas..."
                className="w-full bg-[#030712] border border-[#1e293b] hover:border-slate-750 focus:border-blue-500 rounded-2xl px-4 py-3 text-sm text-slate-200 placeholder-slate-650 focus:outline-none transition-all resize-none leading-relaxed"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            {/* Ejemplos rápidos */}
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-[11px] text-slate-500 font-semibold mr-1">Sugerencias:</span>
              {ejemplos.map((ej, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleEjemploClick(ej.text)}
                  className="text-[10px] font-bold text-slate-400 bg-[#0d1e36] border border-[#1e293b] hover:border-purple-500/30 hover:text-purple-400 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                >
                  {ej.label}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading || !description.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-extrabold px-6 py-3 rounded-xl transition-all shadow-[0_4px_16px_-4px_rgba(37,99,235,0.4)] cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Clasificando...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Recomendar
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-5 bg-rose-500/8 border border-rose-500/20 p-4 rounded-xl text-rose-450 text-xs flex gap-2.5 items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="opacity-90">{error}</p>
          </div>
        )}
      </div>

      {/* CARGANDO */}
      {isLoading && (
        <div className="py-12 flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            <div className="absolute w-12 h-12 border border-purple-500/10 rounded-full animate-ping opacity-35" />
          </div>
          <p className="text-xs text-slate-500 font-medium">Ejecutando predicción y consultando catálogo de Steam...</p>
        </div>
      )}

      {/* RESULTADO DE LA PREDICCIÓN Y JUEGOS */}
      {!isLoading && result && (
        <div className="space-y-8 animate-fade-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* PANEL DE PROBABILIDADES */}
            <div className="md:col-span-1 bg-[#0a1628]/45 border border-[#1e293b]/70 rounded-3xl p-6 space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Predicción del Modelo
                </h3>
                <p className="text-[11px] text-slate-500">Probabilidad estimada por cada clase</p>
              </div>

              <div className="space-y-4">
                {result.predictions.map((p, index) => {
                  const isTop = p.genre === result.top_genre;
                  return (
                    <div key={p.genre} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className={isTop ? 'text-purple-400 font-bold' : 'text-slate-350'}>
                          {p.genre} {isTop && '✨'}
                        </span>
                        <span className={isTop ? 'text-purple-400 font-black' : 'text-slate-500'}>
                          {p.probability.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-[#030712] rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${
                            isTop ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-slate-800'
                          }`}
                          style={{ width: `${p.probability}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECCIÓN JUEGOS RECOMENDADOS */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-200">
                    Juegos de <span className="text-purple-400">{result.top_genre}</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Género principal predicho con {result.top_probability.toFixed(1)}% de coincidencia
                  </p>
                </div>
                <span className="text-[10px] bg-blue-600/10 border border-blue-500/20 text-blue-400 font-bold px-2.5 py-1 rounded-full uppercase">
                  {result.steam_games.length} Juegos
                </span>
              </div>

              {result.steam_games.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-[#1e293b]/70 rounded-3xl bg-white/[0.01]">
                  <p className="text-xs text-slate-500">No se encontraron juegos para este género en este momento.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {result.steam_games.map((game) => (
                    <a
                      key={game.id}
                      href={`https://store.steampowered.com/app/${game.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex gap-4 bg-[#0a1628]/45 border border-[#1e293b]/60 hover:border-purple-500/35 hover:bg-[#0d1d35]/65 p-4 rounded-2xl transition-all duration-300 shadow-sm"
                    >
                      {game.image ? (
                        <img
                          src={game.image}
                          alt={game.name}
                          className="w-24 h-12 sm:w-28 sm:h-14 object-cover rounded-lg shrink-0 border border-white/[0.04] group-hover:scale-[1.03] transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-24 h-12 sm:w-28 sm:h-14 bg-slate-900 rounded-lg shrink-0 flex items-center justify-center text-slate-700 text-[10px]">
                          Sin Imagen
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-white truncate transition-colors">
                            {game.name}
                          </h4>
                          <p className="text-[10px] text-slate-500 mt-1">{game.price}</p>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] text-slate-500 uppercase font-semibold">Score:</span>
                            <span className={`text-[10px] font-bold ${
                              game.metascore && game.metascore !== 'N/A' && game.metascore >= 80 
                                ? 'text-emerald-400' 
                                : game.metascore && game.metascore !== 'N/A' && game.metascore >= 60 
                                ? 'text-yellow-400' 
                                : 'text-slate-400'
                            }`}>
                              {game.metascore || 'N/A'}
                            </span>
                          </div>
                          <span className="text-[10px] text-purple-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                            Tienda
                            <svg xmlns="http://www.w3.org/2000/svg" className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
