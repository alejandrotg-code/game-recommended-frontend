import { useState, memo, useMemo } from 'react';
import {
  Trophy,
  ThumbsUp,
  Scale,
  ThumbsDown,
  ExternalLink,
  ChevronRight,
  BarChart3,
  Cpu,
  Flame,
  Zap,
  Coins,
  Gamepad2,
} from 'lucide-react';
import SentimentChart from './recommendation/SentimentChart';
import TopKeyWords from './recommendation/TopKeyWords';
import ReviewList from './recommendation/ReviewList';
import GroqSummaryCard from './recommendation/GroqSummaryCard';
import { getInstantGamingUrl, getG2aUrl, getSteamStoreUrl } from '../config/affiliates';

const getVerdictConfig = (level) => {
  switch (level) {
    case 'Extremadamente Recomendado':
      return {
        bg: 'bg-positive/10 border-positive/30',
        text: 'text-positive',
        badge: 'bg-positive/15 text-positive border-positive/30',
        icon: <Trophy className="size-3.5 text-positive" />,
        label: 'Extremadamente Recomendado',
        barColor: 'var(--positive)',
      };
    case 'Recomendado':
      return {
        bg: 'bg-accent/10 border-accent/30',
        text: 'text-accent',
        badge: 'bg-accent/15 text-accent border-accent/30',
        icon: <ThumbsUp className="size-3.5 text-accent" />,
        label: 'Recomendado',
        barColor: 'var(--accent)',
      };
    case 'Mixto':
      return {
        bg: 'bg-warn/10 border-warn/30',
        text: 'text-warn',
        badge: 'bg-warn/15 text-warn border-warn/30',
        icon: <Scale className="size-3.5 text-warn" />,
        label: 'Mixto',
        barColor: 'var(--warn)',
      };
    default:
      return {
        bg: 'bg-negative/10 border-negative/30',
        text: 'text-negative',
        badge: 'bg-negative/15 text-negative border-negative/30',
        icon: <ThumbsDown className="size-3.5 text-negative" />,
        label: 'No Recomendado',
        barColor: 'var(--negative)',
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
    .filter((r) => r.sentiment_predicted === sentiment)
    .forEach((r) => {
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
  const [activeTab, setActiveTab] = useState('analysis'); // 'analysis' | 'summary'

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const reviewsClassified = useMemo(() => result?.reviews_classified || [], [result?.reviews_classified]);

  const topPositiveWords = useMemo(() => getTopWords(reviewsClassified, 'Positivo', 10), [reviewsClassified]);
  const topNegativeWords = useMemo(() => getTopWords(reviewsClassified, 'Negativo', 10), [reviewsClassified]);

  const positiveCount = useMemo(() => reviewsClassified.filter((r) => r.sentiment_predicted === 'Positivo').length, [reviewsClassified]);
  const negativeCount = useMemo(() => reviewsClassified.filter((r) => r.sentiment_predicted === 'Negativo').length, [reviewsClassified]);

  const handleAffiliateClick = (storeName) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'affiliate_click', {
        store: storeName,
        game: gameInfo?.name || result?.app_id,
      });
    }
  };

  if (!result) return null;

  const {
    total_reviews_analyzed,
    recommendation_level,
    sentiment_stats,
    steam_voted_up_pct,
    game_details = {},
  } = result;

  const instantGamingUrl = getInstantGamingUrl(gameInfo?.name, result.app_id);
  const g2aUrl = getG2aUrl(gameInfo?.name);
  const steamUrl = getSteamStoreUrl(result.app_id);

  const cfg = getVerdictConfig(recommendation_level);

  return (
    <div className="w-full space-y-5 animate-fade-up mt-2">
      {/* ── 1. CARD PRINCIPAL ENCABEZADO DE JUEGO ── */}
      <div className={`tactical-card overflow-hidden border ${cfg.bg}`}>
        {/* Banner de Portada / Header Hero */}
        {gameInfo?.image ? (
          <div className="relative w-full min-h-[160px] sm:h-44 overflow-hidden border-b border-line">
            <img
              src={gameInfo.image}
              alt={gameInfo.name || 'Juego'}
              className="w-full h-full object-cover brightness-[0.35]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/70 to-transparent" />

            <div className="relative sm:absolute sm:bottom-0 sm:left-0 sm:right-0 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 sm:gap-4 z-10">
              <div className="flex items-start sm:items-center gap-3 w-full sm:w-auto">
                <img
                  src={gameInfo.image}
                  alt={gameInfo.name}
                  className="w-14 h-14 sm:w-20 sm:h-12 object-cover rounded-lg border border-white/20 shadow-md shrink-0 mt-0.5 sm:mt-0"
                />
                <div className="min-w-0 flex-1">
                  <h2 className="text-base sm:text-xl font-display font-bold text-ink leading-tight break-words">
                    {gameInfo?.name || 'Juego Analizado'}
                  </h2>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {gameInfo?.price && (
                      <span className="text-[10px] bg-bg/90 text-ink-soft border border-line px-2 py-0.5 rounded font-semibold">
                        {gameInfo.price}
                      </span>
                    )}
                    {gameInfo?.metascore && gameInfo.metascore !== 'N/A' && (
                      <span className="text-[10px] bg-warn/15 text-warn border border-warn/30 px-2 py-0.5 rounded font-bold">
                        Metascore: {gameInfo.metascore}
                      </span>
                    )}
                    <span className="text-[10px] bg-bg/90 text-ink-faint border border-line px-2 py-0.5 rounded font-mono">
                      AppID: {result.app_id}
                    </span>
                  </div>

                  {game_details && (
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5 text-[10px] text-ink-faint">
                      {game_details.developer && (
                        <span>Dev: <strong className="text-ink">{game_details.developer}</strong></span>
                      )}
                      {game_details.release_date && (
                        <span>Fecha: <strong className="text-ink">{game_details.release_date}</strong></span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 pt-1 sm:pt-0 border-t border-white/10 sm:border-t-0 gap-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded border flex items-center gap-1 shadow-md shadow-black/20 ring-1 ring-white/10 ${cfg.badge}`}>
                  {cfg.icon}
                  <span className="font-display font-bold">{recommendation_level}</span>
                </span>
                <button
                  type="button"
                  onClick={handleShareLink}
                  className="flex items-center gap-1 text-[10px] font-semibold text-ink-soft hover:text-ink bg-bg/80 border border-line px-2.5 py-1 rounded transition-all cursor-pointer btn-tactical"
                >
                  {copied ? (
                    <span className="text-positive font-bold">¡Copiado!</span>
                  ) : (
                    <span>Compartir</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-line gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-display font-bold text-ink">{gameInfo?.name || 'Juego Analizado'}</h2>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {gameInfo?.price && (
                  <span className="text-[10px] bg-bg text-ink-soft border border-line px-2 py-0.5 rounded font-semibold">{gameInfo.price}</span>
                )}
                <span className="text-[10px] bg-bg text-ink-faint border border-line px-2 py-0.5 rounded font-mono">AppID: {result.app_id}</span>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-xs font-bold px-2.5 py-1 rounded border flex items-center gap-1 ${cfg.badge}`}>{cfg.icon} <span className="font-display font-bold">{recommendation_level}</span></span>
            </div>
          </div>
        )}

        {/* ── BARRA HEADER DE NAVEGACIÓN ENTRE ANÁLISIS Y SÍNTESIS INTELIGENTE CON FLECHA A LA DERECHA ── */}
        <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 border-b border-line bg-bg/70 flex-wrap gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-0.5 scrollbar-none w-full sm:w-auto justify-start">
            <button
              type="button"
              onClick={() => setActiveTab('analysis')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'analysis'
                  ? 'bg-accent/15 text-accent border border-accent/40 shadow-sm'
                  : 'text-ink-faint hover:text-ink border border-transparent'
              }`}
            >
              <BarChart3 className="size-3.5 shrink-0" />
              <span className="hidden sm:inline">Análisis de la Muestra (Español)</span>
              <span className="sm:hidden">Análisis Muestra</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('summary')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'summary'
                  ? 'bg-accent/15 text-accent border border-accent/40 shadow-sm'
                  : 'text-ink-faint hover:text-ink border border-transparent'
              }`}
            >
              <Cpu className="size-3.5 text-accent shrink-0" />
              <span className="hidden sm:inline">Síntesis Inteligente de la Comunidad</span>
              <span className="sm:hidden">Síntesis IA</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'analysis' ? 'summary' : 'analysis')}
            className="flex items-center gap-1.5 text-xs font-black text-accent hover:text-accent-2 bg-accent/10 hover:bg-accent/20 border border-accent/30 px-2.5 sm:px-3 py-1.5 rounded-xl transition-all cursor-pointer group btn-tactical shrink-0 ml-auto"
            title={activeTab === 'analysis' ? 'Ver Síntesis Inteligente / Resumen' : 'Ver Análisis de Sentimiento'}
          >
            <span>{activeTab === 'analysis' ? 'Ver Resumen IA' : 'Ver Análisis'}</span>
            <ChevronRight className={`size-4 transition-transform duration-300 ${activeTab === 'analysis' ? 'group-hover:translate-x-1' : 'rotate-180 group-hover:-translate-x-1'}`} />
          </button>
        </div>

        {/* ── CONTENIDO DINÁMICO (ANÁLISIS O SÍNTESIS INTELIGENTE) ── */}
        {activeTab === 'analysis' ? (
          <>
            {/* Gráfico y Estadísticas */}
            <SentimentChart
              sentimentStats={sentiment_stats}
              totalReviewsAnalyzed={total_reviews_analyzed}
              positiveCount={positiveCount}
              negativeCount={negativeCount}
              steamVotedUpPct={steam_voted_up_pct}
              recommendationLevel={recommendation_level}
              verdictConfig={cfg}
              onToggleSummary={() => setActiveTab('summary')}
            />

            {/* Conceptos Destacados */}
            <TopKeyWords
              topPositiveWords={topPositiveWords}
              topNegativeWords={topNegativeWords}
            />
          </>
        ) : (
          <div className="p-4 sm:p-6 bg-bg/60">
            {result?.groq_summary ? (
              <GroqSummaryCard
                groqSummary={result.groq_summary}
                onToggleAnalysis={() => setActiveTab('analysis')}
                embedded
              />
            ) : (
              <div className="text-center py-10 px-6 space-y-3 bg-bg border border-line rounded-2xl max-w-md mx-auto">
                <Cpu className="size-8 text-accent mx-auto" />
                <h4 className="text-sm font-display font-bold text-ink">Síntesis IA no disponible</h4>
                <p className="text-xs text-ink-soft leading-relaxed font-normal">
                  La síntesis periodística no está disponible en este momento. Asegúrate de tener configurada la API Key de Groq en el servidor backend.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('analysis')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-accent bg-accent/10 border border-accent/30 px-3 py-1.5 rounded-xl cursor-pointer"
                >
                  <span>Volver a Análisis de Sentimiento</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── 2. RESEÑAS CLASIFICADAS ── */}
      <ReviewList
        reviewsClassified={reviewsClassified}
        positiveCount={positiveCount}
        negativeCount={negativeCount}
      />

      {/* ── BANNER DESTACADO DE AFILIADO (Si es recomendado) ── */}
      {['Extremadamente Recomendado', 'Recomendado'].includes(recommendation_level) && (
        <div className="bg-gradient-to-r from-warn/15 via-warn/10 to-surface border border-warn/30 p-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-lg">
          <div className="flex items-center gap-2.5 text-center sm:text-left">
            <span className="text-warn shrink-0"><Flame className="size-5" /></span>
            <div>
              <div className="text-ink font-extrabold text-xs sm:text-sm">
                ¡Veredicto Positivo! ¿Decidido a jugarlo?
              </div>
              <div className="text-ink-soft text-[11px]">
                Consigue tu clave digital de Steam al mejor precio en Instant Gaming
              </div>
            </div>
          </div>
          <a
            href={instantGamingUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => handleAffiliateClick('InstantGaming-BannerCTA')}
            className="bg-warn text-white dark:text-slate-950 hover:brightness-110 px-4 py-2 rounded-xl font-black text-xs shrink-0 transition-all btn-tactical shadow-lg shadow-warn/20 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Ver Oferta en Instant Gaming</span>
            <ExternalLink className="size-3.5" />
          </a>
        </div>
      )}

      {/* ── 3. COMPARADOR DE PRECIOS ── */}
      <div className="tactical-card p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-display font-bold text-ink-soft uppercase tracking-wider">Tiendas y Precios Digitales</h4>
          <span className="text-[10px] bg-accent/10 border border-accent/20 text-accent px-2 py-0.5 rounded font-semibold">
            Enlaces Verificados
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href={instantGamingUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => handleAffiliateClick('InstantGaming')}
            className="flex items-center justify-between p-3 bg-bg border border-line hover:border-warn/50 rounded-lg text-xs font-bold text-ink-soft transition-all btn-tactical group"
          >
            <div className="flex items-center gap-2">
              <span className="text-warn shrink-0"><Zap className="size-4" /></span>
              <div>
                <div className="text-ink font-bold flex items-center gap-1">
                  <span>Instant Gaming</span>
                  <span className="text-[9px] bg-warn/20 text-warn px-1 rounded font-normal">Clave PC</span>
                </div>
                <div className="text-[10px] text-ink-faint font-normal">Descuentos Digitales</div>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-ink-faint group-hover:text-warn" />
          </a>

          <a
            href={g2aUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => handleAffiliateClick('G2A')}
            className="flex items-center justify-between p-3 bg-bg border border-line hover:border-warn/50 rounded-lg text-xs font-bold text-ink-soft transition-all btn-tactical group"
          >
            <div className="flex items-center gap-2">
              <span className="text-warn shrink-0"><Coins className="size-4" /></span>
              <div>
                <div className="text-ink font-bold flex items-center gap-1">
                  <span>G2A Marketplace</span>
                  <span className="text-[9px] bg-warn/20 text-warn px-1 rounded font-normal">Global</span>
                </div>
                <div className="text-[10px] text-ink-faint font-normal">Ofertas Mundiales</div>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-ink-faint group-hover:text-warn" />
          </a>

          <a
            href={steamUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => handleAffiliateClick('SteamStore')}
            className="flex items-center justify-between p-3 bg-bg border border-line hover:border-accent/50 rounded-lg text-xs font-bold text-ink-soft transition-all btn-tactical group"
          >
            <div className="flex items-center gap-2">
              <span className="text-accent shrink-0"><Gamepad2 className="size-4" /></span>
              <div>
                <div className="text-ink font-bold">Tienda Steam</div>
                <div className="text-[10px] text-ink-faint font-normal">Precio Oficial</div>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-ink-faint group-hover:text-accent" />
          </a>
        </div>

        <p className="text-[10px] text-ink-faint pt-1 text-center font-normal">
          * Los enlaces a Instant Gaming y G2A contienen parámetros de afiliación (LSSI-CE Art. 20). Al comprar mediante ellos apoya la infraestructura del proyecto sin coste extra.
        </p>
      </div>

      {/* ── 4. BADGE DE GITHUB ── */}
      <div className="tactical-card p-4 space-y-3">
        <h4 className="text-xs font-display font-bold text-ink-faint uppercase tracking-wider">Badge Dinámico de Veredicto</h4>

        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="bg-bg border border-line px-3 py-2 rounded flex items-center justify-center shrink-0">
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
              className="flex-1 bg-bg border border-line px-3 py-1.5 rounded text-xs font-mono text-ink-soft outline-none select-all"
            />
            <button
              onClick={() => {
                const md = `[![Steam IA](${import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL_DEV || 'http://localhost:8000'}/api/games/${result.app_id}/badge)](https://store.steampowered.com/app/${result.app_id})`;
                navigator.clipboard.writeText(md).then(() => {
                  setBadgeCopied(true);
                  setTimeout(() => setBadgeCopied(false), 2000);
                });
              }}
              className="bg-accent hover:bg-accent-2 text-white px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer shrink-0 btn-tactical"
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