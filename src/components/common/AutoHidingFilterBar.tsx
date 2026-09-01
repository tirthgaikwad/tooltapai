import React from 'react';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { cn } from '@/lib/utils';

interface AutoHidingFilterBarProps {
  children: React.ReactNode;
  className?: string;
  topOffset?: string;
}

export default function AutoHidingFilterBar({
  children,
  className,
  topOffset = 'top-[73px]',
}: AutoHidingFilterBarProps) {
  const { isVisible } = useScrollDirection(8);

  return (
    <div
      className={cn(
        'sticky z-40 w-full transition-all duration-300 ease-out bg-[#121212]/98 backdrop-blur-sm transform-gpu [transform:translateZ(0)] border border-white/10 rounded-2xl p-3 shadow-2xl',
        topOffset,
        isVisible
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : '-translate-y-full opacity-0 pointer-events-none',
        className
      )}
    >
      {children}
    </div>
  );
}
