export type AccessType = 'Free' | 'Freemium' | 'Paid' | 'Open Source';

export type FreePlanStatus = 'Generous' | 'Limited' | 'Strict' | 'Trial/Paid' | 'Open Source';
export type FreePlanBadgeColor = 'emerald' | 'amber' | 'rose' | 'slate';
export type FreePlanResetFreq = 'Daily' | 'Monthly' | 'One-time (Non-renewable)' | 'Per-request' | 'N/A';

export interface FreePlanDetails {
  status: FreePlanStatus;
  badgeColor: FreePlanBadgeColor;
  summary: string; // e.g., "400 one-time credits on sign-up"
  breakdown: {
    creditQuota?: string; // e.g., "400 one-time credits" or "125 credits total"
    resetFrequency?: FreePlanResetFreq;
    restrictions?: string; // e.g., "Watermark on exports", "Rate-limited during peak hours"
    requiresCreditCard: boolean;
  };
}

export type FreePlanFilter = 'all' | 'generous' | 'reset' | 'strict' | 'open-source';

export interface Tool {
  id: number;
  name: string;
  url: string;
  category: string;
  access: AccessType;
  freePlan: string;
  why: string;
  freePlanDetails?: FreePlanDetails;
}

export type SortOption = 'default' | 'alphabetical' | 'popularity' | 'recently-added';
export type FilterAccess = 'all' | AccessType;

export interface SearchState {
  query: string;
  filters: {
    access: FilterAccess;
    category: string;
    sort: SortOption;
    studentMode: boolean;
  };
}

export interface CompareItem {
  tool: Tool;
  addedAt: number;
}

export const CATEGORIES = [
  'General AI Assistants',
  'Coding and Software Development',
  'App and Website Builders',
  'Image Generation',
  'Image Editing and Enhancement',
  'Video Generation',
  'Video Editing and Repurposing',
  'Voice and Text to Speech',
  'Audio, Music, and Podcasting',
  'Writing and Copywriting',
  'Research, Search, and Knowledge',
  'PDF and Document AI',
  'Presentations and Slides',
  'Meetings, Notes, and Productivity',
  'Marketing, SEO, and Social Media',
  'Sales and Customer Support',
  'Automation and AI Agents',
  'Data Science and Analytics',
  'Machine Learning Platforms and APIs',
  'Open Source Models and Local AI',
  'Design, UI, and Branding',
  '3D, Architecture, and Games',
  'Education and Learning',
  'Recruitment, Resume, and Career',
  'Business, Legal, and Finance',
] as const;
