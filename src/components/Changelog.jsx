
const BADGE = {
  new: { label: 'Nuevo', bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  fix: { label: 'Fix', bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30' },
  improve: { label: 'Mejora', bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30' },
  perf: { label: 'Rendimiento', bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' },
  ui: { label: 'UI / UX', bg: 'bg-violet-500/15', text: 'text-violet-400', border: 'border-violet-500/30' },
};

const ENTRIES = [
  {
    version: '1.0.2',
    date: '8 de junio de 2026',
    type: 'new',
    title: 'URLs compartibles',
    items: [
      'Al analizar un juego, la URL se actualiza con ?game=ID&name=Nombre.',
      'Compartir el enlace carga automáticamente el análisis del juego indicado.',
      'Pestaña Changelog: sección para documentar cambios del proyecto de forma transparente.',
      'Indicador de salud del backend: punto de estado en el logo que consulta /health cada 60 s con tres estados visuales (comprobando, disponible, no disponible).',
      'Cancelación correcta de peticiones en vuelo al seleccionar otro juego (AbortController).',
      'Se evita mostrar el error "AbortError" al usuario cuando él mismo cambia de juego.',
      'Scroll automático al bloque de resultados tras finalizar el análisis.',
    ],
  },
  {
    version: '1.0.1',
    date: '4 de junio de 2026',
    type: 'improve',
    title: 'Cache en backend',
    items: [
      'Capa de caché inteligente con TTLCache (cachetools) sobre el backend FastAPI.',
      'Búsqueda de juegos cacheada 5 minutos; análisis de sentimiento cacheado 30 minutos.',
      'Threading.Lock por caché para garantizar thread-safety en entornos concurrentes.',
      'Maxsize acotado para evitar memory leaks.',
    ],
  },
  {
    version: '1.0.0',
    date: '26 de mayo de 2026',
    type: 'new',
    title: 'Lanzamiento inicial',
    items: [
      'Búsqueda de juegos por nombre, AppID o URL de la tienda de Steam.',
      'Análisis de reseñas en español con modelo Naive Bayes.',
      'Tarjeta de resultados con veredicto, distribución de sentimiento y muestra de reseñas.',
      'Página "¿Cómo funciona?" con explicación del pipeline de ML.',
      'Diseño dark mode con glassmorphism y animaciones de entrada.',
    ],
  },
];

// ── ICONO POR TIPO ────────────────────────────────────────────────────────────
function TypeIcon({ type }) {
  if (type === 'new') return (
    <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
  if (type === 'fix') return (
    <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  );
  if (type === 'improve') return (
    <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
  if (type === 'perf') return (
    <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
  // ui
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  );
}

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────
export default function Changelog() {
  const badge = (type) => BADGE[type] ?? BADGE.new;

  return (
    <section className="py-10 sm:py-14 max-w-2xl mx-auto w-full animate-fade-up">

      {/* Encabezado */}
      <div className="mb-10 sm:mb-14 text-center">
        <div className="inline-flex items-center gap-2 bg-violet-600/10 border border-violet-500/20 text-violet-400 text-[11px] font-semibold px-3 py-1.5 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Historial de versiones
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-50 mb-3">
          Changelog
        </h1>
        <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
          Aquí se documentan todos los cambios, mejoras y correcciones del proyecto de forma cronológica.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Línea vertical */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-violet-500/40 via-blue-500/20 to-transparent" />

        <ol className="space-y-8 pl-8">
          {ENTRIES.map((entry, idx) => {
            const b = badge(entry.type);
            const isLatest = idx === 0;
            return (
              <li key={entry.version} className="relative group">
                {/* Dot en la línea */}
                <span
                  className={`absolute -left-8 top-1.5 flex size-4 items-center justify-center rounded-full border transition-all duration-300
                    ${isLatest
                      ? 'bg-violet-500 border-violet-400 shadow-[0_0_8px_2px_rgba(139,92,246,0.5)] group-hover:shadow-[0_0_12px_4px_rgba(139,92,246,0.6)]'
                      : 'bg-[#0f172a] border-[#1e293b] group-hover:border-slate-500'
                    }`}
                >
                  {isLatest && <span className="size-1.5 rounded-full bg-white" />}
                </span>

                {/* Tarjeta */}
                <div className={`border rounded-2xl p-5 transition-all duration-300 group-hover:border-white/10 group-hover:bg-white/[0.03]
                  ${isLatest
                    ? 'border-violet-500/20 bg-violet-600/5'
                    : 'border-[#1e293b] bg-white/[0.015]'
                  }`}
                >
                  {/* Cabecera de la tarjeta */}
                  <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Versión */}
                      <span className="text-xs font-mono font-bold text-slate-300 bg-white/[0.06] border border-white/10 px-2 py-0.5 rounded-md">
                        v{entry.version}
                      </span>
                      {/* Badge de tipo */}
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${b.bg} ${b.text} ${b.border}`}>
                        <TypeIcon type={entry.type} />
                        {b.label}
                      </span>
                      {isLatest && (
                        <span className="text-[10px] font-semibold text-violet-400 bg-violet-500/10 border border-violet-500/25 px-2 py-0.5 rounded-full">
                          Más reciente
                        </span>
                      )}
                    </div>
                    {/* Fecha */}
                    <time className="text-[11px] text-slate-600 font-medium shrink-0">{entry.date}</time>
                  </div>

                  {/* Título de la release */}
                  <h2 className="text-sm font-bold text-slate-200 mb-2.5">{entry.title}</h2>

                  {/* Lista de cambios */}
                  <ul className="space-y-1.5">
                    {entry.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-400 leading-relaxed">
                        <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5 mt-0.5 shrink-0 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Footer de la sección */}
      <p className="text-center text-[11px] text-slate-700 mt-10">
        ¿Encontraste un bug? Abre un issue en{' '}
        <a
          href="https://github.com/alejandrotg-code"
          target="_blank"
          rel="noreferrer"
          className="text-slate-500 hover:text-slate-300 underline underline-offset-2 transition-colors"
        >
          GitHub
        </a>
        .
      </p>
    </section>
  );
}
