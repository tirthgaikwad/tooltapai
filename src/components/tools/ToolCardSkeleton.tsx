import React from 'react';
import { cn } from '@/lib/utils';

interface ToolCardSkeletonProps {
  className?: string;
  delayIndex?: number;
}

export default function ToolCardSkeleton({ className, delayIndex = 0 }: ToolCardSkeletonProps) {
  const delayStyle = delayIndex > 0 ? { animationDelay: `${(delayIndex % 8) * 120}ms` } : undefined;

  return (
    <div
      className={cn(
        'w-full bg-[#18181C] border border-white/[0.07] rounded-xl p-5 flex flex-col justify-between relative overflow-hidden h-full min-h-[290px] shadow-lg',
        className
      )}
      style={delayStyle}
    >
      <div className="space-y-3.5">
        {/* Top Row: Icon + Title & Category + Badge Placeholder */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Tool Icon Box */}
            <div className="skeleton-shimmer-charcoal w-10 h-10 rounded-lg shrink-0 border border-white/[0.05]" />
            <div className="space-y-1.5 min-w-0 flex-1">
              {/* Tool Name */}
              <div className="skeleton-shimmer-charcoal w-3/5 h-4 rounded-md" />
              {/* Category */}
              <div className="skeleton-shimmer-charcoal w-2/5 h-3 rounded-md opacity-70" />
            </div>
          </div>
          {/* Top-Right Badge Pill */}
          <div className="skeleton-shimmer-charcoal w-16 h-5 rounded-full shrink-0" />
        </div>

        {/* Middle: Description placeholder (2 lines) */}
        <div className="space-y-2 py-1">
          <div className="skeleton-shimmer-charcoal w-full h-3.5 rounded-md opacity-80" />
          <div className="skeleton-shimmer-charcoal w-4/5 h-3.5 rounded-md opacity-80" />
        </div>

        {/* Plan Limit Breakdown Indicator Box */}
        <div className="bg-white/[0.02] border border-white/[0.05] px-2.5 py-2 rounded-lg flex items-center gap-2">
          <div className="skeleton-shimmer-charcoal w-2 h-2 rounded-full shrink-0" />
          <div className="skeleton-shimmer-charcoal w-20 h-3 rounded-md" />
          <div className="skeleton-shimmer-charcoal w-24 h-3 rounded-md ml-auto opacity-60" />
        </div>
      </div>

      {/* Bottom Actions Row */}
      <div className="pt-3 mt-3 border-t border-white/[0.06] space-y-2">
        <div className="flex items-center justify-between gap-2">
          {/* Category Pill Tag */}
          <div className="skeleton-shimmer-charcoal w-20 h-6 rounded-full" />

          {/* Action Buttons Placeholders */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="skeleton-shimmer-charcoal w-8 h-8 rounded-lg" />
            <div className="skeleton-shimmer-charcoal w-8 h-8 rounded-lg" />
            <div className="skeleton-shimmer-charcoal w-16 h-8 rounded-lg" />
          </div>
        </div>

        {/* Sub-row links */}
        <div className="flex items-center justify-between pt-1">
          <div className="skeleton-shimmer-charcoal w-14 h-3 rounded-md opacity-60" />
          <div className="skeleton-shimmer-charcoal w-20 h-4 rounded-md opacity-60" />
        </div>
      </div>
    </div>
  );
}

export function ToolGridSkeleton({
  count = 8,
  className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6',
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={className} aria-busy="true" aria-label="Loading AI tools...">
      {Array.from({ length: count }).map((_, idx) => (
        <ToolCardSkeleton key={idx} delayIndex={idx} />
      ))}
    </div>
  );
}
