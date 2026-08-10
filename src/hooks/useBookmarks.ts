import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { Tool } from '@/types/tool';

const BOOKMARKS_KEY = 'tooltap-saved-tools';
const HISTORY_KEY = 'tooltap-recently-viewed';
const MAX_HISTORY = 20;

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silently fail if storage is unavailable
  }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Tool[]>(() =>
    loadFromStorage<Tool[]>(BOOKMARKS_KEY, [])
  );

  const isBookmarked = useCallback(
    (id: number) => bookmarks.some(t => t.id === id),
    [bookmarks]
  );

  const toggleBookmark = useCallback((tool: Tool) => {
    setBookmarks(prev => {
      const exists = prev.some(t => t.id === tool.id);
      if (exists) {
        toast.info('Tool removed from Saved Tools.', { duration: 3000, id: `bookmark-${tool.id}` });
      } else {
        toast.success('Tool saved successfully.', { duration: 3000, id: `bookmark-${tool.id}` });
      }
      const next = exists ? prev.filter(t => t.id !== tool.id) : [tool, ...prev];
      saveToStorage(BOOKMARKS_KEY, next);
      return next;
    });
  }, []);

  const clearBookmarks = useCallback(() => {
    setBookmarks([]);
    saveToStorage(BOOKMARKS_KEY, []);
    toast.info('All saved tools cleared.', { duration: 3000, id: 'clear-bookmarks' });
  }, []);

  return { bookmarks, isBookmarked, toggleBookmark, clearBookmarks };
}

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<Tool[]>(() =>
    loadFromStorage<Tool[]>(HISTORY_KEY, [])
  );

  const addToHistory = useCallback((tool: Tool) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(t => t.id !== tool.id);
      const next = [tool, ...filtered].slice(0, MAX_HISTORY);
      saveToStorage(HISTORY_KEY, next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setRecentlyViewed([]);
    saveToStorage(HISTORY_KEY, []);
    toast.info('Recently viewed history cleared.', { duration: 3000, id: 'clear-history' });
  }, []);

  return { recentlyViewed, addToHistory, clearHistory };
}

export function useCompare() {
  const [compareList, setCompareList] = useState<Tool[]>([]);

  const isInCompare = useCallback(
    (id: number) => compareList.some(t => t.id === id),
    [compareList]
  );

  const setCompareTools = useCallback((tools: Tool[]) => {
    setCompareList(tools.slice(0, 3));
  }, []);

  const toggleCompare = useCallback((tool: Tool) => {
    setCompareList(prev => {
      if (prev.some(t => t.id === tool.id)) {
        toast.info('Removed from comparison.', { duration: 3000, id: `compare-${tool.id}` });
        return prev.filter(t => t.id !== tool.id);
      }
      if (prev.length >= 3) {
        toast.warning('You can compare up to 3 tools.', { duration: 3000, id: 'compare-limit' });
        return prev;
      }
      toast.success('Added to comparison.', { duration: 3000, id: `compare-${tool.id}` });
      return [...prev, tool];
    });
  }, []);

  const removeFromCompare = useCallback((id: number) => {
    setCompareList(prev => {
      toast.info('Removed from comparison.', { duration: 3000, id: `compare-${id}` });
      return prev.filter(t => t.id !== id);
    });
  }, []);

  const clearCompare = useCallback(() => {
    setCompareList([]);
    toast.info('Comparison cleared.', { duration: 3000, id: 'clear-compare' });
  }, []);

  return { compareList, isInCompare, toggleCompare, removeFromCompare, clearCompare, setCompareTools };
}

const SEARCHES_KEY = 'tooltap-recent-searches';
const MAX_SEARCHES = 8;

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<string[]>(() =>
    loadFromStorage<string[]>(SEARCHES_KEY, [])
  );

  const addSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.toLowerCase() !== trimmed.toLowerCase());
      const next = [trimmed, ...filtered].slice(0, MAX_SEARCHES);
      saveToStorage(SEARCHES_KEY, next);
      return next;
    });
  }, []);

  const removeSearch = useCallback((query: string) => {
    setRecentSearches(prev => {
      const next = prev.filter(s => s !== query);
      saveToStorage(SEARCHES_KEY, next);
      return next;
    });
  }, []);

  const clearSearches = useCallback(() => {
    setRecentSearches([]);
    saveToStorage(SEARCHES_KEY, []);
  }, []);

  return { recentSearches, addSearch, removeSearch, clearSearches };
}
