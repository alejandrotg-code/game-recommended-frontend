import { memo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, PieChart as PieChartIcon, ChevronRight } from 'lucide-react';

const DonutTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value, fill } = payload[0].payload;
  return (
    <div className="bg-[#080b11] border border-[#1e293b] px-3 py-2 rounded-xl text-xs shadow-2xl">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: fill }} />
        <span className="text-slate-400 font-medium">{name}:</span>
        <span className="font-black text-white">{value}%</span>
      </div>
    </div>
  );
};

const SentimentChart = memo(function SentimentChart({
  sentimentStats,
  totalReviewsAnalyzed,
  positiveCount,
  negativeCount,
  steamVotedUpPct,
  recommendationLevel,
  verdictConfig,
  onToggleSummary,
}) {
  const donutData = [
    { name: 'Positivas', value: sentimentStats.positives_pct, fill: '#10b981' },
    { name: 'Negativas', value: sentimentStats.negatives_pct, fill: '#f43f5e' },
  ];

  return (
    <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-[#1e293b]">
      {/* Columna izquierda: barras de progreso */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="size-4 text-blue-400" />
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider">
              Análisis de la Muestra (Español)
            </h3>
          </div>

          {onToggleSummary && (
            <button
              type="button"
              onClick={onToggleSummary}
              className="flex items-center gap-1 text-[11px] font-extrabold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 px-2.5 py-1 rounded-xl transition-all cursor-pointer group btn-tactical shrink-0"
              title="Ver Síntesis Inteligente de la Comunidad"
            >
              <span>Ver Resumen IA</span>
              <ChevronRight className="size-3.5 text-blue-400 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {/* Clasificación IA */}
        <div className="space-y-2 bg-[#080b11] p-4 rounded-xl border border-[#1e293b]">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-400">Modelo IA (Sentimiento Semántico)</span>
            <span className="font-black text-emerald-400">
              {sentimentStats.positives_pct}% positivo
            </span>
          </div>
          <div className="w-full h-2.5 bg-[#0f1520] rounded-full overflow-hidden flex border border-[#1e293b] p-0.5">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${sentimentStats.positives_pct}%` }}
            />
            <div
              className="h-full bg-rose-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${sentimentStats.negatives_pct}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono pt-1">
            <span className="font-bold text-emerald-400">
              ✓ {positiveCount} positivas
            </span>
            <span className="font-bold text-rose-400">
              {negativeCount} negativas ✗
            </span>
          </div>
        </div>

        {/* Recomendación Steam */}
        <div className="space-y-2 bg-[#080b11] p-4 rounded-xl border border-[#1e293b]">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-400">Aprobación Muestra Steam</span>
            <span className="font-black text-blue-400">{steamVotedUpPct}% sí</span>
          </div>
          <div className="w-full h-2.5 bg-[#0f1520] rounded-full overflow-hidden border border-[#1e293b] p-0.5">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${steamVotedUpPct}%` }}
            />
          </div>
        </div>

        {/* Resumen táctico */}
        <div className="bg-[#080b11] border border-[#1e293b] rounded-xl p-4 text-xs text-slate-300 leading-relaxed font-normal">
          <span className="text-white font-extrabold">Diagnóstico Táctico: </span>
          Analizadas <strong className="text-white font-bold">{totalReviewsAnalyzed} reseñas</strong> en español. El sentimiento general es mayoritariamente{' '}
          <span className={`font-black ${verdictConfig.text}`}>
            {sentimentStats.positives_pct >= 50 ? 'favorables' : 'críticas'}
          </span>
          , determinando un veredicto de <strong className={`font-black ${verdictConfig.text}`}>{recommendationLevel}</strong>.
        </div>
      </div>

      {/* Columna derecha: donut chart + contadores */}
      <div className="flex flex-col items-center justify-between gap-5 bg-[#080b11] p-5 rounded-2xl border border-[#1e293b]">
        <div className="flex items-center gap-2 w-full justify-center">
          <PieChartIcon className="size-4 text-blue-400" />
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider text-center">
            Distribución de Sentimiento
          </h3>
        </div>

        {/* Gráfico Donut */}
        <div className="relative w-full my-2" style={{ height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={70}
                paddingAngle={4}
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
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-black text-emerald-400 font-mono">
              {sentimentStats.positives_pct}%
            </span>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
              positivas
            </span>
          </div>
        </div>

        {/* Contadores Tácticos */}
        <div className="grid grid-cols-3 gap-3 w-full pt-2">
          <div className="bg-[#0f1520] p-3 rounded-xl border border-[#1e293b] text-center shadow-inner">
            <span className="text-lg font-black text-white font-mono block">
              {totalReviewsAnalyzed}
            </span>
            <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider mt-0.5">Total</p>
          </div>
          <div className="bg-[#0f1520] p-3 rounded-xl border border-emerald-500/30 text-center shadow-inner">
            <span className="text-lg font-black text-emerald-400 font-mono block">
              {positiveCount}
            </span>
            <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider mt-0.5">Positivas</p>
          </div>
          <div className="bg-[#0f1520] p-3 rounded-xl border border-rose-500/30 text-center shadow-inner">
            <span className="text-lg font-black text-rose-400 font-mono block">
              {negativeCount}
            </span>
            <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider mt-0.5">Negativas</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default SentimentChart;
