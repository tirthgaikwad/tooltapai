import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import CompareClient from './CompareClient';

export const metadata: Metadata = {
  title: 'Compare AI Tools - ToolTap',
  description: 'Side-by-side feature, pricing, throughput, and benchmark comparison for ChatGPT, Claude, and leading AI models.',
};

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#121216] flex items-center justify-center text-muted-foreground">Loading comparison matrix...</div>}>
      <CompareClient />
    </Suspense>
  );
}
