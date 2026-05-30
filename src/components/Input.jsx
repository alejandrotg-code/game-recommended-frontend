import { useState, useEffect, useRef } from 'react';

// CONFIGURACIÓN DE LA API:
// - Local: 'http://localhost:8000' (si ejecutas "uvicorn app:app --reload")
const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function GameSearch({ onGameSelect, isLoading }) {
  // Estado para controlar el texto escrito en el input
  const [query, setQuery] = useState('');

  // Estado para guardar la lista de sugerencias que devuelve el backend
  const [suggestions, setSuggestions] = useState([]);

  // Estado para saber si estamos buscando sugerencias (cargando el dropdown)
  const [isSearching, setIsSearching] = useState(false);

  // Estado para controlar si el dropdown de sugerencias debe estar visible
  const [showDropdown, setShowDropdown] = useState(false);

  // Referencia al contenedor principal para detectar clics fuera y cerrar el menú
  const containerRef = useRef(null);

  // EFECTO 1: Cerrar el menú de sugerencias si el usuario hace clic fuera del buscador
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Si el elemento clickeado no está dentro de nuestro contenedor, cerramos la lista
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    // Añadimos el evento de escucha al hacer clic
    document.addEventListener('mousedown', handleClickOutside);
    // Limpieza del evento cuando el componente se desmonte
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // EFECTO 2: Controlar la escritura con Debounce (retardo)
  // Esto evita enviar peticiones al backend en cada letra que escribe el usuario.
  // Espera a que el usuario deje de escribir por 350 milisegundos antes de buscar.
  useEffect(() => {
    // Si la búsqueda es muy corta o está vacía, no buscamos nada y limpiamos
    if (query.trim().length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    // Si el usuario escribe directamente un número largo (potencialmente un ID de Steam) o una URL,
    // no hace falta buscar sugerencias de texto, ya que probablemente quiera analizarlo directamente.
    const isNumeric = /^\d+$/.test(query.trim());
    const isUrl = query.includes('store.steampowered.com') || query.includes('app/');
    if (isNumeric || isUrl) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    // Iniciamos estado de búsqueda
    setIsSearching(true);
    setShowDropdown(true);

    // Creamos un temporizador (timer)
    const delayDebounceFn = setTimeout(async () => {
      try {
        // Hacemos la llamada al backend para buscar juegos por texto
        const response = await fetch(`${API_BASE_URL}/api/search?term=${encodeURIComponent(query)}`);

        if (response.ok) {
          const data = await response.json();
          // Guardamos los juegos devueltos en nuestro estado de sugerencias
          setSuggestions(data.games || []);
        } else {
          console.error("Error al buscar juegos sugeridos");
        }
      } catch (error) {
        console.error("Error de conexión al buscar sugerencias:", error);
      } finally {
        // Indicamos que terminó la búsqueda de sugerencias
        setIsSearching(false);
      }
    }, 350); // 350ms de espera

    // Si el usuario vuelve a escribir antes de los 350ms, este retorno cancela el temporizador anterior
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Función que maneja el envío del formulario (cuando pulsan Enter o el botón "Analizar")
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    // Intentamos extraer el ID de Steam si lo que pegaron fue una URL
    // Ejemplo: https://store.steampowered.com/app/1245620/ELDEN_RING/ -> 1245620
    const urlPattern = /store\.steampowered\.com\/app\/(\d+)/;
    const match = query.match(urlPattern);

    if (match && match[1]) {
      // Si era una URL válida, enviamos el ID extraído
      const gameId = match[1];
      onGameSelect({ id: gameId, name: `Juego de Steam (ID: ${gameId})` });
      setShowDropdown(false);
    } else if (/^\d+$/.test(query.trim())) {
      // Si era directamente un ID numérico escrito a mano
      const gameId = query.trim();
      onGameSelect({ id: gameId, name: `Juego de Steam (ID: ${gameId})` });
      setShowDropdown(false);
    } else {
      // Si escribieron texto normal:
      // Si hay sugerencias cargadas, seleccionamos la primera de la lista por comodidad
      if (suggestions.length > 0) {
        handleSelectSuggestion(suggestions[0]);
      } else {
        alert("Por favor, introduce un ID de juego de Steam válido, una URL oficial de la tienda, o selecciona un juego de las sugerencias mientras escribes.");
      }
    }
  };

  // Función al hacer clic en un juego de la lista flotante
  const handleSelectSuggestion = (game) => {
    // 1. Rellenamos el campo de texto con el nombre del juego seleccionado
    setQuery(game.name);
    // 2. Cerramos la lista de sugerencias
    setShowDropdown(false);
    // 3. Notificamos al componente principal (App.jsx) que se ha seleccionado este juego para analizar
    onGameSelect(game);
  };

  return (
    <div ref={containerRef} className="w-full relative">

      {/* FORMULARIO DEL BUSCADOR */}
      <form
        onSubmit={handleSubmit}
        className="w-full bg-brand-card/60 border border-brand-border p-2 rounded-2xl sm:rounded-full flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shadow-[0_0_50px_-12px_rgba(59,130,246,0.25)] focus-within:border-blue-500/50 transition-all"
      >

        <div className="flex items-center flex-1 min-w-0 gap-2">
          {/* Icono de Lupa */}
          <div className="pl-2 sm:pl-4 text-slate-500 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Input de búsqueda */}
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Escribe el nombre de un juego, pega su ID o la URL de Steam..."
            disabled={isLoading}
            className="flex-1 bg-transparent px-2 py-2.5 sm:py-3 text-sm text-slate-100 placeholder-slate-500 outline-none w-full disabled:opacity-50 min-w-0"
          />

          {/* Indicador de búsqueda en progreso para feedback visual del usuario */}
          {isSearching && (
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin shrink-0 mr-2" />
          )}
        </div>

        {/* Botón de Analizar */}
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="bg-brand-accent hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-sm font-bold px-6 py-3 rounded-xl sm:rounded-full transition-all cursor-pointer shadow-md active:scale-98 shrink-0 text-center w-full sm:w-auto"
        >
          {isLoading ? 'Analizando...' : 'Analizar Juego'}
        </button>

      </form>

      {/* DROPDOWN DE SUGERENCIAS FLOTANTE */}
      {showDropdown && (suggestions.length > 0 || (query.trim().length >= 2 && isSearching)) && (
        <div className="absolute left-0 right-0 mt-3 bg-brand-card/95 border border-brand-border rounded-2xl overflow-hidden shadow-2xl z-50 backdrop-blur-xl animate-fade-in">

          {/* Cabecera del listado */}
          <div className="px-4 py-2 border-b border-brand-border bg-slate-950/40 text-[10px] uppercase font-bold tracking-wider text-slate-500">
            Juegos encontrados en Steam
          </div>

          <ul className="max-h-80 overflow-y-auto divide-y divide-brand-border/40 custom-scrollbar">

            {/* Si está cargando y no hay sugerencias previas */}
            {isSearching && suggestions.length === 0 && (
              <li className="px-5 py-4 text-sm text-slate-400 text-center">
                Buscando juegos en la base de datos de Steam...
              </li>
            )}

            {/* Renderizar cada juego sugerido */}
            {suggestions.map((game) => (
              <li key={game.id}>
                <button
                  type="button"
                  onClick={() => handleSelectSuggestion(game)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 pr-4">
                    {/* Imagen pequeña del juego */}
                    {game.image ? (
                      <img
                        src={game.image}
                        alt={game.name}
                        className="w-12 h-6 object-cover rounded border border-brand-border/80 group-hover:border-slate-600 transition-all shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-6 bg-slate-800 rounded flex items-center justify-center shrink-0">
                        🎮
                      </div>
                    )}

                    {/* Nombre e ID */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors line-clamp-1">
                        {game.name}
                      </h4>
                      <span className="text-[10px] text-slate-500">ID: {game.id}</span>
                    </div>
                  </div>

                  {/* Precio e indicación visual */}
                  <div className="text-right flex items-center gap-3 shrink-0">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-semibold text-slate-300">{game.price}</span>
                      {game.metascore && game.metascore !== "N/A" && (
                        <span className="text-[9px] bg-yellow-950 text-yellow-400 px-1 rounded">
                          Meta: {game.metascore}
                        </span>
                      )}
                    </div>

                    {/* Icono de flecha que aparece al hacer hover */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>

                </button>
              </li>
            ))}

          </ul>
        </div>
      )}

    </div>
  );
}