import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: {
    template: '%s | ToolTap',
    default: 'ToolTap | Discover, Compare, and Choose AI Tools',
  },
  description: 'The ultimate directory for students, developers, and creators to find verified AI tools with transparent pricing and workflow benchmarks.',
  openGraph: {
    title: 'ToolTap | Discover, Compare, and Choose AI Tools',
    description: 'The ultimate directory for students, developers, and creators to find verified AI tools with transparent pricing and workflow benchmarks.',
    siteName: 'ToolTap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ToolTap | Discover, Compare, and Choose AI Tools',
    description: 'The ultimate directory for students, developers, and creators to find verified AI tools with transparent pricing and workflow benchmarks.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>{children}</body>
    </html>
  );
}
