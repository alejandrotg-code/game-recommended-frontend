import { memo } from 'react';
import { Tag, ThumbsUp, ThumbsDown } from 'lucide-react';

const TopKeyWords = memo(function TopKeyWords({ topPositiveWords = [], topNegativeWords = [] }) {
  if (topPositiveWords.length === 0 && topNegativeWords.length === 0) {
    return null;
  }

  return (
    <div className="bg-surface/60 p-4 sm:p-7 space-y-4 sm:space-y-6 border-b border-line">
      <div className="flex items-center justify-center gap-2">
        <Tag className="size-4 text-accent" />
        <h3 className="text-sm font-display font-semibold text-ink text-center">
          Lo que más repite la comunidad
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Destacados Positivos */}
        <div className="tactical-nested space-y-3 p-4 sm:p-5 border-positive/25">
          <div className="flex items-center gap-2 text-sm font-semibold text-positive">
            <span className="p-1 rounded-lg bg-positive/10 border border-positive/25">
              <ThumbsUp className="size-3.5 text-positive" />
            </span>
            <span>Lo que más gusta</span>
          </div>
          {topPositiveWords.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {topPositiveWords.map(({ word, count }) => (
                <span
                  key={word}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-positive/40 text-positive text-xs font-bold shadow-sm hover:border-positive transition-colors cursor-default"
                  title={`Mencionado ${count} ${count === 1 ? 'vez' : 'veces'} en reseñas positivas`}
                >
                  <span>{word}</span>
                  <span className="text-[10px] bg-positive/20 text-positive px-1.5 py-0.2 rounded-md font-mono font-black">
                    {count}
                  </span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-ink-faint italic">No se detectaron términos suficientes en la muestra</p>
          )}
        </div>

        {/* Destacados Negativos */}
        <div className="tactical-nested space-y-3 p-4 sm:p-5 border-negative/25">
          <div className="flex items-center gap-2 text-sm font-semibold text-negative">
            <span className="p-1 rounded-lg bg-negative/10 border border-negative/25">
              <ThumbsDown className="size-3.5 text-negative" />
            </span>
            <span>Lo que más molesta</span>
          </div>
          {topNegativeWords.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {topNegativeWords.map(({ word, count }) => (
                <span
                  key={word}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-negative/40 text-negative text-xs font-bold shadow-sm hover:border-negative transition-colors cursor-default"
                  title={`Mencionado ${count} ${count === 1 ? 'vez' : 'veces'} en reseñas negativas`}
                >
                  <span>{word}</span>
                  <span className="text-[10px] bg-negative/20 text-negative px-1.5 py-0.2 rounded-md font-mono font-black">
                    {count}
                  </span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-ink-faint italic">No se detectaron términos suficientes en la muestra</p>
          )}
        </div>
      </div>
    </div>
  );
});

export default TopKeyWords;