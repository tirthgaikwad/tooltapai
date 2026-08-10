import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { GitCompare, X } from 'lucide-react';
import { useComparison } from '@/context/ComparisonContext';
import ToolLogo from './tools/ToolLogo';

export default function ComparisonDock() {
  const {
    selectedTools,
    removeToolFromCompare,
    clearComparison,
  } = useComparison();

  const count = selectedTools.length;
  const isVisible = count > 0;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="comparison-dock"
          initial={{ y: 80, opacity: 0, x: '-50%' }}
          animate={{ y: 0, opacity: 1, x: '-50%' }}
          exit={{ y: 80, opacity: 0, x: '-50%' }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:bottom-6 left-1/2 z-50 pointer-events-auto"
        >
          <div className="bg-[#121212]/90 backdrop-blur-md sm:backdrop-blur-xl border border-white/10 rounded-full px-3.5 sm:px-5 py-2.5 sm:py-3 shadow-2xl flex items-center gap-2.5 sm:gap-4 max-w-[94vw] overflow-x-auto scrollbar-none">
            {/* Selected Tool Pills / Micro-Thumbnails */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {selectedTools.map((tool) => (
                <div
                  key={tool.id}
                  className="flex items-center gap-1.5 sm:gap-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 rounded-full pl-1 sm:pl-1.5 pr-1.5 sm:pr-2 py-1 transition-all"
                >
                  <ToolLogo
                    name={tool.name}
                    category={tool.category}
                    url={tool.url}
                    size="sm"
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-md object-cover bg-white/5 shrink-0"
                  />
                  <span className="text-[11px] sm:text-xs font-medium text-white/90 max-w-[65px] sm:max-w-[100px] truncate">
                    {tool.name}
                  </span>
                  <button
                    onClick={() => removeToolFromCompare(tool.id)}
                    className="text-white/40 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10 min-w-[28px] min-h-[28px] flex items-center justify-center touch-manipulation"
                    aria-label={`Remove ${tool.name} from comparison`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Empty Slot Placeholders */}
              {Array.from({ length: 3 - count }).map((_, idx) => (
                <div
                  key={idx}
                  className="hidden sm:flex items-center gap-1.5 border border-dashed border-white/15 rounded-full px-3 py-1.5 text-[11px] text-white/30"
                >
                  <span className="w-2 h-2 rounded-full bg-white/20" />
                  <span>+ Slot</span>
                </div>
              ))}
            </div>

            {/* Subtle Divider Line */}
            <div className="h-6 w-[1px] bg-white/10 shrink-0" />

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/compare"
                className="bg-gradient-to-r from-[#F2994A] to-[#E05A47] text-white font-bold text-xs px-3.5 sm:px-4 py-2 rounded-full shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>Compare Now ({count}/3)</span>
              </Link>

              <button
                onClick={clearComparison}
                className="text-white/40 hover:text-white/80 text-xs font-medium px-2 py-1 transition-colors whitespace-nowrap"
              >
                Clear
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
