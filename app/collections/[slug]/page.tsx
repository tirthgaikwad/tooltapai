import type { Metadata } from 'next';
import React from 'react';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const formattedTitle = params.slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${formattedTitle} AI Stack`,
    description: `Curated AI tool bundle, workflows, and transparent stack recommendations for ${formattedTitle}.`,
  };
}

export default function CollectionDetailPage({ params }: { params: { slug: string } }) {
  const formattedTitle = params.slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <main>
      <h1>{formattedTitle} AI Stack</h1>
    </main>
  );
}
