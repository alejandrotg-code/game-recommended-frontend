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

    if (searchAbortRef.current) searchAbortRef.current.abort();
    const controller = new AbortController();
    searchAbortRef.current = controller;

    const timer = setTimeout(async () => {
      try {
        const games = await searchGames(query, controller.signal);
        setSuggestions(games);
        setHighlightedIndex(-1);
      } catch (err) {
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
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        handleSelectSuggestion(suggestions[highlightedIndex]);
      } else if (suggestions.length > 0) {
        handleSelectSuggestion(suggestions[0]);
      } else {
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

      {/* Formulario Estilo Command Palette */}
      <form
        onSubmit={handleSubmit}
        className={`relative z-10 w-full bg-[#0f1520] border p-1.5 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2 transition-all duration-200 ${
          isFocused ? 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'border-[#1b2434]'
        }`}
      >
        <div className="flex items-center flex-1 min-w-0 gap-2">
          {/* Icono Lupa */}
          <div className={`pl-3 shrink-0 transition-colors duration-200 ${isFocused ? 'text-blue-400' : 'text-slate-500'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Input de Texto */}
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
            placeholder="Busca un juego, pega su AppID o URL de Steam..."
            className="flex-1 bg-transparent px-2 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none w-full min-w-0 font-medium"
            aria-autocomplete="list"
            aria-haspopup="listbox"
            aria-expanded={showDropdown}
          />

          {/* Indicador de búsqueda */}
          {isSearching && (
            <div className="flex items-center gap-1 shrink-0 px-1">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" />
            </div>
          )}

          {/* Botón Limpiar ✕ */}
          {query && !isSearching && (
            <button
              type="button"
              onClick={handleClear}
              className="text-slate-500 hover:text-slate-200 transition-colors shrink-0 p-1 rounded hover:bg-[#1b2434] mr-1 cursor-pointer"
              aria-label="Limpiar búsqueda"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Atajo de Teclado / */}
          {!query && !isSearching && (
            <kbd className="hidden sm:inline-flex items-center justify-center h-5 px-1.5 text-[10px] font-mono text-slate-500 bg-[#151d2c] border border-[#1b2434] rounded mr-1 pointer-events-none" title="Presiona '/' para buscar">
              /
            </kbd>
          )}
        </div>

        {/* Botón Analizar */}
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-[#151d2c] disabled:text-slate-600 disabled:cursor-not-allowed text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-all btn-tactical cursor-pointer shrink-0 flex items-center justify-center gap-1.5"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin size-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Analizando...</span>
            </>
          ) : (
            <>
              <span>Analizar Juego</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </>
          )}
        </button>
      </form>

      {/* Mensaje de Error Inline */}
      {inputError && (
        <div className="mt-2 flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-lg animate-fade-up">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {inputError}
        </div>
      )}

      {/* Dropdown de Sugerencias */}
      {showResults && (
        <div
          role="listbox"
          className="absolute left-0 right-0 mt-2 bg-[#0f1520] border border-[#1b2434] rounded-xl shadow-2xl z-[200] overflow-hidden animate-fade-up"
        >
          <div className="px-3 py-2 border-b border-[#1b2434] flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Catálogo de Steam</span>
            {suggestions.length > 0 && (
              <span className="text-[10px] text-slate-500">{suggestions.length} sugerencias</span>
            )}
          </div>

          <ul className="max-h-64 overflow-y-auto divide-y divide-[#1b2434]/60 custom-scrollbar">
            {isSearching && suggestions.length === 0 && (
              <li className="px-4 py-3 flex items-center gap-3">
                <div className="w-12 h-7 rounded animate-shimmer shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-2/3 rounded animate-shimmer" />
                  <div className="h-2 w-1/3 rounded animate-shimmer" />
                </div>
              </li>
            )}

            {suggestions.map((game, i) => (
              <li key={game.id} role="option" aria-selected={highlightedIndex === i}>
                <button
                  type="button"
                  onClick={() => handleSelectSuggestion(game)}
                  className={`w-full px-3.5 py-2.5 flex items-center justify-between text-left transition-colors cursor-pointer group ${
                    highlightedIndex === i ? 'bg-blue-600/15 border-l-2 border-blue-500' : 'hover:bg-[#151d2c]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {game.image ? (
                      <img
                        src={game.image}
                        alt={game.name}
                        className="w-14 h-8 object-cover rounded border border-[#1b2434] shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-8 bg-[#151d2c] rounded flex items-center justify-center shrink-0 text-xs">🎮</div>
                    )}
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors truncate">{game.name}</h4>
                      <span className="text-[10px] text-slate-500 font-mono">AppID: {game.id}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 pl-2">
                    {game.price && (
                      <span className="text-[10px] font-semibold text-slate-300 bg-[#151d2c] border border-[#1b2434] px-2 py-0.5 rounded">
                        {game.price}
                      </span>
                    )}
                    {game.metascore && game.metascore !== 'N/A' && (
                      <span className="text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded font-bold">
                        Meta {game.metascore}
                      </span>
                    )}
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