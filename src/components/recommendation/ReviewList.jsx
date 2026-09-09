import { useState, memo, useMemo } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Clock, Sparkles } from 'lucide-react';

const CHAR_LIMIT = 280;

function ExpandableReview({ text }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > CHAR_LIMIT;
  const displayed = isLong && !expanded ? text.slice(0, CHAR_LIMIT) + '...' : text;

  return (
    <div className="pt-1">
      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic pl-3 border-l-2 border-[#1e293b] group-hover:border-blue-500/50 transition-colors">
        "{displayed}"
      </p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-[11px] font-extrabold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
        >
          {expanded ? 'Ver menos ↑' : 'Ver más ↓'}
        </button>
      )}
    </div>
  );
}

function getAvatarColor(name = '') {
  const colors = [
    '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444',
    '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

const ReviewList = memo(function ReviewList({
  reviewsClassified = [],
  positiveCount = 0,
  negativeCount = 0,
}) {
  const [activeTab, setActiveTab] = useState('all');

  const filteredReviews = useMemo(() => {
    return reviewsClassified.filter((r) => {
      if (activeTab === 'positives') return r.sentiment_predicted === 'Positivo';
      if (activeTab === 'negatives') return r.sentiment_predicted === 'Negativo';
      return true;
    });
  }, [reviewsClassified, activeTab]);

  return (
    <div className="tactical-card p-6 sm:p-8 space-y-6">
      {/* Cabecera + Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#1e293b]">
        <div className="flex items-center gap-2.5">
          <MessageSquare className="size-4 text-blue-400" />
          <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <span>Muestra de Reseñas Clasificadas</span>
            <span className="text-[10px] font-mono px-2.5 py-0.5 bg-[#080b11] border border-[#1e293b] text-slate-300 rounded-md font-bold">
              {filteredReviews.length}
            </span>
          </h3>
        </div>

        <div className="flex w-full sm:w-auto bg-[#080b11] border border-[#1e293b] p-1.5 rounded-xl text-xs gap-1 shadow-inner">
          {[
            { key: 'all', label: 'Todas', count: reviewsClassified.length },
            { key: 'positives', label: 'Positivas', count: positiveCount },
            { key: 'negatives', label: 'Negativas', count: negativeCount },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex-1 sm:flex-initial text-center flex items-center justify-center gap-1.5 ${
                activeTab === key
                  ? key === 'positives'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : key === 'negatives'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                    : 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-[#151d2c]'
              }`}
            >
              <span>{label}</span>
              <span className="text-[10px] font-mono font-extrabold opacity-80">({count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Reseñas */}
      <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 bg-[#080b11] rounded-2xl border border-[#1e293b] text-slate-400 text-xs font-medium">
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
                className="review-item bg-[#080b11] border border-[#1e293b] rounded-xl p-4 sm:p-5 transition-all duration-200 relative overflow-hidden group hover:border-slate-700 shadow-md space-y-3"
                style={{
                  borderLeftWidth: '4px',
                  borderLeftColor: isPositive ? '#10b981' : '#f43f5e',
                }}
              >
                {/* Cabecera de Reseña */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0 shadow-sm"
                      style={{ background: avatarColor }}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-extrabold text-white block truncate">
                        {review.author}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono font-medium flex items-center gap-1">
                        <Clock className="size-3 text-slate-500" />
                        <span>{hoursPlayed} hrs jugadas</span>
                      </span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-md border flex items-center gap-1 ${
                        review.voted_up_steam
                          ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                          : 'bg-[#0f1520] text-slate-400 border-[#1e293b]'
                      }`}
                    >
                      <span>Steam</span>
                      {review.voted_up_steam ? (
                        <ThumbsUp className="size-3 text-blue-400" />
                      ) : (
                        <ThumbsDown className="size-3 text-slate-400" />
                      )}
                    </span>

                    <span
                      className={`text-[10px] font-black px-2.5 py-1 rounded-md border flex items-center gap-1 ${
                        isPositive
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      <Sparkles className="size-3" />
                      <span>IA: {review.sentiment_predicted}</span>
                    </span>
                  </div>
                </div>

                {/* Texto Expandible */}
                <ExpandableReview text={review.review_text} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
});

export default ReviewList;
