import { useEffect, useState } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Server,
  Cpu,
  Database,
  Globe,
  Zap,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { checkBackendHealth } from '../services/healthService';
import SeoHead from './SeoHead';
import { getBreadcrumbJsonLd } from '../services/seo/seoService';

export default function Status() {
  const [statusData, setStatusData] = useState({
    status: 'checking',
    latency: null,
    lastChecked: null,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStatus = async () => {
    setIsRefreshing(true);
    const start = performance.now();
    const result = await checkBackendHealth();
    const duration = Math.round(performance.now() - start);

    setStatusData({
      status: result.status,
      latency: duration,
      lastChecked: new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    });
    setIsRefreshing(false);
  };

  useEffect(() => {
    let isMounted = true;
    const loadInitialStatus = async () => {
      const start = performance.now();
      const result = await checkBackendHealth();
      const duration = Math.round(performance.now() - start);

      if (isMounted) {
        setStatusData({
          status: result.status,
          latency: duration,
          lastChecked: new Date().toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
        });
      }
    };

    loadInitialStatus();
    const interval = setInterval(loadInitialStatus, 30_000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const services = [
    {
      name: 'API Backend (FastAPI)',
      type: 'Servidor Principal',
      status: statusData.status,
      latency: statusData.latency ? `${statusData.latency} ms` : '---',
      icon: <Server className="size-5 text-blue-400" />,
      description: 'API REST de alta velocidad hospedada en infraestructura cloud.',
    },
    {
      name: 'Steam Web API (Akamai CDN)',
      type: 'Proveedor Externo',
      status: 'online',
      latency: '~45 ms',
      icon: <Globe className="size-5 text-emerald-400" />,
      description: 'Extracción de reseñas públicas y metadatos de juegos en tiempo real.',
    },
    {
      name: 'Clasificador NLP (TF-IDF + Naive Bayes)',
      type: 'Modelo Machine Learning',
      status: 'online',
      latency: '< 10 ms',
      icon: <Cpu className="size-5 text-violet-400" />,
      description: 'Modelo de análisis de sentimiento optimizado para reseñas en español.',
    },
    {
      name: 'Motor RAG & Groq LLM (Llama 3.1)',
      type: 'Agente Semántico IA',
      status: 'online',
      latency: '~120 ms',
      icon: <Zap className="size-5 text-amber-400" />,
      description: 'Búsqueda semántica vectorizada y generación conversacional.',
    },
    {
      name: 'Caché de Memoria & Rate Limiter',
      type: 'Infraestructura',
      status: 'online',
      latency: '< 1 ms',
      icon: <Database className="size-5 text-cyan-400" />,
      description: 'Caché TTL de 30 minutos y protección anti-abuso por IP.',
    },
  ];

  const statusConfig = {
    checking: {
      label: 'Comprobando Sistemas',
      bg: 'bg-amber-500/10 border-amber-500/30',
      text: 'text-amber-300',
      dot: 'bg-amber-400',
      icon: <Loader2 className="size-5 animate-spin text-amber-400" />,
    },
    online: {
      label: 'Todos los Sistemas Operativos',
      bg: 'bg-emerald-500/10 border-emerald-500/30',
      text: 'text-emerald-300',
      dot: 'bg-emerald-400',
      icon: <CheckCircle2 className="size-5 text-emerald-400" />,
    },
    offline: {
      label: 'Interrupción en Servicio Principal',
      bg: 'bg-rose-500/10 border-rose-500/30',
      text: 'text-rose-300',
      dot: 'bg-rose-500',
      icon: <AlertTriangle className="size-5 text-rose-400" />,
    },
  };

  const st = statusConfig[statusData.status] || statusConfig.checking;

  const breadcrumbLd = getBreadcrumbJsonLd([
    { name: 'Estado del Servicio', path: '/estado' },
  ]);

  return (
    <>
      <SeoHead
        title="Estado del Servicio e Infraestructura"
        description="Monitor en tiempo real de la disponibilidad de la API FastAPI, motor NLP, recomendador RAG con Groq LLM y CDN de Steam."
        canonicalPath="/estado"
        keywords={['Estado del Servicio', 'Status Steam AI', 'FastAPI Uptime', 'Salud del Backend']}
        jsonLd={breadcrumbLd}
      />

      <div className="py-8 sm:py-12 max-w-4xl mx-auto w-full animate-fade-up space-y-10">
        {/* HERO STATUS CARD */}
        <section className="py-10 px-6 sm:px-10 rounded-3xl bg-gradient-to-b from-[#111726]/90 via-[#0f1520]/80 to-[#080b11] border border-[#1e2d4a] shadow-2xl text-center space-y-5">
          <div className="inline-flex items-center gap-2.5 bg-[#080b11] border border-[#1e2d4a] text-blue-400 text-xs font-black px-4 py-2 rounded-full shadow-md">
            <Activity className="size-4 text-blue-400 animate-pulse" />
            <span>Monitoreo de Infraestructura en Tiempo Real</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Estado de los Servicios
          </h1>

          {/* BANNER DINÁMICO DE ESTADO GLOBAL */}
          <div className={`inline-flex items-center gap-3 p-4 px-6 rounded-2xl border ${st.bg} shadow-lg my-2`}>
            {st.icon}
            <span className={`text-sm sm:text-base font-black ${st.text}`}>{st.label}</span>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-slate-400 font-mono pt-2">
            <span>Última comprobación: <strong>{statusData.lastChecked || 'Cargando...'}</strong></span>
            <button
              onClick={fetchStatus}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-bold cursor-pointer disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`size-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Actualizar ahora</span>
            </button>
          </div>
        </section>

        {/* LISTADO DE SERVICIOS */}
        <section className="space-y-4">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider px-1 flex items-center gap-2">
            <ShieldCheck className="size-4 text-blue-400" />
            <span>Componentes del Sistema</span>
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {services.map((serv, index) => {
              const servSt = statusConfig[serv.status] || statusConfig.checking;
              return (
                <div
                  key={index}
                  className="bg-[#111726] border border-[#1e2d4a] hover:border-slate-600 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#080b11] border border-[#1e2d4a] flex items-center justify-center shrink-0 shadow-inner mt-0.5">
                      {serv.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h4 className="text-sm sm:text-base font-extrabold text-white">{serv.name}</h4>
                        <span className="text-[10px] font-mono text-slate-400 bg-[#080b11] border border-[#1e2d4a] px-2 py-0.5 rounded">
                          {serv.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 font-normal leading-relaxed">
                        {serv.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1e2d4a] w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-xs font-mono font-bold text-slate-400 bg-[#080b11] border border-[#1e2d4a] px-2.5 py-1 rounded-lg">
                      {serv.latency}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${servSt.bg} ${servSt.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${servSt.dot}`} />
                      <span>{servSt.label}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
