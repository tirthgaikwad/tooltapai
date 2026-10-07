import { useState, useEffect, useMemo, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Search, ChevronDown, SlidersHorizontal, Bot, Grid3X3 } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import PageMeta from '@/components/common/PageMeta';
import ToolCard from '@/components/tools/ToolCard';
import DeferredToolGrid from '@/components/tools/DeferredToolGrid';
import SuspenseToolGrid from '@/components/tools/SuspenseToolGrid';
import AutoHidingFilterBar from '@/components/common/AutoHidingFilterBar';
import AccessBadge from '@/components/tools/AccessBadge';
import { ToolGridSkeleton } from '@/components/tools/ToolCardSkeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup,
  DropdownMenuRadioItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useApp } from '@/contexts/AppContext';
import { CATEGORIES } from '@/types/tool';
import type { FilterAccess, SortOption } from '@/types/tool';
import { categoryConfig } from '@/components/tools/CategoryCard';
import { normalizeSlug } from '@/lib/slugs';
import { cn } from '@/lib/utils';

export default function CategoryDetailPage() {
  const { slug, categorySlug } = useParams<{ slug?: string; categorySlug?: string }>();
  const rawSlug = slug || categorySlug || '';
  const normalizedRouteSlug = normalizeSlug(rawSlug);

  const { tools, studentMode } = useApp();
  const [searchQ, setSearchQ] = useState('');
  const [access, setAccess] = useState<FilterAccess>('all');
  const [sort, setSort] = useState<SortOption>('default');
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => setIsFiltering(false), 120);
    return () => clearTimeout(timer);
  }, [searchQ, access, sort, studentMode, rawSlug]);

  // Find category safely
  const category = useMemo(() => {
    return CATEGORIES.find(c => normalizeSlug(c) === normalizedRouteSlug);
  }, [normalizedRouteSlug]);

  const safeTools = Array.isArray(tools) ? tools : [];

  const baseCategoryTools = useMemo(() => {
    if (!category) return [];
    return safeTools.filter(t => {
      const toolCat = (t as any)?.category || (t as any)?.categoryName || (t as any)?.categorySlug || '';
      if (Array.isArray(toolCat)) {
        return toolCat.some((c: string) => normalizeSlug(c) === normalizedRouteSlug);
      }
      return normalizeSlug(toolCat) === normalizedRouteSlug;
    });
  }, [safeTools, category, normalizedRouteSlug]);

  const filtered = useMemo(() => {
    let result = [...baseCategoryTools];

    if (studentMode) {
      result = result.filter(t => t.access !== 'Paid');
    }
    if (access !== 'all') {
      result = result.filter(t => t.access === access);
    }
    if (searchQ.trim()) {
      const q = searchQ.toLowerCase();
      result = result.filter(t =>
        (t.name || '').toLowerCase().includes(q) ||
        (t.why || '').toLowerCase().includes(q)
      );
    }

    if (sort === 'alphabetical') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sort === 'recently-added') {
      result.sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    return result;
  }, [baseCategoryTools, studentMode, access, searchQ, sort]);

  const accessCounts = useMemo(() => {
    const c: Record<string, number> = { all: baseCategoryTools.length };
    for (const t of baseCategoryTools) {
      if (t.access) {
        c[t.access] = (c[t.access] ?? 0) + 1;
      }
    }
    return c;
  }, [baseCategoryTools]);

  // Handle Category Not Found state
  if (!category) {
    return (
      <PageLayout>
        <div className="py-20 text-center max-w-md mx-auto px-4 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-2 text-2xl">
            🔍
          </div>
          <h2 className="font-heading font-bold text-xl text-foreground">Category not found</h2>
          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
            This category route may have changed or does not exist in our directory.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Button asChild size="sm" className="bg-primary text-primary-foreground font-semibold rounded-xl">
              <Link to="/categories">View all categories</Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="border-white/10 rounded-xl">
              <Link to="/search">Browse all tools</Link>
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const config = categoryConfig[category] ?? {
    icon: Bot,
    color: 'text-primary',
    bgGradient: 'from-amber-500/10 to-amber-500/5',
  };
  const Icon = config.icon;

  return (
    <PageLayout>
      <PageMeta
        title={`${category} AI Tools`}
        description={`Compare the best free and premium artificial intelligence tools for ${category}.`}
      />
      <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-xs sm:text-sm text-muted-foreground">
          <Link to="/categories" className="hover:text-foreground transition-colors flex items-center gap-1 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" />
            Categories
          </Link>
          <span>/</span>
          <span className="text-foreground font-semibold truncate">{category}</span>
        </div>

        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className={cn('w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0')}>
            <Icon className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-foreground tracking-tight">
              {category}
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1">
              Showing {filtered.length} of {accessCounts.all} curated AI tools
            </p>
          </div>
        </div>

        {/* Auto-Hiding Filter Bar */}
        <AutoHidingFilterBar className="mb-8 space-y-3">
          {/* Access type filter chips */}
          <div className="flex overflow-x-auto sm:flex-wrap gap-2 pb-1 scrollbar-none snap-x snap-mandatory">
            {(['all', 'Free', 'Freemium', 'Paid', 'Open Source'] as const).map(a => {
              const count = accessCounts[a] ?? 0;
              if (a !== 'all' && count === 0) return null;
              return (
                <button
                  key={a}
                  onClick={() => setAccess(a)}
                  className={cn(
                    'flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-xl text-xs sm:text-sm border transition-all snap-start shrink-0 touch-manipulation',
                    access === a
                      ? 'filter-pill-active font-semibold'
                      : 'filter-pill-inactive text-muted-foreground hover:text-foreground'
                  )}
                >
                  {a === 'all' ? 'All Access' : <AccessBadge access={a} size="sm" />}
                  <span className="text-[11px] opacity-70">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Search & sort row */}
          <div className="flex items-center justify-between gap-3 pt-1 border-t border-white/[0.06]">
            <div className="relative flex-1 max-w-xs sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={`Search in ${category}...`}
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                className="pl-9 h-10 bg-[#1E1E24] border-white/[0.08] text-xs sm:text-sm rounded-xl"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-10 gap-1.5 text-xs rounded-xl border border-white/[0.08] text-muted-foreground hover:text-foreground bg-[#1E1E24]">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>{sort === 'default' ? 'Best Match' : sort === 'alphabetical' ? 'A–Z' : 'Recent'}</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#1C1D22] border-white/[0.08]">
                <DropdownMenuRadioGroup value={sort} onValueChange={v => setSort(v as SortOption)}>
                  <DropdownMenuRadioItem value="default" className="text-xs sm:text-sm">Best Match</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="alphabetical" className="text-xs sm:text-sm">A–Z</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="recently-added" className="text-xs sm:text-sm">Recently Added</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </AutoHidingFilterBar>

        {/* Tools grid & Empty state handling with Suspense */}
        <Suspense fallback={<ToolGridSkeleton count={8} />}>
          {isFiltering ? (
            <ToolGridSkeleton count={8} />
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-[#1E1E24] border border-white/10 rounded-2xl p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-xl">
                🔍
              </div>
              <h2 className="font-heading font-bold text-lg text-foreground">No tools match your current filter criteria</h2>
              <p className="text-muted-foreground text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                Try adjusting your search keywords, clearing access filters, or turning off Student Mode.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <Button onClick={() => { setSearchQ(''); setAccess('all'); }} size="sm" className="bg-primary text-primary-foreground font-semibold rounded-xl h-10 px-5">
                  Clear Filters
                </Button>
                <Button asChild size="sm" variant="outline" className="border-white/10 rounded-xl h-10 px-5">
                  <Link to="/categories">
                    <Grid3X3 className="w-4 h-4 mr-1.5" /> All Categories
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <SuspenseToolGrid
              tools={filtered}
              fallback={<ToolGridSkeleton count={8} />}
              emptyTitle="No tools match your current filter criteria"
              emptyMessage="Try adjusting your search keywords, clearing access filters, or turning off Student Mode."
            />
          )}
        </Suspense>
      </div>
    </PageLayout>
  );
}
