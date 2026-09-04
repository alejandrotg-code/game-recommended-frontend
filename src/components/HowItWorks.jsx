const steps = [
  {
    num: '01',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    title: 'Búsqueda del videojuego',
    description:
      'Escribes el título del juego, introduces su AppID o pegas la URL oficial de la tienda. El cliente frontend envía la solicitud al backend FastAPI.',
    tech: 'React · Vite',
  },
  {
    num: '02',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    title: 'Extracción de reseñas en español',
    description:
      'FastAPI consulta la API pública de Steam recuperando las opiniones más recientes escritas en castellano para garantizar el análisis hispanohablante.',
    tech: 'FastAPI · Steam API',
  },
  {
    num: '03',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Limpieza de texto (NLP Pipeline)',
    description:
      'Se procesa el texto mediante expresiones regulares eliminando hashtags, emojis, enlaces y ruido de sintaxis, normalizando todo a minúsculas.',
    tech: 'Python · Regex · NLP',
  },
  {
    num: '04',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
      </svg>
    ),
    title: 'Clasificación Multinomial Naive Bayes',
    description:
      'El vectorizador TF-IDF convierte palabras en frecuencias ponderadas. El modelo clasificador predice si cada opinión es Positiva o Negativa según su semántica real.',
    tech: 'Naive Bayes · TF-IDF · Sklearn',
  },
  {
    num: '05',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Veredicto e Informe Táctico',
    description:
      'Se calcula el ratio de aprobación ponderado y se asigna el veredicto: <strong className="text-slate-200">Extremadamente Recomendado</strong> (≥ 80%), <strong className="text-slate-200">Recomendado</strong> (≥ 60%), <strong className="text-slate-200">Mixto</strong> (≥ 40%) o <strong className="text-slate-200">No Recomendado</strong> (< 40%).',
    tech: 'FastAPI · JSON Response',
  },
];

export default function HowItWorks() {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-fade-up">

      {/* Encabezado */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-[#0f1520] border border-[#1b2434] text-blue-400 text-xs font-semibold px-3 py-1 rounded-full mb-1">
          <span>Arquitectura & Pipeline Técnico</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          ¿Cómo Funciona el Motor de Análisis?
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
          Proceso paso a paso desde que solicitas la búsqueda hasta la generación del veredicto.
        </p>
      </div>

      {/* Timeline vertical */}
      <div className="space-y-3">
        {steps.map((step, i) => (
          <div
            key={step.num}
            className="tactical-card p-4 flex gap-4 items-start border border-[#1b2434]"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="w-8 h-8 rounded bg-[#080b11] border border-[#1b2434] flex items-center justify-center text-blue-400 shrink-0 text-xs font-mono font-bold">
              {step.num}
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-slate-200">
                  {step.title}
                </h3>
                <span className="text-[10px] font-mono text-slate-400 bg-[#080b11] border border-[#1b2434] px-2 py-0.5 rounded shrink-0">
                  {step.tech}
                </span>
              </div>
              <p
                className="text-xs text-slate-400 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: step.description }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Nota final */}
      <div className="tactical-card p-4 sm:p-5 text-center space-y-1.5 border-l-4 border-l-blue-500">
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">La Ventaja del Análisis NLP</h4>
        <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
          A diferencia del porcentaje nativo de Steam (basado en un clic positivo/negativo), nuestro modelo analiza <strong className="text-slate-200">el texto y semántica de las opiniones</strong> para detectar votaciones sesgadas o ironías.
        </p>
      </div>

    </div>
  );
}
