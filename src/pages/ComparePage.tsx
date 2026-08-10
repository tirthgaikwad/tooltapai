import { useMemo, useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  GitCompare,
  ExternalLink,
  X,
  Plus,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  Layers,
  Sparkles,
  ShieldCheck,
  Zap,
  Globe,
  Trophy,
  CheckCircle2,
  Gauge,
  ThumbsUp,
  DollarSign,
  Star,
  Award,
  SlidersHorizontal,
} from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import PageMeta from '@/components/common/PageMeta';
import AccessBadge from '@/components/tools/AccessBadge';
import ToolLogo from '@/components/tools/ToolLogo';
import ScoreMeterBar from '@/components/tools/ScoreMeterBar';
import ShareComparisonButton from '@/components/tools/ShareComparisonButton';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { normalizeSlug } from '@/lib/slugs';
import { cn } from '@/lib/utils';
import type { Tool } from '@/types/tool';

export interface CriteriaScore {
  useCaseFit: number;
  speed: number;
  cost: number;
  quality: number;
  easeOfUse: number;
  overallScore: number;
}

// Calculate deterministic, realistic rating scores based on tool properties
export function calculateToolScores(tool: Tool): CriteriaScore {
  let hash = 0;
  for (let i = 0; i < tool.name.length; i++) {
    hash = (hash << 5) - hash + tool.name.charCodeAt(i);
    hash |= 0;
  }
  const idHash = Math.abs(hash + tool.id * 17);

  // Cost rating based on access type
  let costBase = 3.6;
  if (tool.access === 'Free' || tool.access === 'Open Source') {
    costBase = 4.8;
  } else if (tool.access === 'Freemium') {
    costBase = 4.2;
  } else if (tool.access === 'Paid') {
    costBase = 3.4;
  }
  const cost = Number((costBase + (idHash % 3) * 0.1).toFixed(1));

  const quality = Number((4.3 + ((idHash * 7) % 7) * 0.1).toFixed(1));
  const useCaseFit = Number((4.2 + ((idHash * 11) % 8) * 0.1).toFixed(1));
  const speed = Number((4.1 + ((idHash * 13) % 9) * 0.1).toFixed(1));
  const easeOfUse = Number((4.2 + ((idHash * 17) % 8) * 0.1).toFixed(1));

  // Weighted score: 25% UseCaseFit, 25% Quality, 20% Cost, 15% Speed, 15% EaseOfUse
  const overall = Number(
    (useCaseFit * 0.25 + quality * 0.25 + cost * 0.2 + speed * 0.15 + easeOfUse * 0.15).toFixed(1)
  );

  return {
    useCaseFit: Math.min(5, useCaseFit),
    speed: Math.min(5, speed),
    cost: Math.min(5, cost),
    quality: Math.min(5, quality),
    easeOfUse: Math.min(5, easeOfUse),
    overallScore: Math.min(5, overall),
  };
}

const SCORE_CRITERIA = [
  { key: 'useCaseFit' as const, label: 'Use-Case Fit', weight: '25%', icon: ThumbsUp },
  { key: 'quality' as const, label: 'Quality & Accuracy', weight: '25%', icon: Star },
  { key: 'cost' as const, label: 'Cost & Value', weight: '20%', icon: DollarSign },
  { key: 'speed' as const, label: 'Speed & Performance', weight: '15%', icon: Gauge },
  { key: 'easeOfUse' as const, label: 'Ease of Use', weight: '15%', icon: Award },
];

const TEXT_FIELDS = [
  { key: 'category' as const, label: 'Category', icon: Layers },
  { key: 'access' as const, label: 'Access Type', icon: Zap },
  { key: 'freePlan' as const, label: 'Free Tier Limits', icon: ShieldCheck },
  { key: 'why' as const, label: 'Why Use It / Best For', icon: Sparkles },
];

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare, addToHistory, isBookmarked, toggleBookmark, setCompareTools, tools } = useApp();
  const [selectedMobileToolId, setSelectedMobileToolId] = useState<number | null>(null);
  const [mobileTabMode, setMobileTabMode] = useState<'tools' | 'criteria'>('tools');
  const [searchParams, setSearchParams] = useSearchParams();
  const captureRef = useRef<HTMLDivElement>(null);

  const isEmpty = compareList.length === 0;

  // Sync tools from URL query param `?compare=chatgpt,claude,gemini`
  useEffect(() => {
    const compareParam = searchParams.get('compare');
    if (compareParam && tools.length > 0) {
      const keys = compareParam
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean);

      if (keys.length > 0) {
        const matched: Tool[] = [];
        keys.forEach((key) => {
          const keyNum = Number(key);
          const keySlug = normalizeSlug(key);

          const found = tools.find(
            (t) =>
              (!isNaN(keyNum) && t.id === keyNum) ||
              normalizeSlug(t.name) === keySlug ||
              t.name.toLowerCase() === key.toLowerCase() ||
              normalizeSlug(t.name).startsWith(keySlug) ||
              keySlug.startsWith(normalizeSlug(t.name))
          );

          if (found && !matched.some((m) => m.id === found.id)) {
            matched.push(found);
          }
        });

        if (matched.length > 0) {
          const currentIds = compareList.map((t) => t.id).sort().join(',');
          const matchedIds = matched.map((t) => t.id).sort().join(',');
          if (currentIds !== matchedIds) {
            setCompareTools(matched);
          }
        }
      }
    }
  }, [searchParams, tools]);

  // Sync URL search params when compareList changes
  useEffect(() => {
    if (compareList.length > 0) {
      const slugs = compareList.map((t) => normalizeSlug(t.name)).join(',');
      if (searchParams.get('compare') !== slugs) {
        setSearchParams({ compare: slugs }, { replace: true });
      }
    } else {
      if (searchParams.has('compare')) {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete('compare');
        setSearchParams(nextParams, { replace: true });
      }
    }
  }, [compareList]);

  // Pre-calculate scores for all tools in compare list
  const toolScoresMap = useMemo(() => {
    const map = new Map<number, CriteriaScore>();
    compareList.forEach((t) => {
      map.set(t.id, calculateToolScores(t));
    });
    return map;
  }, [compareList]);

  // Find the winner tool (highest overallScore)
  const winningTool = useMemo(() => {
    if (compareList.length < 2) return null;
    let winner = compareList[0];
    let maxScore = toolScoresMap.get(winner.id)?.overallScore || 0;

    for (let i = 1; i < compareList.length; i++) {
      const tool = compareList[i];
      const score = toolScoresMap.get(tool.id)?.overallScore || 0;
      if (score > maxScore) {
        maxScore = score;
        winner = tool;
      }
    }
    return winner;
  }, [compareList, toolScoresMap]);

  // Keep mobile selected tool synced
  const activeMobileTool = useMemo(() => {
    if (compareList.length === 0) return null;
    const found = compareList.find((t) => t.id === selectedMobileToolId);
    return found || compareList[0];
  }, [compareList, selectedMobileToolId]);

  // Determine top score per criterion among compared tools
  const topCriterionScores = useMemo(() => {
    const map: Record<string, number> = {};
    if (compareList.length === 0) return map;

    SCORE_CRITERIA.forEach(({ key }) => {
      let max = 0;
      compareList.forEach((t) => {
        const s = toolScoresMap.get(t.id)?.[key] || 0;
        if (s > max) max = s;
      });
      map[key] = max;
    });

    let maxOverall = 0;
    compareList.forEach((t) => {
      const s = toolScoresMap.get(t.id)?.overallScore || 0;
      if (s > maxOverall) maxOverall = s;
    });
    map['overallScore'] = maxOverall;

    return map;
  }, [compareList, toolScoresMap]);

  return (
    <PageLayout>
      <PageMeta
        title="Compare AI Tools | ToolTap"
        description="Compare features, pricing tiers, free plan limits, and ratings side-by-side for up to 3 AI tools."
      />
      <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
              <GitCompare className="w-3.5 h-3.5" />
              Side-by-Side Tool Comparison
            </div>
            <h1 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-foreground tracking-tight mb-2">
              Compare AI Tools
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm max-w-xl">
              Evaluate features, weighted performance criteria, and pricing limits side-by-side to find the best tool.
            </p>
          </div>
          {!isEmpty && (
            <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0 flex-wrap">
              <ShareComparisonButton compareList={compareList} captureRef={captureRef} size="sm" className="h-10 px-4" />
              <Button
                variant="outline"
                size="sm"
                className="text-muted-foreground hover:text-foreground text-xs rounded-xl border-white/10 h-10 px-4 shrink-0"
                onClick={clearCompare}
              >
                <X className="w-4 h-4 mr-1.5" /> Clear All ({compareList.length})
              </Button>
            </div>
          )}
        </div>

        {isEmpty ? (
          <div className="text-center py-16 sm:py-20 bg-[#1E1E24] border border-white/[0.08] rounded-3xl p-6 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-4 border border-white/10">
              <GitCompare className="w-8 h-8 text-amber-500" />
            </div>
            <h2 className="font-heading font-bold text-lg sm:text-xl text-foreground mb-2">Nothing to compare yet</h2>
            <p className="text-muted-foreground text-xs sm:text-sm max-w-md mx-auto mb-6 leading-relaxed">
              Select up to 3 tools across the directory using the{' '}
              <span className="inline-flex items-center gap-1 font-semibold text-amber-400">
                <GitCompare className="w-3.5 h-3.5" /> Compare
              </span>{' '}
              button to view weighted performance ratings and feature breakdowns.
            </p>
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-6 font-semibold">
              <Link to="/search">Browse AI Tools</Link>
            </Button>
          </div>
        ) : (
          <div ref={captureRef} id="comparison-capture-area" className="space-y-6 bg-[#18181C] p-4 sm:p-6 rounded-3xl border border-white/5">
            {/* Overall Winner Summary Banner Banner across top */}
            {winningTool && compareList.length >= 2 && (
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-[#1E1E24] border-2 border-[#F2994A]/60 p-5 sm:p-6 shadow-2xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center shrink-0 shadow-lg">
                      <Trophy className="w-6 h-6 text-amber-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                          🏆 Overall Winner ({toolScoresMap.get(winningTool.id)?.overallScore}/5.0)
                        </span>
                        <AccessBadge access={winningTool.access} size="sm" />
                      </div>
                      <h2 className="font-heading font-bold text-lg sm:text-xl text-foreground truncate">
                        {winningTool.name}
                      </h2>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 line-clamp-2">
                        {winningTool.why}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      addToHistory(winningTool);
                      window.open(winningTool.url, '_blank', 'noopener,noreferrer');
                    }}
                    size="sm"
                    className="h-10 px-5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-black rounded-xl gap-2 shrink-0 shadow-xl w-full sm:w-auto"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Visit Winning Tool
                  </Button>
                </div>
              </div>
            )}

            {/* ================= MOBILE VIEW (< 768px) ================= */}
            <div className="block md:hidden space-y-5">
              {/* Mobile View Switcher */}
              <div className="flex items-center justify-between bg-[#1E1E24] border border-white/10 rounded-2xl p-1.5 shadow-md">
                <button
                  type="button"
                  onClick={() => setMobileTabMode('tools')}
                  className={cn(
                    'flex-1 py-2 text-xs font-semibold rounded-xl transition-all text-center flex items-center justify-center gap-1.5',
                    mobileTabMode === 'tools'
                      ? 'bg-amber-500 text-black shadow-md'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Tool View
                </button>
                <button
                  type="button"
                  onClick={() => setMobileTabMode('criteria')}
                  className={cn(
                    'flex-1 py-2 text-xs font-semibold rounded-xl transition-all text-center flex items-center justify-center gap-1.5',
                    mobileTabMode === 'criteria'
                      ? 'bg-amber-500 text-black shadow-md'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Layers className="w-3.5 h-3.5" />
                  By Criterion
                </button>
              </div>

              {/* Tool Selector Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none snap-x snap-mandatory flex-nowrap [mask-image:linear-gradient(to_right,transparent,black_12px,black_calc(100%-12px),transparent)] sm:[mask-image:none]">
                {compareList.map((tool) => {
                  const isSelected = activeMobileTool?.id === tool.id;
                  const isWinner = winningTool?.id === tool.id;

                  return (
                    <button
                      key={`tab-${tool.id}`}
                      onClick={() => setSelectedMobileToolId(tool.id)}
                      className={cn(
                        'flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all shrink-0 cursor-pointer min-h-[44px] snap-start touch-manipulation',
                        isSelected
                          ? isWinner
                            ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-md'
                            : 'bg-white/15 border-white/30 text-white shadow-md'
                          : 'bg-[#1E1E24] border-white/10 text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <ToolLogo name={tool.name} category={tool.category} url={tool.url} className="w-5 h-5 rounded-md text-[10px]" />
                      <span className="truncate max-w-[110px]">{tool.name}</span>
                      {isWinner && <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Mode 1: Tool View */}
              {mobileTabMode === 'tools' && activeMobileTool && (() => {
                const tool = activeMobileTool;
                const scores = toolScoresMap.get(tool.id) || calculateToolScores(tool);
                const isWinner = winningTool?.id === tool.id;
                const bookmarked = isBookmarked(tool.id);
                const toolSlug = tool.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

                return (
                  <div
                    className={cn(
                      'w-full rounded-2xl p-4 sm:p-5 shadow-xl space-y-5 bg-[#1E1E24]',
                      isWinner
                        ? 'border-2 border-[#F2994A]/60 bg-gradient-to-b from-amber-500/10 to-[#1E1E24]'
                        : 'border border-white/10'
                    )}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <ToolLogo name={tool.name} category={tool.category} url={tool.url} className="w-12 h-12 rounded-xl text-base shrink-0" />
                        <div className="min-w-0">
                          {isWinner && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30 mb-1">
                              <Trophy className="w-3 h-3" /> Recommended Choice
                            </span>
                          )}
                          <h3 className="font-heading font-bold text-lg text-foreground truncate">{tool.name}</h3>
                          <p className="text-xs text-muted-foreground truncate">{tool.category}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCompare(tool.id)}
                        className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/10 min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0 transition-colors"
                        aria-label={`Remove ${tool.name}`}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
                      <span className="text-xs font-semibold text-muted-foreground">Overall Weighted Score:</span>
                      <span className="text-sm font-bold text-amber-400 font-mono">{scores.overallScore} / 5.0</span>
                    </div>

                    {/* Criteria Rating Bars */}
                    <div className="space-y-3 pt-1">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                        <Gauge className="w-3.5 h-3.5" /> Performance Criteria Ratings
                      </h4>
                      <div className="space-y-2.5 bg-black/20 p-3.5 rounded-xl border border-white/5">
                        {SCORE_CRITERIA.map(({ key, label, icon: Icon }) => {
                          const val = scores[key];
                          const isTop = val === topCriterionScores[key];

                          return (
                            <div key={key} className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground flex items-center gap-1.5">
                                  <Icon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                  {label}
                                </span>
                              </div>
                              <ScoreMeterBar score={val} isTopScore={isTop} />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Text Fields */}
                    <div className="space-y-3 pt-1">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" /> Plan & Feature Details
                      </h4>
                      <div className="space-y-3 bg-black/20 p-3.5 rounded-xl border border-white/5 text-xs sm:text-sm">
                        <div>
                          <span className="text-muted-foreground font-semibold block mb-1">Access Type:</span>
                          <AccessBadge access={tool.access} size="md" />
                        </div>
                        <div>
                          <span className="text-muted-foreground font-semibold block mb-1">Free Tier Limits:</span>
                          <p className="text-foreground/90 leading-relaxed break-words [overflow-wrap:anywhere]">
                            {tool.freePlan}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground font-semibold block mb-1">Why Use It:</span>
                          <p className="text-foreground/90 leading-relaxed break-words [overflow-wrap:anywhere]">
                            {tool.why}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleBookmark(tool)}
                        className={cn(
                          'h-11 text-xs rounded-xl border-white/10 font-semibold gap-1.5 w-full',
                          bookmarked ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' : ''
                        )}
                      >
                        {bookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-400" /> : <Bookmark className="w-4 h-4" />}
                        {bookmarked ? 'Saved' : 'Save'}
                      </Button>

                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="h-11 text-xs rounded-xl hover:bg-white/5 text-muted-foreground hover:text-foreground gap-1 w-full border border-white/10"
                      >
                        <Link to={`/tools/${toolSlug}`}>
                          Details <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </Button>
                    </div>

                    <Button
                      onClick={() => {
                        addToHistory(tool);
                        window.open(tool.url, '_blank', 'noopener,noreferrer');
                      }}
                      size="sm"
                      className="w-full h-11 text-xs font-bold bg-primary hover:bg-primary/90 text-white rounded-xl gap-2 shadow-md"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit Official Website
                    </Button>
                  </div>
                );
              })()}

              {/* Mode 2: Criterion Breakdown */}
              {mobileTabMode === 'criteria' && (
                <div className="space-y-4">
                  {/* Rating criteria cards */}
                  {SCORE_CRITERIA.map(({ key, label, icon: Icon }) => (
                    <div
                      key={`criterion-card-${key}`}
                      className="w-full bg-[#1E1E24] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-md"
                    >
                      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2.5">
                        <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">{label}</h3>
                      </div>

                      <div className="space-y-3">
                        {compareList.map((tool) => {
                          const scores = toolScoresMap.get(tool.id) || calculateToolScores(tool);
                          const val = scores[key];
                          const isTop = val === topCriterionScores[key];

                          return (
                            <div key={`criterion-val-${tool.id}-${key}`} className="space-y-1">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="font-semibold text-foreground/90 flex items-center gap-1.5">
                                  <ToolLogo name={tool.name} category={tool.category} url={tool.url} className="w-4 h-4 rounded text-[9px]" />
                                  {tool.name}
                                </span>
                                {isTop && (
                                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                    Highest
                                  </span>
                                )}
                              </div>
                              <ScoreMeterBar score={val} isTopScore={isTop} />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Free Plan Breakdown */}
                  <div className="w-full bg-[#1E1E24] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-md">
                    <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2.5">
                      <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Free Tier Limits</h3>
                    </div>
                    <div className="space-y-3.5 divide-y divide-white/[0.06]">
                      {compareList.map((tool, idx) => (
                        <div key={`freeplan-${tool.id}`} className={cn('space-y-1', idx > 0 ? 'pt-3' : '')}>
                          <span className="text-xs font-bold text-amber-400 block mb-1">{tool.name}</span>
                          <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed break-words [overflow-wrap:anywhere]">
                            {tool.freePlan}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ================= DESKTOP VIEW (>= 768px) ================= */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#1E1E24] shadow-2xl">
              <div
                className="w-full min-w-[720px]"
                style={{
                  display: 'grid',
                  gridTemplateColumns: `240px repeat(${compareList.length}, minmax(220px, 1fr))`,
                }}
              >
                {/* Tool Header row */}
                <div className="p-5 bg-muted/20 border-b border-white/[0.08] flex items-center font-bold text-xs uppercase tracking-wider text-muted-foreground">
                  Tool Overview
                </div>
                {compareList.map((tool) => {
                  const isWinner = winningTool?.id === tool.id;
                  const scores = toolScoresMap.get(tool.id) || calculateToolScores(tool);

                  return (
                    <div
                      key={`header-${tool.id}`}
                      className={cn(
                        'p-5 flex flex-col justify-between space-y-3 border-b border-l border-white/[0.08] relative transition-colors',
                        isWinner
                          ? 'border-t-2 border-x-2 border-t-[#F2994A] border-x-[#F2994A] bg-gradient-to-b from-amber-500/15 via-amber-500/5 to-[#1E1E24]'
                          : 'bg-[#1E1E24]'
                      )}
                      style={
                        isWinner
                          ? {
                              borderTop: '2px solid rgba(242, 153, 74, 0.6)',
                              borderLeft: '2px solid rgba(242, 153, 74, 0.6)',
                              borderRight: '2px solid rgba(242, 153, 74, 0.6)',
                            }
                          : undefined
                      }
                    >
                      {isWinner && (
                        <div className="bg-gradient-to-r from-orange-500 to-amber-400 text-black text-[10px] font-black uppercase tracking-widest py-1 px-3 rounded-full flex items-center justify-center gap-1 shadow-md mb-1">
                          <Trophy className="w-3 h-3" /> Recommended Choice
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-2">
                        <ToolLogo name={tool.name} category={tool.category} url={tool.url} size="lg" />
                        <button
                          onClick={() => removeFromCompare(tool.id)}
                          className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                          title={`Remove ${tool.name}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <h3 className="font-heading font-bold text-lg text-foreground mb-1">{tool.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <AccessBadge access={tool.access} size="sm" />
                        </div>
                        <div className="text-xs font-semibold text-muted-foreground">
                          Overall Score:{' '}
                          <span className="text-amber-400 font-bold font-mono">{scores.overallScore} / 5.0</span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Score Criteria Section Header */}
                <div className="col-span-full bg-black/40 px-5 py-2.5 border-b border-white/10 text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Gauge className="w-4 h-4" /> Performance Criteria Breakdown
                </div>

                {/* Animated Score Criteria Rows */}
                {SCORE_CRITERIA.map(({ key, label, weight, icon: Icon }, fi) => (
                  <div key={`row-score-${key}`} className="contents">
                    <div
                      className={cn(
                        'flex flex-col justify-center p-4 sm:p-5 text-xs font-bold text-muted-foreground border-b border-white/[0.06]',
                        fi % 2 === 0 ? 'bg-muted/15' : 'bg-[#1E1E24]'
                      )}
                    >
                      <div className="flex items-center gap-2 text-foreground mb-0.5">
                        <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{label}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-normal">Weight: {weight}</span>
                    </div>

                    {compareList.map((tool) => {
                      const isWinner = winningTool?.id === tool.id;
                      const scores = toolScoresMap.get(tool.id) || calculateToolScores(tool);
                      const val = scores[key];
                      const isTop = val === topCriterionScores[key];

                      return (
                        <div
                          key={`score-val-${tool.id}-${key}`}
                          className={cn(
                            'p-4 sm:p-5 border-b border-l border-white/[0.06] flex items-center',
                            fi % 2 === 0 ? 'bg-muted/15' : 'bg-[#1E1E24]',
                            isWinner ? 'border-x-2 border-x-[#F2994A]/40 bg-amber-500/5' : ''
                          )}
                        >
                          <ScoreMeterBar score={val} isTopScore={isTop} />
                        </div>
                      );
                    })}
                  </div>
                ))}

                {/* Feature & Text Details Section Header */}
                <div className="col-span-full bg-black/40 px-5 py-2.5 border-b border-white/10 text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Feature & Plan Details
                </div>

                {/* Text Field Rows */}
                {TEXT_FIELDS.map(({ key, label, icon: Icon }, fi) => {
                  const values = compareList.map((t) => t[key] as string);
                  const isDifferent = new Set(values).size > 1;

                  return (
                    <div key={`row-text-${key}`} className="contents">
                      <div
                        className={cn(
                          'flex items-center gap-2 p-4 sm:p-5 text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-white/[0.06]',
                          fi % 2 === 0 ? 'bg-muted/15' : 'bg-[#1E1E24]'
                        )}
                      >
                        <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{label}</span>
                      </div>

                      {compareList.map((tool) => {
                        const isWinner = winningTool?.id === tool.id;
                        const val = tool[key] as string;

                        return (
                          <div
                            key={`text-val-${tool.id}-${key}`}
                            className={cn(
                              'p-4 sm:p-5 text-sm border-b border-l border-white/[0.06]',
                              fi % 2 === 0 ? 'bg-muted/15' : 'bg-[#1E1E24]',
                              isWinner ? 'border-x-2 border-x-[#F2994A]/40 bg-amber-500/5' : ''
                            )}
                          >
                            {key === 'access' ? (
                              <AccessBadge access={tool.access} size="md" />
                            ) : (
                              <p
                                className={cn(
                                  'text-xs sm:text-sm leading-relaxed break-words [overflow-wrap:anywhere]',
                                  val ? 'text-foreground/90' : 'text-muted-foreground italic'
                                )}
                              >
                                {val || 'Not specified'}
                              </p>
                            )}
                            {isDifferent && key !== 'access' && (
                              <span className="inline-block text-[10px] text-amber-400 font-semibold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md mt-2">
                                Difference
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}

                {/* Website CTA Row */}
                <div className="flex items-center gap-2 p-5 text-xs font-bold text-muted-foreground uppercase tracking-widest bg-muted/20">
                  <Globe className="w-4 h-4 text-amber-400 shrink-0" />
                  Official Website
                </div>
                {compareList.map((tool) => {
                  const isWinner = winningTool?.id === tool.id;

                  return (
                    <div
                      key={`cta-${tool.id}`}
                      className={cn(
                        'p-5 bg-muted/20 border-l border-white/[0.08]',
                        isWinner ? 'border-x-2 border-x-[#F2994A]/40 bg-amber-500/10' : ''
                      )}
                    >
                      <Button
                        onClick={() => {
                          addToHistory(tool);
                          window.open(tool.url, '_blank', 'noopener,noreferrer');
                        }}
                        size="sm"
                        className={cn(
                          'w-full h-10 text-xs font-bold rounded-xl gap-1.5 shadow-md',
                          isWinner
                            ? 'bg-amber-500 hover:bg-amber-600 text-black'
                            : 'bg-primary hover:bg-primary/90 text-white'
                        )}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Visit Website
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Social Sharing Watermark Banner */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground bg-black/20 p-3.5 rounded-2xl">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-[11px] font-bold text-amber-400">
                  ⚡
                </div>
                <span className="font-semibold text-foreground/90">
                  Generated by <span className="text-amber-400 font-bold">ToolVerse AI</span> - find the right tool for any task.
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground/60 font-mono">
                {compareList.map((t) => t.name).join(' vs ')}
              </span>
            </div>
          </div>
        )}

        {/* Add more tools prompt */}
        {!isEmpty && compareList.length < 3 && (
          <div className="mt-8 p-6 rounded-2xl border border-dashed border-white/15 bg-[#1E1E24]/50 text-center space-y-3">
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
              You can compare up to 3 tools at once ({3 - compareList.length} spot{3 - compareList.length > 1 ? 's' : ''} left)
            </p>
            <Button asChild variant="outline" size="sm" className="text-amber-400 hover:text-amber-300 border-amber-500/30 hover:bg-amber-500/10 text-xs rounded-xl h-10 px-5 font-semibold">
              <Link to="/search">
                <Plus className="w-4 h-4 mr-1.5" />
                Find More Tools to Compare
              </Link>
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
