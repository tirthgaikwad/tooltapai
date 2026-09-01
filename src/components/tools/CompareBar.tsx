import { GitCompare, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import ToolLogo from './ToolLogo';
import ShareComparisonButton from './ShareComparisonButton';

export default function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useApp();
  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 pointer-events-none">
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#242424] border border-white/[0.08] pointer-events-auto"
        style={{
          boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
          transform: 'translate3d(0,0,0)',
          willChange: 'transform',
          contain: 'layout style',
        }}
      >
        <GitCompare className="w-4 h-4 text-primary shrink-0" />
        <span className="text-xs text-muted-foreground shrink-0">Comparing:</span>

        <div className="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto">
          {compareList.map(tool => (
            <div
              key={tool.id}
              className="flex items-center gap-1.5 bg-muted rounded-xl pl-2 pr-1 py-1 shrink-0 min-h-[36px]"
            >
              <ToolLogo name={tool.name} category={tool.category} url={tool.url} size="sm" className="w-5 h-5 text-[10px] rounded-lg" />
              <span className="text-xs text-foreground whitespace-nowrap max-w-[80px] truncate">{tool.name}</span>
              <button
                onClick={() => removeFromCompare(tool.id)}
                className="text-muted-foreground hover:text-foreground min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg hover:bg-white/10 touch-manipulation"
                aria-label={`Remove ${tool.name} from comparison`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {compareList.length < 3 && (
            <div className="text-[11px] text-muted-foreground shrink-0 hidden sm:block">
              +{3 - compareList.length} more
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <ShareComparisonButton compareList={compareList} size="sm" className="h-8 text-xs hidden sm:inline-flex" />
          <Button
            variant="ghost"
            size="sm"
            className="h-11 sm:h-8 min-h-[44px] sm:min-h-0 text-xs text-muted-foreground hover:text-foreground px-2.5 rounded-xl touch-manipulation"
            onClick={clearCompare}
          >
            Clear
          </Button>
          <Button
            asChild
            size="sm"
            className="h-11 sm:h-8 min-h-[44px] sm:min-h-0 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground px-3.5 rounded-xl touch-manipulation"
          >
            <Link to="/compare">Compare Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
