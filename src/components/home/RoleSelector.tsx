import React from 'react';
import {
  GraduationCap, Code2, Palette, TrendingUp,
  Sparkles, Check, ChevronRight
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import type { UserRole } from '@/types/tool';
import { cn } from '@/lib/utils';

interface RoleOption {
  id: UserRole;
  label: string;
  shortLabel: string;
  icon: any;
  tagline: string;
  badgeColor: string;
  accentGradient: string;
}

const ROLES: RoleOption[] = [
  {
    id: 'general',
    label: 'All AI Workflows',
    shortLabel: 'All-Rounder',
    icon: Sparkles,
    tagline: 'Balanced discovery across all 25 categories',
    badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    accentGradient: 'from-amber-500/20 to-orange-500/5',
  },
  {
    id: 'student',
    label: 'Student & Academic',
    shortLabel: '🎓 Student',
    icon: GraduationCap,
    tagline: 'Prioritizes free citations, PDF analysis & study decks',
    badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    accentGradient: 'from-emerald-500/20 to-teal-500/5',
  },
  {
    id: 'developer',
    label: 'Developer & Tech',
    shortLabel: '💻 Developer',
    icon: Code2,
    tagline: 'Code generation, CLI agents & API scaffolding',
    badgeColor: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
    accentGradient: 'from-sky-500/20 to-indigo-500/5',
  },
  {
    id: 'creator',
    label: 'Creator & Media',
    shortLabel: '🎨 Creator',
    icon: Palette,
    tagline: 'Image generation, video editing & voice cloning',
    badgeColor: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    accentGradient: 'from-rose-500/20 to-purple-500/5',
  },
  {
    id: 'marketer',
    label: 'Marketing & Founder',
    shortLabel: '📈 Growth & Marketing',
    icon: TrendingUp,
    tagline: 'Conversion copywriting, slide decks & SEO campaigns',
    badgeColor: 'text-violet-400 border-violet-500/30 bg-violet-500/10',
    accentGradient: 'from-violet-500/20 to-amber-500/5',
  },
];

export function RoleSelector({ className }: { className?: string }) {
  const { userRole, setUserRole, setStudentMode } = useApp();

  const handleSelectRole = (roleId: UserRole) => {
    setUserRole(roleId);
    if (roleId === 'student') {
      setStudentMode(true);
    }
  };

  const activeRole = ROLES.find((r) => r.id === userRole) || ROLES[0];

  return (
    <div className={cn('w-full max-w-4xl mx-auto', className)}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
            Tailor Feed for Role:
          </span>
          <span className={cn('text-xs font-bold px-2.5 py-0.5 rounded-full border', activeRole.badgeColor)}>
            {activeRole.label}
          </span>
        </div>
        <span className="text-xs text-white/40 hidden sm:inline">
          {activeRole.tagline}
        </span>
      </div>

      {/* Role Pill Switcher */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1.5 rounded-2xl bg-[#141417] border border-white/[0.08] shadow-inner">
        {ROLES.map((role) => {
          const isActive = userRole === role.id;
          const Icon = role.icon;

          return (
            <button
              key={role.id}
              type="button"
              onClick={() => handleSelectRole(role.id)}
              className={cn(
                'relative flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer touch-manipulation',
                isActive
                  ? 'bg-gradient-to-r text-white shadow-lg border border-white/20 scale-[1.02]'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04] border border-transparent',
                isActive && role.accentGradient
              )}
            >
              <Icon className={cn('w-3.5 h-3.5 shrink-0', isActive ? 'text-white' : 'text-white/50')} />
              <span className="truncate">{role.shortLabel}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
