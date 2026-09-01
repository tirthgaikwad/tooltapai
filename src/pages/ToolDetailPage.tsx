import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ExternalLink, Bookmark, BookmarkCheck, GitCompare,
  Share2, Flag, ChevronRight, AlertTriangle,
  CheckCircle2, X, Sparkles, ShieldCheck, Zap
} from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import ToolCard from '@/components/tools/ToolCard';
import ToolLogo from '@/components/tools/ToolLogo';
import AccessBadge from '@/components/tools/AccessBadge';
import PromptWorkshopSheet from '@/components/tools/PromptWorkshopSheet';
import { getPromptWorkshop } from '@/data/mockWorkshops';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useApp } from '@/contexts/AppContext';
import { categoryToSlug } from '@/components/tools/CategoryCard';
import { getFreePlanDetails } from '@/lib/freePlanUtils';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function ToolDetailPage() {
  const { toolSlug } = useParams<{ toolSlug: string }>();
  const {
    tools, isBookmarked, toggleBookmark, isInCompare, toggleCompare,
    compareList, addToHistory, studentMode
  } = useApp();

  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [workshopOpen, setWorkshopOpen] = useState(false);

  // Find the tool by slug (generated from name)
  const tool = useMemo(() => {
    if (!toolSlug) return null;
    return tools.find(t => {
      const slug = t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return slug === toolSlug;
    }) ?? null;
  }, [tools, toolSlug]);

  const planDetails = useMemo(() => {
    if (!tool) return null;
    return getFreePlanDetails(tool);
  }, [tool]);

  // Add to recently viewed on mount
  useEffect(() => {
    if (tool) addToHistory(tool);
  }, [tool?.id]);

  const bookmarked = tool ? isBookmarked(tool.id) : false;
  const inCompare = tool ? isInCompare(tool.id) : false;
  const compareDisabled = !inCompare && compareList.length >= 3;

  // Related tools: same category, excluding current
  const relatedTools = useMemo(() => {
    if (!tool) return [];
    return tools
      .filter(t => t.category === tool.category && t.id !== tool.id)
      .slice(0, 6);
  }, [tools, tool]);

  const handleShare = async () => {
    if (!tool) return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    } catch {
      toast.error('Could not copy link');
    }
  };

  const handleVisit = () => {
    if (!tool) return;
    addToHistory(tool);
    window.open(tool.url, '_blank', 'noopener,noreferrer');
  };

  const handleReportSubmit = () => {
    setReportSubmitted(true);
    setTimeout(() => {
      setReportOpen(false);
      setReportSubmitted(false);
      setReportReason('');
    }, 2000);
  };

  if (!tool) {
    return (
      <PageLayout>
        <div className="py-20 text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4 text-2xl">
            🔍
          </div>
          <h2 className="font-heading font-bold text-xl text-foreground mb-2">Tool not found</h2>
          <p className="text-muted-foreground text-sm mb-6">The tool you are looking for is not listed in our directory.</p>
          <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-10 px-6 font-semibold">
            <Link to="/search">Browse All Tools</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  const isStudentFriendly = tool.access !== 'Paid';

  return (
    <PageLayout>
      <TooltipProvider delayDuration={200}>
        <div className="py-6 sm:py-8 max-w-5xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-xs sm:text-sm text-muted-foreground overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <Link
              to={`/categories/${categoryToSlug(tool.category)}`}
              className="hover:text-foreground transition-colors"
            >
              {tool.category}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <span className="text-foreground font-medium truncate">{tool.name}</span>
          </div>

          {/* Header Card */}
          <div className="bg-[#1E1E24] border border-white/[0.08] rounded-2xl p-6 sm:p-8 mb-8 shadow-xl animate-float-up opacity-0 [animation-fill-mode:forwards]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
              <div className="flex items-start gap-4 min-w-0">
                <ToolLogo name={tool.name} category={tool.category} url={tool.url} size="lg" className="w-16 h-16 rounded-2xl text-xl shrink-0" />

                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap mb-2">
                    <h1 className="font-heading font-bold text-2xl sm:text-3xl text-foreground tracking-tight">
                      {tool.name}
                    </h1>
                    <AccessBadge access={tool.access} size="md" />
                    {studentMode && isStudentFriendly && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                        <GraduationCap className="w-3.5 h-3.5" />
                        Student Friendly
                      </span>
                    )}
                  </div>
                  <Link
                    to={`/categories/${categoryToSlug(tool.category)}`}
                    className="text-xs sm:text-sm text-amber-400 hover:underline font-semibold"
                  >
                    {tool.category}
                  </Link>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <Button
                  onClick={handleVisit}
                  className="h-11 px-6 text-xs sm:text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl gap-2 shadow-md w-full sm:w-auto"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit Official Website
                </Button>

                {tool && getPromptWorkshop(tool) && (
                  <button
                    onClick={() => setWorkshopOpen(true)}
                    className="h-11 bg-white/5 border border-white/10 text-white/80 hover:text-white hover:border-[#F2994A]/50 transition-all text-xs sm:text-sm px-4 rounded-xl font-semibold flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                  >
                    <span>🛠️ Prompt Workshop</span>
                  </button>
                )}

                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className={cn(
                          'h-11 w-11 rounded-xl border-white/10 transition-all',
                          bookmarked
                            ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                            : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.06]'
                        )}
                        onClick={() => toggleBookmark(tool)}
                      >
                        {bookmarked ? <BookmarkCheck className="w-5 h-5 text-amber-400" /> : <Bookmark className="w-5 h-5" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs bg-[#1C1D22] border-white/10">
                      {bookmarked ? 'Remove bookmark' : 'Bookmark tool'}
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={compareDisabled}
                        className={cn(
                          'h-11 px-3 sm:px-0 sm:w-11 min-h-[44px] rounded-xl border-white/10 transition-all gap-2',
                          inCompare
                            ? 'text-amber-400 bg-amber-500/10 border-amber-500/30 font-semibold'
                            : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.06]',
                          compareDisabled && 'opacity-30 cursor-not-allowed'
                        )}
                        onClick={() => toggleCompare(tool)}
                      >
                        <GitCompare className="w-5 h-5" />
                        <span className="inline sm:hidden text-xs font-semibold">
                          {inCompare ? 'Added to Compare' : 'Compare Tool'}
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs bg-[#1C1D22] border-white/10">
                      {inCompare ? 'Remove from compare' : compareDisabled ? 'Max 3 tools' : 'Add to compare'}
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-11 w-11 rounded-xl border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/[0.06] transition-all"
                        onClick={handleShare}
                      >
                        <Share2 className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs bg-[#1C1D22] border-white/10">Share link</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>

            {/* Prominent Free Tier & Usage Limits Section */}
            <div className="mt-6 bg-[#121318] border border-amber-500/20 rounded-2xl p-6 shadow-lg space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
                      Free Tier & Usage Limits
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Structured pricing snapshot & allowance breakdown
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 bg-neutral-900 border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-semibold">
                  <span className={cn('w-2.5 h-2.5 rounded-full', {
                    'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]': planDetails.badgeColor === 'emerald',
                    'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]': planDetails.badgeColor === 'amber',
                    'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]': planDetails.badgeColor === 'rose',
                    'bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.8)]': planDetails.badgeColor === 'slate',
                  })} />
                  <span className={cn({
                    'text-emerald-400': planDetails.badgeColor === 'emerald',
                    'text-amber-400': planDetails.badgeColor === 'amber',
                    'text-rose-400': planDetails.badgeColor === 'rose',
                    'text-slate-400': planDetails.badgeColor === 'slate',
                  })}>
                    {planDetails.status} Tier
                  </span>
                </div>
              </div>

              {/* 4-card Breakdown Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div className="p-4 rounded-xl bg-[#181920] border border-white/[0.06] space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Free Allowance / Quota
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-foreground">
                    {planDetails.breakdown.creditQuota || planDetails.summary}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#181920] border border-white/[0.06] space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Reset Frequency
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-amber-400">
                    {planDetails.breakdown.resetFrequency || 'N/A'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#181920] border border-white/[0.06] space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Restrictions & Watermarks
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-foreground/90">
                    {planDetails.breakdown.restrictions || 'None'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#181920] border border-white/[0.06] space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Credit Card Required
                  </span>
                  <p className={cn('text-xs sm:text-sm font-semibold', planDetails.breakdown.requiresCreditCard ? 'text-rose-400' : 'text-emerald-400')}>
                    {planDetails.breakdown.requiresCreditCard ? 'Yes (Mandatory)' : 'No (Free Signup)'}
                  </p>
                </div>
              </div>

              {/* Official Disclaimer */}
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300/90 leading-relaxed">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-amber-300">Disclaimer:</strong> AI companies update quotas frequently. Always verify exact allowances on the official site before starting critical projects.
                </p>
              </div>
            </div>

            {/* Modular Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
              {/* Overview / Best For */}
              <div className="bg-[#111216] border border-white/[0.06] rounded-xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  Why Use It / Best For
                </div>
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">{tool.why}</p>
              </div>

              {/* Free Tier Details */}
              <div className="bg-[#111216] border border-white/[0.06] rounded-xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  Free Tier Overview
                </div>
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                  {tool.freePlan || 'No free plan details specified for this tool.'}
                </p>
              </div>

              {/* Access Type Breakdown */}
              <div className="bg-[#111216] border border-white/[0.06] rounded-xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <Zap className="w-4 h-4" />
                  Pricing & License
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <AccessBadge access={tool.access} size="md" />
                  <span className="text-xs text-muted-foreground">
                    {tool.access === 'Free' && '100% free with no subscription mandatory'}
                    {tool.access === 'Freemium' && 'Offers a generous free plan alongside paid upgrades'}
                    {tool.access === 'Paid' && 'Requires a paid license or credit purchase'}
                    {tool.access === 'Open Source' && 'Source code freely available for developers'}
                  </span>
                </div>
              </div>

              {/* Category Link */}
              <div className="bg-[#111216] border border-white/[0.06] rounded-xl p-5 space-y-2 flex flex-col justify-between">
                <div className="text-muted-foreground font-bold text-xs uppercase tracking-wider">
                  Category Classification
                </div>
                <div>
                  <Link
                    to={`/categories/${categoryToSlug(tool.category)}`}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-primary hover:underline font-semibold"
                  >
                    Explore all {tool.category} tools →
                  </Link>
                </div>
              </div>
            </div>

            {/* Report Outdated Info button */}
            <div className="mt-4 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground text-xs gap-1.5 rounded-xl"
                onClick={() => setReportOpen(true)}
              >
                <Flag className="w-3.5 h-3.5" />
                Report Outdated Info
              </Button>
            </div>
          </div>

          {/* Related Tools */}
          {relatedTools.length > 0 && (
            <section className="mb-8 animate-float-up opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: '100ms' }}>
              <div className="flex items-end justify-between mb-5">
                <div>
                  <h2 className="font-heading font-bold text-lg sm:text-xl text-foreground tracking-tight">
                    More in {tool.category}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Similar tools in the directory
                  </p>
                </div>
                <Link
                  to={`/categories/${categoryToSlug(tool.category)}`}
                  className="flex items-center gap-1 text-xs sm:text-sm text-primary hover:underline font-semibold shrink-0"
                >
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedTools.map((t, i) => (
                  <ToolCard key={t.id} tool={t} animationDelay={i * 40} />
                ))}
              </div>
            </section>
          )}
        </div>
      </TooltipProvider>

      {/* Report Modal */}
      {reportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => { setReportOpen(false); setReportSubmitted(false); setReportReason(''); }}
          />

          <div className="relative w-full max-w-md bg-[#18191E] border border-white/[0.1] rounded-2xl p-6 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
            <button
              onClick={() => { setReportOpen(false); setReportSubmitted(false); setReportReason(''); }}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>

            {reportSubmitted ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="font-heading font-bold text-lg text-foreground mb-1">Thank You!</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Your feedback helps keep the ToolTap directory accurate.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <Flag className="w-4 h-4 text-amber-400" />
                  <h3 className="font-heading font-bold text-lg text-foreground">
                    Report Outdated Info
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4 leading-relaxed">
                  Notice an inaccuracy with <span className="text-foreground font-semibold">{tool.name}</span>?
                  Select a issue below:
                </p>

                <div className="space-y-2 mb-5">
                  {[
                    'Pricing or plans have changed',
                    'Free tier limits are different',
                    'Official website URL is broken',
                    'Tool is discontinued',
                    'Category classification is incorrect',
                    'Other details need updating'
                  ].map(reason => (
                    <button
                      key={reason}
                      onClick={() => setReportReason(reason)}
                      className={cn(
                        'w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border transition-all',
                        reportReason === reason
                          ? 'border-amber-500/40 bg-amber-500/10 text-amber-400 font-medium'
                          : 'border-white/[0.06] text-muted-foreground hover:text-foreground hover:bg-white/[0.04]'
                      )}
                    >
                      {reason}
                    </button>
                  ))}
                </div>

                <Button
                  onClick={handleReportSubmit}
                  disabled={!reportReason}
                  className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs sm:text-sm font-semibold disabled:opacity-40"
                >
                  Submit Feedback
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      <PromptWorkshopSheet
        tool={tool}
        isOpen={workshopOpen}
        onClose={() => setWorkshopOpen(false)}
      />
    </PageLayout>
  );
}
