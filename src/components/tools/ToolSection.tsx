import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ToolCard from './ToolCard';
import ToolCardSkeleton from './ToolCardSkeleton';
import type { Tool } from '@/types/tool';
import { cn } from '@/lib/utils';

interface Props {
  title: string;
  subtitle?: string;
  tools: Tool[];
  showRank?: string;
  viewAllHref?: string;
  showBestFree?: boolean;
  className?: string;
  cols?: 2 | 3 | 4;
  isLoading?: boolean;
}

export default function ToolSection({
  title,
  subtitle,
  tools,
  showRank,
  viewAllHref,
  showBestFree,
  className,
  cols = 3,
  isLoading = false,
}: Props) {
  if (tools.length === 0 && !isLoading) return null;

  const gridClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[cols];

  return (
    <section className={cn('', className)}>
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="font-heading font-bold text-xl text-foreground tracking-tight">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {viewAllHref && (
          <Link
            to={viewAllHref}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors font-medium shrink-0"
          >
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      <div className={cn('grid gap-4', gridClass)}>
        {isLoading
          ? Array.from({ length: cols * 2 }).map((_, i) => (
              <ToolCardSkeleton key={i} />
            ))
          : tools.map((tool, i) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                rank={showRank}
                showBestFree={showBestFree}
                animationDelay={i * 50}
              />
            ))}
      </div>
    </section>
  );
}
