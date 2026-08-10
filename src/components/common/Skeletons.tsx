import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { SkeletonCard, SkeletonCardGrid } from './SkeletonCard';

export { SkeletonCard, SkeletonCardGrid };

export function CategoryCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('p-5 rounded-2xl bg-card/60 border border-white/[0.08] space-y-3 relative overflow-hidden', className)}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
      <div className="flex items-center justify-between">
        <Skeleton className="w-10 h-10 rounded-xl bg-white/[0.08]" />
        <Skeleton className="h-5 w-12 rounded-full bg-white/[0.08]" />
      </div>
      <Skeleton className="h-4 w-3/4 bg-white/[0.08] rounded-md" />
      <Skeleton className="h-3 w-full bg-white/[0.06] rounded-md" />
    </div>
  );
}

export function CategoryGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ToolDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-pulse p-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-20 h-20 rounded-3xl bg-white/[0.08]" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-8 w-48 bg-white/[0.08] rounded-xl" />
          <Skeleton className="h-4 w-32 bg-white/[0.06] rounded-md" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-28 bg-white/[0.06] rounded-2xl" />
        <Skeleton className="h-28 bg-white/[0.06] rounded-2xl" />
        <Skeleton className="h-28 bg-white/[0.06] rounded-2xl" />
      </div>
      <Skeleton className="h-40 w-full bg-white/[0.06] rounded-2xl" />
    </div>
  );
}

export function CompareSkeleton() {
  return (
    <div className="space-y-6 animate-pulse max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48 bg-white/[0.08] rounded-xl" />
        <Skeleton className="h-8 w-24 bg-white/[0.08] rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-64 bg-white/[0.06] rounded-2xl" />
        <Skeleton className="h-64 bg-white/[0.06] rounded-2xl" />
        <Skeleton className="h-64 bg-white/[0.06] rounded-2xl" />
      </div>
    </div>
  );
}
