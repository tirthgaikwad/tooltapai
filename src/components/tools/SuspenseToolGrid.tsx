import React, { Suspense, useMemo, memo } from 'react';
import DeferredToolGrid from './DeferredToolGrid';
import { ToolGridSkeleton } from './ToolCardSkeleton';
import type { Tool } from '@/types/tool';
import { SuspenseResource, createToolsResource } from '@/lib/toolResource';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface Props {
  tools?: Tool[];
  resource?: SuspenseResource<Tool[]>;
  showBestFree?: boolean;
  batchSize?: number;
  gridClassName?: string;
  skeletonCount?: number;
  fallback?: React.ReactNode;
  emptyTitle?: string;
  emptyMessage?: string;
  onResetFilters?: () => void;
}

/**
 * Inner component that reads from a SuspenseResource (triggering Suspense boundary if pending)
 */
function SuspenseResourceRenderer({
  resource,
  showBestFree,
  batchSize,
  gridClassName,
  emptyTitle,
  emptyMessage,
  onResetFilters,
}: {
  resource: SuspenseResource<Tool[]>;
  showBestFree?: boolean;
  batchSize?: number;
  gridClassName?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  onResetFilters?: () => void;
}) {
  const tools = resource.read();

  if (!tools || tools.length === 0) {
    return (
      <div className="text-center py-16 bg-[#18181C] border border-white/10 rounded-2xl p-8 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-xl text-amber-400">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="font-heading font-bold text-lg text-white">
          {emptyTitle || 'No AI tools found'}
        </h3>
        <p className="text-white/60 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
          {emptyMessage || 'Try adjusting your search criteria or clearing active filters.'}
        </p>
        {onResetFilters && (
          <div className="pt-2">
            <Button
              onClick={onResetFilters}
              size="sm"
              className="bg-primary text-primary-foreground font-semibold rounded-xl h-10 px-5"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <DeferredToolGrid
      tools={tools}
      showBestFree={showBestFree}
      batchSize={batchSize}
      gridClassName={gridClassName}
    />
  );
}

/**
 * Suspense-based tool grid component with customizable skeleton fallback.
 * Can be used with direct tool arrays, React.useTransition, or Suspense resources.
 */
function SuspenseToolGrid({
  tools,
  resource,
  showBestFree,
  batchSize = 16,
  gridClassName = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6',
  skeletonCount = 8,
  fallback,
  emptyTitle,
  emptyMessage,
  onResetFilters,
}: Props) {
  // If no external resource is passed but tools is supplied, create a lightweight resource
  const activeResource = useMemo(() => {
    if (resource) return resource;
    return createToolsResource(() => tools ?? []);
  }, [resource, tools]);

  const defaultFallback = fallback ?? (
    <ToolGridSkeleton count={skeletonCount} className={gridClassName} />
  );

  return (
    <Suspense fallback={defaultFallback}>
      <SuspenseResourceRenderer
        resource={activeResource}
        showBestFree={showBestFree}
        batchSize={batchSize}
        gridClassName={gridClassName}
        emptyTitle={emptyTitle}
        emptyMessage={emptyMessage}
        onResetFilters={onResetFilters}
      />
    </Suspense>
  );
}

export default memo(SuspenseToolGrid);
export { SuspenseToolGrid };
