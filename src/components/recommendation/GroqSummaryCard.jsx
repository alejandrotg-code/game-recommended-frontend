import { memo } from 'react';
import { Cpu, BookOpen, Swords, Wrench, ThumbsUp, ThumbsDown, Target, ChevronLeft } from 'lucide-react';

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
    ? 'p-2 sm:p-4 space-y-6 bg-transparent'
    : 'tactical-card p-5 sm:p-7 space-y-6 border border-accent/30 bg-gradient-to-b from-surface-2/80 via-surface/70 to-bg shadow-2xl animate-fade-up';

  return (
    <div className={containerClasses}>
      {/* Cabecera del Informe Groq */}
      <div className="flex items-center justify-between border-b border-line pb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shrink-0">
            <Cpu className="size-4 animate-pulse text-accent" />
          </div>
          <div>
            <h3 className="text-xs font-display font-bold text-ink uppercase tracking-wider">
              Síntesis Inteligente de la Comunidad
            </h3>
            <span className="text-[10px] text-ink-faint font-mono">
              Generada por Groq AI sobre reseñas reales
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold bg-accent/10 text-accent border border-accent/20 px-2.5 py-1 rounded-full">
            Informe Desglosado
          </span>
          {onToggleAnalysis && (
            <button
              type="button"
              onClick={onToggleAnalysis}
              className="flex items-center gap-1 text-[11px] font-black text-accent hover:text-accent-2 bg-accent/10 hover:bg-accent/20 border border-accent/30 px-2.5 py-1 rounded-xl transition-all cursor-pointer btn-tactical"
              title="Volver a Análisis de Sentimiento"
            >
              <ChevronLeft className="size-3.5" />
              <span>Ver Análisis</span>
            </button>
          )}
        </div>
      </div>

      {/* Resumen Ejecutivo */}
      {executive_summary && (
        <div className="space-y-1.5 bg-bg/80 border border-line p-4 rounded-xl">
          <h4 className="text-xs font-extrabold text-accent flex items-center gap-2 uppercase tracking-wide">
            <span>Resumen Ejecutivo</span>
          </h4>
          <p className="text-xs sm:text-sm text-ink leading-relaxed font-normal">
            "{executive_summary}"
          </p>
        </div>
      )}

      {/* Grid de 3 Ejes: Historia, Jugabilidad, Estado Técnico */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {gameplay_summary && (
          <div className="bg-bg border border-line p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-positive">
              <Swords className="size-4 shrink-0" />
              <h5 className="text-xs font-bold uppercase tracking-wider text-ink-soft">Jugabilidad & Combate</h5>
            </div>
            <p className="text-xs text-ink-soft leading-relaxed font-normal">
              {gameplay_summary}
            </p>
          </div>
        )}

        {story_summary && (
          <div className="bg-bg border border-line p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-violet-400">
              <BookOpen className="size-4 shrink-0" />
              <h5 className="text-xs font-bold uppercase tracking-wider text-ink-soft">Historia & Lore</h5>
            </div>
            <p className="text-xs text-ink-soft leading-relaxed font-normal">
              {story_summary}
            </p>
          </div>
        )}

        {tech_and_bugs_summary && (
          <div className="bg-bg border border-line p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-warn">
              <Wrench className="size-4 shrink-0" />
              <h5 className="text-xs font-bold uppercase tracking-wider text-ink-soft">Rendimiento & PC</h5>
            </div>
            <p className="text-xs text-ink-soft leading-relaxed font-normal">
              {tech_and_bugs_summary}
            </p>
          </div>
        )}
      </div>

      {/* Grid de Pros y Contras */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1">
        {pros.length > 0 && (
          <div className="bg-positive/5 border border-positive/20 p-3.5 sm:p-4 rounded-xl space-y-2">
            <h5 className="text-xs font-bold text-positive flex items-center gap-2 uppercase tracking-wider">
              <ThumbsUp className="size-3.5 shrink-0" />
              <span>Puntos Fuertes (Pros)</span>
            </h5>
            <ul className="space-y-1.5 text-xs text-ink-soft">
              {pros.map((pro, idx) => (
                <li key={idx} className="flex items-start gap-2 min-w-0">
                  <span className="text-positive font-bold shrink-0">✓</span>
                  <span className="break-words leading-relaxed">{pro}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {cons.length > 0 && (
          <div className="bg-negative/5 border border-negative/20 p-3.5 sm:p-4 rounded-xl space-y-2">
            <h5 className="text-xs font-bold text-negative flex items-center gap-2 uppercase tracking-wider">
              <ThumbsDown className="size-3.5 shrink-0" />
              <span>Puntos Débiles (Contras)</span>
            </h5>
            <ul className="space-y-1.5 text-xs text-ink-soft">
              {cons.map((con, idx) => (
                <li key={idx} className="flex items-start gap-2 min-w-0">
                  <span className="text-negative font-bold shrink-0">✗</span>
                  <span className="break-words leading-relaxed">{con}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Perfil del Jugador Ideal */}
      {target_audience && (
        <div className="bg-accent/10 border border-accent/20 p-3.5 rounded-xl flex items-start sm:items-center gap-3">
          <Target className="size-5 text-accent shrink-0 mt-0.5 sm:mt-0" />
          <div className="text-xs leading-relaxed">
            <span className="font-extrabold text-accent mr-1.5 uppercase tracking-wide block sm:inline mb-0.5 sm:mb-0">Jugador Ideal:</span>
            <span className="text-ink">{target_audience}</span>
          </div>
        </div>
      )}
    </div>
  );
});

export default GroqSummaryCard;