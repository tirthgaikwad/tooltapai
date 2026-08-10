import Navbar from './Navbar';
import Footer from './Footer';
import ComparisonDock from '@/components/ComparisonDock';
import BackToTop from '@/components/common/BackToTop';

interface Props {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export default function PageLayout({ children, className = '', fullWidth = false }: Props) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className={`flex-1 pt-2 sm:pt-4 ${className}`}>
        <div className={fullWidth ? '' : 'page-container'}>
          {children}
        </div>
      </main>
      <ComparisonDock />
      <BackToTop />
      <Footer />
    </div>
  );
}

