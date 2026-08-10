import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const savedPositions = new Map<string, number>();

export default function ScrollManager() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const previousKey = useRef(location.key);

  // Disable automatic browser scroll restoration to prevent jump conflicts
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Save current scroll position before route key changes
  useEffect(() => {
    const currentKey = previousKey.current;

    return () => {
      savedPositions.set(currentKey, window.scrollY);
    };
  }, [location.key]);

  useEffect(() => {
    previousKey.current = location.key;

    if (location.hash) {
      const targetId = decodeURIComponent(location.hash.replace('#', ''));

      const frameId = requestAnimationFrame(() => {
        const target = document.getElementById(targetId);

        if (!target) return;

        const navbarHeight = 96;
        const targetTop =
          target.getBoundingClientRect().top + window.scrollY - navbarHeight;

        const reduceMotion = window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches;

        window.scrollTo({
          top: Math.max(0, targetTop),
          behavior: reduceMotion ? 'auto' : 'smooth',
        });
      });

      return () => cancelAnimationFrame(frameId);
    }

    if (navigationType === 'POP') {
      const savedPosition = savedPositions.get(location.key);

      if (typeof savedPosition === 'number') {
        const frameId = requestAnimationFrame(() => {
          window.scrollTo({
            top: savedPosition,
            left: 0,
            behavior: 'auto',
          });
        });

        return () => cancelAnimationFrame(frameId);
      }
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    });
  }, [
    location.pathname,
    location.search,
    location.hash,
    location.key,
    navigationType,
  ]);

  return null;
}

