import { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Clock, Trash2, X, Sparkles, Grid3X3 } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import PageMeta from '@/components/common/PageMeta';
import ToolCard from '@/components/tools/ToolCard';
import ToolLogo from '@/components/tools/ToolLogo';
import SuspenseToolGrid from '@/components/tools/SuspenseToolGrid';
import { ToolGridSkeleton } from '@/components/tools/ToolCardSkeleton';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';

export default function BookmarksPage() {
  const { bookmarks, clearBookmarks, recentlyViewed, clearHistory } = useApp();

  return (
    <PageLayout>
      <PageMeta
        title="Saved AI Tools | ToolTap"
        description="View and manage your bookmarked AI tools and recently viewed history."
      />
      <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
              <Bookmark className="w-3.5 h-3.5" />
              Saved Tools
            </div>
            <h1 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-foreground tracking-tight mb-2">
              Bookmarks
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              {bookmarks.length} saved tool{bookmarks.length !== 1 ? 's' : ''} · Stored on your device for quick access
            </p>
          </div>
          {bookmarks.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="text-muted-foreground hover:text-destructive text-xs rounded-xl border-white/[0.1] h-10 px-4 self-start sm:self-auto"
              onClick={clearBookmarks}
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Clear All
            </Button>
          )}
        </div>

        {/* Bookmarks grid */}
        {bookmarks.length === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-[#1E1E24] border border-white/[0.08] rounded-3xl p-6 sm:p-8 mb-12 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
              <Bookmark className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="font-heading font-bold text-lg sm:text-xl text-foreground mb-2">No saved tools yet</h2>
            <p className="text-muted-foreground text-xs sm:text-sm max-w-md mx-auto mb-6 leading-relaxed">
              Click the bookmark icon on any tool card to keep your favorite AI utilities handy across visits.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-10 px-5 font-semibold">
                <Link to="/search">
                  <Sparkles className="w-4 h-4 mr-1.5" /> Browse AI Tools
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="border-white/10 hover:bg-white/[0.06] text-foreground rounded-xl h-10 px-5 font-semibold">
                <Link to="/categories">
                  <Grid3X3 className="w-4 h-4 mr-1.5" /> Explore Categories
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="mb-12">
            <Suspense fallback={<ToolGridSkeleton count={6} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" />}>
              <SuspenseToolGrid
                tools={bookmarks}
                gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                skeletonCount={6}
              />
            </Suspense>
          </div>
        )}

        {/* Recently Viewed section */}
        <div className="border-t border-white/[0.08] pt-10">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-primary" />
                <h2 className="font-heading font-bold text-lg sm:text-xl text-foreground tracking-tight">Recently Viewed</h2>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {recentlyViewed.length} tool{recentlyViewed.length !== 1 ? 's' : ''} in your recent activity
              </p>
            </div>
            {recentlyViewed.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground text-xs rounded-xl"
                onClick={clearHistory}
              >
                <X className="w-3.5 h-3.5 mr-1" /> Clear history
              </Button>
            )}
          </div>

          {recentlyViewed.length === 0 ? (
            <div className="text-center py-8 bg-[#1E1E24]/50 rounded-2xl border border-white/[0.06]">
              <p className="text-muted-foreground text-xs sm:text-sm">
                Tools you open or explore will automatically appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recentlyViewed.map((tool, i) => (
                <div
                  key={`${tool.id}-${i}`}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-[#1E1E24] border border-white/[0.08] hover:border-amber-500/30 transition-all group"
                >
                  <ToolLogo name={tool.name} category={tool.category} url={tool.url} size="sm" className="shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-foreground truncate">{tool.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{tool.category}</p>
                  </div>
                  <Button
                    onClick={() => window.open(tool.url, '_blank', 'noopener,noreferrer')}
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-primary hover:bg-primary/10 rounded-lg px-2 shrink-0 font-semibold"
                  >
                    Visit →
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
