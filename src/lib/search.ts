import Fuse from 'fuse.js';
import type { Tool, SortOption, FreePlanFilter } from '@/types/tool';
import { normalizeSlug } from './slugs';
import { filterByFreePlanStatus } from './freePlanUtils';

let fuseInstance: Fuse<Tool> | null = null;

export function createSearchIndex(tools: Tool[]): Fuse<Tool> {
  fuseInstance = new Fuse(tools, {
    keys: [
      { name: 'name', weight: 3 },
      { name: 'why', weight: 2.5 },
      { name: 'category', weight: 2 },
    ],
    threshold: 0.3,
    includeScore: true,
    ignoreLocation: true,
    minMatchCharLength: 2,
  });
  return fuseInstance;
}

/**
 * Calculates a relevance score for a tool based on the user's search query.
 *
 * Requirements:
 * 1. Tokenized & Multi-word Query Matching:
 *    Split multi-word queries into tokens: const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
 * 2. Relevance weights:
 *    - Exact phrase match in Category or Name: +100 points
 *    - Exact token match in Category or Tags: +50 points (per token)
 *    - Exact token match in Name: +30 points (per token)
 *    - Match in short description (tool.description or tool.why): +10 points (per token)
 * 3. Returns 0 if none of category, name, tags, or description match.
 */
export function calculateRelevance(tool: Tool, query: string): number {
  if (!query || !query.trim()) return 0;
  const queryLower = query.toLowerCase().trim();
  const tokens = queryLower.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return 0;

  const category = (tool.category || '').toLowerCase();
  const name = (tool.name || '').toLowerCase();
  const tags = (tool.tags || []).map((t) => String(t).toLowerCase());
  // Short description / primary functionality (supports both tool.description and tool.why)
  const description = (tool.description || tool.why || '').toLowerCase();

  let score = 0;

  // Exact phrase match in Category or Name: +100 points
  if (category.includes(queryLower) || name.includes(queryLower)) {
    score += 100;
  }

  // Token-by-token scoring across prioritized fields
  for (const token of tokens) {
    // Exact token match in Category or Tags: +50 points
    if (category.includes(token) || tags.some((tag) => tag.includes(token))) {
      score += 50;
    }
    // Exact token match in Name: +30 points
    if (name.includes(token)) {
      score += 30;
    }
    // Match in short description: +10 points
    if (description.includes(token)) {
      score += 10;
    }
  }

  return score;
}

const searchResultsCache = new Map<string, Tool[]>();

/**
 * Searches and strictly filters tools dataset according to search query,
 * category, student mode, access level, and free plan filters.
 */
export function searchTools(
  tools: Tool[],
  _fuse: Fuse<Tool> | null,
  query: string,
  options: {
    access?: string;
    category?: string;
    sort?: SortOption;
    studentMode?: boolean;
    freePlanFilter?: FreePlanFilter;
  } = {}
): Tool[] {
  const q = (query || '').trim();
  const studentModeActive = !!options.studentMode;
  const selectedCategory = options.category || 'all';

  const cacheKey = `${q.toLowerCase()}|${options.access ?? 'all'}|${selectedCategory}|${options.sort ?? 'default'}|${studentModeActive ? '1' : '0'}|${options.freePlanFilter ?? 'all'}`;

  if (searchResultsCache.has(cacheKey)) {
    return searchResultsCache.get(cacheKey)!;
  }

  // 1. Strict Query Filtering Pipeline & 3. Prevent Filter Overrides (Strict AND filtering)
  const scoredItems: { tool: Tool; score: number }[] = [];

  for (const tool of tools) {
    // Calculate relevance score if query is present
    const relevanceScore = q ? calculateRelevance(tool, q) : 1;

    // Strict query check: filter out any tools with a score of 0 when query is present
    const matchesQuery = q ? relevanceScore > 0 : true;

    // Student Mode AND filter:
    // Support tool.pricingTier === 'Free' || tool.generousQuota, as well as access !== 'Paid'
    const isFreeOrGenerous =
      tool.pricingTier === 'Free' ||
      tool.generousQuota === true ||
      tool.access === 'Free' ||
      tool.access === 'Open Source' ||
      tool.access !== 'Paid';
    const matchesStudent = !studentModeActive || isFreeOrGenerous;

    // Category AND filter:
    const toolCatSlug = tool.categorySlug || normalizeSlug(tool.category);
    const selectedCatSlug = normalizeSlug(selectedCategory);
    const matchesCategory =
      selectedCategory === 'all' ||
      tool.categorySlug === selectedCategory ||
      toolCatSlug === selectedCatSlug ||
      tool.category.toLowerCase() === selectedCategory.toLowerCase();

    // Access AND filter:
    const matchesAccess =
      !options.access || options.access === 'all' || tool.access === options.access;

    // Free Plan Tier AND filter:
    const matchesFreePlan =
      !options.freePlanFilter ||
      options.freePlanFilter === 'all' ||
      filterByFreePlanStatus(tool, options.freePlanFilter);

    // All filters must pass simultaneously (AND logic)
    if (matchesQuery && matchesStudent && matchesCategory && matchesAccess && matchesFreePlan) {
      scoredItems.push({
        tool: { ...tool, relevanceScore },
        score: relevanceScore,
      });
    }
  }

  // 2. Sorting Pipeline
  if (options.sort === 'alphabetical') {
    scoredItems.sort((a, b) => (a.tool.name || '').localeCompare(b.tool.name || ''));
  } else if (options.sort === 'recently-added') {
    scoredItems.sort((a, b) => (b.tool.id || 0) - (a.tool.id || 0));
  } else if (q) {
    // Default when searching: rank highest relevance score first
    scoredItems.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return (a.tool.name || '').localeCompare(b.tool.name || '');
    });
  }

  const results = scoredItems.map((item) => item.tool);
  searchResultsCache.set(cacheKey, results);
  return results;
}

export function rankResults(tools: Tool[], _query: string): {
  bestOverall: Tool[];
  bestFree: Tool[];
  bestForStudents: Tool[];
  bestPremium: Tool[];
  mostPopular: Tool[];
  fastestToLearn: Tool[];
} {
  const topN = Math.min(8, tools.length);

  const bestFree = tools
    .filter((t) => t.access === 'Free' || t.access === 'Open Source')
    .slice(0, topN);
  const bestForStudents = tools
    .filter((t) => t.access !== 'Paid')
    .slice(0, topN);
  const bestPremium = tools
    .filter((t) => t.access === 'Paid')
    .slice(0, topN);

  // "Most popular" — strictly select from the filtered results matching popular names
  const popularNames = [
    'ChatGPT', 'Claude', 'Canva', 'GitHub Copilot', 'Midjourney', 'Runway',
    'Gamma', 'Notion', 'Figma', 'Grammarly', 'Perplexity', 'Google Gemini',
    'CapCut', 'Adobe Firefly', 'ElevenLabs', 'Descript', 'InVideo AI', 'VEED'
  ];
  const matchedPopular = tools.filter((t) => popularNames.includes(t.name));
  const mostPopular = (matchedPopular.length > 0 ? matchedPopular : tools).slice(0, topN);

  // "Fastest to learn" — freemium tools with shorter why descriptions
  const fastestToLearn = tools
    .filter((t) => t.access !== 'Paid')
    .sort((a, b) => (a.why || '').length - (b.why || '').length)
    .slice(0, topN);

  return {
    bestOverall: tools.slice(0, topN),
    bestFree,
    bestForStudents,
    bestPremium,
    mostPopular,
    fastestToLearn,
  };
}

export function getAutocompleteSuggestions(query: string): string[] {
  const suggestions = [
    'Video editing', 'Create a PowerPoint', 'Generate Images', 'Build a Website',
    'Write an Essay', 'Edit PDF', 'Create Resume', 'Generate Video', 'Make Music',
    'Code an App', 'Remove Background', 'Translate Text', 'Design a Logo',
    'Research a Topic', 'Edit Videos', 'Create Podcast', 'Automate Tasks',
    'Analyze Data', 'Write Marketing Copy', 'Build Chatbot', 'Generate Voice',
  ];

  if (!query.trim()) return suggestions.slice(0, 8);
  const lower = query.toLowerCase();
  return suggestions.filter((s) => s.toLowerCase().includes(lower)).slice(0, 6);
}
