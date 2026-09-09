import {
  Search,
  CloudDownload,
  Filter,
  Cpu,
  BarChart3,
  CheckCircle2,
  HelpCircle,
  Zap,
} from 'lucide-react';
import SeoHead from './SeoHead';
import { getBreadcrumbJsonLd, getFaqJsonLd } from '../services/seo/seoService';

const steps = [
  {
    num: '01',
    icon: <Search className="size-5 text-blue-400" />,
    title: 'Búsqueda e Identificación de Juego',
    description:
      'Escribes el título del juego, introduces su AppID o pegas la URL oficial de la tienda de Steam. El cliente frontend envía la solicitud al backend FastAPI de alta velocidad.',
    tech: 'React · Vite · Router v7',
  },
  {
    num: '02',
    icon: <CloudDownload className="size-5 text-emerald-400" />,
    title: 'Extracción de Reseñas en Español',
    description:
      'FastAPI consulta la API oficial de Steam recuperando las opiniones más recientes escritas específicamente en castellano para garantizar el análisis del mercado hispanohablante.',
    tech: 'FastAPI · Steam Web API',
  },
  {
    num: '03',
    icon: <Filter className="size-5 text-amber-400" />,
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
    icon: <BarChart3 className="size-5 text-cyan-400" />,
    title: 'Veredicto e Informe Táctico',
    description:
      'Se calcula el ratio de aprobación ponderado y se asigna el veredicto: <strong className="text-white">Extremadamente Recomendado</strong> (≥ 80%), <strong className="text-white">Recomendado</strong> (≥ 60%), <strong className="text-white">Mixto</strong> (≥ 40%) o <strong className="text-white">No Recomendado</strong> (&lt; 40%).',
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
        <section className="py-10 px-6 sm:px-10 rounded-3xl bg-gradient-to-b from-[#111726]/90 via-[#0f1520]/80 to-[#080b11] border border-[#1e2d4a] shadow-2xl text-center space-y-4">
          <div className="inline-flex items-center gap-2.5 bg-[#080b11] border border-[#1e2d4a] text-blue-400 text-xs font-black px-4 py-2 rounded-full shadow-md">
            <Cpu className="size-4 text-blue-400" />
            <span>Arquitectura & Pipeline Técnico</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            ¿Cómo Funciona el Motor de Análisis?
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed font-normal">
            Proceso paso a paso desde que solicitas la búsqueda hasta la generación del veredicto con Inteligencia Artificial.
          </p>
        </section>

        {/* TIMELINE CON TARJETAS ESTRUCTURADAS */}
        <section className="space-y-5">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="bg-[#111726] border border-[#1e2d4a] hover:border-blue-500/50 p-6 rounded-3xl shadow-xl flex gap-5 items-start transition-all"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="w-12 h-12 rounded-2xl bg-[#080b11] border border-[#1e2d4a] flex items-center justify-center shrink-0 shadow-inner">
                {step.icon}
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <h3 className="text-sm sm:text-base font-black text-white">
                    {step.title}
                  </h3>
                  <span className="text-xs font-mono font-bold text-slate-300 bg-[#080b11] border border-[#1e2d4a] px-3 py-1 rounded-xl shrink-0">
                    {step.tech}
                  </span>
                </div>
                <p
                  className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal"
                  dangerouslySetInnerHTML={{ __html: step.description }}
                />
              </div>
            </div>
          ))}
        </section>

        {/* NOTA VENTAJA NLP */}
        <section className="bg-[#111726] border border-[#1e2d4a] rounded-3xl p-6 sm:p-8 text-center space-y-3 border-l-8 border-l-blue-500 shadow-2xl">
          <div className="flex items-center justify-center gap-2.5">
            <Zap className="size-5 text-blue-400" />
            <h4 className="text-sm font-black text-white uppercase tracking-wider">
              La Ventaja del Análisis Semántico NLP
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed font-normal">
            A diferencia del porcentaje nativo de Steam (basado en un simple clic de me gusta), nuestro modelo examina <strong className="text-white font-bold">el texto real de las opiniones escritas en español</strong> para detectar modismos, sarcasmos y desglosar los puntos fuertes y débiles.
          </p>
        </section>

        {/* SECCIÓN FAQ CON TARJETAS DEDICADAS */}
        <section className="space-y-6 pt-4 border-t border-[#1e2d4a]">
          <div className="flex items-center gap-2.5 justify-center">
            <HelpCircle className="size-5 text-blue-400" />
            <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider">
              Preguntas Frecuentes (FAQ)
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-[#111726] border border-[#1e2d4a] p-6 rounded-2xl space-y-2 shadow-lg">
                <h4 className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-blue-400 shrink-0" />
                  <span>{faq.question}</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-6 font-normal">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
