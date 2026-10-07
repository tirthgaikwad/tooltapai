import type { Metadata, ResolvingMetadata } from 'next';
import React from 'react';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const formattedTitle = params.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return {
    title: `${formattedTitle} AI Tools`,
    description: `Compare the best free and premium artificial intelligence tools for ${formattedTitle}.`,
  };
}

export default function CategoriesDetailPage({ params }: { params: { slug: string } }) {
  const formattedTitle = params.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  return (
    <main>
      <h1>{formattedTitle} AI Tools</h1>
    </main>
  );
}
