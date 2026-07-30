const API_BASE_URL = import.meta.env.VITE_API_URLS;

/**
 * Verifica el estado de salud del backend (FastAPI).
 * @returns {Promise<Object>} Estado de salud, latencia y detalles.
 */
export async function checkBackendHealth() {
  const startTime = Date.now();
  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    const latency = Date.now() - startTime;

    if (!response.ok) {
      throw new Error(`Servidor respondió con código ${response.status}`);
    }

    const data = await response.json();
    return {
      status: 'online',
      latency,
      details: 'El servidor backend está operativo.',
      data: data,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'offline',
      latency: null,
      error: error.message || 'No se pudo conectar con el servidor backend.',
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Verifica la conectividad con la API de Steam realizando una búsqueda de prueba.
 * @returns {Promise<Object>} Estado de conexión de Steam, latencia y detalles.
 */
export async function checkSteamStatus() {
  const startTime = Date.now();
  try {
    // Realizamos una búsqueda rápida de un juego muy popular (Counter-Strike)
    const response = await fetch(`${API_BASE_URL}/api/search?term=Counter-Strike`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    const latency = Date.now() - startTime;

    if (!response.ok) {
      throw new Error(`El backend devolvió código de error ${response.status}`);
    }

    const data = await response.json();
    if (data && (Array.isArray(data.games) || Array.isArray(data))) {
      const gamesList = data.games || data;
      return {
        status: gamesList.length > 0 ? 'online' : 'degraded',
        latency,
        details: gamesList.length > 0
          ? `Comunicación con Steam establecida. Devolvió ${gamesList.length} juegos de prueba.`
          : 'La API de Steam no devolvió resultados para la búsqueda de prueba.',
        timestamp: new Date().toISOString()
      };
    } else {
      throw new Error('Formato de respuesta inválido del backend al buscar.');
    }
  } catch (error) {
    return {
      status: 'offline',
      latency: null,
      error: error.message || 'No se puede comunicar con la API de Steam.',
      timestamp: new Date().toISOString()
    };
  }
}
