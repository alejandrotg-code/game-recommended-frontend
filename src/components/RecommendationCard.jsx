import { useState, memo, useMemo } from 'react';
import SentimentChart from './recommendation/SentimentChart';
import TopKeyWords from './recommendation/TopKeyWords';
import ReviewList from './recommendation/ReviewList';

const INSTANT_GAMING_IGR_ID = 'game-recommended';

const POPULAR_GAMES_LINKS = {
  '1245620': { ig: 'https://www.instant-gaming.com/es/4822-comprar-elden-ring-pc-juego-steam/' },
  '1091500': { ig: 'https://www.instant-gaming.com/es/2685-comprar-cyberpunk-2077-pc-juego-gog-com/' },
  '367520':  { ig: 'https://www.instant-gaming.com/es/2198-comprar-hollow-knight-pc-mac-steam/' },
  '620':     { ig: 'https://www.instant-gaming.com/es/400-comprar-portal-2-pc-mac-steam/' },
  '292030':  { ig: 'https://www.instant-gaming.com/es/290-comprar-the-witcher-3-wild-hunt-pc-juego-gog-com/' },
  '413150':  { ig: 'https://www.instant-gaming.com/es/2179-comprar-stardew-valley-pc-mac-steam/' },
};

const getVerdictConfig = (level) => {
  switch (level) {
    case 'Extremadamente Recomendado':
      return {
        bg: 'bg-emerald-500/8 border-emerald-500/25',
        text: 'text-emerald-400',
        glow: 'shadow-[0_0_60px_-10px_rgba(16,185,129,0.3)]',
        badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        icon: '🏆',
        barColor: '#10b981',
      };
    case 'Recomendado':
      return {
        bg: 'bg-blue-500/8 border-blue-500/25',
        text: 'text-blue-400',
        glow: 'shadow-[0_0_60px_-10px_rgba(59,130,246,0.3)]',
        badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
        icon: '👍',
        barColor: '#3b82f6',
      };
    case 'Mixto':
      return {
        bg: 'bg-amber-500/8 border-amber-500/25',
        text: 'text-amber-400',
        glow: 'shadow-[0_0_60px_-10px_rgba(245,158,11,0.25)]',
        badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        icon: '⚖️',
        barColor: '#f59e0b',
      };
    default:
      return {
        bg: 'bg-rose-500/8 border-rose-500/25',
        text: 'text-rose-400',
        glow: 'shadow-[0_0_60px_-10px_rgba(244,63,94,0.3)]',
        badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
        icon: '👎',
        barColor: '#f43f5e',
      };
  }
};

const SPANISH_STOPWORDS = new Set([
  'de', 'la', 'que', 'el', 'en', 'y', 'a', 'los', 'del', 'se', 'las', 'por', 'un', 'para', 'con', 'no', 'una', 'su', 'al', 'lo', 'como', 'más', 'pero', 'sus', 'este', 'le', 'ya', 'o', 'esta', 'sí', 'porque', 'muy', 'sin', 'sobre', 'también', 'me', 'mi', 'te', 'es', 'son', 'era', 'esta', 'eso', 'esto', 'esta', 'un', 'una', 'unos', 'unas', 'tiene', 'tienen', 'todo', 'todos', 'bien', 'bueno', 'malo', 'juego', 'juegos', 'steam', 'hace', 'hacer', 'puede', 'puedo', 'solo', 'si', 'cuando', 'este', 'esta', 'estos', 'estas', 'ser', 'estar', 'ha', 'han', 'he', 'mas', 'muy', 'nos', 'lo', 'le', 'les', 'por', 'sus', 'para', 'una', 'uno', 'unas', 'unos', 'del', 'al', 'lo', 'la', 'las', 'los', 'un', 'en', 'es', 'mi', 'mis', 'tu', 'tus', 'yo', 'el', 'ella', 'ellos', 'ellas', 'nosotros', 'vosotros', 'como', 'con', 'sin', 'muy', 'tan', 'asi', 'entonces', 'pero', 'porque', 'aunque', 'sino', 'o', 'y', 'e', 'ni', 'que', 'donde', 'cuando', 'como', 'quien', 'cual', 'cuyo', 'donde', 'muy', 'bastante', 'poco', 'mucho', 'demasiado', 'nada', 'todo', 'algo', 'alguno', 'ninguno', 'otro', 'mismo', 'tanto', 'tal', 'cual', 'cada', 'ambos', 'sendos', 'juego', 'jugar', 'jugado', 'jugando', 'reseña', 'reseñas', 'opinion', 'opiniones', 'mas', 'si', 'esta', 'este', 'para', 'como', 'pero', 'bien', 'muy', 'solo', 'hace', 'puede', 'tiene'
]);

function getTopWords(reviews, sentiment, limit = 8) {
  const counts = {};
  const regex = /[a-zA-ZáéíóúÁÉÍÓÚñÑ]+/g;
  
  reviews
    .filter(r => r.sentiment_predicted === sentiment)
    .forEach(r => {
      const text = r.review_text.toLowerCase();
      let match;
      while ((match = regex.exec(text)) !== null) {
        const word = match[0];
        if (word.length > 3 && !SPANISH_STOPWORDS.has(word)) {
          counts[word] = (counts[word] || 0) + 1;
        }
      }
    });

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word, count]) => ({ word, count }));
}

const RecommendationCard = memo(function RecommendationCard({ result, gameInfo }) {
  const [copied, setCopied] = useState(false);
  const [badgeCopied, setBadgeCopied] = useState(false);

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const reviewsClassified = result?.reviews_classified || [];

  const topPositiveWords = useMemo(() => getTopWords(reviewsClassified, 'Positivo', 10), [reviewsClassified]);
  const topNegativeWords = useMemo(() => getTopWords(reviewsClassified, 'Negativo', 10), [reviewsClassified]);

  const positiveCount = useMemo(() => reviewsClassified.filter(r => r.sentiment_predicted === 'Positivo').length, [reviewsClassified]);
  const negativeCount = useMemo(() => reviewsClassified.filter(r => r.sentiment_predicted === 'Negativo').length, [reviewsClassified]);

  if (!result) return null;

  const {
    total_reviews_analyzed,
    recommendation_level,
    sentiment_stats,
    steam_voted_up_pct,
    game_details = {}
  } = result;

  const appIdStr = String(result.app_id);
  const popularLinks = POPULAR_GAMES_LINKS[appIdStr];
  const instantGamingUrl = popularLinks?.ig
    ? `${popularLinks.ig}?igr=${INSTANT_GAMING_IGR_ID}`
    : `https://www.instant-gaming.com/es/busquedas/?query=${encodeURIComponent(gameInfo?.name || '')}&igr=${INSTANT_GAMING_IGR_ID}`;

  const cfg = getVerdictConfig(recommendation_level);

  return (
    <div className="w-full space-y-5 sm:space-y-6 animate-fade-up mt-4">
      {/* ── 1. CARD PRINCIPAL ── */}
      <div className={`w-full bg-[#0a1628]/80 border rounded-2xl sm:rounded-3xl overflow-hidden ${cfg.bg} ${cfg.glow} transition-all duration-300`}>
        {/* Banner de Portada */}
        {gameInfo?.image ? (
          <div className="relative w-full h-32 sm:h-44 overflow-hidden">
            <img
              src={gameInfo.image}
              alt={gameInfo.name || 'Juego'}
              className="w-full h-full object-cover scale-105"
              style={{ filter: 'blur(1px) brightness(0.5)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 flex items-end justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={gameInfo.image}
                  alt={gameInfo.name}
                  className="w-16 h-10 sm:w-20 sm:h-12 object-cover rounded-xl border-2 border-white/20 shadow-xl shrink-0"
                />
                <div>
                  <h2 className="text-lg sm:text-2xl font-extrabold text-white drop-shadow-lg leading-tight">
                    {gameInfo?.name || 'Juego Analizado'}
                  </h2>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {gameInfo?.price && (
                      <span className="text-[10px] bg-black/40 text-slate-200 border border-white/10 px-2 py-0.5 rounded-md font-semibold backdrop-blur-sm">
                        {gameInfo.price}
                      </span>
                    )}
                    {gameInfo?.metascore && gameInfo.metascore !== 'N/A' && (
                      <span className="text-[10px] bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-2 py-0.5 rounded-md font-semibold backdrop-blur-sm">
                        Metascore: {gameInfo.metascore}
                      </span>
                    )}
                    <span className="text-[10px] bg-black/40 text-slate-400 border border-white/10 px-2 py-0.5 rounded-md font-mono backdrop-blur-sm">
                      ID: {result.app_id}
                    </span>
                  </div>

                  {game_details && (
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[10px] text-slate-400">
                      {game_details.developer && (
                        <span>Desarrollador: <strong className="text-slate-200">{game_details.developer}</strong></span>
                      )}
                      {game_details.release_date && (
                        <span>Lanzamiento: <strong className="text-slate-200">{game_details.release_date}</strong></span>
                      )}
                    </div>
                  )}

                  {game_details?.genres && game_details.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {game_details.genres.map(g => (
                        <span key={g} className="text-[8px] bg-white/5 border border-white/10 text-slate-300 px-1.5 py-0.5 rounded-md font-medium tracking-wide">
                          {g.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0 flex flex-col items-end gap-2">
                <div className="text-2xl">{cfg.icon}</div>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${cfg.badge}`}>
                  {recommendation_level}
                </span>
                <button
                  type="button"
                  onClick={handleShareLink}
                  className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 hover:text-slate-100 bg-black/30 hover:bg-black/50 border border-white/10 hover:border-white/20 px-2.5 py-1.5 rounded-xl transition-all backdrop-blur-sm cursor-pointer"
                >
                  {copied ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="size-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-emerald-400">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Compartir
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 sm:p-6 flex items-center justify-between border-b border-white/5">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">{gameInfo?.name || 'Juego Analizado'}</h2>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {gameInfo?.price && (
                  <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-md font-semibold">{gameInfo.price}</span>
                )}
                <span className="text-[10px] bg-slate-800 text-slate-500 border border-slate-700 px-2 py-0.5 rounded-md font-mono">ID: {result.app_id}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl mb-1">{cfg.icon}</div>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${cfg.badge}`}>{recommendation_level}</span>
            </div>
          </div>
        )}

        {/* Componente Gráfico y Estadísticas */}
        <SentimentChart
          sentimentStats={sentiment_stats}
          totalReviewsAnalyzed={total_reviews_analyzed}
          positiveCount={positiveCount}
          negativeCount={negativeCount}
          steamVotedUpPct={steam_voted_up_pct}
          recommendationLevel={recommendation_level}
          verdictConfig={cfg}
        />

        {/* Componente Conceptos Destacados */}
        <TopKeyWords
          topPositiveWords={topPositiveWords}
          topNegativeWords={topNegativeWords}
        />
      </div>

      {/* ── 2. RESEÑAS CLASIFICADAS ── */}
      <ReviewList
        reviewsClassified={reviews_classified}
        positiveCount={positiveCount}
        negativeCount={negativeCount}
      />

      {/* ── 3. COMPARADOR DE PRECIOS ── */}
      <div className="bg-[#0a1628]/60 border border-[#1e293b]/80 p-5 sm:p-6 rounded-2xl sm:rounded-3xl space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-base">🛒</span>
          <h4 className="text-sm font-bold text-slate-200">¿Interesado? Encuentra el mejor precio</h4>
          <span className="ml-auto text-[10px] bg-[#1e293b] text-slate-500 px-2 py-0.5 rounded-full font-medium">
            Afiliado
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href={instantGamingUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-3.5 bg-[#ff5400]/8 hover:bg-[#ff5400]/15 text-[#ff8340] border border-[#ff5400]/20 hover:border-[#ff5400]/40 rounded-xl font-bold text-xs transition-all active:scale-98 group"
          >
            <div className="flex items-center gap-2">
              <span className="text-base group-hover:scale-110 transition-transform">🔥</span>
              <div>
                <div>Instant Gaming</div>
                <div className="text-[9px] text-[#ff8340]/60 font-normal">Mejor precio</div>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          <a
            href="https://www.g2a.com/n/gamerecommended"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-3.5 bg-amber-500/8 hover:bg-amber-500/15 text-amber-400 border border-amber-500/20 hover:border-amber-500/40 rounded-xl font-bold text-xs transition-all active:scale-98 group"
          >
            <div className="flex items-center gap-2">
              <span className="text-base group-hover:scale-110 transition-transform">🎮</span>
              <div>
                <div>G2A</div>
                <div className="text-[9px] text-amber-400/60 font-normal">Ofertas y descuentos</div>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          <a
            href={`https://store.steampowered.com/app/${result.app_id}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-3.5 bg-blue-600/8 hover:bg-blue-600/15 text-blue-400 border border-blue-500/20 hover:border-blue-500/40 rounded-xl font-bold text-xs transition-all active:scale-98 group"
          >
            <div className="flex items-center gap-2">
              <span className="text-base group-hover:scale-110 transition-transform">⚓</span>
              <div>
                <div>Tienda Steam</div>
                <div className="text-[9px] text-blue-400/60 font-normal">Precio oficial</div>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        <p className="text-[10px] text-slate-600 text-center leading-relaxed">
          💡 Al usar estos enlaces de afiliado apoyas el mantenimiento de la plataforma sin coste adicional. ¡Gracias!
        </p>
      </div>

      {/* ── 4. BADGE DE GITHUB ── */}
      <div className="bg-[#0a1628]/60 border border-[#1e293b]/80 p-5 sm:p-6 rounded-2xl sm:rounded-3xl space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-base">🛡️</span>
          <h4 className="text-sm font-bold text-slate-200">Embeber Badge en tu GitHub</h4>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="bg-[#030712] border border-[#1e293b]/60 px-4 py-3.5 rounded-xl flex items-center justify-center shrink-0">
            <img
              src={`${import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL_DEV || 'http://localhost:8000'}/api/games/${result.app_id}/badge`}
              alt="Steam IA Badge"
              className="h-5"
            />
          </div>

          <div className="flex-1 w-full flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              readOnly
              value={`[![Steam IA](${import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL_DEV || 'http://localhost:8000'}/api/games/${result.app_id}/badge)](https://store.steampowered.com/app/${result.app_id})`}
              className="flex-1 bg-slate-950/60 border border-[#1e293b] px-3 py-2 rounded-xl text-xs font-mono text-slate-300 outline-none select-all"
            />
            <button
              onClick={() => {
                const md = `[![Steam IA](${import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL_DEV || 'http://localhost:8000'}/api/games/${result.app_id}/badge)](https://store.steampowered.com/app/${result.app_id})`;
                navigator.clipboard.writeText(md).then(() => {
                  setBadgeCopied(true);
                  setTimeout(() => setBadgeCopied(false), 2000);
                });
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0"
            >
              {badgeCopied ? '¡Copiado!' : 'Copiar Markdown'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default RecommendationCard;