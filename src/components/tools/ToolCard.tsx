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
import PromptWorkshopSheet from './PromptWorkshopSheet';
import type { Tool } from '@/types/tool';
import { useApp } from '@/contexts/AppContext';
import { getFreePlanDetails } from '@/lib/freePlanUtils';
import { getPromptWorkshop } from '@/data/mockWorkshops';
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
  const [workshopOpen, setWorkshopOpen] = useState(false);
  const rafId = useRef<number | null>(null);

  const bookmarked = isBookmarked(tool.id);
  const inCompare = isInCompare(tool.id);
  const compareDisabled = !inCompare && compareList.length >= 3;
  const workshop = getPromptWorkshop(tool);

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
            className="tool-card group relative flex flex-col justify-between h-full min-h-[320px] p-5 rounded-2xl bg-[#18181C] border border-white/[0.08] hover:border-white/20 transition-all duration-200 preserve-3d overflow-hidden"
            style={{
              transform: 'translateZ(0) rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg))',
              transformStyle: 'preserve-3d',
              willChange: 'transform',
              contain: 'layout style',
              '--mouse-x': '0px',
              '--mouse-y': '0px',
            } as React.CSSProperties}
          >
            {/* Subtle Spotlight Border Glow Overlay */}
            <div
              className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-200 group-hover:opacity-100 z-10"
              style={{
                padding: '1px',
                background: `radial-gradient(300px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(242, 153, 74, 0.25), transparent 80%)`,
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
            />

            {/* Top Section (Flex-1) */}
            <div className="flex-1 space-y-3 mb-4 relative z-10">
              {/* Top Row: Tool Icon + Title & Category + Pricing Badge */}
              <div className="flex items-start justify-between gap-3" style={{ transform: 'translateZ(15px)' }}>
                <div className="flex items-center gap-3 min-w-0">
                  <ToolLogo
                    name={tool.name}
                    category={tool.category}
                    url={tool.url}
                    className="w-10 h-10 rounded-lg text-sm shrink-0 shadow-sm border border-white/10"
                  />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white text-base truncate leading-snug">
                      <Link
                        to={`/tools/${toolSlug}`}
                        onClick={() => addToHistory(tool)}
                        className="hover:text-primary transition-colors"
                      >
                        {tool.name}
                      </Link>
                    </h3>
                    <p className="text-xs text-white/60 mt-0.5 leading-snug">{tool.category}</p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1.5">
                  {(showBestFree || (studentMode && tool.access !== 'Paid')) && tool.access !== 'Paid' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      <GraduationCap className="w-3 h-3" />
                      Free
                    </span>
                  ) : rank ? (
                    <span className="inline-flex items-center text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                      {rank}
                    </span>
                  ) : null}
                  <AccessBadge access={tool.access} size="sm" />
                </div>
              </div>

              {/* Middle: Description constrained to 2 clean lines */}
              <p
                className="text-white/70 text-sm line-clamp-2 leading-relaxed"
                style={{ transform: 'translateZ(10px)' }}
              >
                {tool.why}
              </p>

              {/* Plan Limit Breakdown Indicator */}
              <div
                className="bg-white/[0.03] border border-white/[0.06] px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 backdrop-blur-sm"
                style={{ transform: 'translateZ(12px)' }}
              >
                <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColorClass)} />
                <div className="flex items-center justify-between w-full gap-1.5 min-w-0">
                  <span className={cn('font-semibold shrink-0 text-xs', statusTextClass)}>
                    {planDetails.status}:
                  </span>
                  <span className="text-white/70 text-xs font-normal truncate" title={planDetails.summary}>
                    {planDetails.summary}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions Container */}
            <div className="relative z-10 mt-auto flex flex-col" style={{ transform: 'translateZ(15px)' }}>
              {/* Row A (Category & Utility Icons) */}
              <div className="flex items-center justify-between gap-2">
                <Link
                  to={`/categories/${tool.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`}
                  className="truncate max-w-[160px] text-xs py-1 px-2.5 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white transition-colors"
                >
                  {tool.category.split(',')[0]}
                </Link>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          'p-1.5 h-7 w-7 rounded-lg transition-all',
                          bookmarked
                            ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                            : 'text-white/50 hover:text-white hover:bg-white/5'
                        )}
                        onClick={() => toggleBookmark(tool)}
                        aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark tool'}
                      >
                        {bookmarked ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs bg-[#18181C] border-white/10">
                      {bookmarked ? 'Bookmarked' : 'Bookmark'}
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={compareDisabled}
                        className={cn(
                          'p-1.5 h-7 w-7 rounded-lg transition-all',
                          inCompare
                            ? 'text-amber-400 bg-amber-500/15 border border-amber-500/30'
                            : 'text-white/50 hover:text-white hover:bg-white/5',
                          compareDisabled && 'opacity-30 cursor-not-allowed'
                        )}
                        onClick={() => toggleCompare(tool)}
                        aria-label={inCompare ? 'Remove from compare' : 'Compare tool'}
                      >
                        <GitCompare className="w-3.5 h-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs bg-[#18181C] border-white/10">
                      {inCompare ? 'In Compare' : 'Compare'}
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="p-1.5 h-7 w-7 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-all"
                        onClick={handleShare}
                        aria-label="Share tool"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs bg-[#18181C] border-white/10">Share</TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* Row B (Primary CTAs - Footer of Card) */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/[0.06]">
                <Link
                  to={`/tools/${toolSlug}`}
                  onClick={() => addToHistory(tool)}
                  className="text-xs text-white/60 hover:text-white font-medium flex items-center gap-1 transition-colors"
                >
                  Details <ArrowRight className="w-3 h-3" />
                </Link>

                <Button
                  onClick={handleVisit}
                  className="shrink-0 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#F2994A] to-[#E05A47] text-white hover:opacity-90 transition-opacity gap-1.5 shadow-sm active:scale-95 h-auto"
                >
                  <span>Visit</span>
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>

          <QuickViewModal
            tool={tool}
            isOpen={quickViewOpen}
            onClose={() => setQuickViewOpen(false)}
          />

          <PromptWorkshopSheet
            tool={tool}
            isOpen={workshopOpen}
            onClose={() => setWorkshopOpen(false)}
          />
        </div>
      </TooltipProvider>
    </motion.div>
  );
}

export default memo(ToolCard);
