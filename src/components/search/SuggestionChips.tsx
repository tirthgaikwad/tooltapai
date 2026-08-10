import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const TASK_CHIPS = [
  { label: '✨ Create PPT', query: 'Create PPT' },
  { label: '💻 Write Code', query: 'Write Code' },
  { label: '🎥 Edit Video', query: 'Edit Video' },
  { label: '🖼️ Generate Images', query: 'Generate Images' },
  { label: '📄 Summarize PDF', query: 'Summarize PDF' },
  { label: '📝 Write Resume', query: 'Write Resume' },
];

interface Props {
  activeChip?: string;
  onChipClick?: (chip: string) => void;
  className?: string;
}

export default function SuggestionChips({ activeChip, onChipClick, className }: Props) {
  const navigate = useNavigate();

  const handleClick = (query: string) => {
    if (onChipClick) {
      onChipClick(query);
    } else {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className={cn('flex overflow-x-auto sm:flex-wrap items-center justify-start sm:justify-center gap-2 sm:gap-2.5 max-w-full py-1 scrollbar-none snap-x snap-mandatory [mask-image:linear-gradient(to_right,transparent,black_12px,black_calc(100%-12px),transparent)] sm:[mask-image:none]', className)}>
      {TASK_CHIPS.map(chip => {
        const isActive = activeChip?.toLowerCase() === chip.query.toLowerCase() || activeChip?.toLowerCase() === chip.label.toLowerCase();
        return (
          <button
            key={chip.label}
            type="button"
            onClick={() => handleClick(chip.query)}
            className={cn(
              'px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer border shrink-0 sm:shrink min-h-[44px] flex items-center justify-center touch-manipulation snap-start',
              isActive
                ? 'filter-pill-active font-semibold'
                : 'filter-pill-inactive text-foreground/90 hover:border-amber-500/50 hover:bg-white/10 hover:text-amber-400'
            )}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}

