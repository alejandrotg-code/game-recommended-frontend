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

      <div className="w-full max-w-3xl mx-auto space-y-12 animate-fade-up py-6 sm:py-10">
        {/* ENCABEZADO CON TARJETA DEDICADA */}
        <section className="py-10 px-6 sm:px-10 rounded-3xl bg-gradient-to-b from-surface-2/80 via-surface/70 to-bg border border-line shadow-2xl text-center space-y-4">
          <div className="inline-flex items-center gap-2.5 bg-bg border border-line text-accent text-xs font-black px-4 py-2 rounded-full shadow-md">
            <Cpu className="size-4 text-accent" />
            <span>Arquitectura & Pipeline Técnico</span>
          </div>

          {/* Kicker */}
          <div className="flex items-center justify-center gap-2.5">
            <span className="h-px w-4 bg-accent" />
            <span className="text-[10px] font-display font-semibold tracking-[0.2em] uppercase text-ink-faint">
              Cómo funciona
            </span>
            <span className="h-px w-4 bg-accent" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-bold text-ink tracking-tight">
            ¿Cómo Funciona el Motor de Análisis?
          </h1>
          <p className="text-ink-soft text-xs sm:text-sm max-w-lg mx-auto leading-relaxed font-normal">
            Proceso paso a paso desde que solicitas la búsqueda hasta la generación del veredicto con Inteligencia Artificial.
          </p>
        </section>

        {/* TIMELINE CON TARJETAS ESTRUCTURADAS */}
        <section className="space-y-5">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="bg-surface border border-line hover:border-accent/50 p-6 rounded-3xl shadow-xl flex gap-5 items-start transition-all"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="w-12 h-12 rounded-2xl bg-bg border border-line flex items-center justify-center shrink-0 shadow-inner">
                {step.icon}
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <h3 className="text-sm sm:text-base font-display font-bold text-ink">
                    {step.title}
                  </h3>
                  <span className="text-xs font-mono font-bold text-ink-soft bg-bg border border-line px-3 py-1 rounded-xl shrink-0">
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
        <section className="bg-surface border border-line rounded-3xl p-6 sm:p-8 text-center space-y-3 border-l-8 border-l-accent shadow-2xl">
          <div className="flex items-center justify-center gap-2.5">
            <Zap className="size-5 text-accent" />
            <h4 className="text-sm font-display font-bold text-ink uppercase tracking-wider">
              La Ventaja del Análisis Semántico NLP
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft max-w-lg mx-auto leading-relaxed font-normal">
            A diferencia del porcentaje nativo de Steam (basado en un simple clic de me gusta), nuestro modelo examina <strong className="text-ink font-bold">el texto real de las opiniones escritas en español</strong> para detectar modismos, sarcasmos y desglosar los puntos fuertes y débiles.
          </p>
        </section>

        {/* SECCIÓN FAQ CON TARJETAS DEDICADAS */}
        <section className="space-y-6 pt-4 border-t border-line">
          <div className="flex items-center gap-2.5 justify-center">
            <HelpCircle className="size-5 text-accent" />
            <h3 className="text-sm sm:text-base font-display font-bold text-ink uppercase tracking-wider">
              Preguntas Frecuentes (FAQ)
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-surface border border-line p-6 rounded-2xl space-y-2 shadow-lg">
                <h4 className="text-xs sm:text-sm font-extrabold text-ink flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-accent shrink-0" />
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
        <section id="aviso-legal" className="bg-surface border border-line rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="size-6 text-positive shrink-0" />
            <h3 className="text-sm sm:text-base font-display font-bold text-ink uppercase tracking-wider">
              Aviso Legal, Transparencia & Exención de Responsabilidad
            </h3>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-ink-soft leading-relaxed font-normal">
            <p>
              <strong className="text-ink font-bold">1. Ausencia de Tratamiento de Datos Personales:</strong> Este sitio web opera únicamente como una herramienta de consulta pública. No solicitamos, almacenamos ni procesamos ningún dato personal de los usuarios. No existen formularios de registro, inicio de sesión ni cookies de seguimiento o analíticas de terceros.
            </p>
            <p>
              <strong className="text-ink font-bold">2. Enlaces de Afiliación (LSSI-CE Art. 20):</strong> Algunos enlaces salientes hacia plataformas externas (Instant Gaming y G2A) incorporan identificadores de afiliado. Si el usuario decide realizar una compra tras acceder desde esta web, este servicio puede percibir una comisión sin coste adicional para el comprador, destinada al sostenimiento de la infraestructura de servidores de Inteligencia Artificial.
            </p>
            <p>
              <strong className="text-ink font-bold">3. Precios y Veredictos de IA:</strong> Las valoraciones y resúmenes son estimaciones automatizadas generadas por algoritmos NLP a partir de opiniones públicas de Steam. Los precios mostrados de tiendas de terceros son únicamente orientativos y pueden sufrir variaciones en el proceso de compra final.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}