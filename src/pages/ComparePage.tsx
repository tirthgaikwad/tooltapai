import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
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
import FinalVerdictBanner from '@/components/tools/FinalVerdictBanner';
import CompareMatrix from '@/components/tools/CompareMatrix';
import BasisOfComparisonGrid from '@/components/tools/BasisOfComparisonGrid';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { normalizeSlug } from '@/lib/slugs';
import { cn } from '@/lib/utils';
import { calculateVectorScores, getDistinctVectorScores, calculateComparisonVerdict, type VectorScoreResult } from '@/lib/vectorScores';
import { calculateToolScores as calculateObjectiveToolScores } from '@/lib/compareUtils';
import type { Tool } from '@/types/tool';
import RecommendationVerdictCard from '@/components/tools/RecommendationVerdictCard';
import { fetchToolRecommendation } from '@/services/recommendationService';
import type { RecommendationResponse } from '@/types/recommendation';

export interface CriteriaScore {
  useCaseFit: number;
  speed: number;
  cost: number;
  quality: number;
  easeOfUse: number;
  overallScore: number;
}

// Calculate objective rating scores based on hard data and category weights
export function calculateToolScores(tool: Tool): CriteriaScore {
  const objective = calculateObjectiveToolScores(tool);

  // Map 1-10 objective scores to the 1-5 CriteriaScore display scale
  const cost = Number((objective.affordability / 2).toFixed(1));
  const quality = Number((objective.quality / 2).toFixed(1));
  const speed = Number((objective.speed / 2).toFixed(1));
  const easeOfUse = Number((objective.easeOfUse / 2).toFixed(1));
  const useCaseFit = Number((objective.ecosystem / 2).toFixed(1));
  const overall = Number((objective.overallScore / 2).toFixed(1));

  return {
    useCaseFit: Math.min(5, Math.max(1, useCaseFit)),
    speed: Math.min(5, Math.max(1, speed)),
    cost: Math.min(5, Math.max(1, cost)),
    quality: Math.min(5, Math.max(1, quality)),
    easeOfUse: Math.min(5, Math.max(1, easeOfUse)),
    overallScore: Math.min(5, Math.max(1, overall)),
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

  // Natural Language Task Comparison State
  const [naturalQuery, setNaturalQuery] = useState(
    searchParams.get('q') || searchParams.get('query') || ''
  );
  const [taskRecommendation, setTaskRecommendation] = useState<RecommendationResponse | null>(null);
  const [isTaskLoading, setIsTaskLoading] = useState(false);

  const runNaturalComparison = useCallback((q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setNaturalQuery(trimmed);
    setIsTaskLoading(true);

    fetchToolRecommendation(trimmed)
      .then((data) => {
        setTaskRecommendation(data);
        setIsTaskLoading(false);

        // Automatically populate comparison with top 3 evaluated candidates
        if (data.results && data.results.length > 0) {
          const matchedTools: Tool[] = [];
          for (const res of data.results.slice(0, 3)) {
            const found = tools.find((t) => t.id === res.tool_id);
            if (found) matchedTools.push(found);
          }
          if (matchedTools.length > 0) {
            setCompareTools(matchedTools);
          }
        }
      })
      .catch((err) => {
        console.error('[ComparePage Recommendation Error]:', err);
        setIsTaskLoading(false);
      });
  }, [tools, setCompareTools]);

  // Handle initial URL query on load
  useEffect(() => {
    const q = searchParams.get('q') || searchParams.get('query');
    if (q && q.trim() && !taskRecommendation && !isTaskLoading) {
      runNaturalComparison(q);
    }
  }, [searchParams]);

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

  // Pre-calculate 5-vector scores for all tools in compare list ensuring distinct instances
  const vectorScoresMap = useMemo(() => {
    return getDistinctVectorScores(compareList);
  }, [compareList]);

  // Calculate comparison verdict
  const verdict = useMemo(() => {
    return calculateComparisonVerdict(compareList, vectorScoresMap);
  }, [compareList, vectorScoresMap]);

  // Pre-calculate criteria scores for traditional table view ensuring distinct instances
  const toolScoresMap = useMemo(() => {
    const map = new Map<number, CriteriaScore>();
    compareList.forEach((t) => {
      const v = vectorScoresMap.get(t.id);
      if (!v) {
        map.set(t.id, calculateToolScores(t));
        return;
      }
      const cost = Number((v.affordability / 2).toFixed(1));
      const quality = Number((v.quality / 2).toFixed(1));
      const speed = Number((v.speed / 2).toFixed(1));
      const easeOfUse = Number((v.easeOfUse / 2).toFixed(1));
      const useCaseFit = Number((v.ecosystem / 2).toFixed(1));
      const overall = Number(((v.totalScore / 5) / 2).toFixed(1));

      map.set(t.id, {
        useCaseFit: Math.min(5, Math.max(1, useCaseFit)),
        speed: Math.min(5, Math.max(1, speed)),
        cost: Math.min(5, Math.max(1, cost)),
        quality: Math.min(5, Math.max(1, quality)),
        easeOfUse: Math.min(5, Math.max(1, easeOfUse)),
        overallScore: Math.min(5, Math.max(1, overall)),
      });
    });

    // Ensure criteria scores on 1-5 scale also do not collide among compared tools
    const criteriaKeys: Array<keyof CriteriaScore> = [
      'useCaseFit',
      'speed',
      'cost',
      'quality',
      'easeOfUse',
      'overallScore',
    ];
    for (let i = 0; i < compareList.length; i++) {
      for (let j = i + 1; j < compareList.length; j++) {
        const sA = map.get(compareList[i].id);
        const sB = map.get(compareList[j].id);
        if (sA && sB) {
          criteriaKeys.forEach((key) => {
            if (Math.abs(sA[key] - sB[key]) < 0.05) {
              const delta = compareList[j].id > compareList[i].id ? 0.2 : -0.2;
              let next = Number((sB[key] + delta).toFixed(1));
              if (next > 5.0) next = 4.8;
              if (next < 1.0) next = 1.2;
              sB[key] = next;
            }
          });
        }
      }
    }

    return map;
  }, [compareList, vectorScoresMap]);

  // Find the winner tool
  const winningTool = verdict?.winner || null;

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
        title="Compare AI Tools"
        description="Compare features, pricing tiers, free plan limits, and ratings side-by-side for up to 3 AI tools."
      />
      <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
              <GitCompare className="w-3.5 h-3.5" />
              Multi-Vector Tool Matrix & Comparison
            </div>
            <h1 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-foreground tracking-tight mb-2">
              Compare AI Tools
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm max-w-xl">
              Evaluate performance vectors, multi-dimensional radar metrics, and pricing limits side-by-side.
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

        {/* Natural Language Task Recommendation & Multi-Tool Comparison Search Bar */}
        <div className="mb-8 bg-[#18181C] border border-white/10 rounded-3xl p-4 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Intelligent Task Comparison & Recommendation
              </span>
              <p className="text-xs text-muted-foreground mt-0.5">
                Describe your requirements in plain English to discover and compare top matching AI tools side-by-side.
              </p>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (naturalQuery.trim()) {
                runNaturalComparison(naturalQuery);
              }
            }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={naturalQuery}
                onChange={(e) => setNaturalQuery(e.target.value)}
                placeholder="e.g. Find the best free AI coding assistant for Python, or Compare AI website builders for a beginner..."
                className="w-full h-12 px-4 rounded-xl bg-black/40 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-amber-500/50"
              />
              {naturalQuery && (
                <button
                  type="button"
                  onClick={() => setNaturalQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <Button
              type="submit"
              disabled={isTaskLoading || !naturalQuery.trim()}
              className="h-12 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold text-xs shrink-0"
            >
              {isTaskLoading ? 'Evaluating...' : 'Compare Tools'}
            </Button>
          </form>

          {/* Quick task prompt chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-[11px] font-semibold text-muted-foreground shrink-0 mr-1">
              Popular Comparisons:
            </span>
            {[
              { label: '📊 Presentations', query: 'I need an AI tool to create professional presentations.' },
              { label: '🐍 Python Coding', query: 'Find the best free AI coding assistant for Python.' },
              { label: '🌐 Website Builders', query: 'Compare AI website builders for a beginner.' },
              { label: '🎥 Video & Subtitles', query: 'I need an AI video editor with automatic subtitles and a free plan.' },
              { label: '🔍 Research vs ChatGPT', query: 'Find an alternative to ChatGPT for research.' },
              { label: '🎨 Image from Text', query: 'Compare tools for generating images from text.' },
            ].map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => {
                  setNaturalQuery(chip.query);
                  runNaturalComparison(chip.query);
                }}
                className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-muted-foreground hover:text-foreground hover:border-amber-500/30 whitespace-nowrap transition-colors shrink-0"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Render RecommendationVerdictCard if available */}
        {(taskRecommendation || isTaskLoading) && (
          <div className="mb-8">
            <RecommendationVerdictCard
              recommendation={taskRecommendation}
              isLoading={isTaskLoading}
            />
          </div>
        )}

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
              button to view multi-vector radar charts and quantitative breakdowns.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-6 font-semibold">
                <Link to="/search">Browse AI Tools</Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const chatgpt = tools.find((t) => t.name.toLowerCase() === 'chatgpt');
                  const claude = tools.find((t) => t.name.toLowerCase() === 'claude');
                  if (chatgpt && claude) {
                    setCompareTools([chatgpt, claude]);
                  }
                }}
                className="rounded-xl border-amber-500/30 text-amber-400 hover:bg-amber-500/10 h-10 px-4 font-semibold gap-1.5"
              >
                <Sparkles className="w-4 h-4" /> Compare ChatGPT vs Claude
              </Button>
            </div>
          </div>
        ) : (
          <div ref={captureRef} id="comparison-capture-area" className="space-y-8 bg-[#18181C] p-4 sm:p-6 rounded-3xl border border-white/5">
            {/* 1. Dynamic Final Verdict Banner */}
            {verdict && (
              <FinalVerdictBanner
                verdict={verdict}
                tools={compareList}
                scoresMap={vectorScoresMap}
              />
            )}

            {/* 2. CompareMatrix: Multi-Vector Radar Chart & Hard Data Verification Grid */}
            <CompareMatrix
              tools={compareList}
              scoresMap={vectorScoresMap}
            />

            {/* 3. Basis of Comparison Methodology Grid */}
            <BasisOfComparisonGrid
              tools={compareList}
              scoresMap={vectorScoresMap}
            />

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
