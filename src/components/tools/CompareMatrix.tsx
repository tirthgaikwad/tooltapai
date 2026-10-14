import React, { useState } from 'react';
import {
  Sparkles,
  DollarSign,
  ShieldCheck,
  Laptop,
  Code2,
  CheckCircle2,
  XCircle,
  Zap,
  Star,
  Smile,
  Layers,
  HelpCircle,
  Scale,
  Award,
} from 'lucide-react';
import ToolLogo from '@/components/tools/ToolLogo';
import type { Tool } from '@/types/tool';
import {
  calculateToolScores,
  getToolHardData,
  CATEGORY_WEIGHTS,
  type ToolCalculatedScores,
} from '@/lib/compareUtils';
import { DATA_VECTORS, type VectorScoreResult } from '@/lib/vectorScores';
import { cn } from '@/lib/utils';

interface CompareMatrixProps {
  tools: Tool[];
  scoresMap?: Map<number, VectorScoreResult>;
}

const TOOL_COLORS = [
  { stroke: '#F2994A', fill: 'rgba(242, 153, 74, 0.35)', dot: '#F2994A', badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { stroke: '#E05A47', fill: 'rgba(224, 90, 71, 0.30)', dot: '#E05A47', badge: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { stroke: '#3B82F6', fill: 'rgba(59, 130, 246, 0.30)', dot: '#3B82F6', badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
];

export default function CompareMatrix({ tools }: CompareMatrixProps) {
  const [hoveredVectorIndex, setHoveredVectorIndex] = useState<number | null>(null);

  // Derive calculated scores and hard data for each tool
  const toolEvaluations = tools.map((tool) => ({
    tool,
    scores: calculateToolScores(tool),
    hardData: getToolHardData(tool),
  }));

  // SVG Geometry Constants for Radar Chart
  const size = 360;
  const center = size / 2;
  const maxRadius = 115;
  const numVectors = DATA_VECTORS.length; // 5: speed, quality, easeOfUse, affordability, ecosystem

  const getPoint = (vectorIndex: number, scoreValue: number) => {
    const angle = (Math.PI * 2 * vectorIndex) / numVectors - Math.PI / 2;
    const radius = (Math.min(10, Math.max(0, scoreValue)) / 10) * maxRadius;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x, y, angle };
  };

  const gridLevels = [2, 4, 6, 8, 10];

  return (
    <div className="space-y-8">
      {/* 1. Radar Matrix Chart Component */}
      <div className="bg-[#1E1E24] border border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Standardized Rubric & Multipliers
            </div>
            <h3 className="font-heading font-bold text-lg sm:text-xl text-foreground">
              Multi-Vector Radar Matrix
            </h3>
            <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
              Objective 1-10 scores mathematically derived from hard pricing, ecosystem, and category benchmarks.
            </p>
          </div>

          {/* Tool Legend */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {toolEvaluations.map(({ tool }, idx) => {
              const color = TOOL_COLORS[idx % TOOL_COLORS.length];
              return (
                <div
                  key={`legend-${tool.id}`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-black/40 text-xs font-semibold"
                >
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color.stroke }} />
                  <ToolLogo name={tool.name} category={tool.category} url={tool.url} className="w-4 h-4 rounded text-[9px]" />
                  <span className="text-foreground truncate max-w-[110px]">{tool.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Radar SVG */}
        <div className="relative w-full flex flex-col items-center justify-center py-2">
          <svg
            viewBox={`0 0 ${size} ${size}`}
            className="w-full max-w-[380px] h-auto overflow-visible"
          >
            {/* Concentric Grid Webs */}
            {gridLevels.map((level) => {
              const points = DATA_VECTORS.map((_, i) => {
                const { x, y } = getPoint(i, level);
                return `${x},${y}`;
              }).join(' ');

              return (
                <polygon
                  key={`grid-level-${level}`}
                  points={points}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth={level === 10 ? 1.5 : 0.8}
                  strokeDasharray={level === 10 ? undefined : '2 3'}
                />
              );
            })}

            {/* Radial Spokes & Vector Labels */}
            {DATA_VECTORS.map((vector, i) => {
              const { x, y, angle } = getPoint(i, 10);
              const labelDist = maxRadius + 28;
              const labelX = center + labelDist * Math.cos(angle);
              const labelY = center + labelDist * Math.sin(angle);
              const isHovered = hoveredVectorIndex === i;

              return (
                <g key={`spoke-${vector.key}`}>
                  <line
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth={1}
                  />
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isHovered ? '#F2994A' : '#E2E8F0'}
                    fontSize={11}
                    fontWeight={isHovered ? 700 : 600}
                    className="cursor-pointer select-none transition-colors"
                    onMouseEnter={() => setHoveredVectorIndex(i)}
                    onMouseLeave={() => setHoveredVectorIndex(null)}
                  >
                    {vector.name}
                  </text>
                </g>
              );
            })}

            {/* Render Filled Polygons for Each Tool */}
            {toolEvaluations.map(({ tool, scores }, toolIdx) => {
              const color = TOOL_COLORS[toolIdx % TOOL_COLORS.length];
              const points = DATA_VECTORS.map((vector, vectorIdx) => {
                const scoreValue = scores[vector.key as keyof ToolCalculatedScores] as number;
                const { x, y } = getPoint(vectorIdx, scoreValue || 1);
                return `${x},${y}`;
              }).join(' ');

              return (
                <g key={`poly-group-${tool.id}`}>
                  <polygon
                    points={points}
                    fill={color.fill}
                    stroke={color.stroke}
                    strokeWidth={2.5}
                    className="transition-all duration-300"
                  />
                  {/* Point circles */}
                  {DATA_VECTORS.map((vector, vectorIdx) => {
                    const scoreValue = scores[vector.key as keyof ToolCalculatedScores] as number;
                    const { x, y } = getPoint(vectorIdx, scoreValue || 1);
                    return (
                      <circle
                        key={`dot-${tool.id}-${vector.key}`}
                        cx={x}
                        cy={y}
                        r={4}
                        fill={color.dot}
                        stroke="#1E1E24"
                        strokeWidth={1.5}
                      />
                    );
                  })}
                </g>
              );
            })}
          </svg>

          {/* Level scale label indicator */}
          <div className="flex items-center gap-4 text-[11px] text-muted-foreground mt-2">
            <span>Center = 0</span>
            <span>Inner Webs = 2, 4, 6, 8</span>
            <span className="font-semibold text-foreground">Outer Ring = 10.0 (Max Score)</span>
          </div>
        </div>
      </div>

      {/* 2. The Hard Data Verification Grid */}
      <div className="bg-[#1E1E24] border border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
        <div className="border-b border-white/10 pb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <Scale className="w-3.5 h-3.5" />
            Hard Data Verification Grid
          </div>
          <h3 className="font-heading font-bold text-lg sm:text-xl text-foreground">
            Objective Scoring Proof & Benchmarks
          </h3>
          <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
            Verify the mathematical formula behind each radar point side-by-side using raw tool facts and platform constraints.
          </p>
        </div>

        {/* CSS Grid Table comparing raw facts side-by-side */}
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/40">
          <div
            className="w-full min-w-[700px]"
            style={{
              display: 'grid',
              gridTemplateColumns: `220px repeat(${tools.length}, minmax(200px, 1fr))`,
            }}
          >
            {/* Header: Tools Info */}
            <div className="p-4 bg-muted/20 border-b border-r border-white/10 flex items-center font-bold text-xs uppercase tracking-wider text-muted-foreground">
              Hard Data Metric
            </div>
            {toolEvaluations.map(({ tool, scores }, idx) => {
              const color = TOOL_COLORS[idx % TOOL_COLORS.length];
              return (
                <div
                  key={`col-head-${tool.id}`}
                  className="p-4 bg-muted/20 border-b border-white/10 flex flex-col justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color.stroke }} />
                    <ToolLogo name={tool.name} category={tool.category} url={tool.url} className="w-7 h-7 rounded-lg text-xs" />
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-foreground truncate">{tool.name}</h4>
                      <p className="text-[11px] text-muted-foreground truncate">{tool.category}</p>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg self-start">
                    <Award className="w-3.5 h-3.5" />
                    Total: {scores.overallScore} / 10
                  </div>
                </div>
              );
            })}

            {/* Row 1: Starting Price */}
            <div className="p-4 border-b border-r border-white/10 flex flex-col justify-center">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Starting Price
              </span>
              <span className="text-[11px] text-muted-foreground">Affordability base calculation</span>
            </div>
            {toolEvaluations.map(({ tool, scores, hardData }) => (
              <div key={`price-${tool.id}`} className="p-4 border-b border-white/10 space-y-1.5">
                <div className="font-bold text-sm text-foreground">
                  {hardData.startingPriceText}
                </div>
                <div className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Affordability: {scores.affordability}/10
                </div>
                <p className="text-[11px] text-muted-foreground/90 font-mono leading-tight">
                  {scores.scoreExplanations.affordability}
                </p>
              </div>
            ))}

            {/* Row 2: Free Tier Quota */}
            <div className="p-4 border-b border-r border-white/10 flex flex-col justify-center">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Free Tier Quota
              </span>
              <span className="text-[11px] text-muted-foreground">Limits & recurring allowances</span>
            </div>
            {toolEvaluations.map(({ tool, hardData }) => (
              <div key={`quota-${tool.id}`} className="p-4 border-b border-white/10 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  {hardData.freeTier ? (
                    <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Free Tier Available
                    </span>
                  ) : (
                    <span className="text-red-400 flex items-center gap-1 text-[11px] font-bold">
                      <XCircle className="w-3.5 h-3.5" /> No Free Tier
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {hardData.freeTierQuota}
                </p>
              </div>
            ))}

            {/* Row 3: Generation Speed / Throughput */}
            <div className="p-4 border-b border-r border-white/10 flex flex-col justify-center">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                Generation Speed
              </span>
              <span className="text-[11px] text-muted-foreground">Tokens/sec throughput</span>
            </div>
            {toolEvaluations.map(({ tool, scores, hardData }) => (
              <div key={`speed-${tool.id}`} className="p-4 border-b border-white/10 space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold font-mono text-foreground">
                    {tool.name} Speed: {hardData.speedTokensPerSec} tokens/sec
                  </span>
                  <span className="inline-flex items-center text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                    Speed: {scores.speed}/10
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground font-mono leading-tight">
                  {scores.scoreExplanations.speed}
                </p>
              </div>
            ))}

            {/* Row 4: Quality Benchmark & Context Window */}
            <div className="p-4 border-b border-r border-white/10 flex flex-col justify-center">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400" />
                Quality & Context Window
              </span>
              <span className="text-[11px] text-muted-foreground">Benchmark & token memory</span>
            </div>
            {toolEvaluations.map(({ tool, scores, hardData }) => (
              <div key={`context-${tool.id}`} className="p-4 border-b border-white/10 space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold font-mono text-foreground">
                    {tool.name} Context: {hardData.contextWindowTokens.toLocaleString()} tokens
                  </span>
                  <span className="inline-flex items-center text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                    Quality: {scores.quality}/10
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground font-mono leading-tight">
                  {scores.scoreExplanations.quality}
                </p>
              </div>
            ))}

            {/* Row 5: Platform Availability */}
            <div className="p-4 border-b border-r border-white/10 flex flex-col justify-center">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Laptop className="w-4 h-4 text-blue-400" />
                Platform Availability
              </span>
              <span className="text-[11px] text-muted-foreground">Supported OS & environments</span>
            </div>
            {toolEvaluations.map(({ tool, hardData }) => (
              <div key={`platforms-${tool.id}`} className="p-4 border-b border-white/10 flex flex-wrap gap-1.5 items-start">
                {hardData.platforms.map((plat) => (
                  <span
                    key={`plat-${tool.id}-${plat}`}
                    className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] font-semibold text-foreground"
                  >
                    {plat}
                  </span>
                ))}
              </div>
            ))}

            {/* Row 6: Open Source Status */}
            <div className="p-4 border-b border-r border-white/10 flex flex-col justify-center">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-purple-400" />
                Open Source Status
              </span>
              <span className="text-[11px] text-muted-foreground">Licensing & code transparency</span>
            </div>
            {toolEvaluations.map(({ tool, hardData }) => (
              <div key={`oss-${tool.id}`} className="p-4 border-b border-white/10 flex items-center">
                {hardData.isOpenSource ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Open Source
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-muted-foreground text-xs font-medium">
                    Proprietary (Closed Source)
                  </span>
                )}
              </div>
            ))}

            {/* Row 5: Ecosystem & Native API */}
            <div className="p-4 border-b border-r border-white/10 flex flex-col justify-center">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-400" />
                Ecosystem & Integrations
              </span>
              <span className="text-[11px] text-muted-foreground">3+ = 7 pts | API = +3 pts</span>
            </div>
            {toolEvaluations.map(({ tool, scores, hardData }) => (
              <div key={`eco-${tool.id}`} className="p-4 border-b border-white/10 space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-foreground">
                    {hardData.integrations.length} Integrations
                  </span>
                  <span className="inline-flex items-center text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                    Ecosystem: {scores.ecosystem}/10
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {hardData.integrations.slice(0, 4).map((item) => (
                    <span key={`int-${tool.id}-${item}`} className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-muted-foreground">
                      {item}
                    </span>
                  ))}
                  {hardData.integrations.length > 4 && (
                    <span className="text-[10px] text-muted-foreground">+{hardData.integrations.length - 4} more</span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground font-mono leading-tight pt-1">
                  {scores.scoreExplanations.ecosystem}
                </p>
              </div>
            ))}

            {/* Row 6: Category Weights & Math Verification */}
            <div className="p-4 border-r border-white/10 flex flex-col justify-center">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                Category Weighting
              </span>
              <span className="text-[11px] text-muted-foreground">Dynamic multipliers applied</span>
            </div>
            {toolEvaluations.map(({ tool, scores }) => {
              const { speedMultiplier, ecosystemMultiplier, qualityMultiplier } = scores.multipliers;
              const hasMultipliers = speedMultiplier > 1 || ecosystemMultiplier > 1 || qualityMultiplier > 1;

              return (
                <div key={`weights-${tool.id}`} className="p-4 space-y-1">
                  {hasMultipliers ? (
                    <div className="space-y-1">
                      {speedMultiplier > 1 && (
                        <div className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                          ⚡ 1.5x Speed Multiplier (Coding)
                        </div>
                      )}
                      {ecosystemMultiplier > 1 && (
                        <div className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                          🔌 1.5x Ecosystem Multiplier (Coding)
                        </div>
                      )}
                      {qualityMultiplier > 1 && (
                        <div className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                          ✨ 1.5x Quality Multiplier (Video)
                        </div>
                      )}
                      <p className="text-[10px] text-muted-foreground">
                        Raw scores scaled & clamped to 1.0 - 10.0 Radar range.
                      </p>
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      Standard 1.0x baseline weights applied across all dimensions.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
