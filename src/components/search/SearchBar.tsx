import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Loader2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

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

export default function SearchBar({ size = 'hero', autoFocus = false, initialValue = '', onSearch }: Props) {
  const navigate = useNavigate();
  const { addSearch } = useApp();
  const [value, setValue] = useState(initialValue);
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isHero = size === 'hero';

  // Rotate placeholder
  useEffect(() => {
    const id = setInterval(() => {
      setPlaceholderIdx(i => (i + 1) % PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSubmit = useCallback((q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setLoading(true);
    addSearch(trimmed);
    if (onSearch) {
      onSearch(trimmed);
      setLoading(false);
    } else {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
    setFocused(false);
    inputRef.current?.blur();
  }, [addSearch, navigate, onSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(value);
    } else if (e.key === 'Escape') {
      setFocused(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className="relative mx-auto w-full z-10">
      <div className="relative w-full">
        <div
          className={cn(
            'relative flex items-center rounded-2xl border transition-all duration-200 bg-[#18181C]/98 backdrop-blur-sm transform-gpu [transform:translateZ(0)] shadow-2xl',
            isHero ? 'h-14 sm:h-16' : 'h-12',
            focused
              ? 'border-amber-500/60 ring-2 ring-amber-500/20 shadow-[0_16px_48px_rgba(0,0,0,0.6)]'
              : 'border-white/10 hover:border-white/20',
          )}
        >
          {/* Left search icon */}
          <Search className={cn('absolute left-4 shrink-0 text-white/50 pointer-events-none', isHero ? 'w-5 h-5' : 'w-4 h-4')} />

          {/* Input field */}
          <input
            ref={inputRef}
            type="text"
            value={value}
            autoFocus={autoFocus}
            onChange={e => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={PLACEHOLDERS[placeholderIdx]}
            className={cn(
              'w-full bg-transparent text-white placeholder:text-white/40 outline-none font-medium',
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
                'absolute text-white/50 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10 flex items-center justify-center shrink-0 z-10 touch-manipulation',
                isHero ? 'right-28 sm:right-36' : 'right-20 sm:right-24'
              )}
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}

          {/* Search Button - ALWAYS VISIBLE with precise padding */}
          <button
            type="button"
            onClick={() => handleSubmit(value)}
            className={cn(
              'absolute right-2 flex items-center justify-center gap-1.5 rounded-xl bg-primary font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-95 shadow-md shrink-0 z-10 px-5 py-2.5',
              isHero ? 'h-10 sm:h-11 text-xs sm:text-sm' : 'h-8 px-3 text-xs'
            )}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
