import React, { useState } from 'react';
import { Sparkles, Activity } from 'lucide-react';
import ToolLogo from '@/components/tools/ToolLogo';
import type { Tool } from '@/types/tool';
import { DATA_VECTORS, type VectorScoreResult } from '@/lib/vectorScores';

interface RadarMatrixChartProps {
  tools: Tool[];
  scoresMap: Map<number, VectorScoreResult>;
}

const TOOL_COLORS = [
  { stroke: '#F2994A', fill: 'rgba(242, 153, 74, 0.35)', dot: '#F2994A' }, // Brand Gold/Amber
  { stroke: '#E05A47', fill: 'rgba(224, 90, 71, 0.30)', dot: '#E05A47' },  // Brand Coral/Orange
  { stroke: '#3B82F6', fill: 'rgba(59, 130, 246, 0.30)', dot: '#3B82F6' }, // Brand Electric Blue
];

export default function RadarMatrixChart({ tools, scoresMap }: RadarMatrixChartProps) {
  const [hoveredVectorIndex, setHoveredVectorIndex] = useState<number | null>(null);

  // SVG Geometry Constants
  const size = 360;
  const center = size / 2;
  const maxRadius = 115;
  const numVectors = DATA_VECTORS.length; // 5

  // Calculate polar point coordinates
  const getPoint = (vectorIndex: number, scoreValue: number) => {
    // Angle in radians starting from top (-90 deg)
    const angle = (Math.PI * 2 * vectorIndex) / numVectors - Math.PI / 2;
    const radius = (scoreValue / 10) * maxRadius;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x, y, angle };
  };

  // Concentric grid levels (2, 4, 6, 8, 10)
  const gridLevels = [2, 4, 6, 8, 10];

  return (
    <div className="bg-[#1E1E24] border border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Quantitative Capability Matrix
          </div>
          <h3 className="font-heading font-bold text-lg sm:text-xl text-foreground">
            Multi-Vector Radar Matrix
          </h3>
          <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
            5 quantitative dimensions evaluated on a 1-10 scale for side-by-side visualization.
          </p>
        </div>

        {/* Legend pills for tools */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {tools.map((tool, idx) => {
            const color = TOOL_COLORS[idx % TOOL_COLORS.length];
            return (
              <div
                key={`legend-${tool.id}`}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-black/30 text-xs font-semibold"
              >
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color.stroke }} />
                <ToolLogo name={tool.name} category={tool.category} url={tool.url} className="w-4 h-4 rounded text-[9px]" />
                <span className="text-foreground truncate max-w-[100px]">{tool.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SVG Custom Radar Chart */}
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
            const endPoint = getPoint(i, 10);
            const labelPoint = getPoint(i, 12.2);
            const isHovered = hoveredVectorIndex === i;

            return (
              <g key={`spoke-${vector.key}`}>
                {/* Spoke Line */}
                <line
                  x1={center}
                  y1={center}
                  x2={endPoint.x}
                  y2={endPoint.y}
                  stroke={isHovered ? '#F2994A' : 'rgba(255, 255, 255, 0.15)'}
                  strokeWidth={isHovered ? 1.5 : 1}
                />

                {/* Vector Axis Label */}
                <text
                  x={labelPoint.x}
                  y={labelPoint.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`text-[11px] font-bold transition-all cursor-pointer select-none ${
                    isHovered ? 'fill-amber-400 font-extrabold' : 'fill-zinc-300'
                  }`}
                  onMouseEnter={() => setHoveredVectorIndex(i)}
                  onMouseLeave={() => setHoveredVectorIndex(null)}
                >
                  {vector.name}
                </text>
              </g>
            );
          })}

          {/* Tool Polygons */}
          {tools.map((tool, idx) => {
            const scoresObj = scoresMap.get(tool.id);
            if (!scoresObj) return null;

            const color = TOOL_COLORS[idx % TOOL_COLORS.length];
            const polygonPoints = DATA_VECTORS.map((vector, i) => {
              const scoreVal = scoresObj[vector.key];
              const { x, y } = getPoint(i, scoreVal);
              return `${x},${y}`;
            }).join(' ');

            return (
              <g key={`polygon-group-${tool.id}`}>
                {/* Filled & Outlined Polygon */}
                <polygon
                  points={polygonPoints}
                  fill={color.fill}
                  stroke={color.stroke}
                  strokeWidth={2.5}
                  className="transition-all duration-300 hover:opacity-90"
                />

                {/* Data Vertex Dots */}
                {DATA_VECTORS.map((vector, i) => {
                  const scoreVal = scoresObj[vector.key];
                  const { x, y } = getPoint(i, scoreVal);

                  return (
                    <circle
                      key={`dot-${tool.id}-${vector.key}`}
                      cx={x}
                      cy={y}
                      r={hoveredVectorIndex === i ? 5 : 3.5}
                      fill={color.dot}
                      stroke="#18181C"
                      strokeWidth={1.5}
                      className="transition-all"
                    />
                  );
                })}
              </g>
            );
          })}
        </svg>

        {/* Dynamic Hover/Interactive Tooltip card when vector is hovered or standard breakdown below */}
        <div className="w-full bg-black/40 border border-white/10 rounded-2xl p-3.5 mt-2 transition-all">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-2 border-b border-white/10 pb-1.5">
            <Activity className="w-4 h-4 text-amber-400" />
            <span>
              {hoveredVectorIndex !== null
                ? `${DATA_VECTORS[hoveredVectorIndex].name} Vector Scores`
                : 'Vector Score Breakdown'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {tools.map((tool, idx) => {
              const scoresObj = scoresMap.get(tool.id);
              if (!scoresObj) return null;

              const activeKey =
                hoveredVectorIndex !== null
                  ? DATA_VECTORS[hoveredVectorIndex].key
                  : 'speed';
              const activeLabel =
                hoveredVectorIndex !== null
                  ? DATA_VECTORS[hoveredVectorIndex].name
                  : 'Speed';
              const scoreVal = scoresObj[activeKey];
              const color = TOOL_COLORS[idx % TOOL_COLORS.length];

              return (
                <div
                  key={`score-badge-${tool.id}`}
                  className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs"
                >
                  <span className="flex items-center gap-1.5 font-semibold text-foreground/90 truncate">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color.stroke }} />
                    <span className="truncate">{tool.name}</span>
                  </span>
                  <span className="font-mono font-bold text-amber-300 shrink-0">
                    {scoreVal} / 10 <span className="text-[10px] text-muted-foreground font-normal">({activeLabel})</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
