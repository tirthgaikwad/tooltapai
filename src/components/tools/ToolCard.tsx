import { useState, memo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ExternalLink, Bookmark, BookmarkCheck, GitCompare, Share2, GraduationCap, Eye, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AccessBadge from './AccessBadge';
import ToolLogo from './ToolLogo';
import QuickViewModal from './QuickViewModal';
import type { Tool } from '@/types/tool';
import { useApp } from '@/contexts/AppContext';
import { getFreePlanDetails } from '@/lib/freePlanUtils';
import { cn } from '@/lib/utils';

interface Props {
  tool: Tool;
  showBestFree?: boolean;
  rank?: string;
  animated?: boolean;
  animationDelay?: number;
  index?: number;
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 32,
    scale: 0.96,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
      delay: (i % 6) * 0.07,
    },
  }),
};

function ToolCard({ tool, showBestFree, rank, animated = true, animationDelay = 0, index }: Props) {
  const { isBookmarked, toggleBookmark, isInCompare, toggleCompare, compareList, addToHistory, studentMode } = useApp();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const rafId = useRef<number | null>(null);

  const bookmarked = isBookmarked(tool.id);
  const inCompare = isInCompare(tool.id);
  const compareDisabled = !inCompare && compareList.length >= 3;

  const toolSlug = tool.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const planDetails = getFreePlanDetails(tool);
  const itemIndex = index ?? (animationDelay ? Math.round(animationDelay / 50) : 0);

  const dotColorClass = {
    emerald: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]',
    amber: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]',
    rose: 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]',
    slate: 'bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.8)]',
  }[planDetails.badgeColor];

  const statusTextClass = {
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    rose: 'text-rose-400',
    slate: 'text-slate-400',
  }[planDetails.badgeColor];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      window.innerWidth < 768 ||
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const currentTarget = e.currentTarget;
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      const rect = currentTarget.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = -((y - centerY) / centerY) * 6;
      const rotateY = ((x - centerX) / centerX) * 6;

      currentTarget.style.setProperty('--mouse-x', `${x}px`);
      currentTarget.style.setProperty('--mouse-y', `${y}px`);
      currentTarget.style.setProperty('--rotate-x', `${rotateX}deg`);
      currentTarget.style.setProperty('--rotate-y', `${rotateY}deg`);
      currentTarget.style.setProperty('--spotlight-opacity', '1');
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    const currentTarget = e.currentTarget;
    currentTarget.style.setProperty('--rotate-x', '0deg');
    currentTarget.style.setProperty('--rotate-y', '0deg');
    currentTarget.style.setProperty('--spotlight-opacity', '0');
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/tools/${toolSlug}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    } catch {
      toast.error('Could not copy link');
    }
  };

  const handleVisit = () => {
    addToHistory(tool);
    window.open(tool.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={animated ? 'hidden' : 'visible'}
      whileInView={animated ? 'visible' : undefined}
      viewport={{ once: true, amount: 0.1 }}
      custom={itemIndex}
      variants={cardVariants}
      className="h-full"
    >
      <TooltipProvider delayDuration={200}>
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="perspective-1000 h-full"
          style={{ perspective: '1000px' }}
        >
          <div
            className="tool-card group relative flex flex-col bg-[#1E1E24] card-gradient border border-white/[0.08] rounded-2xl p-4 sm:p-5 hover:-translate-y-1 transition-all duration-300 ease-out preserve-3d overflow-hidden h-full"
            style={{
              transform: 'translateZ(0) rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg))',
              transformStyle: 'preserve-3d',
              willChange: 'transform',
              contain: 'layout style',
              '--mouse-x': '0px',
              '--mouse-y': '0px',
            } as React.CSSProperties}
          >
            {/* Dual-Layer Glass Border Glow Overlay (1px Outer Border Spotlight) */}
            <div
              className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10"
              style={{
                padding: '1px',
                background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(242, 153, 74, 0.35), rgba(224, 90, 71, 0.15), transparent 80%)`,
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
            />

            {/* Interior Radial Spotlight Fill */}
            <div
              className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300 z-0"
              style={{
                opacity: 'var(--spotlight-opacity, 0)',
                background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(242, 153, 74, 0.12), rgba(224, 90, 71, 0.05), transparent 80%)`,
              }}
            />

          {/* Top Badges */}
          <div className="relative z-10 flex items-center justify-between gap-2 mb-3" style={{ transform: 'translateZ(15px)' }}>
            {/* Best Free or Rank badge */}
            {(showBestFree || (studentMode && tool.access !== 'Paid')) && tool.access !== 'Paid' ? (
              <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full shadow-sm">
                <GraduationCap className="w-3.5 h-3.5" />
                Best Free
              </div>
            ) : rank ? (
              <div className="inline-flex items-center text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full shadow-sm">
                {rank}
              </div>
            ) : (
              <div />
            )}

            <AccessBadge access={tool.access} />
          </div>

          {/* Header: Logo + Name + Category */}
          <div className="relative z-10 flex items-start gap-3 mb-3" style={{ transform: 'translateZ(18px)' }}>
            <ToolLogo name={tool.name} category={tool.category} url={tool.url} className="w-11 h-11 rounded-xl text-base shrink-0 shadow-md border border-white/10" />
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-bold text-base text-high-emphasis truncate leading-snug">
                <Link
                  to={`/tools/${toolSlug}`}
                  onClick={() => addToHistory(tool)}
                  className="hover:text-primary transition-colors"
                >
                  {tool.name}
                </Link>
              </h3>
              <p className="text-xs text-med-emphasis truncate mt-0.5">{tool.category}</p>
            </div>
          </div>

          {/* Short description */}
          <p className="relative z-10 text-xs sm:text-sm text-med-emphasis leading-relaxed mb-3 flex-1 line-clamp-2 min-h-[2.5rem]" style={{ transform: 'translateZ(10px)' }}>
            {tool.why}
          </p>

          {/* Plan Limit Breakdown Indicator (Dark Glassmorphism) */}
          <div
            className="relative z-10 bg-neutral-900/90 border border-white/10 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 mb-3 shadow-sm backdrop-blur-sm"
            style={{ transform: 'translateZ(12px)' }}
          >
            <span className={cn('w-2 h-2 rounded-full shrink-0', dotColorClass)} />
            <div className="flex items-center justify-between w-full gap-1.5 min-w-0">
              <span className={cn('font-semibold shrink-0 text-[11px]', statusTextClass)}>
                {planDetails.status}:
              </span>
              <span className="text-med-emphasis truncate text-[11px] font-normal" title={planDetails.summary}>
                {planDetails.summary}
              </span>
            </div>
          </div>

          {/* Actions row */}
          <div className="relative z-10 flex flex-col gap-2 mt-auto pt-2 border-t border-white/[0.06]" style={{ transform: 'translateZ(15px)' }}>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handleVisit}
                size="sm"
                className="h-11 min-h-[44px] text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl gap-1.5 w-full active:scale-95 shadow-md"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Visit
              </Button>

              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-11 min-h-[44px] text-xs font-semibold border-white/10 hover:bg-white/[0.06] text-high-emphasis rounded-xl gap-1 w-full active:scale-95"
              >
                <Link to={`/tools/${toolSlug}`} onClick={() => addToHistory(tool)}>
                  Details <ArrowRight className="w-3 h-3" />
                </Link>
              </Button>
            </div>

            {/* Quick icon actions: Bookmark, Compare, Quick View, Share */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        'h-10 w-10 sm:h-8 sm:w-8 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center rounded-xl border border-white/[0.06] shrink-0 transition-all',
                        bookmarked
                          ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                          : 'text-med-emphasis hover:text-high-emphasis hover:bg-white/[0.06]'
                      )}
                      onClick={() => toggleBookmark(tool)}
                      aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark tool'}
                    >
                      {bookmarked ? <BookmarkCheck className="w-4 h-4 sm:w-3.5 sm:h-3.5" /> : <Bookmark className="w-4 h-4 sm:w-3.5 sm:h-3.5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs bg-[#1C1D22] border-white/10">
                    {bookmarked ? 'Remove bookmark' : 'Bookmark'}
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={compareDisabled}
                      className={cn(
                        'h-10 sm:h-8 px-2.5 sm:px-0 sm:w-8 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center rounded-xl border border-white/[0.06] shrink-0 transition-all text-xs font-semibold gap-1',
                        inCompare
                          ? 'text-amber-400 bg-amber-500/15 border-amber-500/30'
                          : 'text-med-emphasis hover:text-high-emphasis hover:bg-white/[0.06]',
                        compareDisabled && 'opacity-30 cursor-not-allowed'
                      )}
                      onClick={() => toggleCompare(tool)}
                      aria-label={inCompare ? 'Remove from compare' : 'Compare tool'}
                    >
                      <GitCompare className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                      <span className="inline sm:hidden text-[11px] font-semibold">
                        {inCompare ? 'Added' : 'Compare'}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs bg-[#1C1D22] border-white/10">
                    {inCompare ? 'Remove from compare' : compareDisabled ? 'Max 3 tools' : 'Add to compare'}
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="flex items-center gap-1.5">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 sm:h-8 sm:w-8 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center rounded-xl border border-white/[0.06] text-med-emphasis hover:text-high-emphasis hover:bg-white/[0.06] transition-all"
                      onClick={() => setQuickViewOpen(true)}
                      aria-label="Quick View"
                    >
                      <Eye className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs bg-[#1C1D22] border-white/10">Quick View</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 sm:h-8 sm:w-8 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center rounded-xl border border-white/[0.06] text-med-emphasis hover:text-high-emphasis hover:bg-white/[0.06] transition-all"
                      onClick={handleShare}
                      aria-label="Share tool"
                    >
                      <Share2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs bg-[#1C1D22] border-white/10">Share</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          <QuickViewModal
            tool={tool}
            isOpen={quickViewOpen}
            onClose={() => setQuickViewOpen(false)}
          />
        </div>
      </div>
    </TooltipProvider>
    </motion.div>
  );
}

export default memo(ToolCard);
