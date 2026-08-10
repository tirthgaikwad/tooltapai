import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonCardProps {
  className?: string;
  variant?: 'tool' | 'category' | 'generic' | 'compact';
  lines?: number;
}

export function SkeletonCard({
  className,
  variant = 'tool',
  lines = 2,
}: SkeletonCardProps) {
  if (variant === 'category') {
    return (
      <div
        className={cn(
          'w-full bg-[#1E1E24] border border-white/[0.08] rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-lg relative overflow-hidden',
          className
        )}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="skeleton-shimmer w-10 h-10 rounded-xl" />
          <div className="skeleton-shimmer h-5 w-12 rounded-full" />
        </div>
        <div className="skeleton-shimmer h-4 w-3/4 rounded-md mb-2" />
        <div className="skeleton-shimmer h-3 w-full rounded-md" />
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'w-full bg-[#1E1E24] border border-white/[0.08] rounded-xl p-3 sm:p-4 flex items-center gap-3 shadow-md relative overflow-hidden',
          className
        )}
      >
        <div className="skeleton-shimmer w-10 h-10 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2 min-w-0">
          <div className="skeleton-shimmer h-4 w-2/3 rounded-md" />
          <div className="skeleton-shimmer h-3 w-full rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'w-full bg-[#1E1E24] card-gradient border border-white/[0.08] rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-lg relative overflow-hidden h-full min-h-[320px]',
        className
      )}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="skeleton-shimmer h-5 w-20 rounded-full" />
          <div className="skeleton-shimmer h-5 w-16 rounded-full ml-auto" />
        </div>

        {/* Header: Logo + Title + Category */}
        <div className="flex items-start gap-3 mb-3">
          <div className="skeleton-shimmer w-11 h-11 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2 min-w-0 pt-0.5">
            <div className="skeleton-shimmer h-4 w-3/4 rounded-md" />
            <div className="skeleton-shimmer h-3 w-1/2 rounded-md" />
          </div>
        </div>

        {/* Description Lines */}
        <div className="space-y-2 mb-4 min-h-[2.5rem]">
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'skeleton-shimmer h-3.5 rounded-md',
                i === lines - 1 ? 'w-4/5' : 'w-full'
              )}
            />
          ))}
        </div>

        {/* Plan / Detail tag placeholder */}
        <div className="h-9 w-full rounded-xl bg-white/[0.02] border border-white/[0.06] mb-3 flex items-center px-3 gap-2">
          <div className="skeleton-shimmer w-2 h-2 rounded-full shrink-0" />
          <div className="skeleton-shimmer h-3 w-24 rounded-md" />
          <div className="skeleton-shimmer h-3 w-16 rounded-md ml-auto" />
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-2 mt-auto pt-3 border-t border-white/[0.06]">
        <div className="grid grid-cols-2 gap-2">
          <div className="skeleton-shimmer h-10 rounded-xl w-full" />
          <div className="skeleton-shimmer h-10 rounded-xl w-full" />
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <div className="skeleton-shimmer h-8 w-8 rounded-xl" />
            <div className="skeleton-shimmer h-8 w-8 rounded-xl" />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="skeleton-shimmer h-8 w-8 rounded-xl" />
            <div className="skeleton-shimmer h-8 w-8 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonCardGrid({
  count = 8,
  variant = 'tool',
  className,
}: {
  count?: number;
  variant?: 'tool' | 'category' | 'generic' | 'compact';
  className?: string;
}) {
  const gridClasses = {
    tool: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5',
    generic: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5',
    category: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
    compact: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3',
  }[variant];

  return (
    <div className={cn(gridClasses, className)}>
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonCard key={idx} variant={variant} />
      ))}
    </div>
  );
}

export default SkeletonCard;
