import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ChevronDown, X, GraduationCap } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import PageMeta from '@/components/common/PageMeta';
import SearchBar from '@/components/search/SearchBar';
import SuggestionChips from '@/components/search/SuggestionChips';
import ToolCard from '@/components/tools/ToolCard';
import ToolSection from '@/components/tools/ToolSection';
import DeferredToolGrid from '@/components/tools/DeferredToolGrid';
import { ToolGridSkeleton } from '@/components/tools/ToolCardSkeleton';
import AutoHidingFilterBar from '@/components/common/AutoHidingFilterBar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup,
  DropdownMenuRadioItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useApp } from '@/contexts/AppContext';
import { searchTools, rankResults } from '@/lib/search';
import { CATEGORIES } from '@/types/tool';
import type { FilterAccess, SortOption, FreePlanFilter } from '@/types/tool';
import { cn } from '@/lib/utils';

const ACCESS_OPTIONS: { value: FilterAccess; label: string }[] = [
  { value: 'all', label: 'All Access Types' },
  { value: 'Free', label: 'Free Only' },
  { value: 'Freemium', label: 'Freemium' },
  { value: 'Paid', label: 'Paid' },
  { value: 'Open Source', label: 'Open Source' },
];

const FREE_PLAN_FILTER_OPTIONS: { value: FreePlanFilter; label: string }[] = [
  { value: 'all', label: 'All Free Limits' },
  { value: 'generous', label: '🟢 Generous Free Tier' },
  { value: 'reset', label: '🟡 Daily/Monthly Reset' },
  { value: 'strict', label: '🔴 Non-Renewable Credits' },
  { value: 'open-source', label: '🔓 Open Source' },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'Best Match' },
  { value: 'alphabetical', label: 'A–Z' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'recently-added', label: 'Recently Added' },
];

const RANK_LABELS: Record<string, string> = {
  bestOverall: '🏆 Best Overall',
  bestFree: '🎁 Best Free Options',
  bestForStudents: '🎓 Best for Students',
  bestPremium: '💎 High Performance',
  mostPopular: '⭐ Most Popular',
  fastestToLearn: '⚡ Easiest to Learn',
};

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { tools, fuseIndex, studentMode, setStudentMode, addSearch } = useApp();

  const initialQuery = searchParams.get('q') ?? '';
  const initialAccess = (searchParams.get('access') as FilterAccess) ?? 'all';

  const [query, setQuery] = useState(initialQuery);
  const [access, setAccess] = useState<FilterAccess>(initialAccess);
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState<SortOption>('default');
  const [freePlanFilter, setFreePlanFilter] = useState<FreePlanFilter>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => setIsSearching(false), 120);
    return () => clearTimeout(timer);
  }, [query, access, category, sort, freePlanFilter, studentMode]);

  useEffect(() => {
    const q = searchParams.get('q') ?? '';
    setQuery(q);
  }, [searchParams]);

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    addSearch(q);
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('q', q);
      return next;
    });
  }, [addSearch, setSearchParams]);

  const results = useMemo(() =>
    searchTools(tools, fuseIndex, query, { access, category, sort, studentMode, freePlanFilter }),
    [tools, fuseIndex, query, access, category, sort, studentMode, freePlanFilter]
  );

  const ranked = useMemo(() =>
    query.trim() ? rankResults(results, query) : null,
    [results, query]
  );

  const hasFilters = access !== 'all' || category !== 'all' || sort !== 'default' || freePlanFilter !== 'all' || studentMode;

  const clearFilters = () => {
    setAccess('all');
    setCategory('all');
    setSort('default');
    setFreePlanFilter('all');
    setStudentMode(false);
  };

  return (
    <PageLayout>
      <PageMeta
        title={query ? `Search: "${query}" | ToolTap` : "Search AI Tools | ToolTap"}
        description="Search 500+ AI tools by task, pricing model, free tier limits, and categories."
      />
      <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-foreground mb-2">
            {query ? (
              <>Results for <span className="text-amber-400">"{query}"</span></>
            ) : (
              'Search Directory'
            )}
          </h1>
          {query && (
            <p className="text-muted-foreground text-xs sm:text-sm flex items-center gap-2">
              <span>{results.length} tool{results.length !== 1 ? 's' : ''} found</span>
              {studentMode && (
                <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 text-xs">
                  <GraduationCap className="w-3.5 h-3.5" /> Student Mode
                </span>
              )}
            </p>
          )}
        </div>

        {/* Search bar */}
        <div className="mb-6">
          <SearchBar size="compact" initialValue={query} onSearch={handleSearch} />
        </div>

        {/* Suggestion Chips */}
        <div className="mb-6 overflow-x-auto">
          <SuggestionChips activeChip={query} onChipClick={handleSearch} />
        </div>

        {/* Filters row inside AutoHidingFilterBar */}
        <AutoHidingFilterBar className="mb-4">
          <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-11 sm:h-9 min-h-[44px] sm:min-h-0 gap-1.5 text-xs rounded-xl border px-3.5 touch-manipulation transition-all',
              showFilters
                ? 'filter-pill-active font-semibold'
                : 'filter-pill-inactive text-muted-foreground hover:text-foreground'
            )}
            onClick={() => setShowFilters(v => !v)}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
            {hasFilters && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center">
                {[access !== 'all', category !== 'all', sort !== 'default', studentMode].filter(Boolean).length}
              </span>
            )}
          </Button>

          {/* Access filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'h-11 sm:h-9 min-h-[44px] sm:min-h-0 px-3.5 gap-1 text-xs rounded-xl border touch-manipulation transition-all',
                  access !== 'all'
                    ? 'filter-pill-active font-semibold'
                    : 'filter-pill-inactive text-muted-foreground hover:text-foreground'
                )}
              >
                {ACCESS_OPTIONS.find(o => o.value === access)?.label ?? 'Access Type'}
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#1C1D22] border-white/[0.08]">
              <DropdownMenuRadioGroup value={access} onValueChange={v => setAccess(v as FilterAccess)}>
                {ACCESS_OPTIONS.map(o => (
                  <DropdownMenuRadioItem key={o.value} value={o.value} className="text-xs sm:text-sm min-h-[44px] flex items-center">{o.label}</DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Category filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'h-11 sm:h-9 min-h-[44px] sm:min-h-0 px-3.5 gap-1 text-xs rounded-xl border max-w-[180px] truncate touch-manipulation transition-all',
                  category !== 'all'
                    ? 'filter-pill-active font-semibold'
                    : 'filter-pill-inactive text-muted-foreground hover:text-foreground'
                )}
              >
                <span className="truncate">{category === 'all' ? 'All Categories' : category}</span>
                <ChevronDown className="w-3 h-3 shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#1C1D22] border-white/[0.08] max-h-64 overflow-y-auto">
              <DropdownMenuRadioGroup value={category} onValueChange={setCategory}>
                <DropdownMenuRadioItem value="all" className="text-xs sm:text-sm min-h-[44px] flex items-center">All Categories</DropdownMenuRadioItem>
                {CATEGORIES.map(c => (
                  <DropdownMenuRadioItem key={c} value={c} className="text-xs sm:text-sm min-h-[44px] flex items-center">{c}</DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Free Plan Limits filter dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'h-11 sm:h-9 min-h-[44px] sm:min-h-0 px-3.5 gap-1 text-xs rounded-xl border touch-manipulation transition-all',
                  freePlanFilter !== 'all'
                    ? 'filter-pill-active font-semibold'
                    : 'filter-pill-inactive text-muted-foreground hover:text-foreground'
                )}
              >
                {FREE_PLAN_FILTER_OPTIONS.find(o => o.value === freePlanFilter)?.label ?? 'Free Plan Limit'}
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#1C1D22] border-white/[0.08]">
              <DropdownMenuRadioGroup value={freePlanFilter} onValueChange={v => setFreePlanFilter(v as FreePlanFilter)}>
                {FREE_PLAN_FILTER_OPTIONS.map(o => (
                  <DropdownMenuRadioItem key={o.value} value={o.value} className="text-xs sm:text-sm min-h-[44px] flex items-center">{o.label}</DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'h-11 sm:h-9 min-h-[44px] sm:min-h-0 px-3.5 gap-1 text-xs rounded-xl border touch-manipulation transition-all',
                  sort !== 'default'
                    ? 'filter-pill-active font-semibold'
                    : 'filter-pill-inactive text-muted-foreground hover:text-foreground'
                )}
              >
                {SORT_OPTIONS.find(o => o.value === sort)?.label ?? 'Sort'}
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#1C1D22] border-white/[0.08]">
              <DropdownMenuRadioGroup value={sort} onValueChange={v => setSort(v as SortOption)}>
                {SORT_OPTIONS.map(o => (
                  <DropdownMenuRadioItem key={o.value} value={o.value} className="text-xs sm:text-sm min-h-[44px] flex items-center">{o.label}</DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Student Mode toggle */}
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-9 gap-1.5 text-xs rounded-xl border transition-all',
              studentMode
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-semibold shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'filter-pill-inactive text-muted-foreground hover:text-foreground'
            )}
            onClick={() => setStudentMode(!studentMode)}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Student Mode
          </Button>

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-9 gap-1 text-xs rounded-xl text-muted-foreground hover:text-foreground"
              onClick={clearFilters}
            >
              <X className="w-3.5 h-3.5" /> Clear
            </Button>
          )}

          <div className="ml-auto text-xs text-muted-foreground font-medium hidden md:block">
            {results.length} result{results.length !== 1 ? 's' : ''}
          </div>
        </div>
      </AutoHidingFilterBar>

        {/* Free Plan Quick Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 no-scrollbar">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground shrink-0 mr-1">
            Free Plan Limit:
          </span>
          {FREE_PLAN_FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFreePlanFilter(opt.value)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border shrink-0 min-h-[36px] flex items-center touch-manipulation',
                freePlanFilter === opt.value
                  ? 'filter-pill-active font-semibold'
                  : 'filter-pill-inactive text-muted-foreground hover:text-foreground'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Results */}
        {isSearching ? (
          <ToolGridSkeleton count={8} />
        ) : results.length === 0 ? (
          <div className="text-center py-16 bg-[#1E1E24] border border-white/10 rounded-2xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-xl">
              🔍
            </div>
            <h2 className="font-heading font-bold text-lg text-foreground">No matching AI tools found</h2>
            <p className="text-muted-foreground text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
              Try a different search query or clear your active filters to see all available tools.
            </p>
            <div className="pt-2">
              <Button onClick={clearFilters} size="sm" className="bg-primary text-primary-foreground font-semibold rounded-xl h-10 px-5">
                Reset Filters
              </Button>
            </div>
          </div>
        ) : query.trim() && ranked ? (
          <div className="space-y-12">
            {(Object.entries(ranked) as [string, typeof ranked.bestOverall][]).map(([key, sectionTools]) => {
              if (!sectionTools.length) return null;
              const label = RANK_LABELS[key] ?? key;
              return (
                <div key={key} className="bg-[#1E1E24] border border-white/[0.08] rounded-2xl p-5 sm:p-7 shadow-xl">
                  <ToolSection
                    title={label}
                    tools={sectionTools}
                    showBestFree={key === 'bestFree' || key === 'bestForStudents'}
                    cols={3}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <DeferredToolGrid tools={results} />
        )}
      </div>
    </PageLayout>
  );
}
