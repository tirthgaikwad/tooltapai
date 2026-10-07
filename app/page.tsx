import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  // We use absolute title here so it doesn't append the template twice
  title: {
    absolute: 'ToolTap | Discover, Compare, and Choose AI Tools',
  },
  description: 'The ultimate directory for students, developers, and creators to find verified AI tools with transparent pricing and workflow benchmarks.',
};

export default function HomePage() {
  return (
    <main>
      <h1>ToolTap</h1>
      <p>Discover, compare, and choose AI tools.</p>
    </main>
  );
}
