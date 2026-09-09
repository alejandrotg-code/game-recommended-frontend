import { useState, useEffect, useRef, memo } from 'react';
import {
  Search,
  X,
  Command,
  Sparkles,
  Gamepad2,
  AlertCircle,
  ArrowRight,
  Loader2,
  ExternalLink,
} from 'lucide-react';
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
        className={`relative z-10 w-full bg-[#0f1520] border p-2 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 transition-all duration-300 shadow-xl ${
          isFocused
            ? 'border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.25)]'
            : 'border-[#1b2434] hover:border-slate-700'
        }`}
      >
        <div className="flex items-center flex-1 min-w-0 gap-2.5 pl-1">
          {/* Icono Lupa */}
          <div className={`pl-2 shrink-0 transition-colors duration-200 ${isFocused ? 'text-blue-400' : 'text-slate-500'}`}>
            <Search className="size-5" />
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
            onFocus={() => {
              setShowDropdown(true);
              setIsFocused(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Busca un juego, pega su AppID (ej: 1245620) o URL de Steam..."
            className="flex-1 bg-transparent px-1 py-2 text-sm sm:text-base text-white placeholder-slate-500 outline-none w-full min-w-0 font-medium"
            aria-autocomplete="list"
            aria-haspopup="listbox"
            aria-expanded={showDropdown}
          />

          {/* Indicador de búsqueda spinner */}
          {isSearching && (
            <div className="flex items-center gap-1 shrink-0 px-1 text-blue-400">
              <Loader2 className="size-4 animate-spin" />
            </div>
          )}

          {/* Botón Limpiar ✕ */}
          {query && !isSearching && (
            <button
              type="button"
              onClick={handleClear}
              className="text-slate-500 hover:text-white transition-colors shrink-0 p-1.5 rounded-lg hover:bg-[#1b2434] cursor-pointer"
              aria-label="Limpiar búsqueda"
            >
              <X className="size-4" />
            </button>
          )}

          {/* Atajo de Teclado / */}
          {!query && !isSearching && (
            <kbd
              className="hidden sm:inline-flex items-center gap-0.5 justify-center h-6 px-2 text-[11px] font-mono font-bold text-slate-400 bg-[#151d2c] border border-[#1b2434] rounded-md pointer-events-none"
              title="Presiona '/' para buscar"
            >
              /
            </kbd>
          )}
        </div>

        {/* Botón Analizar */}
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-[#151d2c] disabled:text-slate-600 disabled:cursor-not-allowed text-white text-xs font-black px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-900/30 cursor-pointer shrink-0 flex items-center justify-center gap-2 active:scale-95"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin text-white" />
              <span>Analizando...</span>
            </>
          ) : (
            <>
              <span>Analizar Juego</span>
              <ArrowRight className="size-4" />
            </>
          )}
        </button>
      </form>

      {/* Mensaje de Error Inline */}
      {inputError && (
        <div className="mt-2.5 flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3.5 py-2.5 rounded-xl animate-fade-up">
          <AlertCircle className="size-4 shrink-0 text-amber-400" />
          <span>{inputError}</span>
        </div>
      )}

      {/* Dropdown de Sugerencias */}
      {showResults && (
        <div
          role="listbox"
          className="absolute left-0 right-0 mt-2 bg-[#0f1520] border border-[#1b2434] rounded-2xl shadow-2xl z-[200] overflow-hidden animate-fade-up"
        >
          <div className="px-4 py-2.5 border-b border-[#1b2434] flex items-center justify-between bg-[#080b11]/50">
            <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 flex items-center gap-1.5">
              <Gamepad2 className="size-3.5 text-blue-400" />
              <span>Catálogo de Steam</span>
            </span>
            {suggestions.length > 0 && (
              <span className="text-[10px] text-slate-400 font-mono">{suggestions.length} resultados</span>
            )}
          </div>

          <ul className="max-h-72 overflow-y-auto divide-y divide-[#1b2434]/60 custom-scrollbar">
            {isSearching && suggestions.length === 0 && (
              <li className="px-4 py-3 flex items-center gap-3">
                <div className="w-14 h-8 rounded bg-[#151d2c] animate-pulse shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-2/3 rounded bg-[#151d2c] animate-pulse" />
                  <div className="h-2 w-1/3 rounded bg-[#151d2c] animate-pulse" />
                </div>
              </li>
            )}

            {suggestions.map((game, i) => (
              <li key={game.id} role="option" aria-selected={highlightedIndex === i}>
                <button
                  type="button"
                  onClick={() => handleSelectSuggestion(game)}
                  className={`w-full px-4 py-3 flex items-center justify-between text-left transition-all cursor-pointer group ${
                    highlightedIndex === i
                      ? 'bg-blue-600/20 border-l-4 border-blue-500'
                      : 'hover:bg-[#151d2c]'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {game.image ? (
                      <img
                        src={game.image}
                        alt={game.name}
                        className="w-16 h-9 object-cover rounded-md border border-[#1b2434] shrink-0 group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-16 h-9 bg-[#151d2c] rounded-md flex items-center justify-center shrink-0 text-xs text-slate-400">
                        <Gamepad2 className="size-4 text-slate-500" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-100 group-hover:text-blue-300 transition-colors truncate">
                        {game.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">AppID: {game.id}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pl-2">
                    {game.price && (
                      <span className="text-[10px] font-bold text-slate-200 bg-[#080b11] border border-[#1b2434] px-2 py-0.5 rounded">
                        {game.price}
                      </span>
                    )}
                    {game.metascore && game.metascore !== 'N/A' && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-black">
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