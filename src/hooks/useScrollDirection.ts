import { useState, useEffect, useRef } from 'react';

export function useScrollDirection(threshold = 10) {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [isAtTop, setIsAtTop] = useState(true);
  const lastScrollY = useRef(0);
  const scrollDirRef = useRef<'up' | 'down'>('up');
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const currentIsAtTop = scrollY < 30;
          setIsAtTop(currentIsAtTop);

          const direction = scrollY > lastScrollY.current ? 'down' : 'up';
          if (
            direction !== scrollDirRef.current &&
            Math.abs(scrollY - lastScrollY.current) > threshold
          ) {
            scrollDirRef.current = direction;
            setScrollDirection(direction);
          }
          lastScrollY.current = scrollY > 0 ? scrollY : 0;
          ticking.current = false;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return { scrollDirection, isAtTop, isVisible: scrollDirection === 'up' || isAtTop };
}
