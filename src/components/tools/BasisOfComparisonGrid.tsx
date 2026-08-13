import React from 'react';
import { Zap, Star, Smile, DollarSign, Layers, ShieldCheck, Database, Info } from 'lucide-react';
import ToolLogo from '@/components/tools/ToolLogo';
import type { Tool } from '@/types/tool';
import { DATA_VECTORS, type VectorScoreResult } from '@/lib/vectorScores';

interface BasisOfComparisonGridProps {
  tools: Tool[];
  scoresMap: Map<number, VectorScoreResult>;
}

const VECTOR_ICONS: Record<string, React.FC<{ className?: string }>> = {
  speed: Zap,
  quality: Star,
  easeOfUse: Smile,
  affordability: DollarSign,
  ecosystem: Layers,
};

export default function BasisOfComparisonGrid({ tools, scoresMap }: BasisOfComparisonGridProps) {
  return (
    <div className="bg-[#1E1E24] border border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
      {/* Section Title */}
      <div className="border-b border-white/10 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
          <Database className="w-3.5 h-3.5" />
          Scoring Methodology
        </div>
        <h3 className="font-heading font-bold text-lg sm:text-xl text-foreground">
          Basis of Comparison
        </h3>
        <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
          Detailed metrics and hard benchmarks powering the 1-10 vector ratings for each tool.
        </p>
      </div>

      {/* Grid of 5 Quantitative Vectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {DATA_VECTORS.map((vector) => {
          const IconComponent = VECTOR_ICONS[vector.key] || Info;

          return (
            <div
              key={`vector-card-${vector.key}`}
              className="bg-black/30 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4 hover:border-amber-500/30 transition-all flex flex-col justify-between"
            >
              {/* Header: Vector Name & Measurement Description */}
              <div className="space-y-1.5 border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <IconComponent className="w-4 h-4 text-amber-400" />
                  </div>
                  <h4 className="font-heading font-bold text-sm sm:text-base text-foreground">
                    {vector.name} Vector
                  </h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pl-1">
                  <span className="font-semibold text-amber-400/90">{vector.name}: </span>
                  {vector.description}
                </p>
              </div>

              {/* Tool Scores & Hard Data Driving Scores */}
              <div className="space-y-2.5 pt-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-1">
                  Tool Data Points & Scores
                </div>
                {tools.map((tool) => {
                  const scoreObj = scoresMap.get(tool.id);
                  const scoreVal = scoreObj ? scoreObj[vector.key] : 0;
                  const hardDataSnippet = scoreObj ? scoreObj.hardData[vector.key] : '';

                  return (
                    <div
                      key={`data-${tool.id}-${vector.key}`}
                      className="bg-white/5 border border-white/5 rounded-xl p-3 space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-foreground truncate">
                          <ToolLogo name={tool.name} category={tool.category} url={tool.url} className="w-4 h-4 rounded text-[9px]" />
                          {tool.name}
                        </span>
                        <span className="text-xs font-bold font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md shrink-0">
                          {scoreVal} / 10
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground/90 font-mono leading-tight pl-5 break-words">
                        {hardDataSnippet}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
