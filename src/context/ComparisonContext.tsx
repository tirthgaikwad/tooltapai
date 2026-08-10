import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { Tool } from '@/types/tool';

interface ComparisonContextType {
  selectedTools: Tool[];
  addToolToCompare: (tool: Tool) => void;
  removeToolFromCompare: (toolId: number | string) => void;
  clearComparison: () => void;
  toggleToolCompare: (tool: Tool) => void;
  isInComparison: (toolId: number | string) => boolean;
  // Aliases for compatibility
  compareList: Tool[];
  removeFromCompare: (toolId: number | string) => void;
  clearCompare: () => void;
  isInCompare: (toolId: number | string) => boolean;
  toggleCompare: (tool: Tool) => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [selectedTools, setSelectedTools] = useState<Tool[]>([]);

  const isInComparison = useCallback(
    (toolId: number | string) => {
      const numericId = typeof toolId === 'string' ? parseInt(toolId, 10) : toolId;
      return selectedTools.some(t => t.id === numericId || String(t.id) === String(toolId));
    },
    [selectedTools]
  );

  const addToolToCompare = useCallback(
    (tool: Tool) => {
      setSelectedTools(prev => {
        if (prev.some(t => t.id === tool.id || String(t.id) === String(tool.id))) {
          toast.info(`${tool.name} is already in comparison.`, { duration: 2500, id: `compare-exists-${tool.id}` });
          return prev;
        }
        if (prev.length >= 3) {
          toast.warning('Comparison limit reached (max 3 tools).', { duration: 3000, id: 'compare-max' });
          return prev;
        }
        toast.success(`Added ${tool.name} to compare`, { duration: 2500, id: `compare-add-${tool.id}` });
        return [...prev, tool];
      });
    },
    []
  );

  const removeToolFromCompare = useCallback((toolId: number | string) => {
    setSelectedTools(prev => {
      const numericId = typeof toolId === 'string' ? parseInt(toolId, 10) : toolId;
      const target = prev.find(t => t.id === numericId || String(t.id) === String(toolId));
      if (target) {
        toast.info(`Removed ${target.name} from comparison`, { duration: 2500, id: `compare-rem-${toolId}` });
      }
      return prev.filter(t => t.id !== numericId && String(t.id) !== String(toolId));
    });
  }, []);

  const clearComparison = useCallback(() => {
    setSelectedTools([]);
    toast.info('Comparison list cleared', { duration: 2500, id: 'compare-clear' });
  }, []);

  const toggleToolCompare = useCallback(
    (tool: Tool) => {
      if (isInComparison(tool.id)) {
        removeToolFromCompare(tool.id);
      } else {
        addToolToCompare(tool);
      }
    },
    [isInComparison, removeToolFromCompare, addToolToCompare]
  );

  const value: ComparisonContextType = {
    selectedTools,
    addToolToCompare,
    removeToolFromCompare,
    clearComparison,
    toggleToolCompare,
    isInComparison,
    // Aliases
    compareList: selectedTools,
    removeFromCompare: removeToolFromCompare,
    clearCompare: clearComparison,
    isInCompare: isInComparison,
    toggleCompare: toggleToolCompare,
  };

  return <ComparisonContext.Provider value={value}>{children}</ComparisonContext.Provider>;
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
}

export function useComparisonContext() {
  return useComparison();
}
