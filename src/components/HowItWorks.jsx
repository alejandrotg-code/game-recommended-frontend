const steps = [
  {
    num: '01',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    color: 'blue',
    title: 'El usuario busca un juego',
    description:
      'El usuario escribe el nombre del juego, pega su ID de Steam o la URL de la tienda. El frontend llama al backend de FastAPI con ese identificador.',
    tech: 'React + Vite',
  },
  {
    num: '02',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    color: 'cyan',
    title: 'Extracción de reseñas en Steam',
    description:
      'FastAPI hace una petición a la API pública de Steam para obtener las reseñas más recientes escritas en español. Se filtra por idioma para analizar opiniones hispanohablantes.',
    tech: 'FastAPI · Steam API',
  },
  {
    num: '03',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color: 'purple',
    title: 'Limpieza de texto (NLP)',
    description:
      'Antes de clasificar, se aplican expresiones regulares en Python para eliminar ruido: emojis, hashtags, menciones y números. El texto se normaliza en minúsculas para mejorar la precisión del modelo.',
    tech: 'Python · Regex · NLP',
  },
  {
    num: '04',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
      </svg>
    ),
    color: 'emerald',
    title: 'Clasificación con Naive Bayes',
    description:
      'El vectorizador TF-IDF convierte las palabras en frecuencias matemáticas. El modelo <strong className="text-slate-300">Multinomial Naive Bayes</strong> (entrenado previamente e importado con Joblib) predice si cada reseña es Positiva o Negativa analizando la semántica real del texto.',
    tech: 'Naive Bayes · TF-IDF · Sklearn',
  },
  {
    num: '05',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    color: 'amber',
    title: 'Veredicto final',
    description:
      'Una vez clasificadas todas las reseñas individuales de la muestra, el backend calcula el ratio de opiniones positivas. Según el porcentaje de éxito, se determina el veredicto final: <strong className="text-slate-300">Extremadamente Recomendado</strong> (≥ 80%), <strong className="text-slate-300">Recomendado</strong> (≥ 60%), <strong className="text-slate-300">Mixto</strong> (≥ 40%) o <strong className="text-slate-300">No Recomendado</strong> (< 40%).',
    tech: 'Python · FastAPI · JSON',
  },
];

const colorMap = {
  blue:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    text: 'text-blue-400',    line: 'bg-blue-500/30' },
  cyan:    { bg: 'bg-cyan-500/10',    border: 'border-cyan-500/20',    text: 'text-cyan-400',    line: 'bg-cyan-500/30' },
  purple:  { bg: 'bg-purple-500/10',  border: 'border-purple-500/20',  text: 'text-purple-400',  line: 'bg-purple-500/30' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', line: 'bg-emerald-500/30' },
  amber:   { bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   text: 'text-amber-400',   line: 'bg-amber-500/30' },
};

export default function HowItWorks() {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-10 sm:space-y-14 animate-fade-up">

      {/* Encabezado */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[11px] font-semibold px-3 py-1.5 rounded-full mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Pipeline técnico
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-50 tracking-tight">
          ¿Cómo funciona{' '}
          <span className="gradient-text">Game Recommended AI</span>?
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Desde que buscas un juego hasta que obtienes el veredicto, esto es lo que ocurre por dentro.
        </p>
      </div>

      {/* Timeline vertical */}
      <div className="relative">
        {/* Línea conectora vertical (solo decorativa, oculta en móvil) */}
        <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-blue-500/30 via-purple-500/20 to-amber-500/20 hidden sm:block" />

        <div className="space-y-4 sm:space-y-6">
          {steps.map((step, i) => {
            const c = colorMap[step.color];
            return (
              <div
                key={step.num}
                className="relative flex gap-4 sm:gap-6 animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Icono del nodo */}
                <div className="shrink-0 relative z-10">
                  <div className={`w-12 h-12 rounded-2xl ${c.bg} border ${c.border} flex items-center justify-center ${c.text}`}>
                    {step.icon}
                  </div>
                </div>

                {/* Contenido */}
                <div className={`flex-1 bg-[#0a1628]/60 border border-[#1e293b]/80 rounded-2xl p-4 sm:p-5 hover:border-[#2d3f55] transition-all duration-200 group`}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${c.text} mb-1 block`}>
                        Paso {step.num}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-100 group-hover:text-white transition-colors">
                        {step.title}
                      </h3>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-1 rounded-lg shrink-0 ${c.bg} ${c.border} border ${c.text}`}>
                      {step.tech}
                    </span>
                  </div>
                  <p
                    className="text-xs sm:text-sm text-slate-400 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: step.description }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nota final */}
      <div className="bg-blue-600/5 border border-blue-500/15 rounded-2xl p-5 sm:p-6 text-center space-y-2">
        <span className="text-2xl">💡</span>
        <h4 className="text-sm font-bold text-slate-200">La ventaja clave</h4>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          A diferencia de la valoración oficial de Steam (basada en si el jugador clickó "Recomendar"), nuestro sistema analiza{' '}
          <strong className="text-slate-200">la semántica real de lo que escribe el jugador</strong>.
          Esto permite detectar review bombing o juegos con muchos "Me gusta" a pesar de tener opiniones negativas en el texto.
        </p>
      </div>

    </div>
  );
}
