import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trophy,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  GitCompare,
  ArrowRight,
  Info,
  ChevronDown,
  ChevronUp,
  Layers,
  Zap,
} from 'lucide-react';
import type { RecommendationResponse, ToolCandidate } from '@/types/recommendation';
import ToolLogo from '@/components/tools/ToolLogo';
import AccessBadge from '@/components/tools/AccessBadge';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

interface Props {
  recommendation?: RecommendationResponse | null;
  isLoading?: boolean;
}

export default function RecommendationVerdictCard({ recommendation, isLoading }: Props) {
  const navigate = useNavigate();
  const { setCompareTools, tools } = useApp();
  const [showMatrix, setShowMatrix] = useState(false);

  if (isLoading) {
    return (
      <div className="w-full rounded-3xl border border-amber-500/30 bg-[#1E1E24]/90 p-6 sm:p-8 animate-pulse space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-white/10 rounded w-1/3" />
            <div className="h-6 bg-white/10 rounded w-2/3" />
          </div>
        </div>
        <div className="h-16 bg-white/5 rounded-2xl" />
      </div>
    );
  }

  if (!recommendation) return null;

  const {
    query,
    requirements,
    best_match,
    results,
    comparison_matrix,
    explanation,
    no_match_reason,
    candidates_evaluated_count,
    alternatives,
  } = recommendation;

  const handleCompareAll = () => {
    if (results.length === 0) return;
    const targetTools = results
      .slice(0, 3)
      .map((r) => tools.find((t) => t.id === r.tool_id))
      .filter(Boolean) as any[];

    if (targetTools.length > 0) {
      setCompareTools(targetTools);
      navigate('/compare');
    }
  };

  // Case: No verified match found
  if (!best_match) {
    return (
      <div className="w-full rounded-3xl border-2 border-amber-500/30 bg-[#1E1E24] p-6 sm:p-8 shadow-2xl space-y-5 text-left">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <Info className="w-3.5 h-3.5" />
              Constraint Verification Notice
            </div>
            <h3 className="font-heading font-bold text-lg sm:text-xl text-foreground">
              No Verified Match for "{query}"
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {no_match_reason || 'None of the evaluated tools in our database meet all your mandatory constraints.'}
            </p>
          </div>
        </div>

        <div className="bg-black/30 border border-white/5 rounded-2xl p-4 text-xs space-y-2 text-muted-foreground">
          <span className="font-semibold text-foreground block">Evaluated Constraints:</span>
          <div className="flex flex-wrap gap-2">
            {requirements.hard_constraints.map((c) => (
              <span key={c} className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300">
                Mandatory: {c.replace(/_/g, ' ')}
              </span>
            ))}
            {requirements.soft_preferences.map((p) => (
              <span key={p} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-muted-foreground">
                Preference: {p.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground/80 pt-1">
            Tip: Try broadening your budget filter to Freemium or exploring our popular alternatives below.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-b from-[#1E1E24] via-[#1A1A20] to-[#141418] p-5 sm:p-7 shadow-2xl space-y-6 text-left">
      {/* Top Banner Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-amber-500 p-0.5 shrink-0 shadow-lg">
            <div className="w-full h-full bg-[#18181C] rounded-[14px] flex items-center justify-center">
              <Trophy className="w-6 h-6 text-emerald-400" />
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 px-3 py-0.5 rounded-full border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Top Match: {best_match.name}
              </span>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                Suitability: {best_match.suitability_score}%
              </span>
              <span className="text-[11px] font-semibold text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                {best_match.confidence.toUpperCase()} Confidence • {best_match.evidence_coverage}% Facts Verified
              </span>
            </div>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-foreground tracking-tight flex items-center gap-2">
              <ToolLogo name={best_match.name} category={best_match.category} url={best_match.official_website} className="w-6 h-6 rounded text-xs" />
              {best_match.name}
              <span className="text-xs font-normal text-muted-foreground font-sans">
                ({best_match.category})
              </span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
          <Button
            onClick={handleCompareAll}
            variant="outline"
            size="sm"
            className="h-10 px-4 text-xs font-semibold rounded-xl border-amber-500/30 text-amber-400 hover:bg-amber-500/10 gap-1.5"
          >
            <GitCompare className="w-4 h-4" /> Compare Candidates ({results.length})
          </Button>

          <Button
            asChild
            size="sm"
            className="h-10 px-5 text-xs font-bold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black shadow-md gap-1.5"
          >
            <a href={best_match.official_website} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" /> Visit Official Website
            </a>
          </Button>
        </div>
      </div>

      {/* Grounded Explanation Quote */}
      <div className="bg-black/30 border border-emerald-500/20 rounded-2xl p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1.5 flex-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Why ToolTap Recommends This Tool for "{query}"
            </div>
            <p className="text-sm font-medium text-foreground/95 leading-relaxed">
              {explanation}
            </p>
          </div>
        </div>
      </div>

      {/* Structured Facts Grid for the Winner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
        {/* Box 1: Pricing & Free Tier */}
        <div className="bg-[#18181C] border border-white/10 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Pricing & Free Tier
          </div>
          <div className="font-bold text-foreground text-sm">
            {best_match.pricing_summary}
          </div>
          <p className="text-[11px] text-muted-foreground leading-tight">
            {best_match.free_tier_status}
          </p>
        </div>

        {/* Box 2: Matched Requirements */}
        <div className="bg-[#18181C] border border-white/10 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Matched Requirements
          </div>
          <div className="font-bold text-foreground text-sm">
            {best_match.matched_requirements.length} Satisfied
          </div>
          <div className="flex flex-wrap gap-1">
            {best_match.matched_requirements.slice(0, 2).map((m) => (
              <span key={m} className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px]">
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Box 3: Key Advantages */}
        <div className="bg-[#18181C] border border-white/10 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground font-semibold">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Key Strengths
          </div>
          <p className="text-[11px] text-foreground font-medium leading-tight line-clamp-2">
            {best_match.advantages[0] || 'High benchmark reliability'}
          </p>
        </div>

        {/* Box 4: Major Limitation (Honest Disclosure) */}
        <div className="bg-[#18181C] border border-amber-500/20 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Major Limitation
          </div>
          <p className="text-[11px] text-muted-foreground leading-tight line-clamp-2">
            {best_match.limitations[0] || 'Standard rate limits apply'}
          </p>
        </div>
      </div>

      {/* Runner-up Candidates Quick Bar */}
      {results.length > 1 && (
        <div className="bg-black/20 rounded-2xl p-3.5 border border-white/5 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-muted-foreground">
              Candidate Pool ({results.length} eligible tools evaluated out of {candidates_evaluated_count}):
            </span>
            <button
              onClick={() => setShowMatrix((v) => !v)}
              className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
            >
              {showMatrix ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              {showMatrix ? 'Hide Verification Table' : 'View Side-by-Side Verification Table'}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {results.map((r) => (
              <div
                key={r.tool_id}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs',
                  r.rank === 1
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold'
                    : 'bg-white/5 border-white/10 text-muted-foreground'
                )}
              >
                <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
                  #{r.rank}
                </span>
                <span>{r.name}</span>
                <span className="font-mono text-[11px] text-amber-400">{r.suitability_score}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collapsible Side-by-Side Comparison Matrix */}
      {showMatrix && comparison_matrix && (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/40 p-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <GitCompare className="w-3.5 h-3.5" />
            Objective Side-by-Side Criteria Comparison
          </div>

          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-muted-foreground">
                <th className="py-2 px-3 font-semibold w-40">Criterion</th>
                {comparison_matrix.tools.map((t) => (
                  <th key={t.tool_id} className="py-2 px-3 font-bold text-foreground">
                    {t.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {comparison_matrix.criteria.map((criterion) => (
                <tr key={criterion} className="hover:bg-white/[0.02]">
                  <td className="py-2.5 px-3 font-semibold text-muted-foreground">{criterion}</td>
                  {comparison_matrix.tools.map((t) => (
                    <td key={`cell-${t.tool_id}-${criterion}`} className="py-2.5 px-3 text-foreground/90">
                      {t.values[criterion] || 'Unknown'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
