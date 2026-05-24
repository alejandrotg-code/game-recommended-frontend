/**
 * Componente que explica el funcionamiento técnico y lógico de la aplicación.
 * Muestra el flujo de datos desde que el usuario busca un juego hasta que la IA predice el veredicto.
 */
export default function HowItWorks() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 animate-fade-in">

      {/* 1. Encabezado principal */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-50 tracking-tight">
          ¿Cómo funciona Game Recommended <span className="text-blue-400">AI</span>?
        </h2>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Descubre el proceso técnico, desde el procesamiento de texto hasta el modelo de inteligencia artificial que analiza las reseñas de Steam en español.
        </p>
      </div>

      {/* 2. Diagrama del pipeline visual (Diseño premium interactivo) */}
      <div className="bg-brand-card/40 border border-brand-border p-6 md:p-8 rounded-3xl shadow-xl space-y-6">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider text-center">
          Flujo de datos de la aplicación
        </h3>

        {/* Fila del diagrama en pantallas grandes, columnas en móvil */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center pt-4">

          {/* Nodo 1 */}
          <div className="bg-slate-950/60 border border-brand-border p-4 rounded-2xl text-center space-y-2">
            <span className="text-2xl">🔍</span>
            <h4 className="text-xs font-bold text-slate-200">1. Búsqueda</h4>
            <p className="text-[10px] text-slate-500">Usuario busca un juego en el buscador</p>
          </div>

          {/* Flecha 1 */}
          <div className="hidden md:flex justify-center text-blue-500/40 text-xl animate-pulse">➡️</div>
          <div className="flex md:hidden justify-center text-blue-500/40 text-xl">⬇️</div>

          {/* Nodo 2 */}
          <div className="bg-slate-950/60 border border-brand-border p-4 rounded-2xl text-center space-y-2">
            <span className="text-2xl">☁️</span>
            <h4 className="text-xs font-bold text-slate-200">2. Extracción</h4>
            <p className="text-[10px] text-slate-500">FastAPI solicita reseñas a la API de Steam</p>
          </div>

          {/* Flecha 2 */}
          <div className="hidden md:flex justify-center text-blue-500/40 text-xl animate-pulse">➡️</div>
          <div className="flex md:hidden justify-center text-blue-500/40 text-xl">⬇️</div>

          {/* Nodo 3 */}
          <div className="bg-slate-950/60 border border-brand-border p-4 rounded-2xl text-center space-y-2">
            <span className="text-2xl">🧹</span>
            <h4 className="text-xs font-bold text-slate-200">3. Limpieza</h4>
            <p className="text-[10px] text-slate-500">NLP limpia menciones, números y puntuación</p>
          </div>

          {/* Flecha 3 */}
          <div className="hidden md:flex justify-center text-blue-500/40 text-xl animate-pulse">➡️</div>
          <div className="flex md:hidden justify-center text-blue-500/40 text-xl">⬇️</div>

          {/* Nodo 4 */}
          <div className="bg-slate-950/60 border border-brand-border p-4 rounded-2xl text-center space-y-2">
            <span className="text-2xl">🧠</span>
            <h4 className="text-xs font-bold text-slate-200">4. Clasificación</h4>
            <p className="text-[10px] text-slate-500">Modelo Naive Bayes predice el sentimiento</p>
          </div>

          {/* Flecha 4 */}
          <div className="hidden md:flex justify-center text-blue-500/40 text-xl animate-pulse">➡️</div>
          <div className="flex md:hidden justify-center text-blue-500/40 text-xl">⬇️</div>

          {/* Nodo 5 */}
          <div className="bg-slate-950/60 border border-brand-border p-4 rounded-2xl text-center space-y-2">
            <span className="text-2xl">📊</span>
            <h4 className="text-xs font-bold text-slate-200">5. Reporte</h4>
            <p className="text-[10px] text-slate-500">Se calcula la aprobación y el veredicto</p>
          </div>

        </div>
      </div>

      {/* 3. Cuadrícula con explicaciones paso a paso */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Tarjeta Paso 1 */}
        <div className="bg-brand-card/30 border border-brand-border/80 p-6 rounded-2xl space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-sm">
              01
            </span>
            <h3 className="text-base font-bold text-slate-100">Extracción de datos</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Cuando seleccionas un juego, nuestro backend se comunica de forma asíncrona con el servicio público de opiniones de Steam. Descargamos un bloque de las opiniones más recientes escritas únicamente por jugadores hispanohablantes para analizar opiniones locales y culturales.
          </p>
        </div>

        {/* Tarjeta Paso 2 */}
        <div className="bg-brand-card/30 border border-brand-border/80 p-6 rounded-2xl space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-sm">
              02
            </span>
            <h3 className="text-base font-bold text-slate-100">Procesamiento de Lenguaje Natural (NLP)</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Las reseñas escritas por usuarios suelen contener ruido: hashtags, emojis, menciones o números. Antes de clasificar, aplicamos expresiones regulares en Python para normalizar el texto: convertimos todo a minúsculas y limpiamos los caracteres innecesarios para facilitar la lectura matemática del modelo.
          </p>
        </div>

        {/* Tarjeta Paso 3 */}
        <div className="bg-brand-card/30 border border-brand-border/80 p-6 rounded-2xl space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold text-sm">
              03
            </span>
            <h3 className="text-base font-bold text-slate-100">El modelo Naive Bayes</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Utilizamos un clasificador de Machine Learning llamado **Multinomial Naive Bayes** (entrenado previamente e importado con Joblib). El vectorizador transforma las palabras de la reseña en frecuencias matemáticas y la IA calcula las probabilidades para predecir si el tono del mensaje es positivo o negativo.
          </p>
        </div>

        {/* Tarjeta Paso 4 */}
        <div className="bg-brand-card/30 border border-brand-border/80 p-6 rounded-2xl space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold text-sm">
              04
            </span>
            <h3 className="text-base font-bold text-slate-100">Cálculo de Veredicto</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Una vez clasificadas todas las reseñas individuales de la muestra, el backend calcula el ratio de opiniones positivas. Según el porcentaje de éxito, se determina el veredicto final: **Extremadamente Recomendado** (≥ 80%), **Recomendado** (≥ 60%), **Mixto** (≥ 40%) o **No Recomendado** (&lt; 40%).
          </p>
        </div>

      </div>

      {/* 4. Pie informativo */}
      <div className="bg-blue-600/5 border border-blue-500/10 rounded-2xl p-5 text-center text-xs text-slate-400 leading-relaxed max-w-2xl mx-auto">
        <span className="text-base">💡</span>
        <p className="mt-1">
          La principal ventaja de este sistema es que analiza la <strong>semántica de lo que escribe el jugador</strong>, no solo si hizo clic en el botón de recomendar de Steam. Esto ayuda a detectar si un juego tiene reseñas negativas por "bombardeo de quejas" (review bombing) o si de verdad falla en su jugabilidad.
        </p>
      </div>

    </div>
  );
}
