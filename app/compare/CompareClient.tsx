'use client';

import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { GitCompare, Sparkles, Scale, ArrowLeft } from 'lucide-react';
import rawTools from '@/data/tools.json';
import type { Tool } from '@/types/tool';
import { calculateToolScores, type ToolCalculatedScores } from '@/lib/compareUtils';
import { calculateVectorScores, calculateComparisonVerdict, type VectorScoreResult } from '@/lib/vectorScores';
import CompareMatrix from '@/components/tools/CompareMatrix';
import BasisOfComparisonGrid from '@/components/tools/BasisOfComparisonGrid';
import FinalVerdictBanner from '@/components/tools/FinalVerdictBanner';
import { Button } from '@/components/ui/button';

export default function CompareClient() {
  const searchParams = useSearchParams();
  const compareParam = searchParams?.get('compare') || 'chatgpt,claude';

  // Ensure distinct tool instances are extracted and cloned from the dataset
  const tools: Tool[] = useMemo(() => {
    const keys = compareParam
      .split(',')
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);

    const matched: Tool[] = [];
    keys.forEach((key) => {
      const found = (rawTools as unknown as Tool[]).find(
        (t) =>
          String(t.id) === key ||
          t.name.toLowerCase() === key ||
          t.name.toLowerCase().includes(key)
      );
      if (found && !matched.some((m) => m.id === found.id)) {
        // Deep clone tool instance to guarantee distinct object identity
        matched.push({ ...found });
      }
    });

    if (matched.length === 0) {
      // Default to distinct ChatGPT and Claude profiles
      const chatgpt = (rawTools as unknown as Tool[]).find((t) => t.name.toLowerCase() === 'chatgpt');
      const claude = (rawTools as unknown as Tool[]).find((t) => t.name.toLowerCase() === 'claude');
      if (chatgpt && claude) {
        return [{ ...chatgpt }, { ...claude }];
      }
    }

    return matched;
  }, [compareParam]);

  // Verified State Mapping: tools.map(tool => calculateToolScores(tool)) receives distinct tool instances
  const toolEvaluations = useMemo(() => {
    return tools.map((tool) => {
      const distinctToolInstance: Tool = { ...tool };
      return {
        tool: distinctToolInstance,
        scores: calculateToolScores(distinctToolInstance),
      };
    });
  }, [tools]);

  // Scores map for vector charts and verdicts
  const vectorScoresMap = useMemo(() => {
    const map = new Map<number, VectorScoreResult>();
    tools.forEach((tool) => {
      map.set(Number(tool.id), calculateVectorScores({ ...tool }));
    });
    return map;
  }, [tools]);

  const verdict = useMemo(() => {
    return calculateComparisonVerdict(tools, vectorScoresMap);
  }, [tools, vectorScoresMap]);

  return (
    <div className="min-h-screen bg-[#121216] text-foreground p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <Link
              href="/search"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Directory
            </Link>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground flex items-center gap-2.5">
              <GitCompare className="w-7 h-7 text-amber-500" />
              Side-by-Side Model Comparison
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl">
              Mathematically accurate evaluation derived from ground-truth token throughput, benchmark scores, context limits, and pricing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Comparing:</span>
            {tools.map((t) => (
              <span
                key={`badge-${t.id}`}
                className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400"
              >
                {t.name}
              </span>
            ))}
          </div>
        </div>

        {/* 1. Final Verdict Banner */}
        {verdict && (
          <FinalVerdictBanner
            verdict={verdict}
            tools={tools}
            scoresMap={vectorScoresMap}
          />
        )}

        {/* 2. CompareMatrix (Multi-Vector Radar Chart & Hard Data Verification Grid) */}
        <CompareMatrix tools={tools} scoresMap={vectorScoresMap} />

        {/* 3. Basis of Comparison Methodology Grid */}
        <BasisOfComparisonGrid tools={tools} scoresMap={vectorScoresMap} />
      </div>
    </div>
  );
}
