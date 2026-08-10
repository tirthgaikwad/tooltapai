import Fuse from 'fuse.js';
import type { Tool, AccessType, SortOption, FreePlanFilter } from '@/types/tool';
import { normalizeSlug } from './slugs';
import { filterByFreePlanStatus } from './freePlanUtils';

// Task → category/keyword synonym map for intent-based search
const TASK_SYNONYMS: Record<string, string[]> = {
  presentation: ['slides', 'ppt', 'powerpoint', 'deck', 'pitch', 'keynote', 'slideshow'],
  'make ppt': ['presentation', 'slides', 'powerpoint'],
  coding: ['code', 'programming', 'developer', 'software', 'ide', 'debug', 'script', 'dev'],
  writing: ['essay', 'copy', 'content', 'blog', 'article', 'draft', 'copywriting', 'assignment'],
  research: ['search', 'knowledge', 'study', 'academic', 'paper', 'literature', 'scholar'],
  design: ['ui', 'ux', 'graphic', 'branding', 'logo', 'illustration', 'visual', 'figma'],
  marketing: ['seo', 'social media', 'ads', 'campaign', 'email', 'growth', 'promotion'],
  video: ['film', 'movie', 'clip', 'animation', 'reels', 'shorts', 'youtube', 'tiktok'],
  image: ['photo', 'picture', 'art', 'artwork', 'illustration', 'generate image', 'ai art'],
  voice: ['tts', 'text to speech', 'speech', 'narration', 'audio', 'podcast', 'voiceover'],
  pdf: ['document', 'pdf editor', 'doc', 'extract', 'summarize pdf', 'read pdf'],
  resume: ['cv', 'job application', 'career', 'interview', 'linkedin', 'portfolio'],
  website: ['web', 'landing page', 'build website', 'webapp', 'site builder'],
  automation: ['workflow', 'agent', 'no-code', 'zapier', 'bot', 'automate', 'ai agent'],
  'data science': ['data', 'analytics', 'ml', 'machine learning', 'statistics', 'excel', 'chart'],
  productivity: ['notes', 'meeting', 'tasks', 'todo', 'schedule', 'calendar', 'organize'],
  learning: ['education', 'tutor', 'study', 'course', 'quiz', 'student', 'homework'],
  music: ['audio', 'song', 'beat', 'compose', 'sound', 'melody', 'track'],
  '3d': ['3d model', 'architecture', 'game asset', 'render', 'blender', 'unity'],
  sales: ['crm', 'customer', 'support', 'chat', 'lead', 'sales rep', 'outreach'],
  finance: ['business', 'legal', 'accounting', 'tax', 'invoice', 'contract'],
};

// Category → search keywords for category-based intent matching
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Presentations and Slides': ['presentation', 'slides', 'ppt', 'powerpoint', 'deck', 'pitch', 'keynote', 'slideshow', 'gamma', 'beautiful.ai', 'tome'],
  'Coding and Software Development': ['code', 'coding', 'programming', 'developer', 'software', 'ide', 'github', 'cursor'],
  'App and Website Builders': ['website', 'web app', 'app builder', 'landing page', 'no-code', 'build site'],
  'Image Generation': ['image', 'art', 'photo', 'illustration', 'midjourney', 'generate image', 'ai art', 'picture'],
  'Image Editing and Enhancement': ['edit photo', 'remove background', 'enhance', 'upscale', 'retouch', 'erase', 'photo editing'],
  'Video Generation': ['video generation', 'create video', 'ai video', 'text to video', 'runway', 'sora'],
  'Video Editing and Repurposing': ['edit video', 'clip', 'caption', 'shorts', 'repurpose video', 'capcut'],
  'Voice and Text to Speech': ['voice', 'tts', 'text to speech', 'speech synthesis', 'narration', 'voiceover', 'elevenlabs'],
  'Audio, Music, and Podcasting': ['music', 'audio', 'podcast', 'song', 'beat', 'sound', 'compose', 'suno'],
  'Writing and Copywriting': ['write', 'essay', 'copy', 'blog', 'article', 'draft', 'grammar', 'jasper', 'assignment'],
  'Research, Search, and Knowledge': ['research', 'search', 'knowledge', 'study', 'academic', 'perplexity'],
  'PDF and Document AI': ['pdf', 'document', 'summarize', 'extract text', 'doc', 'read pdf'],
  'Meetings, Notes, and Productivity': ['meeting', 'notes', 'productivity', 'todo', 'otter', 'notion', 'organize'],
  'Marketing, SEO, and Social Media': ['marketing', 'seo', 'social media', 'ads', 'campaign', 'email marketing'],
  'Sales and Customer Support': ['sales', 'crm', 'customer support', 'chat', 'lead', 'outreach'],
  'Automation and AI Agents': ['automation', 'workflow', 'agent', 'no-code', 'zapier', 'bot', 'automate'],
  'Data Science and Analytics': ['data', 'analytics', 'ml', 'machine learning', 'statistics', 'chart'],
  'Machine Learning Platforms and APIs': ['api', 'ml platform', 'model', 'openai api', 'llm'],
  'Open Source Models and Local AI': ['open source', 'local ai', 'ollama', 'llama', 'self-hosted'],
  'Design, UI, and Branding': ['design', 'ui', 'ux', 'logo', 'branding', 'figma', 'canva', 'graphic'],
  '3D, Architecture, and Games': ['3d', 'architecture', 'game', 'render', 'model', 'blender'],
  'Education and Learning': ['education', 'learning', 'tutor', 'study', 'course', 'quiz', 'student', 'homework'],
  'Recruitment, Resume, and Career': ['resume', 'cv', 'job', 'career', 'recruitment', 'linkedin', 'interview'],
  'Business, Legal, and Finance': ['business', 'legal', 'finance', 'accounting', 'tax', 'contract'],
  'General AI Assistants': ['chatgpt', 'claude', 'assistant', 'ai chat', 'gpt', 'gemini', 'general ai'],
};

let fuseInstance: Fuse<Tool> | null = null;

export function createSearchIndex(tools: Tool[]): Fuse<Tool> {
  fuseInstance = new Fuse(tools, {
    keys: [
      { name: 'name', weight: 3 },
      { name: 'why', weight: 2.5 },
      { name: 'category', weight: 2 },
      { name: 'access', weight: 0.5 },
      { name: 'freePlan', weight: 0.3 },
    ],
    threshold: 0.4,
    includeScore: true,
    useExtendedSearch: false,
    ignoreLocation: true,
    minMatchCharLength: 2,
  });
  return fuseInstance;
}

function expandQuery(query: string): string[] {
  const lower = query.toLowerCase().trim();
  const expanded = [lower];

  // Check task synonyms
  for (const [task, synonyms] of Object.entries(TASK_SYNONYMS)) {
    if (lower.includes(task) || synonyms.some(s => lower.includes(s))) {
      expanded.push(task, ...synonyms);
    }
  }

  // Check category keywords
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k) || k.includes(lower))) {
      expanded.push(category);
    }
  }

  return [...new Set(expanded)];
}

const searchResultsCache = new Map<string, Tool[]>();

export function searchTools(
  tools: Tool[],
  fuse: Fuse<Tool>,
  query: string,
  options: {
    access?: string;
    category?: string;
    sort?: SortOption;
    studentMode?: boolean;
    freePlanFilter?: FreePlanFilter;
  } = {}
): Tool[] {
  const cacheKey = `${query.trim().toLowerCase()}|${options.access ?? 'all'}|${options.category ?? 'all'}|${options.sort ?? 'default'}|${options.studentMode ? '1' : '0'}|${options.freePlanFilter ?? 'all'}`;

  if (searchResultsCache.has(cacheKey)) {
    return searchResultsCache.get(cacheKey)!;
  }

  let results: Tool[];

  if (!query.trim()) {
    results = [...tools];
  } else {
    const expandedTerms = expandQuery(query);

    // Search with each expanded term and merge results
    const scoreMap = new Map<number, number>();

    for (const term of expandedTerms) {
      const fuseResults = fuse.search(term);
      for (const r of fuseResults) {
        const existing = scoreMap.get(r.item.id) ?? 1;
        const newScore = Math.min(existing, r.score ?? 1);
        scoreMap.set(r.item.id, newScore);
      }
    }

    if (scoreMap.size === 0) {
      results = [];
    } else {
      results = tools
        .filter(t => scoreMap.has(t.id))
        .sort((a, b) => (scoreMap.get(a.id) ?? 1) - (scoreMap.get(b.id) ?? 1));
    }
  }

  // Apply student mode filter
  if (options.studentMode) {
    results = results.filter(t => t.access !== 'Paid');
  }

  // Apply access filter
  if (options.access && options.access !== 'all') {
    results = results.filter(t => t.access === options.access);
  }

  // Apply Free Plan Tier filter
  if (options.freePlanFilter && options.freePlanFilter !== 'all') {
    results = results.filter(t => filterByFreePlanStatus(t, options.freePlanFilter!));
  }

  // Apply category filter
  if (options.category && options.category !== 'all') {
    results = results.filter(t => normalizeSlug(t.category) === normalizeSlug(options.category));
  }

  // Apply sort
  if (options.sort === 'alphabetical') {
    results = [...results].sort((a, b) => a.name.localeCompare(b.name));
  } else if (options.sort === 'recently-added') {
    results = [...results].sort((a, b) => b.id - a.id);
  }

  searchResultsCache.set(cacheKey, results);
  return results;
}

export function rankResults(tools: Tool[], query: string): {
  bestOverall: Tool[];
  bestFree: Tool[];
  bestForStudents: Tool[];
  bestPremium: Tool[];
  mostPopular: Tool[];
  fastestToLearn: Tool[];
} {
  const topN = Math.min(8, tools.length);

  const bestFree = tools.filter(t => t.access === 'Free' || t.access === 'Open Source').slice(0, topN);
  const bestForStudents = tools.filter(t => t.access !== 'Paid').slice(0, topN);
  const bestPremium = tools.filter(t => t.access === 'Paid').slice(0, topN);

  // "Most popular" — use a fixed popularity list of well-known tools
  const popularNames = ['ChatGPT', 'Claude', 'Canva', 'GitHub Copilot', 'Midjourney', 'Runway', 'Gamma', 'Notion', 'Figma', 'Grammarly', 'Perplexity', 'Google Gemini', 'CapCut', 'Adobe Firefly', 'ElevenLabs'];
  const mostPopular = tools.filter(t => popularNames.includes(t.name)).slice(0, topN);

  // "Fastest to learn" — freemium tools with simple why descriptions (short)
  const fastestToLearn = tools
    .filter(t => t.access !== 'Paid')
    .sort((a, b) => a.why.length - b.why.length)
    .slice(0, topN);

  return {
    bestOverall: tools.slice(0, topN),
    bestFree,
    bestForStudents,
    bestPremium,
    mostPopular: mostPopular.length ? mostPopular : tools.slice(0, topN),
    fastestToLearn,
  };
}

export function getAutocompleteSuggestions(query: string): string[] {
  const suggestions = [
    'Create a PowerPoint', 'Generate Images', 'Build a Website', 'Write an Essay',
    'Edit PDF', 'Create Resume', 'Generate Video', 'Make Music', 'Code an App',
    'Remove Background', 'Translate Text', 'Design a Logo', 'Research a Topic',
    'Edit Videos', 'Create Podcast', 'Automate Tasks', 'Analyze Data',
    'Write Marketing Copy', 'Build Chatbot', 'Generate Voice',
  ];

  if (!query.trim()) return suggestions.slice(0, 8);
  const lower = query.toLowerCase();
  return suggestions.filter(s => s.toLowerCase().includes(lower)).slice(0, 6);
}
