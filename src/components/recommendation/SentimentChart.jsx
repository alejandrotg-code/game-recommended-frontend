import { memo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, PieChart as PieChartIcon, ChevronRight } from 'lucide-react';

const DonutTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value, fill } = payload[0].payload;
  return (
    <div className="bg-bg border border-line px-3 py-2 rounded-xl text-xs shadow-2xl">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: fill }} />
        <span className="text-ink-faint font-medium">{name}:</span>
        <span className="font-black text-ink">{value}%</span>
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
    { name: 'Positivas', value: sentimentStats.positives_pct, fill: 'var(--positive)' },
    { name: 'Negativas', value: sentimentStats.negatives_pct, fill: 'var(--negative)' },
  ];

  return (
    <div className="p-4 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 border-b border-line">
      {/* Columna izquierda: barras de progreso */}
      <div className="space-y-4 sm:space-y-5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <BarChart3 className="size-4 text-accent shrink-0" />
            <h3 className="text-xs font-display font-bold text-ink-soft uppercase tracking-wider">
              <span className="hidden xs:inline">Análisis de la Muestra (Español)</span>
              <span className="xs:hidden">Análisis Muestra</span>
            </h3>
          </div>

          {onToggleSummary && (
            <button
              type="button"
              onClick={onToggleSummary}
              className="flex items-center gap-1 text-[11px] font-extrabold text-accent hover:text-accent-2 bg-accent/10 hover:bg-accent/20 border border-accent/30 px-2.5 py-1 rounded-xl transition-all cursor-pointer group btn-tactical shrink-0 ml-auto"
              title="Ver Síntesis Inteligente de la Comunidad"
            >
              <span>Ver Resumen IA</span>
              <ChevronRight className="size-3.5 text-accent group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {/* Clasificación automática */}
        <div className="space-y-2 bg-bg p-4 rounded-xl border border-line">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-ink-faint">Clasificación automática</span>
            <span className="font-black text-positive">
              {sentimentStats.positives_pct}% positivo
            </span>
          </div>
          <div className="w-full h-2.5 bg-surface-2 rounded-full overflow-hidden flex border border-line p-0.5">
            <div
              className="h-full bg-positive rounded-full transition-all duration-700 ease-out"
              style={{ width: `${sentimentStats.positives_pct}%` }}
            />
            <div
              className="h-full bg-negative rounded-full transition-all duration-700 ease-out"
              style={{ width: `${sentimentStats.negatives_pct}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono pt-1">
            <span className="font-bold text-positive">
              ✓ {positiveCount} positivas
            </span>
            <span className="font-bold text-negative">
              {negativeCount} negativas ✗
            </span>
          </div>
        </div>

        {/* Aprobación Steam */}
        <div className="space-y-2 bg-bg p-4 rounded-xl border border-line">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-ink-faint">Aprobación Muestra Steam</span>
            <span className="font-black text-accent">{steamVotedUpPct}% sí</span>
          </div>
          <div className="w-full h-2.5 bg-surface-2 rounded-full overflow-hidden border border-line p-0.5">
            <div
              className="h-full bg-accent rounded-full transition-all duration-700 ease-out"
              style={{ width: `${steamVotedUpPct}%` }}
            />
          </div>
        </div>

        {/* Diagnóstico */}
        <div className="bg-bg border border-line rounded-xl p-4 text-xs text-ink-soft leading-relaxed font-normal">
          <span className="text-ink font-extrabold">Diagnóstico Táctico: </span>
          Analizadas <strong className="text-ink font-bold">{totalReviewsAnalyzed} reseñas</strong> en español. El sentimiento general es mayoritariamente{' '}
          <span className={`font-black ${verdictConfig.text}`}>
            {sentimentStats.positives_pct >= 50 ? 'favorables' : 'críticas'}
          </span>
          , determinando un veredicto de <strong className={`font-black ${verdictConfig.text}`}>{recommendationLevel}</strong>.
        </div>
      </div>

      {/* Columna derecha: donut chart + contadores */}
      <div className="flex flex-col items-center justify-between gap-5 bg-bg p-5 rounded-2xl border border-line">
        <div className="flex items-center gap-2 w-full justify-center">
          <PieChartIcon className="size-4 text-accent" />
          <h3 className="text-xs font-display font-bold text-ink-soft uppercase tracking-wider text-center">
            Distribución de Sentimiento
          </h3>
        </div>

        {/* Gráfico Donut */}
        <div className="relative w-full my-2" style={{ height: 160 }}>
          <div className="absolute -inset-3 rounded-full bg-accent/10 dark:bg-accent/5 blur-2xl pointer-events-none" />
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
            <span className="text-2xl font-display font-bold text-positive">
              {sentimentStats.positives_pct}%
            </span>
            <span className="text-[10px] text-ink-faint font-extrabold uppercase tracking-wider">
              positivas
            </span>
          </div>
        </div>

        {/* Contadores Tácticos */}
        <div className="grid grid-cols-3 gap-3 w-full pt-2">
          <div className="bg-surface-2 p-3 rounded-xl border border-line text-center shadow-inner hover:border-line-strong transition-colors">
            <span className="text-lg font-display font-bold text-ink block">
              {totalReviewsAnalyzed}
            </span>
            <p className="text-[9px] text-ink-faint font-extrabold uppercase tracking-wider mt-0.5">Total</p>
          </div>
          <div className="bg-surface-2 p-3 rounded-xl border border-positive/30 text-center shadow-inner">
            <span className="text-lg font-display font-bold text-positive block">
              {positiveCount}
            </span>
            <p className="text-[9px] text-ink-faint font-extrabold uppercase tracking-wider mt-0.5">Positivas</p>
          </div>
          <div className="bg-surface-2 p-3 rounded-xl border border-negative/30 text-center shadow-inner">
            <span className="text-lg font-display font-bold text-negative block">
              {negativeCount}
            </span>
            <p className="text-[9px] text-ink-faint font-extrabold uppercase tracking-wider mt-0.5">Negativas</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default SentimentChart;