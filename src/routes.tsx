import { lazy, Suspense } from 'react';
import type { ReactNode } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const HomePage = lazy(() => import('./pages/HomePage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const CategoryDetailPage = lazy(() => import('./pages/CategoryDetailPage'));
const ComparePage = lazy(() => import('./pages/ComparePage'));
const BookmarksPage = lazy(() => import('./pages/BookmarksPage'));
const CollectionsPage = lazy(() => import('./pages/CollectionsPage'));
const CollectionDetailPage = lazy(() => import('./pages/CollectionDetailPage'));
const HowToUsePage = lazy(() => import('./pages/HowToUsePage'));
const DocumentationPage = lazy(() => import('./pages/DocumentationPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ToolDetailPage = lazy(() => import('./pages/ToolDetailPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFound'));

export interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
  public?: boolean;
}

const wrap = (el: ReactNode) => (
  <ErrorBoundary>
    <Suspense fallback={<div className="min-h-screen bg-background" />}>{el}</Suspense>
  </ErrorBoundary>
);

function LegacyToolRedirect() {
  const { toolSlug = '' } = useParams();
  return <Navigate to={`/tools/${toolSlug}`} replace />;
}

function LegacyCategoryRedirect() {
  const { categorySlug = '' } = useParams();
  return <Navigate to={`/categories/${categorySlug}`} replace />;
}

export const routes: RouteConfig[] = [
  { name: 'Home', path: '/', element: wrap(<HomePage />), public: true },
  { name: 'Search', path: '/search', element: wrap(<SearchPage />), public: true },
  { name: 'Categories', path: '/categories', element: wrap(<CategoriesPage />), public: true },
  { name: 'Category', path: '/categories/:slug', element: wrap(<CategoryDetailPage />), public: true },
  { name: 'CategoryAlt', path: '/categories/detail/:categorySlug', element: wrap(<CategoryDetailPage />), public: true },
  { name: 'Collections', path: '/collections', element: wrap(<CollectionsPage />), public: true },
  { name: 'CollectionDetail', path: '/collections/:collectionSlug', element: wrap(<CollectionDetailPage />), public: true },
  { name: 'HowToUse', path: '/how-to-use', element: wrap(<HowToUsePage />), public: true },
  { name: 'Documentation', path: '/documentation', element: wrap(<DocumentationPage />), public: true },
  { name: 'Compare', path: '/compare', element: wrap(<ComparePage />), public: true },
  { name: 'SavedTools', path: '/saved-tools', element: wrap(<BookmarksPage />), public: true },
  { name: 'About', path: '/about', element: wrap(<AboutPage />), public: true },
  { name: 'ToolDetail', path: '/tools/:toolSlug', element: wrap(<ToolDetailPage />), public: true },
  { name: 'Privacy', path: '/privacy', element: wrap(<PrivacyPage />), public: true },
  { name: 'Terms', path: '/terms', element: wrap(<TermsPage />), public: true },

  // Redirect legacy and alias routes
  { name: 'LegacyBookmarks', path: '/bookmarks', element: <Navigate to="/saved-tools" replace />, public: true },
  { name: 'LegacySaved', path: '/saved', element: <Navigate to="/saved-tools" replace />, public: true },
  { name: 'LegacyDocs', path: '/docs', element: <Navigate to="/documentation" replace />, public: true },
  { name: 'LegacyPrivacy', path: '/privacy-policy', element: <Navigate to="/privacy" replace />, public: true },
  { name: 'LegacyTerms', path: '/terms-of-service', element: <Navigate to="/terms" replace />, public: true },
  { name: 'LegacyTool', path: '/tool/:toolSlug', element: wrap(<LegacyToolRedirect />), public: true },
  { name: 'LegacyCategory', path: '/category/:categorySlug', element: wrap(<LegacyCategoryRedirect />), public: true },
  { name: 'NotFound', path: '*', element: wrap(<NotFoundPage />), public: true },
];

