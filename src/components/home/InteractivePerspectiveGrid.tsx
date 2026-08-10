import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import PerspectiveGrid from '@/components/ui/perspective-grid';

interface InteractivePerspectiveGridProps {
  className?: string;
  gridSize?: number;
  fadeRadius?: number;
}

export function InteractivePerspectiveGrid({
  className = "absolute inset-0 z-0 opacity-40 dark:opacity-35",
  gridSize = 40,
  fadeRadius = 80,
}: InteractivePerspectiveGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 120, damping: 20, mass: 0.4 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Subtle interactive tilt and shift based on cursor
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);
  const translateX = useTransform(smoothX, [-0.5, 0.5], [-20, 20]);
  const translateY = useTransform(smoothY, [-0.5, 0.5], [-20, 20]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      !containerRef.current ||
      window.innerWidth < 768 ||
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    ) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none md:pointer-events-auto"
      style={{ perspective: '1200px' }}
    >
      <motion.div
        className="w-full h-full"
        style={{
          rotateX,
          rotateY,
          x: translateX,
          y: translateY,
          transformStyle: 'preserve-3d',
        }}
      >
        <PerspectiveGrid
          className={className}
          gridSize={gridSize}
          fadeRadius={fadeRadius}
        />
      </motion.div>
    </div>
  );
}

export default InteractivePerspectiveGrid;
