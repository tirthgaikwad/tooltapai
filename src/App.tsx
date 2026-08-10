import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IntersectObserver from '@/components/common/IntersectObserver';
import ScrollManager from '@/components/common/ScrollManager';
import { Toaster } from '@/components/ui/sonner';
import { AppProvider } from '@/contexts/AppContext';
import { routes } from './routes';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <ScrollManager />
        <IntersectObserver />
        <div className="flex flex-col min-h-screen bg-background">
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Routes>
        </div>
        <Toaster theme="dark" position="bottom-right" richColors />
      </Router>
    </AppProvider>
  );
};

export default App;
