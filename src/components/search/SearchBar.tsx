import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, TrendingUp, ArrowRight, Loader2 } from 'lucide-react';
import { getAutocompleteSuggestions } from '@/lib/search';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

const TRENDING = [
  'Create PowerPoint', 'Generate Images', 'Write Code', 'Remove Background',
  'Edit Video', 'Make Music', 'Build Website', 'Research Topic',
];

const PLACEHOLDERS = [
  'Create a PowerPoint presentation…',
  'Generate realistic images…',
  'Build a website from scratch…',
  'Write an essay or article…',
  'Edit and enhance photos…',
  'Create Resume or CV…',
  'Generate a video…',
  'Make music with AI…',
  'Code an app quickly…',
  'Translate any text…',
  'Automate workflows…',
  'Analyze data with AI…',
];

interface Props {
  size?: 'hero' | 'compact';
  autoFocus?: boolean;
  initialValue?: string;
  onSearch?: (query: string) => void;
}

function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <span className="min-w-0 flex-1 break-words whitespace-normal">{text}</span>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className="min-w-0 flex-1 break-words whitespace-normal">
      {parts.map((part, idx) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={idx} className="font-bold text-[#F2994A]">
            {part}
          </span>
        ) : (
          <span key={idx}>{part}</span>
        )
      )}
    </span>
  );
}

export default function SearchBar({ size = 'hero', autoFocus = false, initialValue = '', onSearch }: Props) {
  const navigate = useNavigate();
  const { recentSearches, addSearch, removeSearch } = useApp();
  const [value, setValue] = useState(initialValue);
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const recentItems = useMemo(() => recentSearches.slice(0, 4), [recentSearches]);
  const hasQuery = value.trim().length > 0;
  
  const dropdownItems = useMemo(
    () => (hasQuery ? suggestions : [...recentItems, ...TRENDING]),
    [hasQuery, recentItems, suggestions],
  );
  
  const showDropdown = focused && (dropdownItems.length > 0 || (hasQuery && suggestions.length === 0));
  const isHero = size === 'hero';

  // Rotate placeholder
  useEffect(() => {
    const id = setInterval(() => {
      setPlaceholderIdx(i => (i + 1) % PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  // Update suggestions with slight debounce simulation
  useEffect(() => {
    if (!value.trim()) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      setSuggestions(getAutocompleteSuggestions(value));
      setLoading(false);
    }, 100);
    setSelectedIdx(-1);
    return () => clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSubmit = useCallback((q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    addSearch(trimmed);
    if (onSearch) {
      onSearch(trimmed);
    } else {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
    setFocused(false);
    inputRef.current?.blur();
  }, [addSearch, navigate, onSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(i => Math.min(i + 1, dropdownItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIdx >= 0 && dropdownItems[selectedIdx]) {
        handleSubmit(dropdownItems[selectedIdx]);
      } else {
        handleSubmit(value);
      }
    } else if (e.key === 'Escape') {
      setFocused(false);
    }
  };

  return (
    <div ref={containerRef} className="relative mx-auto w-full z-[80]">
      <div className="relative w-full">
        <div
          className={cn(
            'relative flex items-center rounded-2xl border transition-all duration-200 bg-[#1E1E24]',
            isHero ? 'h-14 sm:h-16' : 'h-12',
            focused
              ? 'border-amber-500/60 ring-2 ring-amber-500/20 shadow-[0_16px_48px_rgba(0,0,0,0.6)]'
              : 'border-white/[0.08] hover:border-white/[0.15]',
          )}
        >
          {/* Left search icon */}
          <Search className={cn('absolute left-4 shrink-0 text-med-emphasis pointer-events-none', isHero ? 'w-5 h-5' : 'w-4 h-4')} />

          {/* Input field */}
          <input
            ref={inputRef}
            type="text"
            value={value}
            autoFocus={autoFocus}
            onChange={e => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            onKeyDown={handleKeyDown}
            placeholder={PLACEHOLDERS[placeholderIdx]}
            aria-expanded={showDropdown}
            className={cn(
              'w-full bg-transparent text-high-emphasis placeholder:text-low-emphasis outline-none font-medium',
              isHero ? 'pl-11 sm:pl-12 pr-32 sm:pr-44 text-sm sm:text-base' : 'pl-10 pr-28 text-xs sm:text-sm',
            )}
          />

          {/* Clear button */}
          {value ? (
            <button
              type="button"
              onClick={() => {
                setValue('');
                onSearch?.('');
                inputRef.current?.focus();
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                setValue('');
                onSearch?.('');
                inputRef.current?.focus();
              }}
              className={cn(
                'absolute text-med-emphasis hover:text-high-emphasis transition-colors p-1.5 rounded-full hover:bg-white/10 flex items-center justify-center shrink-0 z-10 touch-manipulation',
                isHero ? 'right-28 sm:right-36' : 'right-20 sm:right-24'
              )}
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}

          {/* Search Button - ALWAYS VISIBLE */}
          <button
            type="button"
            onClick={() => handleSubmit(value)}
            className={cn(
              'absolute right-2 flex items-center justify-center gap-1.5 rounded-xl bg-primary font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-95 shadow-md shrink-0 z-10',
              isHero ? 'h-10 sm:h-11 px-3 sm:px-5 text-xs sm:text-sm' : 'h-8 px-3 text-xs'
            )}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 pr-[5px] animate-spin" />
            ) : (
              <>
                <span>Search</span>
                <ArrowRight className="w-[20px] h-[20px] pr-[5px]" />
              </>
            )}
          </button>
        </div>

        {/* Suggestion Dropdown - EXACT WIDTH MATCHING SEARCH BAR */}
        {showDropdown && (
          <div
            id="searchbar-dropdown"
            role="listbox"
            style={{
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              backgroundColor: 'rgba(30, 30, 36, 0.85)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            }}
            className="absolute left-0 top-[calc(100%+8px)] z-[100] max-h-[340px] w-full overflow-y-auto rounded-2xl border border-white/10 p-2 animate-in fade-in-0 slide-in-from-top-2 duration-150"
          >
            {hasQuery ? (
              suggestions.length > 0 ? (
                <div className="space-y-0.5">
                  <div className="px-3 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Suggestions
                  </div>
                  {suggestions.map((s, i) => (
                    <button
                      key={s}
                      type="button"
                      role="option"
                      aria-selected={selectedIdx === i}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => { setValue(s); handleSubmit(s); }}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl px-4 py-2.5 min-h-[44px] text-left text-xs sm:text-sm transition-colors text-foreground touch-manipulation',
                        selectedIdx === i ? 'bg-amber-500/15 text-amber-400 font-medium' : 'hover:bg-white/[0.06]'
                      )}
                    >
                      <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <HighlightMatch text={s} query={value} />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-6 text-center text-xs text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground">No quick suggestions found for "{value}"</p>
                  <p>Press Enter or click Search to see all directory matches.</p>
                </div>
              )
            ) : (
              <div className="space-y-2">
                {recentItems.length > 0 && (
                  <div>
                    <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Recent Searches
                    </div>
                    {recentItems.map((s, i) => (
                      <button
                        key={s}
                        type="button"
                        role="option"
                        aria-selected={selectedIdx === i}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => { setValue(s); handleSubmit(s); }}
                        className={cn(
                          'group flex w-full items-center justify-between rounded-xl px-4 py-2.5 min-h-[44px] text-left text-xs sm:text-sm transition-colors touch-manipulation',
                          selectedIdx === i ? 'bg-white/[0.08] text-foreground' : 'text-muted-foreground hover:bg-white/[0.05] hover:text-foreground'
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          <span className="truncate">{s}</span>
                        </div>
                        <span
                          role="button"
                          tabIndex={0}
                          aria-label="Remove search"
                          onClick={e => { e.stopPropagation(); removeSearch(s); }}
                          className="p-2 text-muted-foreground hover:text-foreground min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg hover:bg-white/10"
                        >
                          <X className="h-3.5 w-3.5" />
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                <div>
                  <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Popular Tasks
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 p-1">
                    {TRENDING.map((s, i) => {
                      const itemIndex = i + recentItems.length;
                      return (
                        <button
                          key={s}
                          type="button"
                          role="option"
                          aria-selected={selectedIdx === itemIndex}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => { setValue(s); handleSubmit(s); }}
                          className={cn(
                            'flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground',
                            selectedIdx === itemIndex ? 'bg-white/[0.08] text-foreground' : ''
                          )}
                        >
                          <TrendingUp className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                          <span className="truncate">{s}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
