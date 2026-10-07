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

    // Strict deduplication: guarantee exactly one <title> element in the DOM
    const titleNodes = document.querySelectorAll('title');
    if (titleNodes.length > 1) {
      for (let i = 1; i < titleNodes.length; i++) {
        titleNodes[i].remove();
      }
    }

    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);

      // Keep OpenGraph and Twitter tags in sync
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', description);

      let twitterDesc = document.querySelector('meta[name="twitter:description"]');
      if (twitterDesc) twitterDesc.setAttribute('content', description);
    }

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', fullTitle);

    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', fullTitle);
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
