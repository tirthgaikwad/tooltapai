import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import ToolCard from './ToolCard';
import ToolCardSkeleton from './ToolCardSkeleton';
import type { Tool } from '@/types/tool';

interface Props {
  tools: Tool[];
  showBestFree?: boolean;
  batchSize?: number;
  gridClassName?: string;
  isLoading?: boolean;
  skeletonCount?: number;
}

function DeferredToolGrid({
  tools,
  showBestFree,
  batchSize = 16,
  gridClassName = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6',
  isLoading = false,
  skeletonCount = 8,
}: Props) {
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  if (isLoading) {
    return (
      <div className={gridClassName}>
        {Array.from({ length: skeletonCount }).map((_, idx) => (
          <ToolCardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  // When tools list changes (e.g. search query or filter change), reset visibleCount immediately
  useEffect(() => {
    setVisibleCount(batchSize);
  }, [tools, batchSize]);

  // Load more tools when sentinel comes into view
  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + batchSize, tools.length));
  }, [batchSize, tools.length]);

  useEffect(() => {
    if (visibleCount >= tools.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: '300px',
        threshold: 0,
      }
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [visibleCount, tools.length, loadMore]);

  const visibleTools = tools.slice(0, visibleCount);
  const hasMore = visibleCount < tools.length;

  return (
    <>
      <div className={gridClassName}>
        {visibleTools.map((tool, i) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            showBestFree={showBestFree}
            animationDelay={i < 12 ? i * 30 : 0}
            animated={i < 12}
          />
        ))}
      </div>
      {hasMore && (
        <div
          ref={sentinelRef}
          className="w-full h-12 flex items-center justify-center my-4 opacity-50 text-xs text-muted-foreground"
        >
          Loading more AI tools...
        </div>
      )}
    </>
  );
}

export default memo(DeferredToolGrid);
