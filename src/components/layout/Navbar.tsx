import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass, Grid3X3, GitCompare,
  Bookmark, Menu, X, Layers,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useApp } from '@/contexts/AppContext';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { ToolTapLogo } from '@/components/common/ToolTapLogo';
import { StudentModeInfo } from '@/components/common/StudentModeInfo';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Home', path: '/', icon: Compass },
  { label: 'Categories', path: '/categories', icon: Grid3X3 },
  { label: 'Collections', path: '/collections', icon: Layers },
  { label: 'Compare', path: '/compare', icon: GitCompare },
  { label: 'Saved Tools', path: '/saved-tools', icon: Bookmark },
  { label: 'How to Use', path: '/how-to-use', icon: HelpCircle },
];

export default function Navbar() {
  const location = useLocation();
  const { compareList, bookmarks } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Body scroll locking when mobile menu is active
  useBodyScrollLock(mobileOpen);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <TooltipProvider delayDuration={200}>
      <header className="sticky top-0 left-0 right-0 z-40 py-3 bg-[#121212]/98 backdrop-blur-sm transform-gpu [transform:translateZ(0)] border-b border-white/[0.06]">
        <div className="page-container flex justify-center">
          <nav className="w-full flex items-center justify-between gap-3 px-3 sm:px-4 py-2 rounded-2xl bg-[#1E1E24]/95 border border-white/[0.08] shadow-lg transform-gpu [transform:translateZ(0)]">
          {/* Logo */}
          <Link to="/" aria-label="ToolTap home" className="flex items-center shrink-0 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg">
            <ToolTapLogo variant="navbar" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ label, path }) => {
              const active = isActive(path);
              return (
                <Link
                  key={path}
                  to={path}
                  className={cn(
                    'relative px-3 py-1.5 text-xs font-semibold rounded-xl transition-all duration-150 whitespace-nowrap flex items-center gap-1.5 min-h-[38px]',
                    active
                      ? 'text-primary bg-primary/10 border border-primary/20'
                      : 'text-med-emphasis hover:text-high-emphasis hover:bg-white/[0.05]'
                  )}
                >
                  {label}
                  {path === '/compare' && compareList.length > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-primary text-white text-[10px] font-bold">
                      {compareList.length}
                    </span>
                  )}
                  {path === '/saved-tools' && bookmarks.length > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[10px] font-bold">
                      {bookmarks.length > 9 ? '9+' : bookmarks.length}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side: Student Mode Toggle + Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Student mode toggle on desktop */}
            <div className="hidden sm:flex items-center pl-2 border-l border-white/[0.08] shrink-0">
              <StudentModeInfo variant="navbar" />
            </div>

            {/* Mobile Hamburger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/[0.06] flex items-center justify-center"
                  aria-label="Open menu"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" hideCloseButton className="w-full sm:w-80 h-[100dvh] max-h-[100dvh] bg-[#1E1E24] border-white/[0.08] p-0 z-50 flex flex-col">
                <div className="flex flex-col h-full w-full">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] shrink-0">
                    <Link to="/" aria-label="ToolTap home" onClick={() => setMobileOpen(false)} className="flex items-center">
                      <ToolTapLogo variant="navbar" className="h-[36px]" />
                    </Link>
                    <SheetClose asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-11 h-11 min-w-[44px] min-h-[44px] text-med-emphasis hover:text-high-emphasis flex items-center justify-center rounded-xl hover:bg-white/10"
                        onClick={() => setMobileOpen(false)}
                        aria-label="Close menu"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </SheetClose>
                  </div>

                  {/* Navigation links */}
                  <nav className="flex flex-col gap-2 p-4 overflow-y-auto flex-1">
                    {navLinks.map(({ label, path, icon: Icon }) => {
                      const active = isActive(path);
                      return (
                        <Link
                          key={path}
                          to={path}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            'flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl text-sm font-medium transition-all active:scale-[0.98]',
                            active
                              ? 'text-primary bg-primary/10 border border-primary/20 font-semibold'
                              : 'text-med-emphasis hover:text-high-emphasis hover:bg-white/[0.05]'
                          )}
                        >
                          <Icon className="w-4 h-4 text-primary/80 shrink-0" />
                          <span>{label}</span>
                          {path === '/compare' && compareList.length > 0 && (
                            <Badge className="ml-auto bg-primary text-white text-[10px] px-2 py-0.5">
                              {compareList.length}
                            </Badge>
                          )}
                          {path === '/saved-tools' && bookmarks.length > 0 && (
                            <Badge className="ml-auto bg-amber-500 text-black text-[10px] px-2 py-0.5">
                              {bookmarks.length}
                            </Badge>
                          )}
                        </Link>
                      );
                    })}
                  </nav>

                  {/* Student mode footer */}
                  <div className="mt-auto p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] border-t border-white/[0.08] bg-[#111216] shrink-0">
                    <StudentModeInfo variant="mobile" />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
    </TooltipProvider>
  );
}
