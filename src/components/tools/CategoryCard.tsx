import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot, Code2, Globe, ImageIcon, Scissors, Video, Film, Mic, Music, PenTool,
  Search, FileText, Presentation, CalendarCheck, TrendingUp, Headphones,
  Zap, BarChart3, Cpu, Package, Palette, Box, GraduationCap, Briefcase, Building2, ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { normalizeSlug } from '@/lib/slugs';

export const categoryConfig: Record<string, { icon: React.ComponentType<{className?: string}>; color: string; bgGradient: string }> = {
  'General AI Assistants': { icon: Bot, color: 'text-primary', bgGradient: 'from-primary/10 to-primary/5' },
  'Coding and Software Development': { icon: Code2, color: 'text-emerald-400', bgGradient: 'from-emerald-500/10 to-emerald-500/5' },
  'App and Website Builders': { icon: Globe, color: 'text-amber-400', bgGradient: 'from-amber-500/10 to-amber-500/5' },
  'Image Generation': { icon: ImageIcon, color: 'text-purple-400', bgGradient: 'from-purple-500/10 to-purple-500/5' },
  'Image Editing and Enhancement': { icon: Scissors, color: 'text-pink-400', bgGradient: 'from-pink-500/10 to-pink-500/5' },
  'Video Generation': { icon: Video, color: 'text-red-400', bgGradient: 'from-red-500/10 to-red-500/5' },
  'Video Editing and Repurposing': { icon: Film, color: 'text-orange-400', bgGradient: 'from-orange-500/10 to-orange-500/5' },
  'Voice and Text to Speech': { icon: Mic, color: 'text-cyan-400', bgGradient: 'from-cyan-500/10 to-cyan-500/5' },
  'Audio, Music, and Podcasting': { icon: Music, color: 'text-violet-400', bgGradient: 'from-violet-500/10 to-violet-500/5' },
  'Writing and Copywriting': { icon: PenTool, color: 'text-emerald-400', bgGradient: 'from-emerald-500/10 to-emerald-500/5' },
  'Research, Search, and Knowledge': { icon: Search, color: 'text-blue-400', bgGradient: 'from-blue-500/10 to-blue-500/5' },
  'PDF and Document AI': { icon: FileText, color: 'text-red-400', bgGradient: 'from-red-600/10 to-red-600/5' },
  'Presentations and Slides': { icon: Presentation, color: 'text-primary', bgGradient: 'from-primary/10 to-primary/5' },
  'Meetings, Notes, and Productivity': { icon: CalendarCheck, color: 'text-amber-400', bgGradient: 'from-amber-500/10 to-amber-500/5' },
  'Marketing, SEO, and Social Media': { icon: TrendingUp, color: 'text-green-400', bgGradient: 'from-green-500/10 to-green-500/5' },
  'Sales and Customer Support': { icon: Headphones, color: 'text-teal-400', bgGradient: 'from-teal-500/10 to-teal-500/5' },
  'Automation and AI Agents': { icon: Zap, color: 'text-primary', bgGradient: 'from-primary/10 to-primary/5' },
  'Data Science and Analytics': { icon: BarChart3, color: 'text-amber-400', bgGradient: 'from-amber-500/10 to-amber-500/5' },
  'Machine Learning Platforms and APIs': { icon: Cpu, color: 'text-indigo-400', bgGradient: 'from-indigo-500/10 to-indigo-500/5' },
  'Open Source Models and Local AI': { icon: Package, color: 'text-emerald-400', bgGradient: 'from-emerald-500/10 to-emerald-500/5' },
  'Design, UI, and Branding': { icon: Palette, color: 'text-fuchsia-400', bgGradient: 'from-fuchsia-500/10 to-fuchsia-500/5' },
  '3D, Architecture, and Games': { icon: Box, color: 'text-amber-400', bgGradient: 'from-amber-500/10 to-amber-500/5' },
  'Education and Learning': { icon: GraduationCap, color: 'text-emerald-400', bgGradient: 'from-emerald-500/10 to-emerald-500/5' },
  'Recruitment, Resume, and Career': { icon: Briefcase, color: 'text-primary', bgGradient: 'from-primary/10 to-primary/5' },
  'Business, Legal, and Finance': { icon: Building2, color: 'text-amber-400', bgGradient: 'from-amber-500/10 to-amber-500/5' },
};

export function categoryToSlug(category: string): string {
  return normalizeSlug(category);
}

interface Props {
  category: string;
  count: number;
  index?: number;
}

function CategoryCard({ category, count, index = 0 }: Props) {
  const rafId = React.useRef<number | null>(null);

  const config = categoryConfig[category] ?? {
    icon: Bot,
    color: 'text-primary',
    bgGradient: 'from-primary/10 to-primary/5',
  };
  const { icon: Icon, color, bgGradient } = config;
  const slug = categoryToSlug(category);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      window.innerWidth < 768 ||
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const currentTarget = e.currentTarget;
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      const rect = currentTarget.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = -((y - centerY) / centerY) * 8;
      const rotateY = ((x - centerX) / centerX) * 8;

      currentTarget.style.setProperty('--mouse-x', `${x}px`);
      currentTarget.style.setProperty('--mouse-y', `${y}px`);
      currentTarget.style.setProperty('--rotate-x', `${rotateX}deg`);
      currentTarget.style.setProperty('--rotate-y', `${rotateY}deg`);
      currentTarget.style.setProperty('--spotlight-opacity', '1');
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    const currentTarget = e.currentTarget;
    currentTarget.style.setProperty('--rotate-x', '0deg');
    currentTarget.style.setProperty('--rotate-y', '0deg');
    currentTarget.style.setProperty('--spotlight-opacity', '0');
  };

  return (
    <div className="perspective-1000 h-full" style={{ perspective: '1000px' }}>
      <Link
        to={`/categories/${slug}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'category-card group relative flex flex-col justify-between p-5 rounded-2xl bg-[#1E1E24] card-gradient border border-white/[0.08] card-hover animate-float-up opacity-0 [animation-fill-mode:forwards] h-full overflow-hidden transition-transform duration-150 ease-out preserve-3d'
        )}
        style={{
          animationDelay: `${index * 30}ms`,
          transform: 'translateZ(0) rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg))',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          contain: 'layout style',
        }}
      >
        {/* Spotlight overlay */}
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300 z-0"
          style={{
            opacity: 'var(--spotlight-opacity, 0)',
            background: `radial-gradient(250px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(242, 153, 74, 0.15), transparent 80%)`,
          }}
        />

        <div className="relative z-10" style={{ transform: 'translateZ(15px)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className={cn('w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 border border-white/5 shadow-md', bgGradient)}>
              <Icon className={cn('w-5 h-5', color)} />
            </div>
            <span className="text-xs font-medium text-med-emphasis bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-full">
              {count} {count === 1 ? 'tool' : 'tools'}
            </span>
          </div>

          <h3 className="font-heading font-semibold text-sm sm:text-base text-high-emphasis leading-snug mb-1 group-hover:text-primary transition-colors">
            {category}
          </h3>
        </div>

        <div className="relative z-10 flex items-center gap-1 text-xs font-semibold text-med-emphasis group-hover:text-primary transition-colors mt-4" style={{ transform: 'translateZ(12px)' }}>
          <span>Explore category</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    </div>
  );
}

export default memo(CategoryCard);

