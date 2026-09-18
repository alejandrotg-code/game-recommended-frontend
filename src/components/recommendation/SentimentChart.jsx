import { memo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, PieChart as PieChartIcon, ChevronRight, Sparkles } from 'lucide-react';

const DonutTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value, fill } = payload[0].payload;
  return (
    <div className="bg-surface border border-line px-3.5 py-2 rounded-xl text-xs shadow-2xl backdrop-blur-md">
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full shrink-0 shadow-sm" style={{ background: fill }} />
        <span className="text-ink-soft font-semibold">{name}:</span>
        <span className="font-mono font-black text-ink">{value}%</span>
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
    <div className="p-4 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 border-b border-line bg-surface/50">
      {/* Columna izquierda: Barras de progreso tácticas */}
      <div className="space-y-4 sm:space-y-5 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <BarChart3 className="size-4 text-accent shrink-0" />
            <h3 className="text-xs font-display font-bold text-ink-soft uppercase tracking-wider">
              <span>Métricas de Aprobación Semántica</span>
            </h3>
          </div>

          {onToggleSummary && (
            <button
              type="button"
              onClick={onToggleSummary}
              className="flex items-center gap-1.5 text-xs font-bold text-accent hover:text-white hover:bg-accent bg-accent/10 border border-accent/30 px-3 py-1 rounded-xl transition-all cursor-pointer group btn-tactical shrink-0 ml-auto"
              title="Ver Síntesis Inteligente de la Comunidad"
            >
              <span>Ver Síntesis IA</span>
              <ChevronRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {/* Clasificación automática NLP */}
        <div className="space-y-2.5 bg-surface-2 p-4 rounded-2xl border border-line shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-ink-soft flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-accent" />
              <span>Clasificador Machine Learning</span>
            </span>
            <span className="font-mono font-black text-positive">
              {sentimentStats.positives_pct}% positivo
            </span>
          </div>

          <div className="w-full h-3 bg-surface rounded-full overflow-hidden flex border border-line p-0.5 shadow-inner">
            <div
              className="h-full bg-positive rounded-full transition-all duration-700 ease-out shadow-sm shadow-positive/30"
              style={{ width: `${sentimentStats.positives_pct}%` }}
            />
            <div
              className="h-full bg-negative rounded-full transition-all duration-700 ease-out shadow-sm shadow-negative/30"
              style={{ width: `${sentimentStats.negatives_pct}%` }}
            />
          </div>

          <div className="flex justify-between text-xs font-mono pt-0.5">
            <span className="font-bold text-positive">
              ✓ {positiveCount} positivas
            </span>
            <span className="font-bold text-negative">
              {negativeCount} negativas ✗
            </span>
          </div>
        </div>

        {/* Aprobación Muestra Steam */}
        <div className="space-y-2.5 bg-surface-2 p-4 rounded-2xl border border-line shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-ink-soft">Aprobación de la Muestra en Steam</span>
            <span className="font-mono font-black text-accent">{steamVotedUpPct}% votos positivos</span>
          </div>
          <div className="w-full h-3 bg-surface rounded-full overflow-hidden border border-line p-0.5 shadow-inner">
            <div
              className="h-full bg-accent rounded-full transition-all duration-700 ease-out shadow-sm shadow-accent/30"
              style={{ width: `${steamVotedUpPct}%` }}
            />
          </div>
        </div>

        {/* Diagnóstico Táctico */}
        <div className="bg-surface-2 border border-line rounded-2xl p-4 text-xs text-ink-soft leading-relaxed font-normal shadow-sm">
          <span className="text-ink font-bold font-display uppercase tracking-wider block mb-1">
            Diagnóstico Táctico:
          </span>
          Se procesaron <strong className="text-ink font-semibold">{totalReviewsAnalyzed} opiniones</strong> recientes en español. El veredicto clasificado es predominantemente{' '}
          <span className={`font-bold ${verdictConfig.text}`}>
            {sentimentStats.positives_pct >= 50 ? 'favorable y entusiasta' : 'crítico y desaprobatorio'}
          </span>
          , situando el nivel de recomendación en <strong className={`font-black ${verdictConfig.text}`}>{recommendationLevel}</strong>.
        </div>
      </div>

      {/* Columna derecha: Donut chart + KPI Counter cards */}
      <div className="flex flex-col items-center justify-between gap-4 bg-surface-2 p-5 sm:p-6 rounded-2xl border border-line shadow-sm">
        <div className="flex items-center gap-2 w-full justify-center">
          <PieChartIcon className="size-4 text-accent" />
          <h3 className="text-xs font-display font-bold text-ink-soft uppercase tracking-wider text-center">
            Distribución Global de Sentimiento
          </h3>
        </div>

        {/* Gráfico Donut con Glow Focal */}
        <div className="relative w-full my-1" style={{ height: 170 }}>
          <div className="absolute -inset-4 rounded-full bg-accent/10 dark:bg-accent/5 blur-2xl pointer-events-none" />
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={74}
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
            <span className="text-2xl sm:text-3xl font-display font-black text-positive">
              {sentimentStats.positives_pct}%
            </span>
            <span className="text-[10px] text-ink-faint font-extrabold uppercase tracking-widest">
              positivas
            </span>
          </div>
        </div>

        {/* Contadores Tácticos KPI */}
        <div className="grid grid-cols-3 gap-2.5 w-full pt-1">
          <div className="bg-surface p-3 rounded-xl border border-line text-center shadow-sm">
            <span className="text-lg font-display font-black text-ink block">
              {totalReviewsAnalyzed}
            </span>
            <p className="text-[10px] text-ink-faint font-bold uppercase tracking-wider mt-0.5">Total</p>
          </div>
          <div className="bg-surface p-3 rounded-xl border border-positive/40 text-center shadow-sm">
            <span className="text-lg font-display font-black text-positive block">
              {positiveCount}
            </span>
            <p className="text-[10px] text-positive font-bold uppercase tracking-wider mt-0.5">Positivas</p>
          </div>
          <div className="bg-surface p-3 rounded-xl border border-negative/40 text-center shadow-sm">
            <span className="text-lg font-display font-black text-negative block">
              {negativeCount}
            </span>
            <p className="text-[10px] text-negative font-bold uppercase tracking-wider mt-0.5">Negativas</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default SentimentChart;