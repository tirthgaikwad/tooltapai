import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import PageMeta from '@/components/common/PageMeta';
import { Button } from '@/components/ui/button';
import { Compass, Search, Grid3X3 } from 'lucide-react';

export default function NotFound() {
  return (
    <PageLayout>
      <PageMeta title="404 - Page Not Found" description="The requested page could not be found." />
      <div className="py-20 text-center max-w-lg mx-auto px-4 my-8">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-6">
          <span className="font-heading font-extrabold text-3xl text-amber-400">404</span>
        </div>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-foreground mb-3">
          Page Not Found
        </h1>
        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-8 max-w-md mx-auto">
          The page you requested might have been moved, renamed, or is temporarily unavailable.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl h-11 px-6">
            <Link to="/">
              <Compass className="w-4 h-4 mr-1.5" /> Return Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="border-white/10 text-foreground font-semibold rounded-xl h-11 px-6">
            <Link to="/search">
              <Search className="w-4 h-4 mr-1.5" /> Search Directory
            </Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
