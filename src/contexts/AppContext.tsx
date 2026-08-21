import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import Fuse from 'fuse.js';
import { toast } from 'sonner';
import type { Tool, FilterAccess, SortOption, UserRole } from '@/types/tool';
import toolsData from '@/data/tools.json';
import { createSearchIndex } from '@/lib/search';
import { useBookmarks, useRecentlyViewed, useRecentSearches } from '@/hooks/useBookmarks';
import { ComparisonProvider, useComparison } from '@/context/ComparisonContext';

const allTools = toolsData as Tool[];

interface AppContextValue {
  tools: Tool[];
  fuseIndex: Fuse<Tool>;
  studentMode: boolean;
  setStudentMode: (v: boolean) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (v: boolean) => void;
  pricingCalculatorOpen: boolean;
  setPricingCalculatorOpen: (v: boolean) => void;
  pipelinePlannerOpen: boolean;
  setPipelinePlannerOpen: (v: boolean) => void;
  accessFilter: FilterAccess;
  setAccessFilter: (v: FilterAccess) => void;
  categoryFilter: string;
  setCategoryFilter: (v: string) => void;
  sortOption: SortOption;
  setSortOption: (v: SortOption) => void;
  bookmarks: Tool[];
  isBookmarked: (id: number) => boolean;
  toggleBookmark: (tool: Tool) => void;
  clearBookmarks: () => void;
  recentlyViewed: Tool[];
  addToHistory: (tool: Tool) => void;
  clearHistory: () => void;
  compareList: Tool[];
  isInCompare: (id: number) => boolean;
  toggleCompare: (tool: Tool) => void;
  removeFromCompare: (id: number) => void;
  clearCompare: () => void;
  setCompareTools: (tools: Tool[]) => void;
  recentSearches: string[];
  addSearch: (q: string) => void;
  removeSearch: (q: string) => void;
  clearSearches: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function AppInnerProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('dark');
    root.classList.remove('light');
    root.setAttribute('data-theme', 'dark');
    root.style.colorScheme = 'dark';
    try {
      localStorage.removeItem('tooltap-theme');
    } catch {
      // ignore
    }
  }, []);

  const [studentMode, setStudentModeRaw] = useState(() => {
    try {
      return localStorage.getItem('tooltap-student-mode') === 'true';
    } catch {
      return false;
    }
  });

  const [userRole, setUserRoleRaw] = useState<UserRole>(() => {
    try {
      return (localStorage.getItem('tooltap-user-role') as UserRole) || 'general';
    } catch {
      return 'general';
    }
  });

  const setUserRole = (role: UserRole) => {
    setUserRoleRaw(role);
    try {
      localStorage.setItem('tooltap-user-role', role);
    } catch {
      // Silently fail
    }
    const roleLabels: Record<UserRole, string> = {
      general: 'All AI Workflows',
      student: 'Student & Academic Preset',
      developer: 'Developer & Engineering Preset',
      creator: 'Creator & Media Preset',
      marketer: 'Marketing & Business Preset',
    };
    toast.success(`Active persona: ${roleLabels[role]}`, { duration: 2500, id: 'user-role' });
  };

  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [pricingCalculatorOpen, setPricingCalculatorOpen] = useState(false);
  const [pipelinePlannerOpen, setPipelinePlannerOpen] = useState(false);

  const setStudentMode = (v: boolean) => {
    setStudentModeRaw(v);
    try {
      localStorage.setItem('tooltap-student-mode', String(v));
    } catch {
      // Silently fail
    }
    if (v) {
      toast.success('Student Mode enabled.', { duration: 3000, id: 'student-mode' });
    } else {
      toast.info('Student Mode disabled.', { duration: 3000, id: 'student-mode' });
    }
  };

  const [accessFilter, setAccessFilter] = useState<FilterAccess>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOption, setSortOption] = useState<SortOption>('default');

  const fuseIndex = useMemo(() => createSearchIndex(allTools), []);

  const bookmarkHook = useBookmarks();
  const historyHook = useRecentlyViewed();
  const searchHook = useRecentSearches();
  const compContext = useComparison();

  const value: AppContextValue = {
    tools: allTools,
    fuseIndex,
    studentMode,
    setStudentMode,
    userRole,
    setUserRole,
    commandPaletteOpen,
    setCommandPaletteOpen,
    pricingCalculatorOpen,
    setPricingCalculatorOpen,
    pipelinePlannerOpen,
    setPipelinePlannerOpen,
    accessFilter,
    setAccessFilter,
    categoryFilter,
    setCategoryFilter,
    sortOption,
    setSortOption,
    ...bookmarkHook,
    ...historyHook,
    ...searchHook,
    compareList: compContext.selectedTools,
    isInCompare: compContext.isInComparison,
    toggleCompare: compContext.toggleToolCompare,
    removeFromCompare: compContext.removeToolFromCompare,
    clearCompare: compContext.clearComparison,
    setCompareTools: (tools: Tool[]) => {
      compContext.clearComparison();
      tools.slice(0, 3).forEach(t => compContext.addToolToCompare(t));
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ComparisonProvider>
      <AppInnerProvider>{children}</AppInnerProvider>
    </ComparisonProvider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

