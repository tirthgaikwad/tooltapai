import type { Metadata } from 'next';
import React from 'react';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const formattedTitle = params.slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${formattedTitle} – Free Plan, Pricing & Features`,
    description: `Explore features, free tier limitations, pricing, and community benchmarks for ${formattedTitle} on ToolTap.`,
  };
}

export default function ToolDetailPage({ params }: { params: { slug: string } }) {
  const formattedTitle = params.slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <main>
      <h1>{formattedTitle}</h1>
    </main>
  );
}
