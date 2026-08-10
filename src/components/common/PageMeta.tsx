import { useEffect, ReactNode } from 'react';
import { Toaster } from 'sonner';

interface PageMetaProps {
  title: string;
  description?: string;
}

export default function PageMeta({ title, description }: PageMetaProps) {
  useEffect(() => {
    const fullTitle = title.includes('ToolTap') ? title : `${title} | ToolTap`;
    document.title = fullTitle;

    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', description);
    }
  }, [title, description]);

  return null;
}

export function AppWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        theme="dark"
        richColors
        toastOptions={{
          style: {
            background: '#1F1F24',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#F3F4F6',
          },
        }}
      />
    </>
  );
}

