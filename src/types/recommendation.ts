import type { AccessType } from './tool';

export interface BudgetConstraint {
  type: 'free_only' | 'freemium' | 'paid' | 'any';
  maximum_price?: number;
  currency: 'USD';
  billing_period: 'month' | 'year' | 'one-time';
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'any';

export type PlatformTarget = 'web' | 'windows' | 'mac' | 'linux' | 'ios' | 'android';

export interface UserRequirements {
  raw_query: string;
  task: string;
  primary_category?: string;
  required_capabilities: string[];
  preferred_capabilities: string[];
  budget: BudgetConstraint;
  skill_level: SkillLevel;
  platforms: PlatformTarget[];
  required_integrations: string[];
  excluded_tool_names: string[];
  target_tool_names?: string[];
  hard_constraints: string[];
  soft_preferences: string[];
}

export interface ToolEvidenceItem {
  field: string;
  claim: string;
  source: 'database_record' | 'hard_benchmark' | 'pricing_tier' | 'category_index';
  verified: boolean;
}

export interface ToolCandidate {
  tool_id: number;
  name: string;
  canonical_id: string;
  category: string;
  access: AccessType;
  official_website: string;
  description: string;
  rank: number;
  suitability_score: number; // 0 to 100
  evidence_coverage: number; // 0 to 100%
  confidence: 'high' | 'medium' | 'low';
  constraint_status: 'satisfied' | 'failed' | 'requires_verification';
  matched_requirements: string[];
  unmet_requirements: string[];
  unknown_requirements: string[];
  advantages: string[];
  limitations: string[];
  evidence: ToolEvidenceItem[];
  pricing_summary: string;
  free_tier_status: string;
  key_metrics: {
    starting_price: number | null;
    has_free_tier: boolean;
    free_quota_level: string;
    speed_score?: number;
    quality_score?: number;
    ease_of_use_score?: number;
    ecosystem_score?: number;
    platforms: string[];
  };
}

export interface RecommendationResponse {
  query: string;
  requirements: UserRequirements;
  candidates_evaluated_count: number;
  eligible_candidates_count: number;
  results: ToolCandidate[];
  best_match: ToolCandidate | null;
  no_match_reason?: string;
  alternatives: {
    best_free?: ToolCandidate | null;
    best_for_beginners?: ToolCandidate | null;
    best_value?: ToolCandidate | null;
  };
  comparison_matrix: {
    criteria: string[];
    tools: Array<{
      tool_id: number;
      name: string;
      values: Record<string, string>;
    }>;
  };
  tradeoffs_summary: string;
  explanation: string;
  warnings: string[];
  latency_ms: number;
}
