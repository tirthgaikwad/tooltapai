import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/layout/PageLayout';
import { AlertTriangle, RefreshCw, Grid3X3, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Category page rendering error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <PageLayout>
          <div className="py-16 text-center max-w-lg mx-auto px-4 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-foreground mb-2">
                {this.props.fallbackTitle || 'Something went wrong while loading this category.'}
              </h2>
              <p className="text-muted-foreground text-xs sm:text-sm">
                An unexpected error occurred. You can retry loading or navigate to another page.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                onClick={this.handleRetry}
                size="sm"
                className="bg-primary text-primary-foreground font-semibold rounded-xl gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Try Again
              </Button>
              <Button asChild size="sm" variant="outline" className="border-white/10 rounded-xl gap-2">
                <Link to="/categories">
                  <Grid3X3 className="w-3.5 h-3.5" />
                  View All Categories
                </Link>
              </Button>
              <Button asChild size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground gap-2">
                <Link to="/">
                  <Home className="w-3.5 h-3.5" />
                  Go Home
                </Link>
              </Button>
            </div>
          </div>
        </PageLayout>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
