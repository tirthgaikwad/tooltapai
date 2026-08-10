import React, { useState } from 'react';
import { GraduationCap, Info, X, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Switch } from '@/components/ui/switch';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface StudentModeInfoProps {
  variant?: 'navbar' | 'mobile' | 'banner';
  showSwitch?: boolean;
  className?: string;
}

export function StudentModeInfo({
  variant = 'navbar',
  showSwitch = true,
  className,
}: StudentModeInfoProps) {
  const { studentMode, setStudentMode } = useApp();
  const [open, setOpen] = useState(false);

  if (variant === 'mobile') {
    return (
      <div className={cn('relative z-30 flex items-center justify-between w-full min-h-[44px]', className)}>
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          <GraduationCap
            className={cn(
              'w-5 h-5 shrink-0 transition-colors',
              studentMode ? 'text-success' : 'text-med-emphasis'
            )}
          />
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs font-semibold text-high-emphasis truncate">Student Mode</span>

            {/* Mobile Info Button Popover */}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-label="Student Mode Info"
                  onTouchStart={(e) => {
                    e.preventDefault();
                    setOpen((prev) => !prev);
                  }}
                  onClick={() => setOpen((prev) => !prev)}
                  className="text-low-emphasis hover:text-high-emphasis hover:bg-white/10 rounded-full p-1 transition-colors flex items-center justify-center shrink-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary min-h-[32px] min-w-[32px] touch-manipulation"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                side="top"
                align="start"
                sideOffset={12}
                className="z-[100] w-72 max-w-[calc(100vw-32px)] bg-[#18191E] border border-white/20 text-high-emphasis shadow-2xl shadow-black/90 rounded-2xl p-3.5 relative isolate space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-success font-semibold text-xs">
                    <GraduationCap className="w-4 h-4" />
                    <span>Student Mode Active</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="p-1 rounded-lg text-low-emphasis hover:text-high-emphasis hover:bg-white/10 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-med-emphasis text-[11px] leading-relaxed">
                  Filters purely paid software and prioritizes 100% Free, Freemium, and Open Source AI tools with generous free tiers for assignments & projects.
                </p>

                <div className="pt-1 border-t border-white/10 flex flex-wrap gap-1.5 text-[10px]">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                    100% Free
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                    Freemium
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
                    Open Source
                  </span>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {showSwitch && (
          <Switch
            checked={studentMode}
            onCheckedChange={setStudentMode}
            className="data-[state=checked]:bg-success scale-110 shrink-0 ml-2"
            aria-label="Toggle Student Mode"
          />
        )}
      </div>
    );
  }

  return (
    <div className={cn('relative z-30 inline-flex items-center gap-3 shrink-0', className)}>
      <div className="flex items-center gap-2 shrink-0">
        <GraduationCap
          className={cn(
            'w-4 h-4 transition-colors shrink-0',
            studentMode ? 'text-success' : 'text-med-emphasis'
          )}
        />
        <span className="text-xs font-semibold text-high-emphasis whitespace-nowrap">Student Mode</span>

        {/* Desktop Info Button Popover - Absolutely positioned z-[100] opaque card anchored to end */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label="Student Mode Info"
              onMouseEnter={() => setOpen(true)}
              onTouchStart={(e) => {
                e.preventDefault();
                setOpen((prev) => !prev);
              }}
              onClick={() => setOpen((prev) => !prev)}
              className="text-low-emphasis hover:text-high-emphasis hover:bg-white/10 rounded-full p-1 transition-colors flex items-center justify-center shrink-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary min-h-[28px] min-w-[28px] touch-manipulation"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="bottom"
            align="end"
            sideOffset={14}
            onMouseLeave={() => setOpen(false)}
            className="z-[100] w-80 max-w-[calc(100vw-32px)] bg-[#18191E] border border-white/20 text-high-emphasis shadow-2xl shadow-black/90 rounded-2xl p-4 relative isolate space-y-2.5 animate-in fade-in-0 zoom-in-95"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-success font-semibold text-xs">
                <GraduationCap className="w-4 h-4" />
                <span>🎓 Student Mode</span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg text-low-emphasis hover:text-high-emphasis hover:bg-white/10 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-med-emphasis text-[12px] leading-relaxed">
              Prioritizes 100% Free, Freemium, and Open Source AI tools with generous free tiers for assignments & student projects.
            </p>

            <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-[10px]">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-medium">
                <CheckCircle2 className="w-3 h-3" /> 100% Free
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-medium">
                <CheckCircle2 className="w-3 h-3" /> Freemium
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30 font-medium">
                <CheckCircle2 className="w-3 h-3" /> Open Source
              </span>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {showSwitch && (
        <Switch
          checked={studentMode}
          onCheckedChange={setStudentMode}
          className="data-[state=checked]:bg-success shrink-0"
          aria-label="Toggle Student Mode"
        />
      )}
    </div>
  );
}
