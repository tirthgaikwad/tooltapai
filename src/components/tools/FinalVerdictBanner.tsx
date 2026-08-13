import React from 'react';
import { Trophy, CheckCircle2, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import AccessBadge from '@/components/tools/AccessBadge';
import ToolLogo from '@/components/tools/ToolLogo';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import type { Tool } from '@/types/tool';
import type { VerdictResult, VectorScoreResult } from '@/lib/vectorScores';

interface FinalVerdictBannerProps {
  verdict: VerdictResult;
  tools: Tool[];
  scoresMap: Map<number, VectorScoreResult>;
}

export default function FinalVerdictBanner({ verdict, tools, scoresMap }: FinalVerdictBannerProps) {
  const { addToHistory } = useApp();
  const { winner, winnerScore, summaryText } = verdict;

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-[#F2994A]/60 bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-[#1E1E24] backdrop-blur-xl p-5 sm:p-7 shadow-2xl space-y-5">
      {/* Subtle ambient light glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Row */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-0.5 shrink-0 shadow-xl">
            <div className="w-full h-full bg-[#18181C] rounded-[14px] flex items-center justify-center">
              <Trophy className="w-6 h-6 text-amber-400" />
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/40 shadow-sm">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                🏆 Overall Winner: {winner.name}
              </span>
              <span className="text-xs font-bold font-mono text-amber-300 bg-black/40 px-2.5 py-1 rounded-full border border-white/10">
                Score: {winnerScore} / 50.0
              </span>
              <AccessBadge access={winner.access} size="sm" />
            </div>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-foreground tracking-tight flex items-center gap-2">
              <ToolLogo name={winner.name} category={winner.category} url={winner.url} className="w-6 h-6 rounded-md text-xs" />
              {winner.name}
            </h2>
          </div>
        </div>

        <Button
          onClick={() => {
            addToHistory(winner);
            window.open(winner.url, '_blank', 'noopener,noreferrer');
          }}
          size="sm"
          className="h-11 px-6 text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black rounded-xl gap-2 shrink-0 shadow-xl w-full lg:w-auto"
        >
          <CheckCircle2 className="w-4 h-4" />
          Visit Winning Tool
        </Button>
      </div>

      {/* Dynamic Summary Sentence Block */}
      <div className="bg-black/40 border border-amber-500/20 rounded-2xl p-4 sm:p-5 relative">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Dynamic Matrix Analysis
            </div>
            <p className="text-sm sm:text-base font-medium text-foreground/95 leading-relaxed italic">
              &ldquo;{summaryText}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* All Selected Tools Score Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs font-semibold text-muted-foreground mr-1">Matrix Scores:</span>
        {tools.map((t) => {
          const scoreObj = scoresMap.get(t.id);
          const total = scoreObj ? scoreObj.totalScore : 0;
          const isWinner = t.id === winner.id;

          return (
            <div
              key={`verdict-chip-${t.id}`}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                isWinner
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md'
                  : 'bg-white/5 border-white/10 text-muted-foreground'
              }`}
            >
              <ToolLogo name={t.name} category={t.category} url={t.url} className="w-4 h-4 rounded text-[9px]" />
              <span>{t.name}</span>
              <span className="font-mono font-bold text-foreground">{total} / 50</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
