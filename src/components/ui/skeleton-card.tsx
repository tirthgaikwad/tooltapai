import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  lines?: number;
}

export function SkeletonCard({ className, lines = 2, ...props }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        'w-full bg-[#1E1E24] card-gradient border border-white/[0.08] rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-lg relative overflow-hidden h-full min-h-[320px]',
        className
      )}
      {...props}
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

        {/* Free plan or tier info bar */}
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
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5', className)}>
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonCard key={idx} />
      ))}
    </div>
  );
}

export default SkeletonCard;
