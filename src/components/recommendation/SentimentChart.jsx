import { memo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const DonutTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value, fill } = payload[0].payload;
  return (
    <div className="bg-[#080b11] border border-[#1b2434] px-2.5 py-1.5 rounded text-xs shadow-xl">
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full" style={{ background: fill }} />
        <span className="text-slate-400">{name}:</span>
        <span className="font-bold text-slate-100">{value}%</span>
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
}) {
  const donutData = [
    { name: 'Positivas', value: sentimentStats.positives_pct, fill: '#10b981' },
    { name: 'Negativas', value: sentimentStats.negatives_pct, fill: '#f43f5e' },
  ];

  return (
    <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 border-b border-[#1b2434]">
      {/* Columna izquierda: barras de progreso */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Análisis de la Muestra (Español)
        </h3>

        {/* Clasificación IA */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-400">Modelo IA (Sentimiento)</span>
            <span className="font-bold text-emerald-400">
              {sentimentStats.positives_pct}% positivo
            </span>
          </div>
          <div className="w-full h-2 bg-[#080b11] rounded overflow-hidden flex border border-[#1b2434]">
            <div
              className="h-full bg-emerald-500 transition-all duration-700 ease-out"
              style={{ width: `${sentimentStats.positives_pct}%` }}
            />
            <div
              className="h-full bg-rose-500 transition-all duration-700 ease-out"
              style={{ width: `${sentimentStats.negatives_pct}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>✓ {positiveCount} positivas</span>
            <span>{negativeCount} negativas ✗</span>
          </div>
        </div>

        {/* Recomendación Steam */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-400">Aprobación Muestra Steam</span>
            <span className="font-bold text-blue-400">{steamVotedUpPct}% sí</span>
          </div>
          <div className="w-full h-2 bg-[#080b11] rounded overflow-hidden border border-[#1b2434]">
            <div
              className="h-full bg-blue-500 transition-all duration-700 ease-out"
              style={{ width: `${steamVotedUpPct}%` }}
            />
          </div>
        </div>

        {/* Resumen táctico */}
        <div className="bg-[#080b11] border border-[#1b2434] rounded-lg p-3 text-xs text-slate-400 leading-relaxed">
          <span className="text-slate-300 font-bold">Diagnóstico: </span>
          Analizadas <strong className="text-slate-200">{totalReviewsAnalyzed} reseñas</strong> en español. El sentimiento general es mayoritariamente{' '}
          <span className={`font-bold ${verdictConfig.text}`}>
            {sentimentStats.positives_pct >= 50 ? 'favorables' : 'críticas'}
          </span>
          , determinando un veredicto de <strong className={verdictConfig.text}>{recommendationLevel}</strong>.
        </div>
      </div>

      {/* Columna derecha: donut chart + contadores */}
      <div className="flex flex-col items-center gap-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider w-full text-center">
          Distribución de Votos
        </h3>

        {/* Gráfico Donut */}
        <div className="relative w-full" style={{ height: 140 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={62}
                paddingAngle={3}
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
            <span className="text-xl font-extrabold text-emerald-400 font-mono">
              {sentimentStats.positives_pct}%
            </span>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
              positivas
            </span>
          </div>
        </div>

        {/* Contadores Tácticos */}
        <div className="grid grid-cols-3 gap-2 w-full">
          <div className="bg-[#080b11] p-2.5 rounded border border-[#1b2434] text-center">
            <span className="text-base font-extrabold text-slate-100 font-mono">
              {totalReviewsAnalyzed}
            </span>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Total</p>
          </div>
          <div className="bg-[#080b11] p-2.5 rounded border border-emerald-500/20 text-center">
            <span className="text-base font-extrabold text-emerald-400 font-mono">
              {positiveCount}
            </span>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Positivas</p>
          </div>
          <div className="bg-[#080b11] p-2.5 rounded border border-rose-500/20 text-center">
            <span className="text-base font-extrabold text-rose-400 font-mono">
              {negativeCount}
            </span>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Negativas</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default SentimentChart;
