import { memo } from 'react';
import { Tag, ThumbsUp, ThumbsDown } from 'lucide-react';

const TopKeyWords = memo(function TopKeyWords({ topPositiveWords = [], topNegativeWords = [] }) {
  if (topPositiveWords.length === 0 && topNegativeWords.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#080b11] p-6 sm:p-8 space-y-6 border-b border-[#1e293b]">
      <div className="flex items-center justify-center gap-2">
        <Tag className="size-4 text-blue-400" />
        <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider text-center">
          Términos Destacados en la Muestra de Reseñas
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Destacados Positivos */}
        <div className="space-y-3 bg-[#0f1520] p-4 sm:p-5 rounded-2xl border border-emerald-500/20 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-400">
            <ThumbsUp className="size-4 text-emerald-400" />
            <span>Elogios Más Frecuentes</span>
          </div>
          {topPositiveWords.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {topPositiveWords.map(({ word, count }) => (
                <span
                  key={word}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#080b11] border border-emerald-500/30 text-emerald-300 text-xs font-bold shadow-sm"
                  title={`Aparece ${count} ${count === 1 ? 'vez' : 'veces'}`}
                >
                  <span>{word}</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded-md font-mono font-black">
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
        <div className="space-y-3 bg-[#0f1520] p-4 sm:p-5 rounded-2xl border border-rose-500/20 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-extrabold text-rose-400">
            <ThumbsDown className="size-4 text-rose-400" />
            <span>Críticas Más Frecuentes</span>
          </div>
          {topNegativeWords.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {topNegativeWords.map(({ word, count }) => (
                <span
                  key={word}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#080b11] border border-rose-500/30 text-rose-300 text-xs font-bold shadow-sm"
                  title={`Aparece ${count} ${count === 1 ? 'vez' : 'veces'}`}
                >
                  <span>{word}</span>
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded-md font-mono font-black">
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
