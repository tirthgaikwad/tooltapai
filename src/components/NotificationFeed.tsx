import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCheck, RefreshCw, ExternalLink } from 'lucide-react';
import { ToolUpdate } from '@/types/updates';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface NotificationFeedProps {
  onUnreadChange?: (unreadCount: number) => void;
  onClose?: () => void;
}

export function NotificationFeed({ onUnreadChange }: NotificationFeedProps) {
  const [updates, setUpdates] = useState<ToolUpdate[]>([]);
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch updates from API or fallback
  const fetchUpdates = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/updates');
      if (res.ok) {
        const data = await res.json();
        if (data.updates && Array.isArray(data.updates)) {
          setUpdates(data.updates);
          const unread = data.updates.filter((u: ToolUpdate) => !u.read).length;
          onUnreadChange?.(unread);
          return;
        }
      }
      // Fallback: fetch from static json or mock
      const staticRes = await fetch('/src/data/updates.json');
      if (staticRes.ok) {
        const fallback = await staticRes.json();
        setUpdates(fallback);
        onUnreadChange?.(fallback.filter((u: ToolUpdate) => !u.read).length);
      }
    } catch (err) {
      console.warn('Could not fetch updates, falling back to local storage', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  const markAllAsRead = async () => {
    const updated = updates.map((u) => ({ ...u, read: true }));
    setUpdates(updated);
    onUnreadChange?.(0);

    try {
      await fetch('/api/updates/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      });
      toast.success('All updates marked as read');
    } catch {
      // Local state is already updated
    }
  };

  const markSingleAsRead = async (id: string) => {
    const updated = updates.map((u) => (u.id === id ? { ...u, read: true } : u));
    setUpdates(updated);
    const unread = updated.filter((u) => !u.read).length;
    onUnreadChange?.(unread);

    try {
      await fetch('/api/updates/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch {
      // Local state is already updated
    }
  };

  // Generate new update via Gemini Summarizer API
  const handleGenerateUpdates = async () => {
    try {
      setIsGenerating(true);
      toast.info('Summarizing latest AI changelogs with Gemini...');
      const res = await fetch('/api/generate-updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawChangelog: 'Anthropic announced Claude 3.5 Sonnet upgraded with enhanced computer use and 20% lower token pricing. OpenAI launched ChatGPT Search feature for all free tier users.',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.updates) {
          setUpdates(data.updates);
          const unread = data.updates.filter((u: ToolUpdate) => !u.read).length;
          onUnreadChange?.(unread);
          toast.success('New AI update summarized and added!');
        }
      } else {
        toast.error('Failed to summarize changelog');
      }
    } catch (err: any) {
      toast.error('Error generating updates: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const getBadgeStyle = (type: ToolUpdate['type']) => {
    switch (type) {
      case 'feature':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'pricing':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'launch':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default:
        return 'text-white/60 bg-white/10 border-white/10';
    }
  };

  const unreadCount = updates.filter((u) => !u.read).length;

  return (
    <div className="w-80 max-h-[400px] overflow-y-auto bg-[#18181C]/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl text-white select-none custom-scrollbar">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-[#18181C]/95 backdrop-blur-md px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-white">Latest Updates</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#F2994A] text-black leading-none">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="text-xs text-white/50 hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none"
            title="Mark all as read"
          >
            Mark all as read
          </button>
        </div>
      </div>

      {/* List items */}
      <div className="divide-y divide-white/5">
        {loading && updates.length === 0 ? (
          <div className="p-6 text-center text-xs text-white/40">Loading latest AI updates...</div>
        ) : updates.length === 0 ? (
          <div className="p-6 text-center text-xs text-white/40">No recent updates available.</div>
        ) : (
          updates.map((item) => (
            <div
              key={item.id}
              onClick={() => markSingleAsRead(item.id)}
              className={cn(
                'p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group relative',
                !item.read && 'bg-white/[0.02]'
              )}
            >
              {/* Top line: toolName bold white + tiny badge for type */}
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-bold text-white text-sm truncate group-hover:text-primary transition-colors">
                    {item.toolName}
                  </span>
                  {!item.read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F2994A] shrink-0" title="Unread" />
                  )}
                </div>
                <span
                  className={cn(
                    'text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0',
                    getBadgeStyle(item.type)
                  )}
                >
                  {item.type}
                </span>
              </div>

              {/* Middle line: summary in text-sm text-white/70 */}
              <p className="text-sm text-white/70 leading-snug mb-1.5 line-clamp-2">
                {item.summary}
              </p>

              {/* Bottom line: date in text-xs text-white/40 */}
              <div className="flex items-center justify-between text-xs text-white/40">
                <span>{item.date}</span>
                <span className="text-[11px] opacity-0 group-hover:opacity-100 text-white/50 transition-opacity flex items-center gap-0.5">
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Action Footer for Gemini live summarizer */}
      <div className="p-3 bg-[#131316] border-t border-white/5 flex items-center justify-between">
        <button
          onClick={handleGenerateUpdates}
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors disabled:opacity-50"
        >
          <Sparkles className={cn('w-3.5 h-3.5 text-amber-400', isGenerating && 'animate-spin')} />
          <span>{isGenerating ? 'Summarizing...' : 'Summarize Fresh News with Gemini'}</span>
        </button>
      </div>
    </div>
  );
}

export default NotificationFeed;
