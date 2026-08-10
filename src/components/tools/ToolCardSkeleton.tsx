import React from 'react';
import { cn } from '@/lib/utils';

interface ToolCardSkeletonProps {
  className?: string;
}

export default function ToolCardSkeleton({ className }: ToolCardSkeletonProps) {
  return (
    <div
      className={cn(
        'w-full bg-[#1E1E24] border border-white/[0.05] rounded-xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden h-full min-h-[280px] shadow-lg',
        className
      )}
    >
      <div className="space-y-4">
        {/* Header Area */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Tool Icon */}
            <div className="skeleton-shimmer-charcoal w-10 h-10 rounded-lg shrink-0" />
            {/* Primary Title Line */}
            <div className="skeleton-shimmer-charcoal w-2/5 h-5 rounded-md" />
          </div>
          {/* Top-Right Badge Placeholder */}
          <div className="skeleton-shimmer-charcoal w-16 h-5 rounded-full shrink-0" />
        </div>

        {/* Body Area */}
        <div className="space-y-2 pt-1">
          {/* Line 1 */}
          <div className="skeleton-shimmer-charcoal w-full h-4 rounded-md" />
          {/* Line 2 */}
          <div className="skeleton-shimmer-charcoal w-4/5 h-4 rounded-md" />
        </div>
      </div>

      {/* Footer/Tags Area */}
      <div className="pt-4 mt-auto border-t border-white/[0.05] flex items-center justify-between gap-2">
        {/* 2 Micro-Pill Placeholders */}
        <div className="flex items-center gap-2">
          <div className="skeleton-shimmer-charcoal w-14 h-5 rounded-md" />
          <div className="skeleton-shimmer-charcoal w-14 h-5 rounded-md" />
        </div>
        {/* Bottom Action Button Placeholder */}
        <div className="skeleton-shimmer-charcoal w-24 h-8 rounded-lg shrink-0" />
      </div>
    </div>
  );
}

export function ToolGridSkeleton({
  count = 8,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6',
        className
      )}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <ToolCardSkeleton key={idx} />
      ))}
    </div>
  );
}
