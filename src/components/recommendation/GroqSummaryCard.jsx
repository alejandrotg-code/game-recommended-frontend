import { memo } from 'react';
import {
  Cpu,
  BookOpen,
  Swords,
  Wrench,
  ThumbsUp,
  ThumbsDown,
  Target,
  ChevronLeft,
  Sparkles,
  Check,
  X,
} from 'lucide-react';

const GroqSummaryCard = memo(function GroqSummaryCard({ groqSummary, onToggleAnalysis, embedded = false }) {
  if (!groqSummary) return null;

  const {
    executive_summary,
    story_summary,
    gameplay_summary,
    tech_and_bugs_summary,
    pros = [],
    cons = [],
    target_audience,
  } = groqSummary;

  if (!executive_summary && pros.length === 0) return null;

  const containerClasses = embedded
    ? 'p-2 sm:p-5 space-y-6 bg-transparent'
    : 'tactical-card p-5 sm:p-7 space-y-6 border border-accent/40 bg-surface shadow-2xl animate-fade-up';

  return (
    <div className={containerClasses}>
      {/* Cabecera del Informe Groq */}
      <div className="flex items-center justify-between border-b border-line pb-4 flex-wrap gap-2.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shrink-0 shadow-sm">
            <Cpu className="size-4.5 animate-pulse text-accent" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-display font-bold text-ink uppercase tracking-wider flex items-center gap-2">
              <span>Síntesis Inteligente de la Comunidad</span>
              <span className="text-[10px] font-mono bg-accent/15 text-accent border border-accent/30 px-2 py-0.5 rounded-full font-bold">
                Groq AI
              </span>
            </h3>
            <span className="text-[11px] text-ink-faint">
              Análisis semántico periodístico generado sobre reseñas reales en español
            </span>
          </div>
        </div>

        {onToggleAnalysis && (
          <button
            type="button"
            onClick={onToggleAnalysis}
            className="flex items-center gap-1.5 text-xs font-bold text-accent hover:text-white hover:bg-accent bg-accent/10 border border-accent/30 px-3 py-1.5 rounded-xl transition-all cursor-pointer btn-tactical"
            title="Volver a Análisis de Sentimiento"
          >
            <ChevronLeft className="size-3.5" />
            <span>Ver Métricas</span>
          </button>
        )}
      </div>

      {/* Resumen Ejecutivo */}
      {executive_summary && (
        <div className="space-y-2 bg-surface-2 border border-line p-4 sm:p-5 rounded-2xl relative overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold font-display uppercase tracking-wider text-accent">
            <Sparkles className="size-3.5" />
            <span>Resumen Ejecutivo</span>
          </div>
          <p className="text-xs sm:text-sm text-ink leading-relaxed font-normal italic">
            "{executive_summary}"
          </p>
        </div>
      )}

      {/* Grid de 3 Ejes: Jugabilidad, Historia, Rendimiento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {gameplay_summary && (
          <div className="bg-surface-2 border border-line p-4 sm:p-4.5 rounded-2xl space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-positive">
              <span className="p-1 rounded-lg bg-positive/15 border border-positive/30">
                <Swords className="size-3.5 shrink-0" />
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink font-display">Jugabilidad & Combate</h4>
            </div>
            <p className="text-xs text-ink-soft leading-relaxed font-normal">
              {gameplay_summary}
            </p>
          </div>
        )}

        {story_summary && (
          <div className="bg-surface-2 border border-line p-4 sm:p-4.5 rounded-2xl space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-violet-400">
              <span className="p-1 rounded-lg bg-violet-500/15 border border-violet-500/30 text-violet-400">
                <BookOpen className="size-3.5 shrink-0" />
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink font-display">Historia & Lore</h4>
            </div>
            <p className="text-xs text-ink-soft leading-relaxed font-normal">
              {story_summary}
            </p>
          </div>
        )}

        {tech_and_bugs_summary && (
          <div className="bg-surface-2 border border-line p-4 sm:p-4.5 rounded-2xl space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-warn">
              <span className="p-1 rounded-lg bg-warn/15 border border-warn/30">
                <Wrench className="size-3.5 shrink-0" />
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink font-display">Rendimiento & PC</h4>
            </div>
            <p className="text-xs text-ink-soft leading-relaxed font-normal">
              {tech_and_bugs_summary}
            </p>
          </div>
        )}
      </div>

      {/* Grid de Pros y Contras */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        {pros.length > 0 && (
          <div className="bg-positive/5 border border-positive/30 p-4 sm:p-5 rounded-2xl space-y-3 shadow-sm">
            <h4 className="text-xs font-bold text-positive flex items-center gap-2 uppercase tracking-wider font-display">
              <span className="p-1 bg-positive/20 rounded-lg border border-positive/40">
                <ThumbsUp className="size-3.5 shrink-0" />
              </span>
              <span>Puntos Fuertes (Elogios de la Comunidad)</span>
            </h4>
            <ul className="space-y-2 text-xs text-ink-soft">
              {pros.map((pro, idx) => (
                <li key={idx} className="flex items-start gap-2.5 min-w-0">
                  <span className="w-4 h-4 rounded-full bg-positive/20 text-positive flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black">
                    <Check className="size-2.5" />
                  </span>
                  <span className="break-words leading-relaxed text-ink-soft">{pro}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {cons.length > 0 && (
          <div className="bg-negative/5 border border-negative/30 p-4 sm:p-5 rounded-2xl space-y-3 shadow-sm">
            <h4 className="text-xs font-bold text-negative flex items-center gap-2 uppercase tracking-wider font-display">
              <span className="p-1 bg-negative/20 rounded-lg border border-negative/40">
                <ThumbsDown className="size-3.5 shrink-0" />
              </span>
              <span>Puntos Débiles (Críticas Recurrentes)</span>
            </h4>
            <ul className="space-y-2 text-xs text-ink-soft">
              {cons.map((con, idx) => (
                <li key={idx} className="flex items-start gap-2.5 min-w-0">
                  <span className="w-4 h-4 rounded-full bg-negative/20 text-negative flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black">
                    <X className="size-2.5" />
                  </span>
                  <span className="break-words leading-relaxed text-ink-soft">{con}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Perfil del Jugador Ideal */}
      {target_audience && (
        <div className="bg-accent/10 border border-accent/25 p-4 rounded-2xl flex items-start sm:items-center gap-3 shadow-sm">
          <div className="p-2 rounded-xl bg-accent/20 border border-accent/30 text-accent shrink-0">
            <Target className="size-5" />
          </div>
          <div className="text-xs leading-relaxed">
            <span className="font-extrabold text-accent mr-1.5 uppercase tracking-wide block sm:inline mb-0.5 sm:mb-0 font-display">
              Jugador Ideal Recomendado:
            </span>
            <span className="text-ink font-medium">{target_audience}</span>
          </div>
        </div>
      )}
    </div>
  );
});

export default GroqSummaryCard;