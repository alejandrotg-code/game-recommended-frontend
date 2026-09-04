import { useState, memo, useMemo } from 'react';
import SentimentChart from './recommendation/SentimentChart';
import TopKeyWords from './recommendation/TopKeyWords';
import ReviewList from './recommendation/ReviewList';
import { getInstantGamingUrl, getG2aUrl, getSteamStoreUrl } from '../config/affiliates';

const getVerdictConfig = (level) => {
  switch (level) {
    case 'Extremadamente Recomendado':
      return {
        bg: 'bg-emerald-500/10 border-emerald-500/30',
        text: 'text-emerald-400',
        badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        icon: '🏆',
        barColor: '#10b981',
      };
    case 'Recomendado':
      return {
        bg: 'bg-blue-500/10 border-blue-500/30',
        text: 'text-blue-400',
        badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
        icon: '👍',
        barColor: '#3b82f6',
      };
    case 'Mixto':
      return {
        bg: 'bg-amber-500/10 border-amber-500/30',
        text: 'text-amber-400',
        badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        icon: '⚖️',
        barColor: '#f59e0b',
      };
    default:
      return {
        bg: 'bg-rose-500/10 border-rose-500/30',
        text: 'text-rose-400',
        badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
        icon: '👎',
        barColor: '#f43f5e',
      };
  }
};

const SPANISH_STOPWORDS = new Set([
  'de', 'la', 'que', 'el', 'en', 'y', 'a', 'los', 'del', 'se', 'las', 'por', 'un', 'para', 'con', 'no', 'una', 'su', 'al', 'lo', 'como', 'más', 'pero', 'sus', 'este', 'le', 'ya', 'o', 'esta', 'sí', 'porque', 'muy', 'sin', 'sobre', 'también', 'me', 'mi', 'te', 'es', 'son', 'era', 'eso', 'esto', 'unos', 'unas', 'tiene', 'tienen', 'todo', 'todos', 'bien', 'bueno', 'malo', 'juego', 'juegos', 'steam', 'hace', 'hacer', 'puede', 'puedo', 'solo', 'si', 'cuando', 'estos', 'estas', 'ser', 'estar', 'ha', 'han', 'he', 'mas', 'nos', 'les', 'mis', 'tu', 'tus', 'yo', 'ella', 'ellos', 'ellas', 'nosotros', 'vosotros', 'tan', 'asi', 'entonces', 'aunque', 'sino', 'e', 'ni', 'donde', 'quien', 'cual', 'cuyo', 'bastante', 'poco', 'mucho', 'demasiado', 'nada', 'algo', 'alguno', 'ninguno', 'otro', 'mismo', 'tanto', 'tal', 'cada', 'ambos', 'sendos', 'jugar', 'jugado', 'jugando', 'reseña', 'reseñas', 'opinion', 'opiniones'
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

  const reviewsClassified = useMemo(() => result?.reviews_classified || [], [result?.reviews_classified]);

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

  const instantGamingUrl = getInstantGamingUrl(gameInfo?.name, result.app_id);
  const g2aUrl = getG2aUrl(gameInfo?.name);
  const steamUrl = getSteamStoreUrl(result.app_id);

  const cfg = getVerdictConfig(recommendation_level);

  return (
    <div className="w-full space-y-5 animate-fade-up mt-2">
      {/* ── 1. CARD PRINCIPAL ── */}
      <div className={`tactical-card overflow-hidden border ${cfg.bg}`}>
        {/* Banner de Portada */}
        {gameInfo?.image ? (
          <div className="relative w-full h-36 sm:h-44 overflow-hidden border-b border-[#1b2434]">
            <img
              src={gameInfo.image}
              alt={gameInfo.name || 'Juego'}
              className="w-full h-full object-cover brightness-[0.45]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1520] via-[#0f1520]/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 flex items-end justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={gameInfo.image}
                  alt={gameInfo.name}
                  className="w-16 h-10 sm:w-20 sm:h-12 object-cover rounded-lg border border-white/20 shadow-md shrink-0"
                />
                <div>
                  <h2 className="text-base sm:text-xl font-extrabold text-white leading-tight">
                    {gameInfo?.name || 'Juego Analizado'}
                  </h2>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {gameInfo?.price && (
                      <span className="text-[10px] bg-[#080b11] text-slate-200 border border-[#1b2434] px-2 py-0.5 rounded font-semibold">
                        {gameInfo.price}
                      </span>
                    )}
                    {gameInfo?.metascore && gameInfo.metascore !== 'N/A' && (
                      <span className="text-[10px] bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
                        Metascore: {gameInfo.metascore}
                      </span>
                    )}
                    <span className="text-[10px] bg-[#080b11] text-slate-400 border border-[#1b2434] px-2 py-0.5 rounded font-mono">
                      AppID: {result.app_id}
                    </span>
                  </div>

                  {game_details && (
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5 text-[10px] text-slate-400">
                      {game_details.developer && (
                        <span>Dev: <strong className="text-slate-200">{game_details.developer}</strong></span>
                      )}
                      {game_details.release_date && (
                        <span>Fecha: <strong className="text-slate-200">{game_details.release_date}</strong></span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                <span className={`text-xs font-bold px-2.5 py-1 rounded border ${cfg.badge}`}>
                  {cfg.icon} {recommendation_level}
                </span>
                <button
                  type="button"
                  onClick={handleShareLink}
                  className="flex items-center gap-1 text-[10px] font-semibold text-slate-300 hover:text-white bg-[#080b11]/80 border border-[#1b2434] px-2.5 py-1 rounded transition-all cursor-pointer btn-tactical"
                >
                  {copied ? (
                    <span className="text-emerald-400 font-bold">¡Copiado!</span>
                  ) : (
                    <span>Compartir</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[#1b2434]">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">{gameInfo?.name || 'Juego Analizado'}</h2>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {gameInfo?.price && (
                  <span className="text-[10px] bg-[#080b11] text-slate-300 border border-[#1b2434] px-2 py-0.5 rounded font-semibold">{gameInfo.price}</span>
                )}
                <span className="text-[10px] bg-[#080b11] text-slate-400 border border-[#1b2434] px-2 py-0.5 rounded font-mono">AppID: {result.app_id}</span>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-xs font-bold px-2.5 py-1 rounded border ${cfg.badge}`}>{cfg.icon} {recommendation_level}</span>
            </div>
          </div>
        )}

        {/* Gráfico y Estadísticas */}
        <SentimentChart
          sentimentStats={sentiment_stats}
          totalReviewsAnalyzed={total_reviews_analyzed}
          positiveCount={positiveCount}
          negativeCount={negativeCount}
          steamVotedUpPct={steam_voted_up_pct}
          recommendationLevel={recommendation_level}
          verdictConfig={cfg}
        />

        {/* Conceptos Destacados */}
        <TopKeyWords
          topPositiveWords={topPositiveWords}
          topNegativeWords={topNegativeWords}
        />
      </div>

      {/* ── 2. RESEÑAS CLASIFICADAS ── */}
      <ReviewList
        reviewsClassified={reviewsClassified}
        positiveCount={positiveCount}
        negativeCount={negativeCount}
      />

      {/* ── 3. COMPARADOR DE PRECIOS ── */}
      <div className="tactical-card p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Tiendas y Precios Digitales</h4>
          <span className="text-[10px] bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-semibold">
            Enlaces Verificados
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href={instantGamingUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-3 bg-[#080b11] border border-[#1b2434] hover:border-orange-500/50 rounded-lg text-xs font-bold text-slate-200 transition-all btn-tactical group"
          >
            <div className="flex items-center gap-2">
              <span className="text-orange-400">⚡</span>
              <div>
                <div className="text-slate-100 font-bold">Instant Gaming</div>
                <div className="text-[10px] text-slate-500 font-normal">Claves de Steam</div>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-slate-500 group-hover:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          <a
            href={g2aUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-3 bg-[#080b11] border border-[#1b2434] hover:border-amber-500/50 rounded-lg text-xs font-bold text-slate-200 transition-all btn-tactical group"
          >
            <div className="flex items-center gap-2">
              <span className="text-amber-400">🟡</span>
              <div>
                <div className="text-slate-100 font-bold">G2A Marketplace</div>
                <div className="text-[10px] text-slate-500 font-normal">Ofertas Globales</div>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          <a
            href={steamUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-3 bg-[#080b11] border border-[#1b2434] hover:border-blue-500/50 rounded-lg text-xs font-bold text-slate-200 transition-all btn-tactical group"
          >
            <div className="flex items-center gap-2">
              <span className="text-blue-400">🎮</span>
              <div>
                <div className="text-slate-100 font-bold">Tienda Steam</div>
                <div className="text-[10px] text-slate-500 font-normal">Precio Oficial</div>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

      {/* ── 4. BADGE DE GITHUB ── */}
      <div className="tactical-card p-4 space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Badge Dinámico de Veredicto</h4>
        
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="bg-[#080b11] border border-[#1b2434] px-3 py-2 rounded flex items-center justify-center shrink-0">
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
              className="flex-1 bg-[#080b11] border border-[#1b2434] px-3 py-1.5 rounded text-xs font-mono text-slate-300 outline-none select-all"
            />
            <button
              onClick={() => {
                const md = `[![Steam IA](${import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL_DEV || 'http://localhost:8000'}/api/games/${result.app_id}/badge)](https://store.steampowered.com/app/${result.app_id})`;
                navigator.clipboard.writeText(md).then(() => {
                  setBadgeCopied(true);
                  setTimeout(() => setBadgeCopied(false), 2000);
                });
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer shrink-0 btn-tactical"
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