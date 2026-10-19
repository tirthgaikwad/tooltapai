import type { RecommendationResponse, UserRequirements } from '@/types/recommendation';
import { rankAndRecommendTools } from '@/lib/recommendationEngine';
import toolsData from '@/data/tools.json';
import type { Tool } from '@/types/tool';

const allTools = toolsData as Tool[];

export async function fetchToolRecommendation(
  query: string,
  constraints?: Partial<UserRequirements>
): Promise<RecommendationResponse> {
  const trimmed = query.trim();
  if (!trimmed) {
    throw new Error('Query must not be empty');
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const response = await fetch('/api/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: trimmed, constraints }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data: RecommendationResponse = await response.json();
      return data;
    }
  } catch (err) {
    console.warn('[Recommendation Service] Server request failed, using client-side engine:', (err as any)?.message);
  }

  // Resilient Client-Side Fallback: uses identical deterministic recommendation algorithm
  return rankAndRecommendTools(allTools, trimmed, constraints);
}
