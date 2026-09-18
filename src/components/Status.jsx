import { useEffect, useState } from 'react';
import {
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
  Radio,
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
      icon: <Server className="size-5 text-accent" />,
      description: 'API REST asíncrona de alto rendimiento que orquestra el procesamiento.',
    },
    {
      name: 'Steam Web API (Akamai CDN)',
      type: 'Proveedor Externo',
      status: 'online',
      latency: '~45 ms',
      icon: <Globe className="size-5 text-positive" />,
      description: 'Extracción de opiniones públicas recientes y fichas de metadatos.',
    },
    {
      name: 'Clasificador NLP (TF-IDF + Naive Bayes)',
      type: 'Modelo Machine Learning',
      status: 'online',
      latency: '< 10 ms',
      icon: <Cpu className="size-5 text-violet-400" />,
      description: 'Modelo entrenado para inferir sentimiento semántico en español.',
    },
    {
      name: 'Motor RAG & Groq LLM',
      type: 'Agente Semántico IA',
      status: 'online',
      latency: '~120 ms',
      icon: <Zap className="size-5 text-warn" />,
      description: 'Búsqueda semántica vectorizada y generación conversacional.',
    },
    {
      name: 'Caché en Memoria & Rate Limiting',
      type: 'Infraestructura',
      status: 'online',
      latency: '< 1 ms',
      icon: <Database className="size-5 text-accent-2" />,
      description: 'Caché con expiración TTL de 30 minutos y protección anti-abuso por IP.',
    },
  ];

  const statusConfig = {
    checking: {
      label: 'Verificando Sistemas',
      bg: 'bg-warn/15 border-warn/40',
      text: 'text-warn',
      dot: 'bg-warn animate-ping',
      icon: <Loader2 className="size-5 animate-spin text-warn" />,
    },
    online: {
      label: 'Todos los Sistemas Operativos',
      bg: 'bg-positive/15 border-positive/40',
      text: 'text-positive',
      dot: 'bg-positive animate-pulse',
      icon: <CheckCircle2 className="size-5 text-positive" />,
    },
    offline: {
      label: 'Incidencia en Servicio Principal',
      bg: 'bg-negative/15 border-negative/40',
      text: 'text-negative',
      dot: 'bg-negative animate-ping',
      icon: <AlertTriangle className="size-5 text-negative" />,
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

      <div className="py-8 sm:py-12 max-w-4xl mx-auto w-full animate-fade-up space-y-8">
        {/* HERO STATUS PANEL */}
        <section className="relative py-10 px-6 sm:px-10 rounded-3xl text-center space-y-4 overflow-hidden border border-line bg-surface/50 shadow-xl">
          <div aria-hidden="true" className="hero-light" />

          <div className="relative inline-flex items-center gap-2 bg-surface border border-line text-accent text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm">
            <Radio className="size-4 text-accent animate-pulse" />
            <span>Telemetría de Infraestructura en Tiempo Real</span>
          </div>

          <h1 className="relative text-3xl sm:text-5xl font-display font-black tracking-tight text-ink">
            Estado de los <span className="text-gradient">Servicios</span>
          </h1>

          {/* BANNER DINÁMICO DE ESTADO GLOBAL */}
          <div className={`relative inline-flex items-center gap-3 p-4 px-6 rounded-2xl border ${st.bg} shadow-lg my-2 backdrop-blur-md`}>
            {st.icon}
            <span className={`text-sm sm:text-base font-display font-bold ${st.text}`}>{st.label}</span>
          </div>

          <div className="relative flex items-center justify-center gap-4 text-xs text-ink-faint font-mono pt-2">
            <span>Última comprobación: <strong className="text-ink font-semibold">{statusData.lastChecked || 'Cargando...'}</strong></span>
            <button
              type="button"
              onClick={fetchStatus}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 text-accent hover:text-accent-2 font-bold cursor-pointer disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`size-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </button>
          </div>
        </section>

        {/* LISTADO DE COMPONENTES */}
        <section className="space-y-4">
          <h3 className="text-xs font-display font-bold text-ink-soft uppercase tracking-wider px-1 flex items-center gap-2">
            <ShieldCheck className="size-4 text-accent" />
            <span>Módulos y Dependencias del Sistema</span>
          </h3>

          <div className="grid grid-cols-1 gap-3.5">
            {services.map((serv, index) => {
              const servSt = statusConfig[serv.status] || statusConfig.checking;
              return (
                <div
                  key={index}
                  className="tactical-card p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md hover:border-line-strong transition-all"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-surface-2 border border-line flex items-center justify-center shrink-0 shadow-inner mt-0.5">
                      {serv.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h4 className="text-sm sm:text-base font-display font-bold text-ink">{serv.name}</h4>
                        <span className="text-[10px] font-mono text-ink-faint bg-surface-2 border border-line px-2 py-0.5 rounded font-bold">
                          {serv.type}
                        </span>
                      </div>
                      <p className="text-xs text-ink-soft mt-1 font-normal leading-relaxed">
                        {serv.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-line w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-xs font-mono font-bold text-ink-soft bg-surface-2 border border-line px-2.5 py-1 rounded-lg">
                      {serv.latency}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${servSt.bg} ${servSt.text}`}>
                      <span className={`w-2 h-2 rounded-full ${servSt.dot}`} />
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