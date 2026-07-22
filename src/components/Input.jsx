import { useState, useEffect, useRef, memo } from 'react';
import { searchGames } from '../services/steamService';

const GameSearch = memo(function GameSearch({ onGameSelect, isLoading }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [inputError, setInputError] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const searchAbortRef = useRef(null);

  // ── Atajo de teclado '/' para enfocar el buscador ─────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === '/' &&
        document.activeElement !== inputRef.current &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ── Cerrar dropdown al hacer clic fuera ──────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowDropdown(false);
        setIsFocused(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Debounce 350ms para buscar sugerencias ───────────────────────────────
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;

    const isNumeric = /^\d+$/.test(trimmed);
    const isUrl = trimmed.includes('store.steampowered.com') || trimmed.includes('app/');
    if (isNumeric || isUrl) return;

    // Cancelar la búsqueda anterior si existe
    if (searchAbortRef.current) searchAbortRef.current.abort();
    const controller = new AbortController();
    searchAbortRef.current = controller;

    const timer = setTimeout(async () => {
      try {
        const games = await searchGames(query, controller.signal);
        setSuggestions(games);
        setHighlightedIndex(-1);
      } catch (err) {
        // Ignoramos el error si fue cancelación intencional
        if (err.name !== 'AbortError') {
          console.error('Error buscando sugerencias:', err);
        }
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => {
      clearTimeout(timer);
    };
  }, [query]);

  // ── Envío del formulario ─────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const urlPattern = /store\.steampowered\.com\/app\/(\d+)/;
    const match = query.match(urlPattern);

    if (match && match[1]) {
      onGameSelect({ id: match[1], name: `Juego de Steam (ID: ${match[1]})` });
      setShowDropdown(false);
    } else if (/^\d+$/.test(query.trim())) {
      onGameSelect({ id: query.trim(), name: `Juego de Steam (ID: ${query.trim()})` });
      setShowDropdown(false);
    } else {
      if (suggestions.length > 0) {
        handleSelectSuggestion(suggestions[highlightedIndex >= 0 ? highlightedIndex : 0]);
      } else {
        // Error inline, no alert()
        setInputError('Selecciona un juego de las sugerencias, o introduce un ID o URL de Steam directamente.');
        setTimeout(() => setInputError(''), 4000);
      }
    }
  };

  // ── Seleccionar sugerencia ───────────────────────────────────────────────
  const handleSelectSuggestion = (game) => {
    setQuery(game.name);
    setShowDropdown(false);
    setIsFocused(false);
    setHighlightedIndex(-1);
    setInputError('');
    onGameSelect(game);
  };

  // ── Limpiar el campo ─────────────────────────────────────────────────────
  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
    setInputError('');
    setHighlightedIndex(-1);
    if (searchAbortRef.current) searchAbortRef.current.abort();
    inputRef.current?.focus();
  };

  // ── Navegación por teclado en el dropdown ────────────────────────────────
  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      setHighlightedIndex(-1);
    }
  };

  const showResults = showDropdown && (suggestions.length > 0 || (query.trim().length >= 2 && isSearching));

  return (
    <div ref={containerRef} className="w-full relative">

      {/* Borde aurora animado al enfocar */}
      {isFocused && (
        <div
          className="absolute -inset-[2px] rounded-[22px] sm:rounded-full z-0 opacity-70 blur-[2px]"
          style={{
            background: 'linear-gradient(90deg, #2563eb, #7c3aed, #0ea5e9, #2563eb)',
            backgroundSize: '300% 100%',
            animation: 'gradientShift 3s linear infinite',
          }}
        />
      )}

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className={`relative z-10 w-full bg-[#0a1628]/90 border p-1.5 rounded-[20px] sm:rounded-full flex flex-col sm:flex-row items-stretch sm:items-center gap-2 transition-all duration-300 ${
          isFocused ? 'border-transparent' : 'border-[#1e293b] shadow-[0_0_40px_-12px_rgba(37,99,235,0.2)]'
        }`}
      >
        <div className="flex items-center flex-1 min-w-0 gap-2">
          {/* Icono lupa */}
          <div className={`pl-3 sm:pl-4 shrink-0 transition-colors duration-200 ${isFocused ? 'text-blue-400' : 'text-slate-500'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="size-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Input de texto */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              const val = e.target.value;
              setQuery(val);
              setInputError('');
              const trimmed = val.trim();
              const isNumeric = /^\d+$/.test(trimmed);
              const isUrl = trimmed.includes('store.steampowered.com') || trimmed.includes('app/');
              if (trimmed.length < 2 || isNumeric || isUrl) {
                setSuggestions([]);
                setIsSearching(false);
              } else {
                setIsSearching(true);
                setShowDropdown(true);
              }
            }}
            onFocus={() => { setShowDropdown(true); setIsFocused(true); }}
            onKeyDown={handleKeyDown}
            placeholder="Busca un juego, pega su ID o URL de Steam..."
            className="flex-1 bg-transparent px-2 py-2.5 sm:py-3 text-sm text-slate-100 placeholder-slate-600 outline-none w-full min-w-0 font-medium"
            aria-autocomplete="list"
            aria-haspopup="listbox"
            aria-expanded={showDropdown}
          />

          {/* Indicador de búsqueda (puntos animados) */}
          {isSearching && (
            <div className="flex items-center gap-1 shrink-0">
              <span className="loading-dot" />
              <span className="loading-dot" />
              <span className="loading-dot" />
            </div>
          )}

          {/* Botón limpiar ✕ */}
          {query && !isSearching && (
            <button
              type="button"
              onClick={handleClear}
              className="text-slate-600 hover:text-slate-300 transition-colors shrink-0 p-1 rounded-full hover:bg-white/5 mr-1"
              aria-label="Limpiar búsqueda"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Botón analizar */}
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="relative overflow-hidden bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white text-sm font-bold px-5 sm:px-7 py-3 rounded-[14px] sm:rounded-full transition-all duration-200 cursor-pointer shrink-0 w-full sm:w-auto group"
        >
          <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <span className="relative">
            {isLoading ? 'Analizando...' : 'Analizar Juego'}
          </span>
        </button>
      </form>

      {/* Error inline (reemplaza el alert del navegador) */}
      {inputError && (
        <div className="mt-2 flex items-center gap-2 text-xs text-amber-400 bg-amber-500/8 border border-amber-500/20 px-3 py-2 rounded-xl animate-fade-up">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {inputError}
        </div>
      )}

      {/* Dropdown de sugerencias */}
      {showResults && (
        <div
          role="listbox"
          className="absolute left-0 right-0 mt-3 bg-[#0a1628]/98 border border-[#1e293b] rounded-2xl shadow-[0_24px_60px_-12px_rgba(0,0,0,0.8)] z-[200] backdrop-blur-xl animate-fade-up overflow-hidden"
        >
          {/* Cabecera */}
          <div className="px-4 py-2.5 border-b border-[#1e293b]/60 flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Juegos en Steam</span>
            {suggestions.length > 0 && (
              <span className="text-[10px] text-slate-600">{suggestions.length} resultados · ↑↓ para navegar</span>
            )}
          </div>

          <ul className="max-h-72 overflow-y-auto divide-y divide-[#1e293b]/40 custom-scrollbar">

            {/* Skeleton mientras carga */}
            {isSearching && suggestions.length === 0 && (
              <li className="px-4 py-4 flex items-center gap-3">
                <div className="w-16 h-9 rounded-lg animate-shimmer shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-2/3 rounded-full animate-shimmer" />
                  <div className="h-2.5 w-1/3 rounded-full animate-shimmer" />
                </div>
              </li>
            )}

            {/* Lista de juegos */}
            {suggestions.map((game, i) => (
              <li key={game.id} role="option" aria-selected={highlightedIndex === i}>
                <button
                  type="button"
                  onClick={() => handleSelectSuggestion(game)}
                  className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors cursor-pointer group ${
                    highlightedIndex === i
                      ? 'bg-blue-600/15 border-l-2 border-blue-500'
                      : 'hover:bg-blue-600/8'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {game.image ? (
                      <img
                        src={game.image}
                        alt={game.name}
                        className="w-16 h-9 object-cover rounded-lg border border-[#1e293b] group-hover:border-slate-600 transition-all shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-9 bg-slate-800 rounded-lg flex items-center justify-center shrink-0 text-base">🎮</div>
                    )}
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors truncate">{game.name}</h4>
                      <span className="text-[10px] text-slate-600 font-mono">ID: {game.id}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 pl-3">
                    <div className="text-right hidden sm:block">
                      {game.price && (
                        <span className="text-xs font-bold text-slate-300 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-md">
                          {game.price}
                        </span>
                      )}
                      {game.metascore && game.metascore !== 'N/A' && (
                        <div className="mt-1">
                          <span className="text-[9px] bg-yellow-900/50 text-yellow-400 border border-yellow-500/20 px-1.5 py-0.5 rounded font-semibold">
                            Meta {game.metascore}
                          </span>
                        </div>
                      )}
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
});

export default GameSearch;