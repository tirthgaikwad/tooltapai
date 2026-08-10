import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  // Set manual scroll restoration on mount
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    const scrollToTopImmediate = () => {
      // If there is an anchor hash in the URL, scroll to that element
      if (hash) {
        const id = hash.replace('#', '');
        const element = document.getElementById(id) || document.querySelector(`[name="${id}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }

      // Reset window scroll
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' as ScrollBehavior,
      });

      // Reset document elements
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
        document.documentElement.scrollLeft = 0;
      }
      if (document.body) {
        document.body.scrollTop = 0;
        document.body.scrollLeft = 0;
      }

      // Reset layout container if present
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.scrollTop = 0;
        mainElement.scrollLeft = 0;
      }

      const rootElement = document.getElementById('root');
      if (rootElement) {
        rootElement.scrollTop = 0;
        rootElement.scrollLeft = 0;
      }

      // Reset any scrollable containers
      const scrollables = document.querySelectorAll(
        '.overflow-y-auto, .overflow-auto, [data-scroll-container]'
      );
      scrollables.forEach((el) => {
        el.scrollTop = 0;
        el.scrollLeft = 0;
      });
    };

    // Execute immediately before browser paint
    scrollToTopImmediate();

    // Re-trigger after paint/requestAnimationFrame to handle async content or lazy loading
    const rafId = requestAnimationFrame(() => {
      scrollToTopImmediate();
    });

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [pathname, search, hash]);

  return null;
};

export default ScrollToTop;
