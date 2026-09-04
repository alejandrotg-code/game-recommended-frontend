import { memo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const DonutTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value, fill } = payload[0].payload;
  return (
    <div className="bg-[#0a1628] border border-[#1e293b] px-3 py-2 rounded-xl text-xs shadow-2xl">
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
    <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
      {/* Columna izquierda: barras de progreso */}
      <div className="space-y-5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Aprobación de reseñas en español
        </h3>

        {/* Clasificación IA */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400 font-medium">Clasificación IA</span>
            <span className="font-bold text-emerald-400">
              {sentimentStats.positives_pct}% positivo
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-950/60 rounded-full overflow-hidden flex border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000 ease-out"
              style={{ width: `${sentimentStats.positives_pct}%` }}
            />
            <div
              className="h-full bg-rose-500/80 transition-all duration-1000 ease-out"
              style={{ width: `${sentimentStats.negatives_pct}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-600">
            <span>✓ {positiveCount} positivas</span>
            <span>{negativeCount} negativas ✗</span>
          </div>
        </div>

        {/* Recomendación Steam */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400 font-medium">Aprobación Muestra Steam</span>
            <span className="font-bold text-blue-400">{steamVotedUpPct}% sí</span>
          </div>
          <div className="w-full h-2 bg-slate-950/60 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-1000 ease-out"
              style={{ width: `${steamVotedUpPct}%` }}
            />
          </div>
        </div>

        {/* Resumen */}
        <div className="bg-slate-950/30 border border-white/5 rounded-xl p-4 text-xs text-slate-400 leading-relaxed">
          <strong className="text-slate-300">Resumen: </strong>
          Nuestro modelo leyó individualmente{' '}
          <span className="text-slate-200 font-semibold">
            {totalReviewsAnalyzed} reseñas
          </span>{' '}
          en español. Las opiniones son mayoritariamente{' '}
          <span className={`font-semibold ${verdictConfig.text}`}>
            {sentimentStats.positives_pct >= 50 ? 'favorables' : 'críticas'}
          </span>
          , resultando en un veredicto de{' '}
          <span className={`font-bold ${verdictConfig.text}`}>
            {recommendationLevel}
          </span>
          .
        </div>
      </div>

      {/* Columna derecha: donut chart + contadores */}
      <div className="flex flex-col items-center gap-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest w-full text-center">
          Distribución del sentimiento
        </h3>

        {/* Gráfico donut */}
        <div className="relative w-full" style={{ height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={72}
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
          {/* Texto central del donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-black text-emerald-400">
              {sentimentStats.positives_pct}%
            </span>
            <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">
              positivas
            </span>
          </div>
        </div>

        {/* Leyenda */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-400">Positivas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-400">Negativas</span>
          </div>
        </div>

        {/* Contadores */}
        <div className="grid grid-cols-3 gap-2 w-full">
          <div className="bg-slate-950/40 p-3 rounded-xl border border-white/5 text-center">
            <span className="text-xl font-black text-slate-100">
              {totalReviewsAnalyzed}
            </span>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">Total</p>
          </div>
          <div className="bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/15 text-center">
            <span className="text-xl font-black text-emerald-400">
              {positiveCount}
            </span>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">Positivas</p>
          </div>
          <div className="bg-rose-500/5 p-3 rounded-xl border border-rose-500/15 text-center">
            <span className="text-xl font-black text-rose-400">
              {negativeCount}
            </span>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">Negativas</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default SentimentChart;
