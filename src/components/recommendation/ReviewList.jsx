import { useState, memo, useMemo } from 'react';

const CHAR_LIMIT = 280;

function ExpandableReview({ text }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > CHAR_LIMIT;
  const displayed = isLong && !expanded ? text.slice(0, CHAR_LIMIT) + '...' : text;

  return (
    <div>
      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic pl-2 group-hover:text-slate-100 transition-colors">
        "{displayed}"
      </p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1.5 ml-2 text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
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
    <div className="space-y-3">
      {/* Cabecera + Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          Reseñas Clasificadas
          <span className="text-[10px] font-mono px-2 py-0.5 bg-[#0f1520] border border-[#1b2434] text-slate-300 rounded">
            {filteredReviews.length}
          </span>
        </h3>

        <div className="flex w-full sm:w-auto bg-[#0f1520] border border-[#1b2434] p-1 rounded-lg text-xs">
          {[
            { key: 'all', label: 'Todas', count: reviewsClassified.length },
            { key: 'positives', label: 'Positivas', count: positiveCount },
            { key: 'negatives', label: 'Negativas', count: negativeCount },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-3 py-1 rounded font-semibold transition-all cursor-pointer flex-1 sm:flex-initial text-center flex items-center justify-center gap-1.5 btn-tactical ${
                activeTab === key
                  ? key === 'positives'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : key === 'negatives'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {label}
              <span className="text-[10px] font-mono opacity-80">({count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Reseñas */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-10 bg-[#0f1520] rounded-xl border border-[#1b2434] text-slate-500 text-xs">
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
                className="review-item tactical-card p-3.5 sm:p-4 transition-all duration-200 relative overflow-hidden group border-l-4"
                style={{
                  borderLeftColor: isPositive ? '#10b981' : '#f43f5e',
                  animationDelay: `${index * 30}ms`
                }}
              >
                {/* Cabecera de Reseña */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-7 h-7 rounded flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ background: avatarColor }}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-200 block truncate">
                        {review.author}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {hoursPlayed} hrs jugadas
                      </span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                        review.voted_up_steam
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : 'bg-[#080b11] text-slate-500 border-[#1b2434]'
                      }`}
                    >
                      Steam {review.voted_up_steam ? '👍' : '👎'}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        isPositive
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}
                    >
                      IA: {review.sentiment_predicted}
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
