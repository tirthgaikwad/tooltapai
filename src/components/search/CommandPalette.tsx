import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Sparkles, ExternalLink, ArrowRight,
  GitCompare, Bookmark, BookmarkCheck, GraduationCap,
  Layers, Code2, Palette, TrendingUp, SlidersHorizontal,
  Calculator, Workflow, Check, X
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import ToolLogo from '@/components/tools/ToolLogo';
import AccessBadge from '@/components/tools/AccessBadge';
import type { Tool, UserRole } from '@/types/tool';
import { cn } from '@/lib/utils';

export function CommandPalette() {
  const navigate = useNavigate();
  const {
    tools,
    fuseIndex,
    commandPaletteOpen,
    setCommandPaletteOpen,
    studentMode,
    setStudentMode,
    userRole,
    setUserRole,
    setPricingCalculatorOpen,
    setPipelinePlannerOpen,
    isInCompare,
    toggleCompare,
    isBookmarked,
    toggleBookmark,
    addToHistory,
    compareList,
    bookmarks,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Global keydown listener for Cmd+K / Ctrl+K / '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      } else if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)
      ) {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  // Reset search when opened
  useEffect(() => {
    if (commandPaletteOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
    }
  }, [commandPaletteOpen]);

  // Filtered tools based on search
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) {
      // Default: show top trending / role-tailored tools
      if (studentMode) {
        return tools.filter((t) => t.access !== 'Paid').slice(0, 8);
      }
      if (userRole === 'developer') {
        return tools.filter((t) => t.category.includes('Coding') || t.name === 'Cursor' || t.name === 'Claude').slice(0, 8);
      }
      if (userRole === 'creator') {
        return tools.filter((t) => t.category.includes('Image') || t.category.includes('Video') || t.name === 'ElevenLabs').slice(0, 8);
      }
      return tools.slice(0, 8);
    }

    const results = fuseIndex.search(searchQuery);
    return results.map((r) => r.item).slice(0, 10);
  }, [searchQuery, fuseIndex, tools, studentMode, userRole]);

  // Quick Action items
  const quickActions = useMemo(() => {
    const actions = [
      {
        id: 'toggle-student',
        title: studentMode ? 'Disable Student Mode' : 'Enable Student Mode (100% Free / Freemium Only)',
        icon: GraduationCap,
        badge: studentMode ? 'Active' : 'Off',
        badgeColor: studentMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/60',
        action: () => setStudentMode(!studentMode),
      },
      {
        id: 'open-pipeline',
        title: 'Open Goal-to-Stack AI Pipeline Planner',
        icon: Workflow,
        badge: 'Workflow',
        badgeColor: 'bg-amber-500/20 text-amber-400',
        action: () => {
          setCommandPaletteOpen(false);
          setPipelinePlannerOpen(true);
        },
      },
      {
        id: 'open-pricing',
        title: 'Open Free vs Pro Pricing & ROI Simulator',
        icon: Calculator,
        badge: 'Calculator',
        badgeColor: 'bg-blue-500/20 text-blue-400',
        action: () => {
          setCommandPaletteOpen(false);
          setPricingCalculatorOpen(true);
        },
      },
      {
        id: 'view-compare',
        title: `View Active Comparison (${compareList.length}/3 Tools)`,
        icon: GitCompare,
        badge: `${compareList.length} tools`,
        badgeColor: 'bg-primary/20 text-primary',
        action: () => {
          setCommandPaletteOpen(false);
          navigate('/compare');
        },
      },
      {
        id: 'view-saved',
        title: `View Bookmarked Tools (${bookmarks.length} Saved)`,
        icon: Bookmark,
        badge: `${bookmarks.length} saved`,
        badgeColor: 'bg-amber-500/20 text-amber-400',
        action: () => {
          setCommandPaletteOpen(false);
          navigate('/saved-tools');
        },
      },
    ];

    if (!searchQuery.trim()) {
      return actions;
    }

    const q = searchQuery.toLowerCase();
    return actions.filter(a => a.title.toLowerCase().includes(q) || a.badge.toLowerCase().includes(q));
  }, [searchQuery, studentMode, compareList.length, bookmarks.length, setStudentMode, setPipelinePlannerOpen, setPricingCalculatorOpen, setCommandPaletteOpen, navigate]);

  // Persona switchers
  const personaActions = useMemo(() => {
    const roles: { id: UserRole; name: string; icon: any }[] = [
      { id: 'student', name: '🎓 Student / Academic Preset', icon: GraduationCap },
      { id: 'developer', name: '💻 Developer & Engineer Preset', icon: Code2 },
      { id: 'creator', name: '🎨 Creator & Media Designer Preset', icon: Palette },
      { id: 'marketer', name: '📈 Marketer & Growth Preset', icon: TrendingUp },
      { id: 'general', name: '⚡ General Power User Preset', icon: SlidersHorizontal },
    ];

    if (!searchQuery.trim()) return roles;
    const q = searchQuery.toLowerCase();
    return roles.filter(r => r.name.toLowerCase().includes(q));
  }, [searchQuery]);

  const totalItems = filteredTools.length + quickActions.length + (searchQuery.trim() ? 0 : personaActions.length);

  // Keyboard navigation within list
  useEffect(() => {
    const handleListKeys = (e: KeyboardEvent) => {
      if (!commandPaletteOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, totalItems));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + totalItems) % Math.max(1, totalItems));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex < filteredTools.length) {
          const tool = filteredTools[selectedIndex];
          if (tool) {
            addToHistory(tool);
            setCommandPaletteOpen(false);
            navigate(`/tools/${tool.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
          }
        } else if (selectedIndex < filteredTools.length + quickActions.length) {
          const actionIdx = selectedIndex - filteredTools.length;
          quickActions[actionIdx]?.action();
        } else {
          const personaIdx = selectedIndex - filteredTools.length - quickActions.length;
          const role = personaActions[personaIdx];
          if (role) {
            setUserRole(role.id);
            setCommandPaletteOpen(false);
          }
        }
      }
    };

    window.addEventListener('keydown', handleListKeys);
    return () => window.removeEventListener('keydown', handleListKeys);
  }, [commandPaletteOpen, selectedIndex, totalItems, filteredTools, quickActions, personaActions, navigate, addToHistory, setCommandPaletteOpen, setUserRole]);

  return (
    <Dialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <DialogContent className="max-w-2xl p-0 bg-[#141417]/95 backdrop-blur-2xl border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.8)] rounded-2xl overflow-hidden text-white gap-0">
        {/* Search Input Header */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-white/[0.08] bg-[#18181C]/90">
          <Search className="w-5 h-5 text-white/50 shrink-0 mr-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search 500+ AI tools, actions, stacks, or workflows... (⌘K)"
            className="w-full bg-transparent text-white placeholder:text-white/40 text-sm sm:text-base outline-none font-medium"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-white/40 hover:text-white p-1 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-white/40 bg-white/[0.06] border border-white/10 px-2 py-0.5 rounded ml-2">
            ESC
          </kbd>
        </div>

        {/* Scrollable Results */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-4 scrollbar-thin">
          {/* Tools Section */}
          {filteredTools.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-white/40 px-3 py-1.5 flex items-center justify-between">
                <span>AI Tools ({filteredTools.length})</span>
                <span className="text-[10px] lowercase text-white/30 font-normal">press enter to explore</span>
              </div>
              <div className="space-y-1">
                {filteredTools.map((tool, idx) => {
                  const isSelected = selectedIndex === idx;
                  const inCompare = isInCompare(tool.id);
                  const bookmarked = isBookmarked(tool.id);

                  return (
                    <div
                      key={tool.id}
                      onClick={() => {
                        addToHistory(tool);
                        setCommandPaletteOpen(false);
                        navigate(`/tools/${tool.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        'group flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all',
                        isSelected ? 'bg-white/[0.08] text-white' : 'text-white/80 hover:bg-white/[0.04]'
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <ToolLogo
                          name={tool.name}
                          category={tool.category}
                          url={tool.url}
                          className="w-8 h-8 rounded-lg text-xs shrink-0 border border-white/10"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm truncate text-white">
                              {tool.name}
                            </span>
                            <AccessBadge access={tool.access} size="sm" />
                          </div>
                          <p className="text-xs text-white/50 truncate max-w-[340px]">
                            {tool.category} • {tool.freePlan}
                          </p>
                        </div>
                      </div>

                      {/* Quick tool action buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(tool);
                          }}
                          className={cn(
                            'p-1.5 rounded-lg border transition-colors',
                            bookmarked
                              ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                              : 'border-white/10 text-white/40 hover:text-white hover:bg-white/10'
                          )}
                          title={bookmarked ? 'Remove Bookmark' : 'Bookmark'}
                        >
                          {bookmarked ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCompare(tool);
                          }}
                          className={cn(
                            'p-1.5 rounded-lg border transition-colors',
                            inCompare
                              ? 'bg-primary/20 text-primary border-primary/30'
                              : 'border-white/10 text-white/40 hover:text-white hover:bg-white/10'
                          )}
                          title={inCompare ? 'Remove Compare' : 'Add to Compare'}
                        >
                          <GitCompare className="w-3.5 h-3.5" />
                        </button>

                        <a
                          href={tool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToHistory(tool);
                          }}
                          className="p-1.5 rounded-lg border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                          title="Open official site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Actions Section */}
          {quickActions.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-white/40 px-3 py-1.5">
                Quick Actions
              </div>
              <div className="space-y-1">
                {quickActions.map((action, i) => {
                  const globalIdx = filteredTools.length + i;
                  const isSelected = selectedIndex === globalIdx;
                  const Icon = action.icon;

                  return (
                    <div
                      key={action.id}
                      onClick={() => action.action()}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={cn(
                        'flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all',
                        isSelected ? 'bg-white/[0.08] text-white' : 'text-white/80 hover:bg-white/[0.04]'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">{action.title}</span>
                      </div>
                      <Badge className={cn('text-[10px] px-2 py-0.5', action.badgeColor)}>
                        {action.badge}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Persona Switchers (when no search or matching) */}
          {personaActions.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-white/40 px-3 py-1.5">
                Switch Role / Persona Preset
              </div>
              <div className="space-y-1">
                {personaActions.map((role, i) => {
                  const globalIdx = filteredTools.length + quickActions.length + i;
                  const isSelected = selectedIndex === globalIdx;
                  const isActive = userRole === role.id;
                  const Icon = role.icon;

                  return (
                    <div
                      key={role.id}
                      onClick={() => {
                        setUserRole(role.id);
                        setCommandPaletteOpen(false);
                      }}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={cn(
                        'flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all',
                        isSelected ? 'bg-white/[0.08] text-white' : 'text-white/80 hover:bg-white/[0.04]'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center border',
                          isActive ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-white/5 border-white/10 text-white/60'
                        )}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">{role.name}</span>
                      </div>
                      {isActive && (
                        <span className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
                          <Check className="w-3.5 h-3.5" /> Current
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {filteredTools.length === 0 && quickActions.length === 0 && (
            <div className="text-center py-10 text-white/40">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No tools or actions found for "{searchQuery}"</p>
              <p className="text-xs text-white/30 mt-1">Try searching by category, use case, or tool name.</p>
            </div>
          )}
        </div>

        {/* Footer with Hotkeys */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/[0.08] bg-[#101013] text-[11px] text-white/40">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">↑</kbd>
              <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">↓</kbd> navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">↵</kbd> select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">esc</kbd> close
            </span>
          </div>
          <div className="flex items-center gap-1 text-amber-400/80">
            <Sparkles className="w-3 h-3" />
            <span>500+ Verified AI Tools</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
