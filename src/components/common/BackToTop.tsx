import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { compareList } = useApp();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        setVisible(window.scrollY > 500);
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  };

  const hasCompareBar = compareList.length > 0;

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={scrollToTop}
      className={cn(
        'fixed right-6 z-40 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full',
        'bg-[#1D1E24] hover:bg-[#252730] text-amber-400 border border-white/15 shadow-2xl',
        'flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
        hasCompareBar ? 'bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] sm:bottom-20' : 'bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] sm:bottom-6',
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
      )}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
