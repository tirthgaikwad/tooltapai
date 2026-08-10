import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  GitCompare,
  Share2,
  GraduationCap,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  Globe,
  Layers
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import AccessBadge from './AccessBadge';
import ToolLogo from './ToolLogo';
import type { Tool } from '@/types/tool';
import { useApp } from '@/contexts/AppContext';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { cn } from '@/lib/utils';

interface QuickViewModalProps {
  tool: Tool | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ tool, isOpen, onClose }: QuickViewModalProps) {
  const { isBookmarked, toggleBookmark, isInCompare, toggleCompare, compareList, addToHistory, studentMode } = useApp();

  useBodyScrollLock(isOpen);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!tool) return null;

  const bookmarked = isBookmarked(tool.id);
  const inCompare = isInCompare(tool.id);
  const compareDisabled = !inCompare && compareList.length >= 3;
  const toolSlug = tool.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleShare = async () => {
    const url = `${window.location.origin}/tools/${toolSlug}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Tool link copied to clipboard');
    } catch {
      toast.error('Could not copy link');
    }
  };

  const handleVisit = () => {
    addToHistory(tool);
    window.open(tool.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto">
          {/* Backdrop with Fade transition */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm sm:backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{
              duration: 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={cn(
              'relative w-full max-w-xl bg-card border-t sm:border border-white/10 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden z-10',
              'flex flex-col mt-auto sm:my-auto max-h-[92vh] sm:max-h-[88vh] pb-[env(safe-area-inset-bottom,0px)]'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Top bar */}
            <div className="relative p-5 sm:p-6 border-b border-white/[0.08] bg-gradient-to-r from-card via-muted/30 to-card">
              {/* Mobile sheet pull handle */}
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-3 sm:hidden" />

              <button
                onClick={onClose}
                className="absolute top-3 right-3 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/[0.08] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation z-20"
                aria-label="Close Quick View"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4">
                <ToolLogo name={tool.name} category={tool.category} url={tool.url} className="w-14 h-14 rounded-2xl text-lg shrink-0 shadow-lg" />
                <div className="flex-1 min-w-0 pr-8">
                  <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                    <h2 className="text-xl font-heading font-bold text-foreground tracking-tight">
                      {tool.name}
                    </h2>
                    <AccessBadge access={tool.access} />
                    {studentMode && tool.access !== 'Paid' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success bg-success/10 border border-success/20 px-2.5 py-0.5 rounded-full">
                        <GraduationCap className="w-3 h-3" /> Student Friendly
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 text-primary/90 font-medium">
                      <Layers className="w-3.5 h-3.5" />
                      {tool.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
              {/* Primary Summary */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  Overview & Best Use Case
                </h3>
                <p className="text-sm text-foreground/90 leading-relaxed bg-muted/30 border border-white/[0.05] rounded-xl p-3.5">
                  {tool.why}
                </p>
              </div>

              {/* Key Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-muted/20 border border-white/[0.05] rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <Zap className="w-3.5 h-3.5 text-primary" />
                    Access & Pricing Model
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    {tool.access}
                  </div>
                </div>

                <div className="p-3.5 bg-muted/20 border border-white/[0.05] rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-success" />
                    Free Tier Availability
                  </div>
                  <div className="text-xs text-foreground/80 line-clamp-2">
                    {tool.freePlan || 'Standard access available'}
                  </div>
                </div>
              </div>

              {/* Free Plan Details if provided */}
              {tool.freePlan && (
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-1">
                  <div className="text-xs font-medium text-primary flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" />
                    Free Plan Specs
                  </div>
                  <p className="text-xs text-foreground/80 leading-normal">
                    {tool.freePlan}
                  </p>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-5 border-t border-white/[0.08] bg-muted/20 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleBookmark(tool)}
                  className={cn(
                    'h-11 sm:h-9 min-h-[44px] sm:min-h-0 rounded-xl text-xs gap-1.5 border-white/10 transition-colors touch-manipulation',
                    bookmarked ? 'bg-accent/15 text-accent border-accent/30 hover:bg-accent/20' : 'hover:bg-white/5'
                  )}
                >
                  {bookmarked ? <BookmarkCheck className="w-4 h-4 text-accent" /> : <Bookmark className="w-4 h-4" />}
                  {bookmarked ? 'Bookmarked' : 'Bookmark'}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={compareDisabled}
                  onClick={() => toggleCompare(tool)}
                  className={cn(
                    'h-11 sm:h-9 min-h-[44px] sm:min-h-0 rounded-xl text-xs gap-1.5 border-white/10 transition-colors touch-manipulation',
                    inCompare ? 'bg-primary/15 text-primary border-primary/30 hover:bg-primary/20' : 'hover:bg-white/5'
                  )}
                >
                  <GitCompare className="w-4 h-4" />
                  {inCompare ? 'In Compare' : 'Compare'}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                  className="h-11 w-11 sm:h-9 sm:w-9 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 rounded-xl border-white/10 hover:bg-white/5 text-muted-foreground hover:text-foreground flex items-center justify-center touch-manipulation"
                  title="Share tool"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2 ml-auto flex-wrap">
                <Link
                  to={`/tools/${toolSlug}`}
                  onClick={() => {
                    addToHistory(tool);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary font-medium px-3.5 py-2.5 min-h-[44px] sm:min-h-0 rounded-xl hover:bg-white/5 transition-colors touch-manipulation"
                >
                  Full Details
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Button
                  onClick={handleVisit}
                  size="sm"
                  className="h-11 sm:h-9 min-h-[44px] sm:min-h-0 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl gap-1.5 px-4 shadow-md touch-manipulation"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Visit
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
