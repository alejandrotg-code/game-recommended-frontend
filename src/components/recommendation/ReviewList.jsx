import { useState, memo, useMemo } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Clock, Sparkles, Calendar } from 'lucide-react';

const CHAR_LIMIT = 280;

function formatReviewDate(rawTimestamp) {
  if (!rawTimestamp) return null;
  const timestamp = typeof rawTimestamp === 'number' && rawTimestamp < 1e11 ? rawTimestamp * 1000 : rawTimestamp;
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function ExpandableReview({ text }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > CHAR_LIMIT;
  const displayed = isLong && !expanded ? text.slice(0, CHAR_LIMIT) + '...' : text;

  return (
    <div className="pt-1">
      <p className="text-xs sm:text-sm text-ink-soft leading-relaxed italic pl-3 border-l-2 border-line group-hover:border-accent/50 transition-colors">
        "{displayed}"
      </p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-[11px] font-extrabold text-accent hover:text-accent-2 transition-colors cursor-pointer"
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
    <div className="tactical-card p-4 sm:p-8 space-y-4 sm:space-y-6">
      {/* Cabecera + Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 pb-4 border-b border-line">
        <div className="flex items-center gap-2.5">
          <MessageSquare className="size-4 text-accent" />
          <h3 className="text-xs font-display font-bold text-ink-soft uppercase tracking-wider flex items-center gap-2">
            <span>Muestra de Reseñas Clasificadas</span>
            <span className="text-[10px] font-mono px-2.5 py-0.5 bg-bg border border-line text-ink-soft rounded-md font-bold">
              {filteredReviews.length}
            </span>
          </h3>
        </div>

        <div className="flex w-full sm:w-auto bg-bg border border-line p-1 rounded-xl text-xs gap-1 shadow-inner overflow-x-auto">
          {[
            { key: 'all', label: 'Todas', count: reviewsClassified.length },
            { key: 'positives', label: 'Positivas', count: positiveCount },
            { key: 'negatives', label: 'Negativas', count: negativeCount },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-lg font-bold text-[11px] sm:text-xs transition-all cursor-pointer flex-1 sm:flex-initial text-center flex items-center justify-center gap-1 shrink-0 ${
                activeTab === key
                  ? key === 'positives'
                    ? 'bg-positive/20 text-positive border border-positive/40 shadow-sm'
                    : key === 'negatives'
                    ? 'bg-negative/20 text-negative border border-negative/40 shadow-sm'
                    : 'bg-accent text-white shadow-sm'
                  : 'text-ink-faint hover:text-ink hover:bg-surface-2'
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
          <div className="text-center py-12 bg-bg rounded-2xl border border-line text-ink-faint text-xs font-medium">
            No hay reseñas en esta categoría.
          </div>
        ) : (
          filteredReviews.map((review, index) => {
            const hoursPlayed = Math.round(review.playtime_forever / 60);
            const isPositive = review.sentiment_predicted === 'Positivo';
            const avatarColor = getAvatarColor(review.author);
            const initials = (review.author || '?').slice(0, 2).toUpperCase();
            const rawDate = review.timestamp_created || review.timestamp_updated || review.timestamp || review.date_posted || review.created_at;
            const postedDate = formatReviewDate(rawDate);

            return (
              <div
                key={review.recommendation_id || index}
                className="review-item bg-bg border border-line rounded-xl p-4 sm:p-5 transition-all duration-200 relative overflow-hidden group hover:border-line-strong shadow-md space-y-3"
                style={{
                  borderLeftWidth: '4px',
                  borderLeftColor: isPositive ? 'var(--positive)' : 'var(--negative)',
                }}
              >
                {/* Cabecera de Reseña */}
                <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0 shadow-sm"
                      style={{ background: avatarColor }}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-extrabold text-ink block truncate">
                        {review.author}
                      </span>
                      <span className="text-[10px] text-ink-faint font-mono font-medium flex items-center gap-1.5 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3 text-ink-faint shrink-0" />
                          <span>{hoursPlayed} hrs</span>
                        </span>
                        {postedDate && (
                          <>
                            <span className="text-ink-faint/60">·</span>
                            <span className="flex items-center gap-1 text-ink-faint">
                              <Calendar className="size-3 text-ink-faint shrink-0" />
                              <span>{postedDate}</span>
                            </span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-1.5 shrink-0 self-start xs:self-auto">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border flex items-center gap-1 ${
                        review.voted_up_steam
                          ? 'bg-accent/15 text-accent border-accent/30'
                          : 'bg-surface-2 text-ink-faint border-line'
                      }`}
                    >
                      <span>Steam</span>
                      {review.voted_up_steam ? (
                        <ThumbsUp className="size-3 text-accent shrink-0" />
                      ) : (
                        <ThumbsDown className="size-3 text-ink-faint shrink-0" />
                      )}
                    </span>

                    <span
                      className={`text-[10px] font-black px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border flex items-center gap-1 ${
                        isPositive
                          ? 'bg-positive/15 text-positive border-positive/30'
                          : 'bg-negative/15 text-negative border-negative/30'
                      }`}
                    >
                      <Sparkles className="size-3 shrink-0" />
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