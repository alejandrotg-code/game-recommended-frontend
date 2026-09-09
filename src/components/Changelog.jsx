import { useEffect } from 'react';
import {
  Sparkles,
  Bug,
  TrendingUp,
  Zap,
  Layout,
  History,
  GitCommit,
} from 'lucide-react';
import SeoHead from './SeoHead';
import { getBreadcrumbJsonLd } from '../services/seo/seoService';
import { LATEST_CHANGELOG_VERSION } from '../constants/changelog';

function GithubIcon({ className = "size-4" }) {
  return (
    <svg className={`${className} fill-current`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

const BADGE = {
  new: { label: 'Nuevo', bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/40', icon: <Sparkles className="size-3.5" /> },
  fix: { label: 'Fix', bg: 'bg-rose-500/20', text: 'text-rose-300', border: 'border-rose-500/40', icon: <Bug className="size-3.5" /> },
  improve: { label: 'Mejora', bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/40', icon: <TrendingUp className="size-3.5" /> },
  perf: { label: 'Rendimiento', bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/40', icon: <Zap className="size-3.5" /> },
  ui: { label: 'UI / UX', bg: 'bg-violet-500/20', text: 'text-violet-300', border: 'border-violet-500/40', icon: <Layout className="size-3.5" /> },
};

const ENTRIES = [
  {
    version: '2.1.0',
    date: '9 de septiembre de 2026',
    type: 'ui',
    title: 'Optimización SEO Integral, Integración de Lucide & Sistema de Componentes Tactical',
    items: [
      'Arquitectura SEO portátil framework-agnostic basada en constants/seo, canonicalUrl() y meta adaptables per-route.',
      'Soporte completo para datos estructurados JSON-LD (Schema.org WebSite, WebApplication, BreadcrumbList, FAQPage y SoftwareApplication).',
      'Etiquetas meta dinámicas Open Graph, Twitter Cards, manifest PWA, sitemap.xml y robots.txt listos para indexación en Google.',
      'Instalación de utilidades UI estilo shadcn (lucide-react, clsx, tailwind-merge, class-variance-authority).',
      'Refactorización visual con estética Steam Obsidian: botones interactivos, badges tácticos y tarjetas glassmorphic.',
    ],
  },
  {
    version: '2.0.0',
    date: '30 de julio de 2026',
    type: 'new',
    title: 'Migración a Agente RAG IA (Groq LLM) y Sistema de Afiliación',
    items: [
      'Migración completa de la recomendación heredada Keras a una arquitectura RAG en lenguaje natural sobre 10.000 juegos top de Steam.',
      'Búsqueda semántica e inteligencia conversacional impulsada por Groq LLM sobre el catálogo de Steam.',
      'Integración con Groq Cloud API (Llama 3.1 8B) para traducción automática inteligente de consultas (ES ➔ EN) y síntesis empática en español.',
      'Integración de enlaces monetizados con códigos de afiliados para Instant Gaming (igr=game-recommended) y G2A (gname=gamerecommended).',
      'Carga optimizada de carátulas en alta definición utilizando la CDN oficial de Steam Akamai.',
      'Limpieza completa del código obsoleto del modelo Keras en frontend y backend.',
    ],
  },
  {
    version: '1.2.0',
    date: '22 de julio de 2026',
    type: 'ui',
    title: 'Rediseño Cyberpunk/Gaming, optimización de ciclo de vida de ML y resiliencia con ErrorBoundary',
    items: [
      'Rediseño visual completo con estética Cyberpunk/Gaming: gradientes multidestello, paneles glassmorphic con backdrop-blur y resplandor neón.',
      'Refactorización modular de RecommendationCard en subcomponentes especializados (SentimentChart, ReviewList, TopKeyWords).',
      'Optimización del rendimiento de renderizado en React usando React.memo y useMemo para el filtrado y cálculo de palabras clave.',
      'Manejo de excepciones visuales en React mediante un nuevo componente ErrorBoundary con pantalla de recuperación estética.',
      'Gestión del ciclo de vida del backend FastAPI refactorizado a @asynccontextmanager lifespan para diferir la carga de modelos de ML al arranque del servidor.',
      'Prevención de fugas de memoria en RateLimitMiddleware mediante cachetools.TTLCache con expiración de tiempo de vida (TTL) automática por IP.',
      'Atajo de teclado global "/" para enfocar la búsqueda e insignia resplandeciente "BETA" en la recomendación por IA.',
      'Creación de suite de pruebas unitarias para componentes UI con React Testing Library y Vitest.',
    ],
  },
  {
    version: '1.1.0',
    date: '16 de julio de 2026',
    type: 'new',
    title: 'Recomendación de juegos mediante Inteligencia Artificial (Keras/TensorFlow)',
    items: [
      'Nueva pestaña en la navegación "Recomendar por IA" para buscar títulos por descripciones complejas.',
      'Carga del modelo multietiqueta secuencial de Keras (game_classifier_keras.keras), el vectorizador de texto y el binarizador de géneros en el backend FastAPI.',
      'Optimización y reentrenamiento del modelo a 120 épocas sobre el catálogo de descripciones en español para mejorar drásticamente la representatividad semántica y evitar el sesgo de predicción por defecto.',
      'Módulo de recomendación en backend que filtra el catálogo local de juegos por el género predicho con mayor probabilidad.',
      'Consulta en paralelo (asyncio.gather) de la información en tiempo real de los juegos recomendados (precio y puntuación Metascore en Steam).',
      'Panel de visualización interactivo en el frontend con barras de probabilidad porcentual para cada género y una cuadrícula de juegos recomendados con enlaces directos a la tienda de Steam.',
    ],
  },
  {
    version: '1.0.4',
    date: '11 de junio de 2026',
    type: 'improve',
    title: 'Análisis enriquecido con limitador, rutas, conceptos clave y badges',
    items: [
      'Selector interactivo de cantidad de reseñas en la interfaz (opciones: 10, 20 o 30 opiniones a analizar).',
      'Integración de react-router-dom para una navegación estructurada a través de las rutas /, /como-funciona y /changelog.',
      'Sincronización bidireccional del estado de búsqueda e ID de juego con los parámetros de la URL usando useSearchParams.',
      'Generación en tiempo real de "Conceptos Destacados" (nube de palabras adaptativa) para identificar rápidamente los elogios y críticas principales sobre cada juego, filtrando stopwords del español de forma dinámica.',
      'Nuevo endpoint en backend (/api/games/{app_id}/badge) que devuelve un escudo SVG dinámico embebible en GitHub con el veredicto del análisis.',
      'Metadatos ampliados del juego: se consultan y muestran géneros, desarrollador y fecha de lanzamiento de Steam en la tarjeta de resultados.',
    ],
  },
  {
    version: '1.0.3',
    date: '10 de junio de 2026',
    type: 'improve',
    title: 'Mejora del modelo de clasificación',
    items: [
      'Reentrenamiento del clasificador de sentimiento mediante un ensemble de Complement Naive Bayes, Linear SVC y Logistic Regression con soft voting.',
      'Vectorización actualizada a TF-IDF con bigramas para mejorar la captura de contexto negativo.',
      'Optimización del preprocesamiento de texto y limpieza de reseñas en español.',
    ],
  },
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

export default function Changelog() {
  useEffect(() => {
    try {
      localStorage.setItem('seen_changelog_version', LATEST_CHANGELOG_VERSION);
    } catch {
      // Fallback
    }
  }, []);

  const badge = (type) => BADGE[type] ?? BADGE.new;

  const breadcrumbLd = getBreadcrumbJsonLd([
    { name: 'Changelog', path: '/changelog' },
  ]);

  return (
    <>
      <SeoHead
        title="Historial de Versiones y Cambios"
        description="Historial cronológico de actualizaciones, nuevas características, mejoras visuales y optimizaciones en Game Recommended AI."
        canonicalPath="/changelog"
        keywords={['Changelog', 'Historial de versiones', 'Novedades Game Recommended', 'Updates Steam AI']}
        jsonLd={breadcrumbLd}
      />

      <section className="py-8 sm:py-12 max-w-3xl mx-auto w-full animate-fade-up space-y-12">
        {/* ENCABEZADO CON TARJETA DEDICADA */}
        <div className="py-10 px-6 sm:px-10 rounded-3xl bg-gradient-to-b from-[#111726]/90 via-[#0f1520]/80 to-[#080b11] border border-[#1e2d4a] shadow-2xl text-center space-y-4">
          <div className="inline-flex items-center gap-2.5 bg-[#080b11] border border-[#1e2d4a] text-violet-400 text-xs font-black px-4 py-2 rounded-full shadow-md">
            <History className="size-4 text-violet-400" />
            <span>Historial de versiones</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Changelog
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
            Aquí se documentan todos los cambios, mejoras y correcciones del proyecto de forma cronológica.
          </p>
        </div>

        {/* TIMELINE CON TARJETAS ESTRUCTURADAS */}
        <div className="relative">
          {/* Línea vertical */}
          <div className="absolute left-[9px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-500 via-violet-500/40 to-transparent" />

          <ol className="space-y-10 pl-10">
            {ENTRIES.map((entry, idx) => {
              const b = badge(entry.type);
              const isLatest = idx === 0;
              return (
                <li key={entry.version} className="relative group">
                  {/* Dot en la línea */}
                  <span
                    className={`absolute -left-[39px] top-3 flex size-5 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                      isLatest
                        ? 'bg-blue-500 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.8)]'
                        : 'bg-[#080b11] border-[#1e2d4a] group-hover:border-slate-400'
                    }`}
                  >
                    {isLatest && <span className="size-2 rounded-full bg-white animate-pulse" />}
                  </span>

                  {/* Tarjeta */}
                  <div
                    className={`bg-[#111726] border rounded-3xl p-6 sm:p-8 transition-all duration-300 group-hover:border-slate-600 shadow-2xl space-y-4 ${
                      isLatest
                        ? 'border-blue-500/40 shadow-blue-900/20'
                        : 'border-[#1e2d4a]'
                    }`}
                  >
                    {/* Cabecera de la tarjeta */}
                    <div className="flex items-start justify-between gap-4 flex-wrap pb-3 border-b border-[#1e2d4a]/80">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        {/* Versión */}
                        <span className="text-xs font-mono font-black text-white bg-[#080b11] border border-[#1e2d4a] px-3 py-1 rounded-xl shadow-inner">
                          v{entry.version}
                        </span>
                        {/* Badge de tipo */}
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full border ${b.bg} ${b.text} ${b.border}`}
                        >
                          {b.icon}
                          {b.label}
                        </span>
                        {isLatest && (
                          <span className="text-[10px] font-black text-blue-300 bg-blue-500/25 border border-blue-500/40 px-2.5 py-1 rounded-full">
                            Más reciente
                          </span>
                        )}
                      </div>
                      {/* Fecha */}
                      <time className="text-xs text-slate-400 font-mono font-bold shrink-0">{entry.date}</time>
                    </div>

                    {/* Título de la release */}
                    <h2 className="text-base sm:text-lg font-black text-white">{entry.title}</h2>

                    {/* Lista de cambios */}
                    <ul className="space-y-2.5 pt-1">
                      {entry.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                          <GitCommit className="size-4 mt-0.5 shrink-0 text-blue-400" />
                          <span>{item}</span>
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
        <p className="text-center text-xs text-slate-400 font-medium mt-12">
          ¿Encontraste un error o deseas proponer una idea? Abre un issue en{' '}
          <a
            href="https://github.com/alejandrotg-code"
            target="_blank"
            rel="noreferrer"
            className="text-white hover:text-blue-400 underline underline-offset-2 transition-colors font-bold inline-flex items-center gap-1.5"
          >
            <GithubIcon className="size-4 text-white" />
            <span>GitHub</span>
          </a>
          .
        </p>
      </section>
    </>
  );
}
