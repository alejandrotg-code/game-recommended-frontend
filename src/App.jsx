import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import GameSearch from './components/Input';
import RecommendationCard from './components/RecommendationCard';
import HowItWorks from './components/HowItWorks';

const API_BASE_URL = import.meta.env.VITE_API_URL_DEV;

function App() {
  // Estado 1: Para guardar los datos del juego seleccionado en la lista (ID, Nombre, Imagen, etc.)
  const [selectedGameInfo, setSelectedGameInfo] = useState(null);

  // Estado 2: Para guardar el resultado final del análisis que devuelve la IA del backend
  const [analysisResult, setAnalysisResult] = useState(null);

  // Estado 3: Controla si estamos en proceso de llamada al servidor (cargando)
  const [isLoading, setIsLoading] = useState(false);

  // Estado 4: Guarda mensajes de error en caso de que la API falle (ej. ID de juego inexistente)
  const [error, setError] = useState(null);

  // Estado 5: Texto de carga dinámico que cambia secuencialmente para entretener al usuario
  const [loadingStep, setLoadingStep] = useState(0);

  // Estado 6: Controla qué página/pestaña se visualiza ('home' o 'how-it-works')
  const [activePage, setActivePage] = useState('home');

  // Textos informativos sobre el proceso interno del backend
  const loadingTexts = [
    "Conectando con los servidores de Steam...",
    "Buscando reseñas escritas en español...",
    "Descargando las opiniones más recientes...",
    "Limpiando el texto de ruido (hashtags, menciones, emojis)...",
    "Enviando reseñas al modelo Naive Bayes...",
    "Clasificando cada opinión en Positiva o Negativa...",
    "Comparando resultados de la IA con la valoración oficial...",
    "Generando informe interactivo..."
  ];

  // EFECTO: Cambia el texto de carga cada 2 segundos mientras esté analizando
  useEffect(() => {
    let interval;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingTexts.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Función principal: Se ejecuta cuando el usuario selecciona un juego o pulsa "Analizar"
  const handleGameSelect = async (game) => {
    // 1. Limpiamos errores y resultados anteriores
    setError(null);
    setAnalysisResult(null);

    // 2. Guardamos la información básica del juego que nos llega del buscador
    setSelectedGameInfo(game);

    // 3. Activamos el estado de carga
    setIsLoading(true);

    try {
      // Realizamos la petición HTTP GET al endpoint de análisis del backend
      // Le pedimos por defecto que analice un límite de 30 reseñas recientes
      const response = await fetch(`${API_BASE_URL}/api/analyze/${game.id}?limit=30`);

      // Si la respuesta no es correcta (código HTTP != 200)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error del servidor (código ${response.status})`);
      }

      // Convertimos la respuesta a un objeto JSON
      const data = await response.json();

      // Guardamos el resultado del análisis de la IA en su estado
      setAnalysisResult(data);
    } catch (err) {
      console.error("Error al analizar el juego:", err);
      // Guardamos el mensaje de error para mostrárselo al usuario de forma clara
      setError(
        err.message ||
        "No se pudo conectar con el servidor de análisis. Comprueba si el backend está activo o si el AppID es correcto."
      );
    } finally {
      // Desactivamos el estado de carga al terminar (haya ido bien o mal)
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-slate-100 flex flex-col font-sans antialiased">
      {/* 1. Barra de navegación / Cabecera - Le pasamos el control de la página activa */}
      <Header activePage={activePage} setActivePage={setActivePage} />

      {/* 2. Área principal de contenido */}
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 flex flex-col justify-start">

        {/* RENDERIZADO CONDICIONAL DE PÁGINAS */}

        {/* CASO A: VISTA DE CÓMO FUNCIONA */}
        {activePage === 'how-it-works' && (
          <HowItWorks />
        )}

        {/* CASO B: VISTA DE INICIO (BUSCADOR Y ANÁLISIS) */}
        {activePage === 'home' && (
          <>
            {/* Título de bienvenida con degradado premium */}
            <div className="text-center mb-6 sm:mb-10 space-y-2 sm:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-200 to-teal-400 bg-clip-text text-transparent">
                Comprueba las reseñas con IA
              </h1>
              <p className="text-base md:text-lg text-slate-400 max-w-xl mx-auto">
                Nuestro modelo de Machine Learning lee las opiniones en español y te dice si de verdad vale la pena comprarlo.
              </p>
            </div>

            {/* 3. El componente buscador (Input con sugerencias) */}
            <div className="w-full mb-8">
              <GameSearch onGameSelect={handleGameSelect} isLoading={isLoading} />
            </div>

            {/* 4. Estado de error (Si algo sale mal) */}
            {error && (
              <div className="w-full bg-rose-500/10 border border-rose-500/30 p-4 sm:p-5 rounded-xl sm:rounded-2xl text-rose-400 text-sm flex gap-3 items-center animate-fade-in">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h4 className="font-bold text-rose-300">¡Vaya! Algo salió mal:</h4>
                  <p className="mt-0.5 opacity-90">{error}</p>
                </div>
              </div>
            )}

            {/* 5. Pantalla de carga animada (Mientras isLoading es true) */}
            {isLoading && (
              <div className="w-full py-16 flex flex-col items-center justify-center space-y-6 animate-pulse">

                {/* Animación central: Anillo giratorio con efecto de resplandor */}
                <div className="relative flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-brand-accent/20 border-t-brand-accent rounded-full animate-spin" />
                  <div className="absolute w-20 h-20 border border-brand-accent/10 rounded-full animate-ping opacity-25" />
                </div>

                {/* Texto informativo actual */}
                <div className="text-center space-y-2">
                  <p className="text-lg font-bold text-slate-100 transition-all duration-300">
                    {loadingTexts[loadingStep]}
                  </p>
                  <p className="text-xs text-slate-500">
                    Esto puede tardar unos segundos dependiendo de los servidores de Steam...
                  </p>
                </div>

                {/* Simulación visual de tarjetas cargando (Skeleton Loader) */}
                <div className="w-full bg-brand-card/20 border border-brand-border/40 p-6 rounded-2xl space-y-4 max-w-2xl mx-auto">
                  <div className="h-6 bg-slate-800/40 rounded-full w-2/3" />
                  <div className="h-4 bg-slate-800/40 rounded-full w-1/2" />
                  <div className="h-10 bg-slate-800/40 rounded-xl w-full mt-4" />
                </div>

              </div>
            )}

            {/* 6. Renderizar la tarjeta de recomendación cuando tengamos resultados */}
            {!isLoading && analysisResult && (
              <RecommendationCard result={analysisResult} gameInfo={selectedGameInfo} />
            )}

            {/* 7. Mensaje informativo inicial (Si no hay búsqueda ni carga) */}
            {!isLoading && !analysisResult && !error && (
              <div className="text-center py-10 sm:py-16 px-4 border border-dashed border-brand-border/40 rounded-2xl bg-brand-card/10 max-w-2xl mx-auto w-full mt-6">
                <span className="text-4xl">🤖</span>
                <h3 className="text-base font-bold text-slate-300 mt-4">Listo para analizar</h3>
                <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
                  Busca arriba tu juego favorito por su nombre, introduce su ID de Steam o pega la dirección web directa del juego.
                </p>
              </div>
            )}
          </>
        )}

      </main>

      {/* 8. Pie de página simple */}
      <footer className="w-full py-8 text-center text-xs text-slate-500 border-t border-brand-border/60 mt-auto">
        <p>Game Recommended AI © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;
