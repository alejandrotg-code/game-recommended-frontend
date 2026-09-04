import { memo } from 'react';

const TopKeyWords = memo(function TopKeyWords({ topPositiveWords = [], topNegativeWords = [] }) {
  if (topPositiveWords.length === 0 && topNegativeWords.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#080b11] px-4 py-4 sm:px-5 sm:py-5 space-y-4">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
        Términos Destacados (Frecuencia en Reseñas)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Destacados Positivos */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            Elogios Más Frecuentes
          </div>
          {topPositiveWords.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {topPositiveWords.map(({ word, count }) => (
                <span
                  key={word}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#0f1520] border border-emerald-500/20 text-emerald-300 text-xs font-semibold"
                  title={`Aparece ${count} ${count === 1 ? 'vez' : 'veces'}`}
                >
                  <span>{word}</span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 py-0.2 rounded font-mono">
                    {count}
                  </span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No hay suficientes datos</p>
          )}
        </div>

        {/* Destacados Negativos */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
            <span className="w-1.5 h-1.5 bg-rose-400 rounded-full" />
            Críticas Más Frecuentes
          </div>
          {topNegativeWords.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {topNegativeWords.map(({ word, count }) => (
                <span
                  key={word}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#0f1520] border border-rose-500/20 text-rose-300 text-xs font-semibold"
                  title={`Aparece ${count} ${count === 1 ? 'vez' : 'veces'}`}
                >
                  <span>{word}</span>
                  <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1 py-0.2 rounded font-mono">
                    {count}
                  </span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No hay suficientes datos</p>
          )}
        </div>
      </div>
    </div>
  );
});

export default TopKeyWords;
