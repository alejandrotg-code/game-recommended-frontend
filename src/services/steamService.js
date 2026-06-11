const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Busca juegos en Steam que coincidan con el término proporcionado.
 * @param {string} query Término de búsqueda.
 * @param {AbortSignal} [signal] Señal para cancelar la petición si hay una nueva.
 * @returns {Promise<Array>} Lista de juegos sugeridos.
 */
export async function searchGames(query, signal) {
  const response = await fetch(
    `${API_BASE_URL}/api/search?term=${encodeURIComponent(query)}`,
    { signal }
  );

  if (!response.ok) {
    throw new Error(`Error al buscar juegos sugeridos (código ${response.status})`);
  }

  const data = await response.json();
  return data.games || [];
}

/**
 * Solicita el análisis con IA de las reseñas de un juego específico.
 * @param {string|number} gameId ID de Steam del juego (AppID).
 * @param {number} limit Límite de reseñas recientes a analizar (por defecto 30).
 * @param {AbortSignal} [signal] Señal para cancelar la petición anterior si se lanza una nueva.
 * @returns {Promise<Object>} Resultado del análisis de la IA del backend.
 */
export async function analyzeGame(gameId, limit = 30, signal) {
  const response = await fetch(
    `${API_BASE_URL}/api/analyze/${gameId}?limit=${limit}`,
    { signal }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Error del servidor (código ${response.status})`);
  }

  return await response.json();
}
