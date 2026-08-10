import { useMemo } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PageMeta from '@/components/common/PageMeta';
import CategoryCard from '@/components/tools/CategoryCard';
import { useApp } from '@/contexts/AppContext';
import { CATEGORIES } from '@/types/tool';
import { Grid3X3 } from 'lucide-react';

export default function CategoriesPage() {
  const { tools } = useApp();

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const t of tools) {
      counts[t.category] = (counts[t.category] ?? 0) + 1;
    }
    return counts;
  }, [tools]);

  return (
    <PageLayout>
      <PageMeta
        title="AI Tool Categories | ToolTap"
        description="Browse 25 domain categories of AI tools ranging from coding and writing to image generation and productivity."
      />
      <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
            <Grid3X3 className="w-3.5 h-3.5" />
            25 Domain Categories
          </div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-foreground tracking-tight mb-2">
            Browse AI Tools by Category
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm max-w-xl leading-relaxed">
            Every type of AI utility organized into specialized categories. Select a category to explore features, pricing tiers, and direct links.
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-8 p-4 sm:p-5 rounded-2xl bg-[#1E1E24] border border-white/[0.08] shadow-lg">
          {[
            { n: `${tools.length}+`, label: 'Total AI Tools' },
            { n: '25', label: 'Domain Categories' },
            { n: '20+', label: 'Avg Tools per Category' },
          ].map(({ n, label }) => (
            <div key={label} className="text-center sm:text-left">
              <div className="font-heading font-bold text-xl sm:text-2xl text-amber-400">{n}</div>
              <div className="text-[11px] sm:text-xs text-muted-foreground font-medium">{label}</div>
            </div>
          ))}
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {CATEGORIES.map((cat, i) => (
            <CategoryCard
              key={cat}
              category={cat}
              count={categoryCounts[cat] ?? 0}
              index={i}
            />
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
