import { memo } from 'react';
import { Tag, ThumbsUp, ThumbsDown } from 'lucide-react';

const TopKeyWords = memo(function TopKeyWords({ topPositiveWords = [], topNegativeWords = [] }) {
  if (topPositiveWords.length === 0 && topNegativeWords.length === 0) {
    return null;
  }

  return (
    <div className="bg-bg p-4 sm:p-8 space-y-4 sm:space-y-6 border-b border-line">
      <div className="flex items-center justify-center gap-2">
        <Tag className="size-4 text-accent" />
        <h3 className="text-xs font-display font-bold text-ink-soft uppercase tracking-wider text-center">
          Términos Destacados en la Muestra de Reseñas
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Destacados Positivos */}
        <div className="space-y-3 bg-surface-2 p-4 sm:p-5 rounded-2xl border border-positive/20 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-extrabold text-positive">
            <ThumbsUp className="size-4 text-positive" />
            <span>Elogios Más Frecuentes</span>
          </div>
          {topPositiveWords.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {topPositiveWords.map(({ word, count }) => (
                <span
                  key={word}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bg border border-positive/30 text-positive text-xs font-bold shadow-sm"
                  title={`Aparece ${count} ${count === 1 ? 'vez' : 'veces'}`}
                >
                  <span>{word}</span>
                  <span className="text-[10px] bg-positive/20 text-positive px-1.5 py-0.2 rounded-md font-mono font-black">
                    {count}
                  </span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-ink-faint italic">No hay suficientes datos</p>
          )}
        </div>

        {/* Destacados Negativos */}
        <div className="space-y-3 bg-surface-2 p-4 sm:p-5 rounded-2xl border border-negative/20 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-extrabold text-negative">
            <ThumbsDown className="size-4 text-negative" />
            <span>Críticas Más Frecuentes</span>
          </div>
          {topNegativeWords.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {topNegativeWords.map(({ word, count }) => (
                <span
                  key={word}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bg border border-negative/30 text-negative text-xs font-bold shadow-sm"
                  title={`Aparece ${count} ${count === 1 ? 'vez' : 'veces'}`}
                >
                  <span>{word}</span>
                  <span className="text-[10px] bg-negative/20 text-negative px-1.5 py-0.2 rounded-md font-mono font-black">
                    {count}
                  </span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-ink-faint italic">No hay suficientes datos</p>
          )}
        </div>
      </div>
    </div>
  );
});

export default TopKeyWords;