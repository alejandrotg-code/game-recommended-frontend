import { useState } from 'react';

// CONFIGURACIÓN DE AFILIADOS:
// Si tienes códigos de afiliado de estas tiendas, ponlos aquí entre las comillas.
// Si los dejas vacíos '', se buscarán los juegos de forma normal sin ID de afiliación.
const INSTANT_GAMING_IGR_ID = 'alejandrotg'; // Ejemplo: 'mi_codigo_igr'

// MAPEO DE ENLACES DIRECTOS A JUEGOS POPULARES:
// Como las tiendas de keys usan IDs y rutas propias para sus fichas de producto (ej: /2198-comprar-hollow-knight-pc/),
// mapeamos los juegos más habituales por su App ID de Steam para que vayan directo al producto.
// Si el juego buscado no está aquí, se usará el buscador dinámico por texto como alternativa segura.
const POPULAR_GAMES_LINKS = {
  "1245620": { // Elden Ring
    ig: "https://www.instant-gaming.com/es/4822-comprar-elden-ring-pc-juego-steam/",
  },
  "1091500": { // Cyberpunk 2077
    ig: "https://www.instant-gaming.com/es/2685-comprar-cyberpunk-2077-pc-juego-gog-com/",
  },
  "367520": { // Hollow Knight
    ig: "https://www.instant-gaming.com/es/2198-comprar-hollow-knight-pc-mac-steam/",
  },
  "620": { // Portal 2
    ig: "https://www.instant-gaming.com/es/400-comprar-portal-2-pc-mac-steam/",
  },
  "292030": { // The Witcher 3: Wild Hunt
    ig: "https://www.instant-gaming.com/es/290-comprar-the-witcher-3-wild-hunt-pc-juego-gog-com/",
  },
  "413150": { // Stardew Valley
    ig: "https://www.instant-gaming.com/es/2179-comprar-stardew-valley-pc-mac-steam/",
  }
};

/**
 * Componente para mostrar el resultado detallado del análisis del juego.
 * 
 * @param {Object} props
 * @param {Object} props.result El objeto con los resultados devueltos por el backend (/api/analyze/{id})
 * @param {Object} props.gameInfo El objeto con la información básica del juego (nombre, imagen, etc.) obtenida de la búsqueda
 */
export default function RecommendationCard({ result, gameInfo }) {
  // Estado para controlar qué pestaña de reseñas mostrar
  // Opciones: 'all' (todas), 'positives' (positivas), 'negatives' (negativas)
  const [activeTab, setActiveTab] = useState('all');

  // Si no hay datos del análisis, no renderizamos nada
  if (!result) return null;

  const {
    total_reviews_analyzed,
    recommendation_level,
    sentiment_stats,
    steam_voted_up_pct,
    reviews_classified = []
  } = result;

  // Comprobamos si el juego analizado tiene ficha directa mapeada
  const appIdStr = String(result.app_id);
  const popularLinks = POPULAR_GAMES_LINKS[appIdStr];

  // Generación de URL para Instant Gaming
  let instantGamingUrl = '';
  if (popularLinks?.ig) {
    // Si tenemos la ficha directa, usamos "?" para concatenar el afiliado
    instantGamingUrl = `${popularLinks.ig}${INSTANT_GAMING_IGR_ID ? `?igr=${INSTANT_GAMING_IGR_ID}` : ''}`;
  } else {
    // Si no, usamos el buscador por nombre de juego (usando "&" porque ya tiene parámetros)
    instantGamingUrl = `https://www.instant-gaming.com/es/busquedas/?query=${encodeURIComponent(gameInfo?.name || '')}${INSTANT_GAMING_IGR_ID ? `&igr=${INSTANT_GAMING_IGR_ID}` : ''}`;
  }

  // Filtrar reseñas según la pestaña seleccionada
  const filteredReviews = reviews_classified.filter((review) => {
    if (activeTab === 'positives') return review.sentiment_predicted === 'Positivo';
    if (activeTab === 'negatives') return review.sentiment_predicted === 'Negativo';
    return true; // Si es 'all', muestra todas
  });

  // Contar cuántas reseñas son positivas y negativas en nuestro listado clasificado
  const positiveCount = reviews_classified.filter(r => r.sentiment_predicted === 'Positivo').length;
  const negativeCount = reviews_classified.filter(r => r.sentiment_predicted === 'Negativo').length;

  // Determinar colores y estilos según el nivel de recomendación para darle un toque premium y dinámico
  const getVerdictStyles = (level) => {
    switch (level) {
      case 'Extremadamente Recomendado':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30',
          text: 'text-emerald-400',
          glow: 'shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
        };
      case 'Recomendado':
        return {
          bg: 'bg-blue-500/10 border-blue-500/30',
          text: 'text-blue-400',
          glow: 'shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]',
          badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40'
        };
      case 'Mixto':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30',
          text: 'text-amber-400',
          glow: 'shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
        };
      case 'No Recomendado':
      default:
        return {
          bg: 'bg-rose-500/10 border-rose-500/30',
          text: 'text-rose-400',
          glow: 'shadow-[0_0_30px_-5px_rgba(244,63,94,0.3)]',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
        };
    }
  };

  const styles = getVerdictStyles(recommendation_level);

  return (
    <div className="w-full space-y-8 animate-fade-in mt-10">

      {/* 1. CARD PRINCIPAL DEL VEREDICTO */}
      <div className={`w-full bg-brand-card/80 border p-6 rounded-2xl ${styles.bg} ${styles.glow} transition-all duration-300`}>

        {/* Encabezado con imagen del juego y título */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border-b border-brand-border/60 pb-6">
          <div className="flex items-center gap-4">
            {gameInfo?.image && (
              <img
                src={gameInfo.image}
                alt={gameInfo.name || "Juego"}
                className="w-24 h-12 object-cover rounded-lg border border-brand-border shadow-sm shrink-0"
              />
            )}
            <div>
              <h2 className="text-2xl font-bold text-slate-50">{gameInfo?.name || "Juego Analizado"}</h2>
              <div className="flex flex-wrap gap-2 mt-1">
                {gameInfo?.price && (
                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                    {gameInfo.price}
                  </span>
                )}
                {gameInfo?.metascore && gameInfo.metascore !== "N/A" && (
                  <span className="text-xs bg-yellow-600/20 text-yellow-400 px-2 py-0.5 rounded border border-yellow-500/30">
                    Metascore: {gameInfo.metascore}
                  </span>
                )}
                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                  ID: {result.app_id}
                </span>
              </div>
            </div>
          </div>

          {/* Gran indicador de nivel de recomendación */}
          <div className="text-right flex flex-col items-end">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Veredicto IA</span>
            <span className={`text-xl md:text-2xl font-extrabold ${styles.text} mt-1`}>
              {recommendation_level}
            </span>
          </div>
        </div>

        {/* 2. ANÁLISIS DE SENTIMIENTO CON PORCENTAJES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">

          {/* Columna Izquierda: Gráfico de barras de aprobación */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Aprobación de Reseñas en Español</h3>

            {/* Barra de Sentimiento de la IA */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-medium">Clasificación IA:</span>
                <span className="font-bold text-emerald-400">{sentiment_stats.positives_pct}% Positivo</span>
              </div>

              {/* Contenedor de la barra */}
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden flex border border-brand-border">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000"
                  style={{ width: `${sentiment_stats.positives_pct}%` }}
                />
                <div
                  className="h-full bg-rose-500 transition-all duration-1000"
                  style={{ width: `${sentiment_stats.negatives_pct}%` }}
                />
              </div>
            </div>

            {/* Comparación con votos nativos de Steam */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-medium">Recomendación Directa en Steam (Votado útil):</span>
                <span className="font-bold text-blue-400">{steam_voted_up_pct}% Sí</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-brand-border">
                <div
                  className="h-full bg-blue-500 transition-all duration-1000"
                  style={{ width: `${steam_voted_up_pct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Columna Derecha: Estadísticas rápidas */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-950/40 p-4 rounded-xl border border-brand-border flex flex-col justify-center items-center text-center">
              <span className="text-2xl md:text-3xl font-extrabold text-slate-200">{total_reviews_analyzed}</span>
              <span className="text-[10px] md:text-xs text-slate-400 font-medium mt-1">Reseñas Analizadas</span>
            </div>
            <div className="bg-slate-950/40 p-4 rounded-xl border border-brand-border flex flex-col justify-center items-center text-center">
              <span className="text-2xl md:text-3xl font-extrabold text-emerald-400">{positiveCount}</span>
              <span className="text-[10px] md:text-xs text-slate-400 font-medium mt-1">Clasificadas Positivas</span>
            </div>
            <div className="bg-slate-950/40 p-4 rounded-xl border border-brand-border flex flex-col justify-center items-center text-center">
              <span className="text-2xl md:text-3xl font-extrabold text-rose-400">{negativeCount}</span>
              <span className="text-[10px] md:text-xs text-slate-400 font-medium mt-1">Clasificadas Negativas</span>
            </div>
          </div>

        </div>

        {/* Resumen explicativo según los porcentajes */}
        <div className="bg-slate-950/30 border border-brand-border/40 p-4 rounded-xl mt-6 text-sm text-slate-300">
          <p className="leading-relaxed">
            <strong className="text-slate-100">Resumen del Análisis de Sentimiento:</strong> Nuestro modelo de inteligencia artificial ha leído y procesado individualmente las últimas reseñas escritas por usuarios hispanohablantes. Tras evaluar la semántica del texto de cada opinión (ignorando si marcaron el botón de 'Recomendar' nativo), determinamos que las opiniones son mayoritariamente <span className={styles.text}>{sentiment_stats.positives_pct >= 50 ? 'favorables' : 'críticas'}</span>, resultando en una recomendación de nivel <span className={`font-semibold ${styles.text}`}>{recommendation_level}</span>.
          </p>
        </div>

      </div>

      {/* 3. LISTADO DE RESEÑAS CLASIFICADAS INDIVIDUALES */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>Reseñas clasificadas por la IA</span>
            <span className="text-xs font-semibold px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full">
              {filteredReviews.length} mostradas
            </span>
          </h3>

          {/* Pestañas de filtrado (All, Positivas, Negativas) */}
          <div className="flex bg-slate-900/80 p-1 rounded-lg border border-brand-border text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${activeTab === 'all' ? 'bg-brand-accent text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Todas ({reviews_classified.length})
            </button>
            <button
              onClick={() => setActiveTab('positives')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${activeTab === 'positives' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200 border border-transparent'}`}
            >
              Positivas ({positiveCount})
            </button>
            <button
              onClick={() => setActiveTab('negatives')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${activeTab === 'negatives' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'text-slate-400 hover:text-slate-200 border border-transparent'}`}
            >
              Negativas ({negativeCount})
            </button>
          </div>
        </div>

        {/* Contenedor con scroll para las reseñas */}
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/20 rounded-xl border border-brand-border/60 text-slate-500">
              No hay reseñas que coincidan con esta categoría en la muestra analizada.
            </div>
          ) : (
            filteredReviews.map((review, index) => {
              const hoursPlayed = Math.round(review.playtime_forever / 60);
              const isPositive = review.sentiment_predicted === 'Positivo';

              return (
                <div
                  key={review.recommendation_id || index}
                  className="bg-brand-card/40 border border-brand-border/60 p-5 rounded-xl hover:border-brand-border transition-all space-y-3 relative overflow-hidden"
                >
                  {/* Pequeña línea decorativa lateral según clasificación */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`} />

                  {/* Fila del autor e información */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-300">{review.author}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">{hoursPlayed} hrs de juego</span>
                    </div>

                    {/* Insignias de clasificación */}
                    <div className="flex items-center gap-2">
                      {/* Voto nativo de Steam */}
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${review.voted_up_steam
                        ? 'bg-blue-950/40 text-blue-400 border-blue-500/20'
                        : 'bg-slate-900/60 text-slate-500 border-slate-800'
                        }`}>
                        Steam: {review.voted_up_steam ? '👍 Recomienda' : '👎 No Recomienda'}
                      </span>

                      {/* Clasificación de nuestra IA */}
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${isPositive
                        ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20'
                        : 'bg-rose-950/40 text-rose-400 border-rose-500/20'
                        }`}>
                        IA: {review.sentiment_predicted}
                      </span>
                    </div>
                  </div>

                  {/* Contenido de la reseña */}
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line italic font-sans font-light">
                    "{review.review_text}"
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 4. COMPARADOR DE PRECIOS Y ENLACES (Monetización / Utilidad real) */}
      <div className="bg-brand-card/50 border border-brand-border/80 p-6 rounded-2xl space-y-4">
        <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <span>🛒 ¿Interesado en jugarlo? Encuentra el mejor precio</span>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-normal normal-case">
            Enlaces de búsqueda dinámicos
          </span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Botón Instant Gaming */}
          <a
            href={instantGamingUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-3.5 bg-[#ff5400]/10 hover:bg-[#ff5400]/20 text-[#ff8340] border border-[#ff5400]/20 hover:border-[#ff5400]/40 rounded-xl font-bold text-xs transition-all active:scale-98 group"
          >
            <div className="flex items-center gap-2">
              <span className="text-base group-hover:scale-110 transition-transform">🔥</span>
              <span>Instant Gaming</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#ff8340]/60 group-hover:text-[#ff8340] group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          {/* Botón G2A */}
          <a
            href="https://www.g2a.com/n/gamerecommended"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-3.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 hover:border-amber-500/40 rounded-xl font-bold text-xs transition-all active:scale-98 group"
          >
            <div className="flex items-center gap-2">
              <span className="text-base group-hover:scale-110 transition-transform">🎮</span>
              <span>G2A (Ofertas)</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-amber-400/60 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          {/* Botón Steam (Oficial) */}
          <a
            href={`https://store.steampowered.com/app/${result.app_id}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-3.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 hover:border-blue-500/40 rounded-xl font-bold text-xs transition-all active:scale-98 group"
          >
            <div className="flex items-center gap-2">
              <span className="text-base group-hover:scale-110 transition-transform">⚓</span>
              <span>Tienda Steam</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-400/60 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div> {/* Cierra el grid de botones de tiendas */}

        {/* Banner explicativo de afiliación (Ética y valor añadido en portfolio) */}
        <div className="bg-slate-950/20 border border-brand-border/30 rounded-xl p-3 text-[10px] text-slate-400 text-center leading-relaxed flex items-center justify-center gap-2 max-w-xl mx-auto mt-2">
          <span>💡</span>
          <p>
            Al usar los enlaces de afiliado apoyas el mantenimiento de esta plataforma de IA sin coste adicional. ¡Además, registrarte o comprar a través de <strong>Instant Gaming</strong> o <strong>G2A</strong> te otorga descuentos en tus compras!
          </p>
        </div>
      </div> {/* Cierra el comparador de precios */}
    </div>
  );
}
