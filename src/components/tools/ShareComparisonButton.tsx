import React, { useState, useCallback } from 'react';
import { Share2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { normalizeSlug } from '@/lib/slugs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Tool } from '@/types/tool';

interface ShareComparisonButtonProps {
  compareList: Tool[];
  captureRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

export default function ShareComparisonButton({
  compareList,
  className,
  size = 'sm',
}: ShareComparisonButtonProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = useCallback(() => {
    if (compareList.length === 0) return window.location.href;
    const slugs = compareList.map((t) => normalizeSlug(t.name)).join(',');
    const origin = window.location.origin;
    const pathname = window.location.pathname.includes('/compare') ? window.location.pathname : '/compare';
    return `${origin}${pathname}?compare=${encodeURIComponent(slugs)}`;
  }, [compareList]);

  const handleCopyLink = async () => {
    try {
      const shareUrl = getShareUrl();
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Comparison link copied to clipboard!', {
        description: 'Ready to share with friends or colleagues.',
        duration: 4000,
        id: 'share-link-copied',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy link to clipboard.', { id: 'share-link-error' });
    }
  };

  if (compareList.length === 0) return null;

  return (
    <Button
      variant="outline"
      size={size}
      onClick={handleCopyLink}
      className={cn(
        'liquid-glass border-amber-500/50 text-amber-400 hover:bg-amber-500/10 hover:border-amber-400 font-semibold rounded-xl gap-2 shadow-lg transition-all',
        copied && 'bg-amber-500/20 text-amber-300 border-amber-400',
        className
      )}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-emerald-400 animate-in zoom-in-50" />
          <span>Copied Link!</span>
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4 text-amber-400" />
          <span>Share Comparison</span>
        </>
      )}
    </Button>
  );
}
