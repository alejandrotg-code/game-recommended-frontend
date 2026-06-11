import { useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from 'recharts';

const INSTANT_GAMING_IGR_ID = 'game-recommended';

const POPULAR_GAMES_LINKS = {
  "1245620": { ig: "https://www.instant-gaming.com/es/4822-comprar-elden-ring-pc-juego-steam/" },
  "1091500": { ig: "https://www.instant-gaming.com/es/2685-comprar-cyberpunk-2077-pc-juego-gog-com/" },
  "367520":  { ig: "https://www.instant-gaming.com/es/2198-comprar-hollow-knight-pc-mac-steam/" },
  "620":     { ig: "https://www.instant-gaming.com/es/400-comprar-portal-2-pc-mac-steam/" },
  "292030":  { ig: "https://www.instant-gaming.com/es/290-comprar-the-witcher-3-wild-hunt-pc-juego-gog-com/" },
  "413150":  { ig: "https://www.instant-gaming.com/es/2179-comprar-stardew-valley-pc-mac-steam/" },
};

// ── Tooltip del gráfico Donut ─────────────────────────────────────────────────
const DonutTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value, fill } = payload[0].payload;
  return (
    <div className="bg-[#0a1628] border border-[#1e293b] px-3 py-2 rounded-xl text-xs shadow-2xl">
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full" style={{ background: fill }} />
        <span className="text-slate-400">{name}:</span>
        <span className="font-bold text-slate-100">{value}%</span>
      </div>
    </div>
  );
};

// ── Configuración de estilos según veredicto ─────────────────────────────────
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

// ── Genera un color único por nombre de autor ─────────────────────────────────
function getAvatarColor(name = '') {
  const colors = [
    '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444',
    '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

// ── Reseña expandible con "Ver más / Ver menos" ─────────────────────────
const CHAR_LIMIT = 280;

function ExpandableReview({ text }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > CHAR_LIMIT;
  const displayed = isLong && !expanded ? text.slice(0, CHAR_LIMIT) + '...' : text;

  return (
    <div>
      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed italic pl-2 group-hover:text-slate-300 transition-colors">
        "{displayed}"
      </p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1.5 ml-2 text-[11px] font-semibold text-blue-400/70 hover:text-blue-400 transition-colors cursor-pointer"
        >
          {expanded ? 'Ver menos ↑' : 'Ver más ↓'}
        </button>
      )}
    </div>
  );
}

const SPANISH_STOPWORDS = new Set([
  'de', 'la', 'que', 'el', 'en', 'y', 'a', 'los', 'del', 'se', 'las', 'por', 'un', 'para', 'con', 'no', 'una', 'su', 'al', 'lo', 'como', 'más', 'pero', 'sus', 'este', 'le', 'ya', 'o', 'esta', 'sí', 'porque', 'muy', 'sin', 'sobre', 'también', 'me', 'mi', 'te', 'es', 'son', 'era', 'esta', 'eso', 'esto', 'esta', 'un', 'una', 'unos', 'unas', 'tiene', 'tienen', 'todo', 'todos', 'bien', 'bueno', 'malo', 'juego', 'juegos', 'steam', 'hace', 'hacer', 'puede', 'puedo', 'solo', 'si', 'cuando', 'este', 'esta', 'estos', 'estas', 'ser', 'estar', 'ha', 'han', 'he', 'mas', 'muy', 'nos', 'lo', 'le', 'les', 'por', 'sus', 'sus', 'para', 'una', 'uno', 'unas', 'unos', 'del', 'al', 'lo', 'la', 'las', 'los', 'un', 'en', 'es', 'es', 'mi', 'mis', 'tu', 'tus', 'yo', 'el', 'ella', 'ellos', 'ellas', 'nosotros', 'vosotros', 'como', 'con', 'sin', 'muy', 'tan', 'asi', 'entonces', 'pero', 'porque', 'aunque', 'sino', 'o', 'y', 'e', 'ni', 'que', 'donde', 'cuando', 'como', 'quien', 'cual', 'cuyo', 'donde', 'muy', 'bastante', 'poco', 'mucho', 'demasiado', 'nada', 'todo', 'algo', 'alguno', 'ninguno', 'otro', 'mismo', 'tanto', 'tal', 'cual', 'cada', 'ambos', 'sendos', 'juego', 'jugar', 'jugado', 'jugando', 'reseña', 'reseñas', 'opinion', 'opiniones', 'mas', 'si', 'esta', 'esta', 'este', 'para', 'como', 'pero', 'bien', 'muy', 'solo', 'hace', 'puede', 'tiene'
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

// ── Componente principal ──────────────────────────────────────────────────
export default function RecommendationCard({ result, gameInfo }) {
  const [activeTab, setActiveTab] = useState('all');
  const [copied, setCopied] = useState(false);

  // Copiar enlace compartible al portapapeles
  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!result) return null;

  const {
    total_reviews_analyzed,
    recommendation_level,
    sentiment_stats,
    steam_voted_up_pct,
    reviews_classified = [],
  } = result;

  const topPositiveWords = getTopWords(reviews_classified, 'Positivo', 10);
  const topNegativeWords = getTopWords(reviews_classified, 'Negativo', 10);

  const appIdStr = String(result.app_id);
  const popularLinks = POPULAR_GAMES_LINKS[appIdStr];
  const instantGamingUrl = popularLinks?.ig
    ? `${popularLinks.ig}?igr=${INSTANT_GAMING_IGR_ID}`
    : `https://www.instant-gaming.com/es/busquedas/?query=${encodeURIComponent(gameInfo?.name || '')}&igr=${INSTANT_GAMING_IGR_ID}`;

  const filteredReviews = reviews_classified.filter((r) => {
    if (activeTab === 'positives') return r.sentiment_predicted === 'Positivo';
    if (activeTab === 'negatives') return r.sentiment_predicted === 'Negativo';
    return true;
  });

  const positiveCount = reviews_classified.filter(r => r.sentiment_predicted === 'Positivo').length;
  const negativeCount = reviews_classified.filter(r => r.sentiment_predicted === 'Negativo').length;
  const cfg = getVerdictConfig(recommendation_level);

  // Datos para el donut chart
  const donutData = [
    { name: 'Positivas', value: sentiment_stats.positives_pct, fill: '#10b981' },
    { name: 'Negativas', value: sentiment_stats.negatives_pct, fill: '#f43f5e' },
  ];

  return (
    <div className="w-full space-y-5 sm:space-y-6 animate-fade-up mt-4">

      {/* ── 1. CARD PRINCIPAL ──────────────────────────────────────────────── */}
      <div className={`w-full bg-[#0a1628]/80 border rounded-2xl sm:rounded-3xl overflow-hidden ${cfg.bg} ${cfg.glow} transition-all duration-300`}>

        {/* Cabecera con imagen como portada */}
        {gameInfo?.image && (
          <div className="relative w-full h-32 sm:h-44 overflow-hidden">
            <img
              src={gameInfo.image}
              alt={gameInfo.name || 'Juego'}
              className="w-full h-full object-cover scale-105"
              style={{ filter: 'blur(1px) brightness(0.5)' }}
            />
            {/* Overlay degradado */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/60 to-transparent" />

            {/* Info encima del banner */}
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
                </div>
              </div>

              {/* Veredicto badge + botón compartir */}
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
        )}

        {/* Sin imagen: cabecera compacta */}
        {!gameInfo?.image && (
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

        {/* Cuerpo de estadísticas */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

          {/* Columna izquierda: barras de progreso */}
          <div className="space-y-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aprobación de reseñas en español</h3>

            {/* IA */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 font-medium">Clasificación IA</span>
                <span className="font-bold text-emerald-400">{sentiment_stats.positives_pct}% positivo</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950/60 rounded-full overflow-hidden flex border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000 ease-out"
                  style={{ width: `${sentiment_stats.positives_pct}%` }}
                />
                <div
                  className="h-full bg-rose-500/80 transition-all duration-1000 ease-out"
                  style={{ width: `${sentiment_stats.negatives_pct}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-600">
                <span>✓ {positiveCount} positivas</span>
                <span>{negativeCount} negativas ✗</span>
              </div>
            </div>

            {/* Steam oficial */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 font-medium">Recomendación Steam</span>
                <span className="font-bold text-blue-400">{steam_voted_up_pct}% sí</span>
              </div>
              <div className="w-full h-2 bg-slate-950/60 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-1000 ease-out"
                  style={{ width: `${steam_voted_up_pct}%` }}
                />
              </div>
            </div>

            {/* Resumen */}
            <div className="bg-slate-950/30 border border-white/5 rounded-xl p-4 text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-300">Resumen: </strong>
              Nuestro modelo leyó individualmente{' '}
              <span className="text-slate-200 font-semibold">{total_reviews_analyzed} reseñas</span>{' '}
              en español. Las opiniones son mayoritariamente{' '}
              <span className={`font-semibold ${cfg.text}`}>
                {sentiment_stats.positives_pct >= 50 ? 'favorables' : 'críticas'}
              </span>
              , resultando en un veredicto de{' '}
              <span className={`font-bold ${cfg.text}`}>{recommendation_level}</span>.
            </div>
          </div>

          {/* Columna derecha: donut chart + contadores */}
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest w-full text-center">Distribución del sentimiento</h3>

            {/* Gráfico donut */}
            <div className="relative w-full" style={{ height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<DonutTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Texto central del donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-emerald-400">{sentiment_stats.positives_pct}%</span>
                <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">positivas</span>
              </div>
            </div>

            {/* Leyenda */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-400">Positivas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-slate-400">Negativas</span>
              </div>
            </div>

            {/* Contadores */}
            <div className="grid grid-cols-3 gap-2 w-full">
              <div className="bg-slate-950/40 p-3 rounded-xl border border-white/5 text-center">
                <span className="text-xl font-black text-slate-100">{total_reviews_analyzed}</span>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">Total</p>
              </div>
              <div className="bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/15 text-center">
                <span className="text-xl font-black text-emerald-400">{positiveCount}</span>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">Positivas</p>
              </div>
              <div className="bg-rose-500/5 p-3 rounded-xl border border-rose-500/15 text-center">
                <span className="text-xl font-black text-rose-400">{negativeCount}</span>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">Negativas</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── CONCEPTOS DESTACADOS ── */}
        {(topPositiveWords.length > 0 || topNegativeWords.length > 0) && (
          <div className="border-t border-white/5 bg-slate-950/20 px-4 py-5 sm:px-6 sm:py-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
              Conceptos más destacados (IA)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Destacados Positivos */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  Lo más elogiado
                </div>
                {topPositiveWords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {topPositiveWords.map(({ word, count }) => {
                      const maxCount = topPositiveWords[0].count;
                      const ratio = count / maxCount;
                      const sizeClass = ratio > 0.8 ? 'text-sm px-3 py-1.5' : ratio > 0.4 ? 'text-xs px-2.5 py-1' : 'text-[11px] px-2 py-0.5';
                      return (
                        <span
                          key={word}
                          className={`inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/15 hover:border-emerald-500/30 text-emerald-300 font-medium transition-all cursor-default ${sizeClass}`}
                          title={`Aparece ${count} ${count === 1 ? 'vez' : 'veces'}`}
                        >
                          {word}
                          <span className="text-[9px] opacity-60 bg-emerald-500/10 px-1 rounded-md">{count}</span>
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-600">No hay suficientes datos positivos.</p>
                )}
              </div>

              {/* Destacados Negativos */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
                  <span className="w-1.5 h-1.5 bg-rose-400 rounded-full" />
                  Lo más criticado
                </div>
                {topNegativeWords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {topNegativeWords.map(({ word, count }) => {
                      const maxCount = topNegativeWords[0].count;
                      const ratio = count / maxCount;
                      const sizeClass = ratio > 0.8 ? 'text-sm px-3 py-1.5' : ratio > 0.4 ? 'text-xs px-2.5 py-1' : 'text-[11px] px-2 py-0.5';
                      return (
                        <span
                          key={word}
                          className={`inline-flex items-center gap-1.5 rounded-xl bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/15 hover:border-rose-500/30 text-rose-300 font-medium transition-all cursor-default ${sizeClass}`}
                          title={`Aparece ${count} ${count === 1 ? 'vez' : 'veces'}`}
                        >
                          {word}
                          <span className="text-[9px] opacity-60 bg-rose-500/10 px-1 rounded-md">{count}</span>
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-600">No hay suficientes datos negativos.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── 2. RESEÑAS CLASIFICADAS ────────────────────────────────────────── */}
      <div className="space-y-4">
        {/* Cabecera + tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            Reseñas clasificadas
            <span className="text-xs font-semibold px-2 py-0.5 bg-[#1e293b] text-slate-400 rounded-full">
              {filteredReviews.length}
            </span>
          </h3>

          <div className="flex w-full sm:w-auto bg-[#0a1628]/80 border border-[#1e293b] p-1 rounded-xl text-[11px]">
            {[
              { key: 'all', label: `Todas`, count: reviews_classified.length },
              { key: 'positives', label: `Positivas`, count: positiveCount },
              { key: 'negatives', label: `Negativas`, count: negativeCount },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex-1 sm:flex-initial text-center flex items-center justify-center gap-1 ${
                  activeTab === key
                    ? key === 'positives'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : key === 'negatives'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                {label}
                <span className="opacity-70">({count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Lista de reseñas */}
        <div className="space-y-2.5 sm:space-y-3 max-h-[520px] overflow-y-auto pr-0.5 custom-scrollbar">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12 bg-white/[0.01] rounded-2xl border border-[#1e293b]/60 text-slate-600 text-sm">
              No hay reseñas en esta categoría.
            </div>
          ) : (
            filteredReviews.map((review, index) => {
              const hoursPlayed = Math.round(review.playtime_forever / 60);
              const isPositive = review.sentiment_predicted === 'Positivo';
              const avatarColor = getAvatarColor(review.author);
              const initials = (review.author || '?').slice(0, 2).toUpperCase();

              return (
                <div
                  key={review.recommendation_id || index}
                  className="review-item bg-[#0a1628]/60 border border-[#1e293b]/80 hover:border-[#2d3f55] p-4 sm:p-5 rounded-xl sm:rounded-2xl transition-all duration-200 relative overflow-hidden group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Borde izquierdo de color */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`} />

                  {/* Cabecera de la reseña */}
                  <div className="flex items-start justify-between gap-3 mb-3 pl-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Avatar generado */}
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ background: avatarColor, boxShadow: `0 0 12px -2px ${avatarColor}60` }}
                      >
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <span className="text-sm font-semibold text-slate-200 block truncate">{review.author}</span>
                        <span className="text-[10px] text-slate-600">{hoursPlayed} horas jugadas</span>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`text-[10px] font-semibold px-2 py-1 rounded-lg border ${
                        review.voted_up_steam
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : 'bg-slate-800/60 text-slate-500 border-slate-700/60'
                      }`}>
                        Steam {review.voted_up_steam ? '👍' : '👎'}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${
                        isPositive
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        IA: {review.sentiment_predicted}
                      </span>
                    </div>
                  </div>

                  {/* Texto expandible */}
                  <ExpandableReview text={review.review_text} />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── 3. COMPARADOR DE PRECIOS ──────────────────────────────────────── */}
      <div className="bg-[#0a1628]/60 border border-[#1e293b]/80 p-5 sm:p-6 rounded-2xl sm:rounded-3xl space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-base">🛒</span>
          <h4 className="text-sm font-bold text-slate-200">¿Interesado? Encuentra el mejor precio</h4>
          <span className="ml-auto text-[10px] bg-[#1e293b] text-slate-500 px-2 py-0.5 rounded-full font-medium">
            Afiliado
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Instant Gaming */}
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

          {/* G2A */}
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

          {/* Steam */}
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

    </div>
  );
}