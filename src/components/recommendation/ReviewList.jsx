import React, { useState } from 'react';

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

function getAvatarColor(name = '') {
  const colors = [
    '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444',
    '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export default function ReviewList({
  reviewsClassified = [],
  positiveCount = 0,
  negativeCount = 0,
}) {
  const [activeTab, setActiveTab] = useState('all');

  const filteredReviews = reviewsClassified.filter((r) => {
    if (activeTab === 'positives') return r.sentiment_predicted === 'Positivo';
    if (activeTab === 'negatives') return r.sentiment_predicted === 'Negativo';
    return true;
  });

  return (
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
            { key: 'all', label: 'Todas', count: reviewsClassified.length },
            { key: 'positives', label: 'Positivas', count: positiveCount },
            { key: 'negatives', label: 'Negativas', count: negativeCount },
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
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${
                    isPositive ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                />

                {/* Cabecera de la reseña */}
                <div className="flex items-start justify-between gap-3 mb-3 pl-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{
                        background: avatarColor,
                        boxShadow: `0 0 12px -2px ${avatarColor}60`,
                      }}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm font-semibold text-slate-200 block truncate">
                        {review.author}
                      </span>
                      <span className="text-[10px] text-slate-600">
                        {hoursPlayed} horas jugadas
                      </span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`text-[10px] font-semibold px-2 py-1 rounded-lg border ${
                        review.voted_up_steam
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : 'bg-slate-800/60 text-slate-500 border-slate-700/60'
                      }`}
                    >
                      Steam {review.voted_up_steam ? '👍' : '👎'}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${
                        isPositive
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}
                    >
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
  );
}
