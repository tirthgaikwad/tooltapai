import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The requested page could not be located in the ToolTap directory.',
};

export default function NotFound() {
  return (
    <main>
      <h1>404 - Page Not Found</h1>
    </main>
  );
}
