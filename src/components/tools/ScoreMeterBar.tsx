import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ScoreMeterBarProps {
  score: number; // 0 to 5
  maxScore?: number; // default 5
  isTopScore?: boolean;
  className?: string;
  showValue?: boolean;
}

export default function ScoreMeterBar({
  score,
  maxScore = 5,
  isTopScore = false,
  className,
  showValue = true,
}: ScoreMeterBarProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));
    const timer = setTimeout(() => {
      setWidth(percentage);
    }, 50);
    return () => clearTimeout(timer);
  }, [score, maxScore]);

  return (
    <div className={cn('flex items-center gap-2.5 w-full', className)}>
      <div className="relative flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full',
            isTopScore
              ? 'bg-gradient-to-r from-orange-500 to-amber-400 shadow-[0_0_10px_rgba(242,153,74,0.4)]'
              : 'bg-amber-500/50'
          )}
          style={{
            width: `${width}%`,
            transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </div>
      {showValue && (
        <span
          className={cn(
            'text-xs font-bold shrink-0 min-w-[32px] text-right font-mono',
            isTopScore ? 'text-amber-400' : 'text-muted-foreground'
          )}
        >
          {score.toFixed(1)}
        </span>
      )}
    </div>
  );
}
