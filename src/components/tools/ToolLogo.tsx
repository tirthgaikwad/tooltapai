import { useState, useMemo, useEffect, memo } from 'react';
import { cn } from '@/lib/utils';

// Category-based color palettes for placeholder logos
const categoryColors: Record<string, { bg: string; text: string }> = {
  'General AI Assistants': { bg: 'bg-primary/20', text: 'text-primary' },
  'Coding and Software Development': { bg: 'bg-[#22C55E]/15', text: 'text-[#22C55E]' },
  'App and Website Builders': { bg: 'bg-[#D4AF37]/15', text: 'text-[#D4AF37]' },
  'Image Generation': { bg: 'bg-purple-500/15', text: 'text-purple-400' },
  'Image Editing and Enhancement': { bg: 'bg-pink-500/15', text: 'text-pink-400' },
  'Video Generation': { bg: 'bg-red-500/15', text: 'text-red-400' },
  'Video Editing and Repurposing': { bg: 'bg-orange-500/15', text: 'text-orange-400' },
  'Voice and Text to Speech': { bg: 'bg-cyan-500/15', text: 'text-cyan-400' },
  'Audio, Music, and Podcasting': { bg: 'bg-violet-500/15', text: 'text-violet-400' },
  'Writing and Copywriting': { bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
  'Research, Search, and Knowledge': { bg: 'bg-blue-500/15', text: 'text-blue-400' },
  'PDF and Document AI': { bg: 'bg-red-600/15', text: 'text-red-400' },
  'Presentations and Slides': { bg: 'bg-primary/20', text: 'text-primary' },
  'Meetings, Notes, and Productivity': { bg: 'bg-[#D4AF37]/15', text: 'text-[#D4AF37]' },
  'Marketing, SEO, and Social Media': { bg: 'bg-green-500/15', text: 'text-green-400' },
  'Sales and Customer Support': { bg: 'bg-teal-500/15', text: 'text-teal-400' },
  'Automation and AI Agents': { bg: 'bg-primary/20', text: 'text-primary' },
  'Data Science and Analytics': { bg: 'bg-[#D4AF37]/15', text: 'text-[#D4AF37]' },
  'Machine Learning Platforms and APIs': { bg: 'bg-indigo-500/15', text: 'text-indigo-400' },
  'Open Source Models and Local AI': { bg: 'bg-[#22C55E]/15', text: 'text-[#22C55E]' },
  'Design, UI, and Branding': { bg: 'bg-fuchsia-500/15', text: 'text-fuchsia-400' },
  '3D, Architecture, and Games': { bg: 'bg-amber-500/15', text: 'text-amber-400' },
  'Education and Learning': { bg: 'bg-[#22C55E]/15', text: 'text-[#22C55E]' },
  'Recruitment, Resume, and Career': { bg: 'bg-primary/20', text: 'text-primary' },
  'Business, Legal, and Finance': { bg: 'bg-[#D4AF37]/15', text: 'text-[#D4AF37]' },
};

const fallback = { bg: 'bg-muted', text: 'text-muted-foreground' };

interface Props {
  name: string;
  category: string;
  url?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function ToolLogo({ name, category, url, size = 'md', className }: Props) {
  const [useFallbackService, setUseFallbackService] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const colors = categoryColors[category] ?? fallback;
  const initial = name.charAt(0).toUpperCase();

  const domain = useMemo(() => {
    if (!url) return null;
    try {
      const u = url.startsWith('http') ? url : `https://${url}`;
      return new URL(u).hostname.replace(/^www\./, '');
    } catch {
      return null;
    }
  }, [url]);

  useEffect(() => {
    setImgError(false);
    setUseFallbackService(false);
    setLoaded(false);
  }, [domain]);

  const faviconUrl = useMemo(() => {
    if (!domain) return null;
    if (useFallbackService) {
      return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
    }
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  }, [domain, useFallbackService]);

  const handleImgError = () => {
    if (!useFallbackService) {
      setUseFallbackService(true);
    } else {
      setImgError(true);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-xl',
  };

  if (faviconUrl && !imgError) {
    return (
      <div
        className={cn(
          'rounded-xl flex items-center justify-center bg-white/10 overflow-hidden shrink-0 p-1 border border-white/10 transition-all',
          sizeClasses[size],
          loaded && 'animate-logo-fade',
          className
        )}
      >
        <img
          src={faviconUrl}
          alt={`${name} logo`}
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={handleImgError}
          className={cn(
            'w-full h-full object-contain rounded-lg transition-opacity duration-300',
            loaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-xl flex items-center justify-center font-heading font-bold shrink-0',
        sizeClasses[size],
        colors.bg,
        colors.text,
        className
      )}
    >
      {initial}
    </div>
  );
}

export default memo(ToolLogo);
