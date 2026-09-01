import React, { useEffect, useRef } from 'react';
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

  useEffect(() => {
    let isTicking = false;
    let pendingX = 0;
    let pendingY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (
        !containerRef.current ||
        window.innerWidth < 768 ||
        !window.matchMedia('(hover: hover) and (pointer: fine)').matches
      ) return;

      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      pendingX = (e.clientX - rect.left) / rect.width - 0.5;
      pendingY = (e.clientY - rect.top) / rect.height - 0.5;

      if (!isTicking) {
        isTicking = true;
        requestAnimationFrame(() => {
          mouseX.set(pendingX);
          mouseY.set(pendingY);
          isTicking = false;
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none transform-gpu [transform:translateZ(0)]"
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
