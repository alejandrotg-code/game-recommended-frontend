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

function GithubIcon({ className = 'size-4' }) {
  return (
    <svg className={`${className} fill-current`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

const BADGE = {
  new: { label: 'Nuevo', bg: 'bg-positive/15', text: 'text-positive', border: 'border-positive/40', icon: <Sparkles className="size-3.5" /> },
  fix: { label: 'Fix', bg: 'bg-negative/15', text: 'text-negative', border: 'border-negative/40', icon: <Bug className="size-3.5" /> },
  improve: { label: 'Mejora', bg: 'bg-accent/15', text: 'text-accent', border: 'border-accent/40', icon: <TrendingUp className="size-3.5" /> },
  perf: { label: 'Rendimiento', bg: 'bg-warn/15', text: 'text-warn', border: 'border-warn/40', icon: <Zap className="size-3.5" /> },
  ui: { label: 'UI / UX', bg: 'bg-violet-500/15', text: 'text-violet-400', border: 'border-violet-500/40', icon: <Layout className="size-3.5" /> },
};

const ENTRIES = [
  {
    version: '2.3.0',
    date: '18 de septiembre de 2026',
    type: 'ui',
    title: 'Rediseño Integral de Experiencia y Sistema de Diseño UI/UX',
    items: [
      'Implementación del sistema de diseño uiux-designer con tokens semánticos de alto contraste WCAG AA.',
      'Transformación de la barra de búsqueda en consola táctica HUD con atajos de teclado y sugerencias enriquecidas.',
      'Nuevo escáner holográfico de carga con telemetría animada paso a paso y anillos concéntricos.',
      'Rediseño completo de RecommendationCard, SentimentChart y GroqSummaryCard con controles de pestañas segmentadas fluidos.',
      'Optimización de contraste en modo claro y modo oscuro, respetando accesibilidad y preferencias de reducción de movimiento.',
    ],
  },
  {
    version: '2.2.0',
    date: '9 de septiembre de 2026',
    type: 'new',
    title: 'Integración de Síntesis Inteligente de la Comunidad, Navegación con Flechas e Interfaz de Muestra',
    items: [
      'Integración unificada de la Síntesis Inteligente de la Comunidad (Groq AI) dentro de la tarjeta de análisis principal.',
      'Sistema de navegación interactiva con botón de flecha (ChevronRight) para conmutar dinámicamente entre el Análisis de la Muestra y el Resumen Ejecutivo IA.',
      'Acceso rápido en la cabecera de la gráfica de sentimiento (SentimentChart) para alternar al instante entre métricas estadísticas y el resumen desglosado.',
      'Incorporación de la tarjeta de muestra interactiva para Stardew Valley (AppID: 413150, Extremadamente Recomendado) en los estados iniciales.',
      'Añadidos botones tácticos de acceso directo a la Síntesis Inteligente en cada tarjeta de resultado del Recomendador RAG por IA.',
    ],
  },
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
      'Integración con Groq Cloud API para traducción automática inteligente de consultas (ES ➔ EN) y síntesis empática en español.',
      'Integración de enlaces monetizados con códigos de afiliados para Instant Gaming y G2A.',
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
      'Rediseño visual completo con estética Cyberpunk/Gaming: paneles glassmorphic con backdrop-blur y resplandor neón.',
      'Refactorización modular de RecommendationCard en subcomponentes especializados (SentimentChart, ReviewList, TopKeyWords).',
      'Optimización del rendimiento de renderizado en React usando React.memo y useMemo para el filtrado y cálculo de palabras clave.',
      'Manejo de excepciones visuales en React mediante un nuevo componente ErrorBoundary con pantalla de recuperación estética.',
      'Gestión del ciclo de vida del backend FastAPI refactorizado a lifespan para diferir la carga de modelos de ML al arranque.',
      'Prevención de fugas de memoria en RateLimitMiddleware mediante cachetools.TTLCache con expiración TTL automática.',
      'Atajo de teclado global "/" para enfocar la búsqueda e insignia resplandeciente "BETA" en la recomendación por IA.',
    ],
  },
  {
    version: '1.1.0',
    date: '16 de julio de 2026',
    type: 'new',
    title: 'Recomendación de juegos mediante Inteligencia Artificial (Keras/TensorFlow)',
    items: [
      'Nueva pestaña en la navegación "Recomendar por IA" para buscar títulos por descripciones complejas.',
      'Carga del modelo multietiqueta secuencial de Keras en el backend FastAPI.',
      'Optimización y reentrenamiento del modelo a 120 épocas sobre el catálogo de descripciones en español.',
      'Consulta en paralelo de la información en tiempo real de los juegos recomendados (precio y puntuación Metascore).',
      'Panel de visualización interactivo en el frontend con cuadrícula de juegos recomendados y enlaces directos a Steam.',
    ],
  },
  {
    version: '1.0.4',
    date: '11 de junio de 2026',
    type: 'improve',
    title: 'Análisis enriquecido con limitador, rutas, conceptos clave y badges',
    items: [
      'Selector interactivo de cantidad de reseñas en la interfaz (opciones: 10, 20 o 30 opiniones a analizar).',
      'Integración de react-router-dom para una navegación estructurada.',
      'Sincronización bidireccional del estado de búsqueda e ID de juego con los parámetros de la URL.',
      'Generación en tiempo real de "Conceptos Destacados" filtrando stopwords dinámicamente.',
      'Nuevo endpoint en backend que devuelve un escudo SVG dinámico embebible en GitHub.',
      'Metadatos ampliados del juego: desarrollador y fecha de lanzamiento de Steam.',
    ],
  },
  {
    version: '1.0.0',
    date: '26 de mayo de 2026',
    type: 'new',
    title: 'Lanzamiento inicial de Game Recommended AI',
    items: [
      'Búsqueda de juegos por nombre, AppID o URL de la tienda de Steam.',
      'Análisis de reseñas en español con modelo Naive Bayes.',
      'Tarjeta de resultados con veredicto, distribución de sentimiento y muestra de reseñas.',
      'Página "¿Cómo funciona?" con explicación del pipeline de ML.',
      'Diseño dark mode inicial con animaciones de entrada.',
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

      <section className="py-8 sm:py-12 max-w-3xl mx-auto w-full animate-fade-up space-y-10">
        {/* ENCABEZADO */}
        <div className="relative py-10 px-6 sm:px-10 rounded-3xl text-center space-y-4 overflow-hidden border border-line bg-surface/50 shadow-xl">
          <div aria-hidden="true" className="hero-light" />

          <div className="relative inline-flex items-center gap-2 bg-surface border border-line text-accent text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm">
            <History className="size-4 text-accent" />
            <span>Registro de Actualizaciones</span>
          </div>

          <h1 className="relative text-3xl sm:text-5xl font-display font-black tracking-tight text-ink">
            Changelog & <span className="text-gradient">Versiones</span>
          </h1>
          <p className="relative text-xs sm:text-sm text-ink-soft max-w-md mx-auto leading-relaxed">
            Evolución continua del motor de recomendación, modelos NLP, interfaz y experiencia de usuario.
          </p>
        </div>

        {/* TIMELINE DE RELEASES */}
        <div className="relative">
          {/* Línea vertical luminosa */}
          <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-accent via-accent/40 to-transparent" />

          <ol className="space-y-8 pl-10">
            {ENTRIES.map((entry, idx) => {
              const b = badge(entry.type);
              const isLatest = idx === 0;
              return (
                <li key={entry.version} className="relative group">
                  {/* Dot en la línea */}
                  <span
                    className={`absolute -left-[37px] top-3.5 flex size-5 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                      isLatest
                        ? 'bg-accent border-accent shadow-md shadow-accent/40'
                        : 'bg-surface border-line-strong group-hover:border-accent'
                    }`}
                  >
                    {isLatest && <span className="size-2 rounded-full bg-white animate-pulse" />}
                  </span>

                  {/* Tarjeta */}
                  <div
                    className={`tactical-card p-6 sm:p-7 space-y-3.5 shadow-lg transition-all duration-300 group-hover:border-line-strong ${
                      isLatest ? 'border-accent/40 shadow-accent/10 bg-surface' : ''
                    }`}
                  >
                    {/* Cabecera de la tarjeta */}
                    <div className="flex items-start justify-between gap-3 flex-wrap pb-3 border-b border-line">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Versión */}
                        <span className="text-xs font-mono font-bold text-ink bg-surface-2 border border-line px-2.5 py-1 rounded-xl shadow-inner">
                          v{entry.version}
                        </span>
                        {/* Badge de tipo */}
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full border ${b.bg} ${b.text} ${b.border}`}
                        >
                          {b.icon}
                          <span>{b.label}</span>
                        </span>
                        {isLatest && (
                          <span className="text-[10px] font-black text-accent bg-accent/15 border border-accent/30 px-2.5 py-0.5 rounded-full uppercase">
                            Más reciente
                          </span>
                        )}
                      </div>
                      {/* Fecha */}
                      <time className="text-xs text-ink-faint font-mono font-semibold shrink-0">{entry.date}</time>
                    </div>

                    {/* Título de la release */}
                    <h2 className="text-base sm:text-lg font-display font-bold text-ink">{entry.title}</h2>

                    {/* Lista de cambios */}
                    <ul className="space-y-2 pt-1">
                      {entry.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-ink-soft leading-relaxed font-normal">
                          <GitCommit className="size-4 mt-0.5 shrink-0 text-accent" />
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
        <p className="text-center text-xs text-ink-faint font-medium pt-4">
          Código abierto y transparente. Contribuciones y sugerencias en{' '}
          <a
            href="https://github.com/aletgdev"
            target="_blank"
            rel="noreferrer"
            className="text-ink hover:text-accent underline underline-offset-2 transition-colors font-bold inline-flex items-center gap-1.5"
          >
            <GithubIcon className="size-3.5 text-ink" />
            <span>GitHub @aletgdev</span>
          </a>
        </p>
      </section>
    </>
  );
}