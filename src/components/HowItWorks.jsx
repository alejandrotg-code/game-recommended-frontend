import {
  Search,
  CloudDownload,
  Filter,
  Cpu,
  BarChart3,
  CheckCircle2,
  HelpCircle,
  Zap,
  ShieldCheck,
  ArrowDown,
} from 'lucide-react';
import SeoHead from './SeoHead';
import { getBreadcrumbJsonLd, getFaqJsonLd } from '../services/seo/seoService';

const steps = [
  {
    num: '01',
    icon: <Search className="size-5 text-accent" />,
    title: 'Búsqueda e Identificación de Juego',
    description:
      'Escribes el título del juego, introduces su AppID o pegas la URL oficial de la tienda de Steam. El cliente frontend envía la solicitud al backend FastAPI de alta velocidad.',
    tech: 'React · Vite · Router v7',
  },
  {
    num: '02',
    icon: <CloudDownload className="size-5 text-positive" />,
    title: 'Extracción de Reseñas en Español',
    description:
      'FastAPI consulta la API oficial de Steam recuperando las opiniones más recientes escritas específicamente en castellano para garantizar el análisis del mercado hispanohablante.',
    tech: 'FastAPI · Steam Web API',
  },
  {
    num: '03',
    icon: <Filter className="size-5 text-warn" />,
    title: 'Limpieza de Texto (NLP Pipeline)',
    description:
      'Se procesa el texto mediante expresiones regulares eliminando hashtags, emojis, enlaces web, caracteres nulos y ruido de sintaxis, normalizando todo a minúsculas.',
    tech: 'Python · NLTK · Regex',
  },
  {
    num: '04',
    icon: <Cpu className="size-5 text-violet-400" />,
    title: 'Clasificación Multinomial Naive Bayes',
    description:
      'El vectorizador TF-IDF convierte palabras en frecuencias ponderadas por relevancia. El modelo clasificador predice si cada opinión es Positiva o Negativa según su semántica real.',
    tech: 'Naive Bayes · TF-IDF · Scikit-Learn',
  },
  {
    num: '05',
    icon: <BarChart3 className="size-5 text-accent-2" />,
    title: 'Veredicto e Informe Táctico',
    description:
      'Se calcula el ratio de aprobación ponderado y se asigna el veredicto: <strong className="text-ink">Extremadamente Recomendado</strong> (≥ 80%), <strong className="text-ink">Recomendado</strong> (≥ 60%), <strong className="text-ink">Mixto</strong> (≥ 40%) o <strong className="text-ink">No Recomendado</strong> (&lt; 40%).',
    tech: 'FastAPI · JSON Response',
  },
];

const faqs = [
  {
    question: '¿Por qué es mejor este análisis que la nota global de Steam?',
    answer:
      'Steam sólo cuenta los clics positivos/negativos que pueden estar sesgados por review bombing o campañas externas. Nuestro modelo examina el contenido semántico real de las reseñas en español para detectar ironías y desglosar opiniones concretas.',
  },
  {
    question: '¿Qué idiomas admite el clasificador NLP?',
    answer:
      'Actualmente el modelo NLP de análisis de sentimiento está optimizado específicamente para opiniones en español. La búsqueda de juegos RAG también traduce automáticamente consultas del español al inglés si es necesario.',
  },
  {
    question: '¿Con qué frecuencia se actualiza la información?',
    answer:
      'Las consultas extraen las opiniones más recientes directamente de la API de Steam en tiempo real, respaldadas por un sistema de caché de 30 minutos para maximizar el rendimiento.',
  },
  {
    question: '¿Se recopilan mis datos personales al navegar o buscar en la web?',
    answer:
      'No. Este sitio web no recopila, almacena ni procesa ningún dato personal. No existen cuentas de usuario, formularios de registro ni cookies de seguimiento o analítica de terceros.',
  },
  {
    question: '¿Cómo funcionan los enlaces a tiendas de videojuegos (Instant Gaming, G2A)?',
    answer:
      'Los enlaces a tiendas digitales contienen parámetros de afiliación (conforme al Art. 20 de la LSSI-CE). Si decides comprar un juego a través de estos enlaces, el proyecto puede recibir una comisión de afiliado que contribuye al mantenimiento del servicio sin coste adicional para ti.',
  },
  {
    question: '¿Cómo puedo incluir el badge del veredicto en mi GitHub README?',
    answer:
      'Al realizar cualquier análisis de juego, la plataforma genera automáticamente una URL SVG y un fragmento Markdown listo para copiar y pegar en el archivo README.md de tus repositorios.',
  },
];

export default function HowItWorks() {
  const breadcrumbLd = getBreadcrumbJsonLd([
    { name: '¿Cómo funciona?', path: '/como-funciona' },
  ]);

  const faqLd = getFaqJsonLd(faqs);

  return (
    <>
      <SeoHead
        title="¿Cómo Funciona el Motor NLP de Steam?"
        description="Conoce el pipeline técnico de Inteligencia Artificial para análisis de sentimiento en opiniones de Steam: Extracción API, Limpieza Regex, TF-IDF y Clasificación Naive Bayes."
        canonicalPath="/como-funciona"
        keywords={[
          'Pipeline NLP',
          'Naive Bayes Steam',
          'TF-IDF Reseñas',
          'Análisis de Sentimiento Python',
          'FastAPI Machine Learning',
          'Game Recommended Arquitectura',
        ]}
        jsonLd={[breadcrumbLd, faqLd]}
      />

      <div className="w-full max-w-3xl mx-auto space-y-10 animate-fade-up py-6 sm:py-10">
        {/* HERO HEADER */}
        <section className="relative py-10 px-6 sm:px-10 rounded-3xl text-center space-y-4 overflow-hidden border border-line bg-surface/50 shadow-xl">
          <div aria-hidden="true" className="hero-light" />

          <div className="relative inline-flex items-center gap-2 bg-surface border border-line text-accent text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm">
            <Cpu className="size-4 text-accent animate-pulse" />
            <span>Arquitectura & Pipeline Técnico</span>
          </div>

          <h1 className="relative text-3xl sm:text-5xl font-display font-black tracking-tight text-ink">
            ¿Cómo Funciona el <span className="text-gradient">Motor de Análisis</span>?
          </h1>
          <p className="relative text-sm sm:text-base text-ink-soft max-w-lg mx-auto leading-relaxed font-normal">
            Proceso transparente desde que introduces el título hasta la emisión del veredicto con Inteligencia Artificial.
          </p>
        </section>

        {/* TIMELINE DE PASOS TÉCNICOS */}
        <section className="space-y-4 relative">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="tactical-card p-5 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-5 items-start transition-all hover:border-accent/50 shadow-md group"
            >
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-12 h-12 rounded-2xl bg-surface-2 border border-line flex items-center justify-center shrink-0 shadow-inner group-hover:border-accent/40 transition-colors">
                  {step.icon}
                </div>
                <span className="sm:hidden text-xs font-mono font-bold text-accent">
                  Paso {step.num}
                </span>
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-display font-bold text-ink flex items-center gap-2">
                    <span className="hidden sm:inline-block font-mono text-accent text-xs font-bold bg-accent/15 px-2 py-0.5 rounded-md border border-accent/30">
                      {step.num}
                    </span>
                    <span>{step.title}</span>
                  </h3>
                  <span className="text-[11px] font-mono font-bold text-ink-soft bg-surface-2 border border-line px-2.5 py-1 rounded-lg shrink-0">
                    {step.tech}
                  </span>
                </div>
                <p
                  className="text-xs sm:text-sm text-ink-soft leading-relaxed font-normal"
                  dangerouslySetInnerHTML={{ __html: step.description }}
                />
              </div>
            </div>
          ))}
        </section>

        {/* NOTA VENTAJA NLP */}
        <section className="tactical-card p-6 sm:p-8 text-center space-y-3 border-l-4 border-l-accent shadow-xl bg-surface-2/40">
          <div className="flex items-center justify-center gap-2">
            <Zap className="size-5 text-accent" />
            <h4 className="text-sm font-display font-bold text-ink uppercase tracking-wider">
              La Diferencia del Análisis Semántico NLP
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft max-w-xl mx-auto leading-relaxed font-normal">
            A diferencia de la puntuación nativa de Steam (un simple voto binario de me gusta/no me gusta), nuestro modelo examina <strong className="text-ink font-semibold">el contenido léxico real de las reseñas en español</strong> para clasificar el sentimiento veraz detrás de cada opinión.
          </p>
        </section>

        {/* SECCIÓN FAQ */}
        <section className="space-y-5 pt-4 border-t border-line">
          <div className="flex items-center gap-2 justify-center">
            <HelpCircle className="size-5 text-accent" />
            <h3 className="text-sm sm:text-base font-display font-bold text-ink uppercase tracking-wider">
              Preguntas Frecuentes (FAQ)
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="tactical-card p-5 sm:p-6 space-y-2 shadow-sm">
                <h4 className="text-xs sm:text-sm font-display font-bold text-ink flex items-start sm:items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-accent shrink-0 mt-0.5 sm:mt-0" />
                  <span>{faq.question}</span>
                </h4>
                <p className="text-xs sm:text-sm text-ink-soft leading-relaxed pl-6 font-normal">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECCIÓN AVISO LEGAL Y TRANSPARENCIA */}
        <section id="aviso-legal" className="tactical-card p-6 sm:p-8 space-y-4 shadow-xl border-t-2 border-t-positive">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="size-5 text-positive shrink-0" />
            <h3 className="text-sm sm:text-base font-display font-bold text-ink uppercase tracking-wider">
              Aviso Legal, Transparencia & Exención de Responsabilidad
            </h3>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-ink-soft leading-relaxed font-normal">
            <p>
              <strong className="text-ink font-semibold">1. Ausencia de Tratamiento de Datos Personales:</strong> Este servicio opera como una herramienta de consulta analítica. No recopilamos, almacenamos ni compartimos datos personales de los usuarios.
            </p>
            <p>
              <strong className="text-ink font-semibold">2. Enlaces de Afiliación (LSSI-CE Art. 20):</strong> Los enlaces hacia Instant Gaming y G2A contienen parámetros de afiliación que ayudan al mantenimiento de los servidores sin suponer ningún coste extra para el usuario.
            </p>
            <p>
              <strong className="text-ink font-semibold">3. Estimaciones Automatizadas:</strong> Las valoraciones y resúmenes son estimaciones predictivas calculadas por algoritmos NLP sobre opiniones públicas de la API de Steam.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}