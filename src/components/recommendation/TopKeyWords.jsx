import { memo } from 'react';

const TopKeyWords = memo(function TopKeyWords({ topPositiveWords = [], topNegativeWords = [] }) {
  if (topPositiveWords.length === 0 && topNegativeWords.length === 0) {
    return null;
  }

  return (
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
                const sizeClass =
                  ratio > 0.8
                    ? 'text-sm px-3 py-1.5'
                    : ratio > 0.4
                    ? 'text-xs px-2.5 py-1'
                    : 'text-[11px] px-2 py-0.5';
                return (
                  <span
                    key={word}
                    className={`inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/15 hover:border-emerald-500/30 text-emerald-300 font-medium transition-all cursor-default ${sizeClass}`}
                    title={`Aparece ${count} ${count === 1 ? 'vez' : 'veces'}`}
                  >
                    <span>{word}</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded-full font-mono">
                      {count}
                    </span>
                  </span>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-600 italic">No hay suficientes datos</p>
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
                const sizeClass =
                  ratio > 0.8
                    ? 'text-sm px-3 py-1.5'
                    : ratio > 0.4
                    ? 'text-xs px-2.5 py-1'
                    : 'text-[11px] px-2 py-0.5';
                return (
                  <span
                    key={word}
                    className={`inline-flex items-center gap-1.5 rounded-xl bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/15 hover:border-rose-500/30 text-rose-300 font-medium transition-all cursor-default ${sizeClass}`}
                    title={`Aparece ${count} ${count === 1 ? 'vez' : 'veces'}`}
                  >
                    <span>{word}</span>
                    <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded-full font-mono">
                      {count}
                    </span>
                  </span>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-600 italic">No hay suficientes datos</p>
          )}
        </div>
      </div>
    </div>
  );
});

export default TopKeyWords;
