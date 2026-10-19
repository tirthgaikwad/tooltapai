import type { Tool, AccessType } from '@/types/tool';
import type {
  UserRequirements,
  ToolCandidate,
  RecommendationResponse,
  ToolEvidenceItem,
  BudgetConstraint,
} from '@/types/recommendation';
import {
  CAPABILITY_TAXONOMY,
  VERIFIED_TOOL_PROFILES,
  analyzeQuerySemantics,
  type ToolProfileRecord,
} from './capabilityTaxonomy';
import { getToolHardData } from './compareUtils';

/**
 * Normalizes tool name to match lookup keys
 */
export function normalizeToolKey(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

/**
 * PHASE THREE: EXTRACT USER REQUIREMENTS
 * Converts raw query into a structured requirement object.
 */
export function extractUserRequirements(
  rawQuery: string,
  overrides?: Partial<UserRequirements>
): UserRequirements {
  const semantics = analyzeQuerySemantics(rawQuery);

  const budget: BudgetConstraint = {
    type: overrides?.budget?.type || semantics.budgetType,
    currency: 'USD',
    billing_period: 'month',
    maximum_price: overrides?.budget?.maximum_price,
  };

  const hardConstraints: string[] = [];
  const softPreferences: string[] = [];

  if (semantics.isFreePlanMandatory || budget.type === 'free_only') {
    hardConstraints.push('free_plan_available');
  }

  // Mandatory capabilities vs soft preferences
  const requiredCapabilities = overrides?.required_capabilities || [];
  const preferredCapabilities = overrides?.preferred_capabilities || [];

  if (requiredCapabilities.length === 0 && semantics.matchedCapabilities.length > 0) {
    // The first detected capability is treated as mandatory primary task
    requiredCapabilities.push(semantics.matchedCapabilities[0]);
    hardConstraints.push(semantics.matchedCapabilities[0]);

    // Additional detected capabilities are treated as preferred/soft unless explicit
    for (let i = 1; i < semantics.matchedCapabilities.length; i++) {
      preferredCapabilities.push(semantics.matchedCapabilities[i]);
      softPreferences.push(semantics.matchedCapabilities[i]);
    }
  }

  if (semantics.skillLevel === 'beginner') {
    softPreferences.push('beginner_friendly');
  } else if (semantics.skillLevel === 'advanced') {
    softPreferences.push('advanced_features');
  }

  if (semantics.platforms.length > 0) {
    semantics.platforms.forEach((p) => hardConstraints.push(`platform_${p}`));
  }

  // Derive task name
  let task = 'General AI Assistance';
  if (requiredCapabilities.length > 0) {
    const capDef = CAPABILITY_TAXONOMY[requiredCapabilities[0]];
    if (capDef) {
      task = capDef.name;
    }
  } else if (semantics.suggestedCategory) {
    task = semantics.suggestedCategory;
  }

  return {
    raw_query: rawQuery,
    task,
    primary_category: semantics.suggestedCategory,
    required_capabilities: requiredCapabilities,
    preferred_capabilities: preferredCapabilities,
    budget,
    skill_level: semantics.skillLevel,
    platforms: semantics.platforms,
    required_integrations: overrides?.required_integrations || [],
    excluded_tool_names: semantics.excludedTools,
    hard_constraints: hardConstraints,
    soft_preferences: softPreferences,
    ...overrides,
  };
}

/**
 * PHASE FIVE: CANDIDATE TOOL RETRIEVAL
 * Filters tools based on category, task relevance, keywords, and explicit exclusions.
 */
export function retrieveCandidates(tools: Tool[], requirements: UserRequirements): Tool[] {
  const queryLower = requirements.raw_query.toLowerCase().trim();
  const excludedSet = new Set(requirements.excluded_tool_names.map((e) => e.toLowerCase().trim()));

  const candidates: { tool: Tool; matchScore: number }[] = [];

  for (const tool of tools) {
    const toolNameLower = tool.name.toLowerCase().trim();

    // 1. Explicit Exclusions (e.g., "Find an alternative to ChatGPT" -> exclude ChatGPT)
    let isExcluded = false;
    for (const ex of excludedSet) {
      if (toolNameLower === ex || toolNameLower.includes(ex) || ex.includes(toolNameLower)) {
        isExcluded = true;
        break;
      }
    }
    if (isExcluded) continue;

    let matchScore = 0;
    const toolCat = tool.category.toLowerCase();
    const toolWhy = (tool.why || '').toLowerCase();
    const toolDesc = (tool.description || '').toLowerCase();
    const combinedText = `${toolNameLower} ${toolCat} ${toolWhy} ${toolDesc}`;

    // 2. Category matching
    if (requirements.primary_category && tool.category.toLowerCase() === requirements.primary_category.toLowerCase()) {
      matchScore += 40;
    }

    // 3. Capability keyword matching
    for (const capKey of requirements.required_capabilities) {
      const capDef = CAPABILITY_TAXONOMY[capKey];
      if (capDef) {
        if (tool.category.toLowerCase() === capDef.category.toLowerCase()) {
          matchScore += 30;
        }
        for (const kw of capDef.keywords) {
          if (combinedText.includes(kw.toLowerCase())) {
            matchScore += 15;
            break;
          }
        }
      }
    }

    // 4. Preferred capability matching
    for (const capKey of requirements.preferred_capabilities) {
      const capDef = CAPABILITY_TAXONOMY[capKey];
      if (capDef) {
        for (const kw of capDef.keywords) {
          if (combinedText.includes(kw.toLowerCase())) {
            matchScore += 8;
            break;
          }
        }
      }
    }

    // 5. Query token overlap (ignoring generic stop words)
    const stopWords = new Set(['i', 'need', 'an', 'a', 'ai', 'tool', 'tools', 'for', 'the', 'best', 'with', 'and', 'or', 'to', 'of', 'in', 'is']);
    const queryTokens = queryLower.split(/\s+/).filter((t) => t.length > 2 && !stopWords.has(t));

    for (const token of queryTokens) {
      if (toolNameLower.includes(token)) matchScore += 20;
      if (toolCat.includes(token)) matchScore += 12;
      if (toolWhy.includes(token)) matchScore += 6;
    }

    // Check verified profiles for extra match signals
    const toolKey = normalizeToolKey(tool.name);
    const profile = VERIFIED_TOOL_PROFILES[toolKey];
    if (profile) {
      for (const cap of requirements.required_capabilities) {
        if (profile.supported_capabilities.includes(cap)) {
          matchScore += 35;
        }
      }
    }

    if (matchScore > 10) {
      candidates.push({ tool, matchScore });
    }
  }

  // Sort candidate pool by preliminary retrieval match score
  candidates.sort((a, b) => b.matchScore - a.matchScore);

  // Return top candidates (bounded to 40 for quality & speed)
  return candidates.slice(0, 40).map((c) => c.tool);
}

/**
 * PHASE FIVE & SIX: HARD CONSTRAINT FILTERING & EVALUATION
 */
export function evaluateToolConstraints(
  tool: Tool,
  requirements: UserRequirements
): {
  passes: boolean;
  constraint_status: 'satisfied' | 'failed' | 'requires_verification';
  unmet_requirements: string[];
  matched_requirements: string[];
  unknown_requirements: string[];
  evidence: ToolEvidenceItem[];
  profile?: ToolProfileRecord;
} {
  const toolKey = normalizeToolKey(tool.name);
  const profile = VERIFIED_TOOL_PROFILES[toolKey];
  const hardData = getToolHardData(tool);

  const unmet: string[] = [];
  const matched: string[] = [];
  const unknown: string[] = [];
  const evidence: ToolEvidenceItem[] = [];

  let passes = true;

  // 1. Check Hard Constraint: Free Plan Availability
  if (
    requirements.budget.type === 'free_only' ||
    requirements.hard_constraints.includes('free_plan_available')
  ) {
    if (profile) {
      if (profile.verified_free_plan && profile.free_plan_type !== 'none') {
        matched.push('Verified Free Plan Available');
        evidence.push({
          field: 'freePlan',
          claim: `Verified Free Tier: ${profile.free_plan_limitations}`,
          source: 'pricing_tier',
          verified: true,
        });
      } else {
        passes = false;
        unmet.push('Free plan required (tool requires paid subscription)');
        evidence.push({
          field: 'access',
          claim: `Paid only: ${profile.free_plan_limitations || 'No permanent free tier'}`,
          source: 'pricing_tier',
          verified: true,
        });
      }
    } else {
      // Use database fields
      if (tool.access === 'Paid' && !tool.hasFreeTier && !tool.freeTier) {
        passes = false;
        unmet.push('Free plan required (tool marked as Paid with no free tier)');
        evidence.push({
          field: 'access',
          claim: 'Database marks access as Paid with no free tier',
          source: 'database_record',
          verified: true,
        });
      } else if (tool.access === 'Free' || tool.access === 'Open Source') {
        matched.push('100% Free / Open Source');
        evidence.push({
          field: 'access',
          claim: `Access type is ${tool.access}`,
          source: 'database_record',
          verified: true,
        });
      } else if (tool.access === 'Freemium') {
        matched.push('Freemium Free Plan Available');
        evidence.push({
          field: 'freePlan',
          claim: tool.freePlan || 'Freemium tier available',
          source: 'database_record',
          verified: false,
        });
      } else {
        unknown.push('Free plan tier verification pending');
      }
    }
  }

  // 2. Check Hard Constraint: Mandatory Capabilities
  for (const capKey of requirements.required_capabilities) {
    const capDef = CAPABILITY_TAXONOMY[capKey];
    if (!capDef) {
      // Capability is unknown or not supported by any tool in the database
      passes = false;
      unmet.push(`Mandatory capability '${capKey}' is unsupported by available AI tools`);
      continue;
    }

    if (profile) {
      if (profile.supported_capabilities.includes(capKey)) {
        matched.push(`Supports ${capDef.name}`);
        evidence.push({
          field: 'supported_capabilities',
          claim: `Verified support for ${capDef.name}`,
          source: 'hard_benchmark',
          verified: true,
        });
      } else if (profile.unsupported_capabilities.includes(capKey)) {
        passes = false;
        unmet.push(`Does not support mandatory capability: ${capDef.name}`);
        evidence.push({
          field: 'unsupported_capabilities',
          claim: `Confirmed non-support for ${capDef.name}`,
          source: 'hard_benchmark',
          verified: true,
        });
      } else {
        // Unknown in profile, check category
        if (tool.category.toLowerCase() === capDef.category.toLowerCase()) {
          matched.push(`Belongs to ${capDef.category}`);
        } else {
          unknown.push(`Capability ${capDef.name} not explicitly verified`);
        }
      }
    } else {
      // General database tools
      const toolText = `${tool.name} ${tool.category} ${tool.why} ${tool.freePlan || ''}`.toLowerCase();
      const hasKeyword = capDef.keywords.some((kw) => toolText.includes(kw.toLowerCase()));
      const matchesCategory = tool.category.toLowerCase() === capDef.category.toLowerCase();

      if (matchesCategory || hasKeyword) {
        matched.push(`Supports ${capDef.name} (via ${tool.category})`);
        evidence.push({
          field: 'category',
          claim: `Categorized under ${tool.category}`,
          source: 'category_index',
          verified: true,
        });
      } else {
        passes = false;
        unmet.push(`Lacks required task alignment for ${capDef.name}`);
      }
    }
  }

  // 3. Platform Constraint (e.g., 'web')
  if (requirements.platforms.includes('web')) {
    if (profile && !profile.platforms.includes('web')) {
      passes = false;
      unmet.push('Web browser access required (desktop-only)');
    } else {
      matched.push('Web browser supported');
    }
  }

  const constraint_status = passes
    ? unknown.length > 0 && matched.length === 0
      ? 'requires_verification'
      : 'satisfied'
    : 'failed';

  return {
    passes,
    constraint_status,
    unmet_requirements: unmet,
    matched_requirements: matched,
    unknown_requirements: unknown,
    evidence,
    profile,
  };
}

/**
 * PHASE SIX: WEIGHTED EXPLAINABLE SCORING MODEL
 * Formula:
 * - Required capability coverage: 35%
 * - Primary task suitability: 25%
 * - Preferred feature coverage: 15%
 * - Budget & value suitability: 10%
 * - Platform & integration compatibility: 10%
 * - Ease of use & skill level match: 5%
 */
export function calculateToolSuitability(
  tool: Tool,
  requirements: UserRequirements,
  constraintEval: ReturnType<typeof evaluateToolConstraints>
): {
  suitabilityScore: number;
  evidenceCoverage: number;
  confidence: 'high' | 'medium' | 'low';
  advantages: string[];
  limitations: string[];
  pricingSummary: string;
  freeTierStatus: string;
  keyMetrics: ToolCandidate['key_metrics'];
} {
  const { profile } = constraintEval;
  const hardData = getToolHardData(tool);

  let reqCapScore = 0;
  let taskSuitabilityScore = 0;
  let prefCapScore = 0;
  let budgetScore = 0;
  let platformScore = 0;
  let easeOfUseScore = 0;

  let evidencePoints = 0;
  const maxEvidencePoints = 5;

  const advantages: string[] = [];
  const limitations: string[] = [];

  // 1. Required capability coverage (35%)
  if (requirements.required_capabilities.length > 0) {
    let matchedCount = 0;
    requirements.required_capabilities.forEach((cap) => {
      if (constraintEval.matched_requirements.some((m) => m.toLowerCase().includes(cap.toLowerCase()))) {
        matchedCount++;
      }
    });
    reqCapScore = (matchedCount / requirements.required_capabilities.length) * 35;
  } else {
    reqCapScore = 35;
  }

  // 2. Primary task suitability (25%)
  if (requirements.primary_category && tool.category.toLowerCase() === requirements.primary_category.toLowerCase()) {
    taskSuitabilityScore = 25;
    evidencePoints += 1;
    advantages.push(`Native specialized platform for ${tool.category}`);
  } else if (tool.why && requirements.task && tool.why.toLowerCase().includes(requirements.task.toLowerCase())) {
    taskSuitabilityScore = 20;
    evidencePoints += 1;
  } else {
    taskSuitabilityScore = 15;
  }

  // 3. Preferred feature coverage (15%)
  if (requirements.preferred_capabilities.length > 0) {
    let prefMatched = 0;
    for (const cap of requirements.preferred_capabilities) {
      const capDef = CAPABILITY_TAXONOMY[cap];
      const hasCap = profile
        ? profile.supported_capabilities.includes(cap)
        : capDef?.keywords.some((kw) => (tool.why || '').toLowerCase().includes(kw));

      if (hasCap) {
        prefMatched++;
        advantages.push(`Supports ${capDef?.name || cap}`);
      }
    }
    prefCapScore = (prefMatched / requirements.preferred_capabilities.length) * 15;
  } else {
    prefCapScore = 15;
  }

  // 4. Budget & value suitability (10%)
  if (tool.access === 'Free' || tool.access === 'Open Source') {
    budgetScore = 10;
    evidencePoints += 1;
    advantages.push('100% Free / Open Source with no paywalls');
  } else if (profile?.free_plan_type === 'generous_recurring') {
    budgetScore = 9;
    evidencePoints += 1;
    advantages.push(`Generous recurring free tier: ${profile.free_plan_limitations}`);
  } else if (tool.access === 'Freemium') {
    budgetScore = 7.5;
    evidencePoints += 1;
  } else {
    budgetScore = 4;
  }

  // 5. Platform & integration compatibility (10%)
  const userPlatforms = requirements.platforms.length > 0 ? requirements.platforms : ['web'];
  const toolPlatforms = profile?.platforms || hardData.platforms || ['web'];
  const platformOverlap = userPlatforms.filter((p) => toolPlatforms.includes(p));
  platformScore = (platformOverlap.length / userPlatforms.length) * 10;
  if (profile) evidencePoints += 1;

  // 6. Ease of use & skill level match (5%)
  if (requirements.skill_level === 'beginner') {
    if (profile?.skill_level === 'beginner') {
      easeOfUseScore = 5;
      advantages.push('Intuitive interface suitable for beginners');
    } else {
      easeOfUseScore = 3.5;
    }
  } else if (requirements.skill_level === 'advanced') {
    if (profile?.skill_level === 'advanced' || profile?.skill_level === 'intermediate') {
      easeOfUseScore = 5;
      advantages.push('Advanced developer controls & robust configurations');
    } else {
      easeOfUseScore = 4;
    }
  } else {
    easeOfUseScore = 4.5;
  }

  if (profile) {
    evidencePoints += 1;
    advantages.push(...profile.key_advantages);
    limitations.push(...profile.key_limitations);
  } else {
    if (tool.access === 'Paid') {
      limitations.push('Requires paid subscription for continuous usage');
    } else if (tool.access === 'Freemium') {
      limitations.push(tool.freePlan || 'Free tier subject to rate limits');
    }
  }

  const rawSuitability = reqCapScore + taskSuitabilityScore + prefCapScore + budgetScore + platformScore + easeOfUseScore;
  const suitabilityScore = Math.min(100, Math.max(0, Math.round(rawSuitability)));
  const evidenceCoverage = Math.round((evidencePoints / maxEvidencePoints) * 100);

  const confidence: 'high' | 'medium' | 'low' =
    evidenceCoverage >= 75 ? 'high' : evidenceCoverage >= 40 ? 'medium' : 'low';

  // Deduplicate advantages & limitations
  const uniqueAdvantages = Array.from(new Set(advantages)).slice(0, 4);
  const uniqueLimitations = Array.from(new Set(limitations)).slice(0, 3);

  const pricingSummary = profile
    ? profile.starting_price === 0
      ? '100% Free / Open Source'
      : `$${profile.starting_price}/mo (${profile.verified_free_plan ? 'Free tier available' : 'Paid only'})`
    : tool.access === 'Free'
    ? '$0 / Free'
    : tool.startingPrice
    ? `$${tool.startingPrice}/mo`
    : tool.access;

  const freeTierStatus = profile
    ? profile.free_plan_limitations
    : tool.freePlan || (tool.access === 'Freemium' ? 'Freemium credits included' : tool.access);

  return {
    suitabilityScore,
    evidenceCoverage,
    confidence,
    advantages: uniqueAdvantages,
    limitations: uniqueLimitations,
    pricingSummary,
    freeTierStatus,
    keyMetrics: {
      starting_price: profile ? profile.starting_price : tool.startingPrice ?? null,
      has_free_tier: profile ? profile.verified_free_plan : tool.access !== 'Paid',
      free_quota_level: profile ? profile.free_plan_type : (tool.freeQuotaLevel as string) || 'moderate',
      speed_score: hardData.speedTokensPerSec,
      quality_score: hardData.qualityBenchmarkScore,
      ease_of_use_score: hardData.easeOfUseRating,
      ecosystem_score: hardData.integrationsCount,
      platforms: toolPlatforms,
    },
  };
}

/**
 * PHASE SEVEN & EIGHT: RANKING & COMPARISON MATRIX PIPELINE
 */
export function rankAndRecommendTools(
  tools: Tool[],
  rawQuery: string,
  overrides?: Partial<UserRequirements>
): RecommendationResponse {
  const startTime = Date.now();
  const requirements = extractUserRequirements(rawQuery, overrides);
  const candidates = retrieveCandidates(tools, requirements);

  const evaluatedCandidates: ToolCandidate[] = [];
  const warnings: string[] = [];

  for (const tool of candidates) {
    const constraintEval = evaluateToolConstraints(tool, requirements);

    // If hard constraints failed, the tool does NOT qualify for ranking
    if (!constraintEval.passes) {
      continue;
    }

    const suitability = calculateToolSuitability(tool, requirements, constraintEval);

    evaluatedCandidates.push({
      tool_id: tool.id,
      name: tool.name,
      canonical_id: normalizeToolKey(tool.name),
      category: tool.category,
      access: tool.access,
      official_website: tool.url,
      description: tool.description || tool.why || '',
      rank: 0,
      suitability_score: suitability.suitabilityScore,
      evidence_coverage: suitability.evidenceCoverage,
      confidence: suitability.confidence,
      constraint_status: constraintEval.constraint_status,
      matched_requirements: constraintEval.matched_requirements,
      unmet_requirements: constraintEval.unmet_requirements,
      unknown_requirements: constraintEval.unknown_requirements,
      advantages: suitability.advantages,
      limitations: suitability.limitations,
      evidence: constraintEval.evidence,
      pricing_summary: suitability.pricingSummary,
      free_tier_status: suitability.freeTierStatus,
      key_metrics: suitability.keyMetrics,
    });
  }

  // Deterministic sorting: Highest suitability score first, tie-break by evidence coverage then ID
  evaluatedCandidates.sort((a, b) => {
    if (b.suitability_score !== a.suitability_score) {
      return b.suitability_score - a.suitability_score;
    }
    if (b.evidence_coverage !== a.evidence_coverage) {
      return b.evidence_coverage - a.evidence_coverage;
    }
    return a.tool_id - b.tool_id;
  });

  // Assign ranks
  evaluatedCandidates.forEach((c, idx) => {
    c.rank = idx + 1;
  });

  const topResults = evaluatedCandidates.slice(0, 5);
  const bestMatch = topResults.length > 0 ? topResults[0] : null;

  let no_match_reason: string | undefined;
  if (!bestMatch) {
    if (requirements.budget.type === 'free_only') {
      no_match_reason = `No verified match found that satisfies 100% free access for "${requirements.task}". Most high-performance tools in this category operate on paid or restricted trial models.`;
    } else {
      no_match_reason = `No verified tools in our directory currently satisfy all mandatory constraints specified for "${rawQuery}".`;
    }
  }

  // Identify specialized alternatives
  let best_free: ToolCandidate | null = null;
  let best_for_beginners: ToolCandidate | null = null;
  let best_value: ToolCandidate | null = null;

  for (const c of topResults) {
    if (!best_free && (c.access === 'Free' || c.access === 'Open Source' || c.key_metrics.free_quota_level === 'generous_recurring')) {
      best_free = c;
    }
    if (!best_for_beginners && c.advantages.some((a) => a.toLowerCase().includes('beginner'))) {
      best_for_beginners = c;
    }
    if (!best_value && c.rank > 1 && (c.key_metrics.starting_price ?? 999) <= 15) {
      best_value = c;
    }
  }

  // Build Side-by-Side Comparison Matrix for Top 3 Candidates
  const matrixTools = topResults.slice(0, 3);
  const comparisonCriteria = [
    'Primary Task Alignment',
    'Free Plan & Quota',
    'Starting Price',
    'Platforms Supported',
    'Primary Strength',
    'Key Limitation',
  ];

  const comparison_matrix = {
    criteria: comparisonCriteria,
    tools: matrixTools.map((t) => ({
      tool_id: t.tool_id,
      name: t.name,
      values: {
        'Primary Task Alignment': `${t.category} (${t.suitability_score}% fit)`,
        'Free Plan & Quota': t.free_tier_status,
        'Starting Price': t.pricing_summary,
        'Platforms Supported': t.key_metrics.platforms.join(', '),
        'Primary Strength': t.advantages[0] || 'High benchmark reliability',
        'Key Limitation': t.limitations[0] || 'Requires account registration',
      },
    })),
  };

  // Generate grounded trade-off summary
  let tradeoffs_summary = '';
  if (topResults.length >= 2) {
    const first = topResults[0];
    const second = topResults[1];
    tradeoffs_summary = `${first.name} ranks #1 for ${requirements.task} with ${first.suitability_score}% suitability due to ${first.advantages[0] || 'superior capability fit'}. However, if you prefer ${second.advantages[0] || 'an alternative workflow'}, ${second.name} offers a strong alternative with ${second.pricing_summary}.`;
  } else if (bestMatch) {
    tradeoffs_summary = `${bestMatch.name} is the top verified choice for "${rawQuery}" satisfying all mandatory requirements.`;
  } else {
    tradeoffs_summary = no_match_reason || 'No qualifying tools evaluated.';
  }

  const latency_ms = Date.now() - startTime;

  return {
    query: rawQuery,
    requirements,
    candidates_evaluated_count: candidates.length,
    eligible_candidates_count: evaluatedCandidates.length,
    results: topResults,
    best_match: bestMatch,
    no_match_reason,
    alternatives: {
      best_free,
      best_for_beginners,
      best_value,
    },
    comparison_matrix,
    tradeoffs_summary,
    explanation: tradeoffs_summary,
    warnings,
    latency_ms,
  };
}
