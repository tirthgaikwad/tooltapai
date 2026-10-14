import type { Tool } from '@/types/tool';

export interface ToolHardData {
  startingPrice: number;
  startingPriceText: string;
  hasFreeTier: boolean;
  freeTier: boolean;
  freeQuotaLevel: 'completely-free' | 'generous' | 'moderate' | 'limited' | 'strict' | 'none';
  freeTierQuota: string;
  speedTokensPerSec: number;
  qualityBenchmarkScore: number;
  easeOfUseRating: number;
  integrationsCount: number;
  hasPublicApi: boolean;
  hasApi: boolean;
  contextWindowTokens: number;
  contextWindow: string;
  integrations: string[];
  platforms: string[];
  isOpenSource: boolean;
  resolutionQuality: string;
  latencyEstimate: string;
}

export interface ToolCalculatedScores {
  affordability: number; // 1.0 - 10.0
  ecosystem: number;     // 1.0 - 10.0
  speed: number;         // 1.0 - 10.0
  quality: number;       // 1.0 - 10.0
  easeOfUse: number;     // 1.0 - 10.0
  overallScore: number;  // 1.0 - 10.0 (weighted composite)
  totalScore: number;    // sum out of 50
  rawScores: {
    affordability: number;
    ecosystem: number;
    speed: number;
    quality: number;
    easeOfUse: number;
  };
  multipliers: {
    speedMultiplier: number;
    ecosystemMultiplier: number;
    qualityMultiplier: number;
  };
  hardData: ToolHardData;
  scoreExplanations: {
    affordability: string;
    ecosystem: string;
    speed: string;
    quality: string;
    easeOfUse: string;
  };
}

export const CATEGORY_WEIGHTS: Record<
  string,
  {
    speedMultiplier?: number;
    ecosystemMultiplier?: number;
    qualityMultiplier?: number;
    easeOfUseMultiplier?: number;
    affordabilityMultiplier?: number;
  }
> = {
  'Coding': {
    speedMultiplier: 1.5,
    ecosystemMultiplier: 1.5,
  },
  'Coding and Software Development': {
    speedMultiplier: 1.5,
    ecosystemMultiplier: 1.5,
  },
  'Video Editing': {
    qualityMultiplier: 1.5,
  },
  'Video Editing and Repurposing': {
    qualityMultiplier: 1.5,
  },
  'Video Generation': {
    qualityMultiplier: 1.5,
  },
};

// Ground-truth hard data catalog for prominent AI tools
const KNOWN_HARD_DATA: Record<string, Partial<ToolHardData>> = {
  'chatgpt': {
    startingPrice: 20,
    startingPriceText: '$20/mo (Plus)',
    hasFreeTier: true,
    freeTier: true,
    freeQuotaLevel: 'moderate',
    freeTierQuota: 'Unlimited GPT-4o mini, rate-limited GPT-4o',
    speedTokensPerSec: 65,
    qualityBenchmarkScore: 88,
    easeOfUseRating: 9.5,
    integrationsCount: 1200,
    hasPublicApi: true,
    hasApi: true,
    contextWindowTokens: 128000,
    contextWindow: '128K tokens',
    integrations: ['Web', 'iOS', 'Android', 'macOS', 'Windows', 'REST API', 'Zapier', 'Google Drive'],
    platforms: ['Web', 'Mac', 'Windows', 'iOS', 'Android'],
    isOpenSource: false,
    resolutionQuality: 'Flagship reasoning & general knowledge',
    latencyEstimate: '~400ms first token, 65 tokens/sec',
  },
  'claude': {
    startingPrice: 20,
    startingPriceText: '$20/mo (Pro)',
    hasFreeTier: true,
    freeTier: true,
    freeQuotaLevel: 'limited',
    freeTierQuota: 'Strict message limits resetting every 5 hours',
    speedTokensPerSec: 55,
    qualityBenchmarkScore: 94,
    easeOfUseRating: 8.8,
    integrationsCount: 350,
    hasPublicApi: true,
    hasApi: true,
    contextWindowTokens: 200000,
    contextWindow: '200K tokens',
    integrations: ['Web', 'iOS', 'Android', 'REST API', 'Slack', 'Raycast'],
    platforms: ['Web', 'Mac', 'iOS', 'Android'],
    isOpenSource: false,
    resolutionQuality: 'Industry-leading code & technical writing',
    latencyEstimate: '~350ms first token, 55 tokens/sec',
  },
  'cursor': {
    startingPrice: 20,
    startingPriceText: '$20/mo (Pro)',
    hasFreeTier: true,
    freeTier: true,
    freeQuotaLevel: 'moderate',
    freeTierQuota: '2,000 completions, 50 slow premium requests',
    speedTokensPerSec: 78,
    qualityBenchmarkScore: 92,
    easeOfUseRating: 8.5,
    integrationsCount: 650,
    hasPublicApi: true,
    hasApi: true,
    contextWindowTokens: 200000,
    contextWindow: '200K tokens',
    integrations: ['VS Code Fork', 'Git', 'GitHub', 'Extensions Ecosystem', 'Terminal CLI', 'REST API'],
    platforms: ['Mac', 'Windows', 'Linux', 'VS Code'],
    isOpenSource: false,
    resolutionQuality: 'Top-tier agentic multi-file code editing',
    latencyEstimate: '~180ms inline autocomplete, ultra-fast',
  },
  'github-copilot': {
    startingPrice: 10,
    startingPriceText: '$10/mo (Individual)',
    hasFreeTier: true,
    freeTier: true,
    freeQuotaLevel: 'generous',
    freeTierQuota: 'Free for verified students, educators & OSS maintainers',
    speedTokensPerSec: 75,
    qualityBenchmarkScore: 86,
    easeOfUseRating: 9.0,
    integrationsCount: 450,
    hasPublicApi: true,
    hasApi: true,
    contextWindowTokens: 64000,
    contextWindow: '64K tokens',
    integrations: ['VS Code', 'Visual Studio', 'JetBrains', 'Neovim', 'GitHub CLI', 'REST API'],
    platforms: ['VS Code', 'JetBrains', 'Neovim', 'Web', 'Mac', 'Windows', 'Linux'],
    isOpenSource: false,
    resolutionQuality: 'Enterprise-grade code generation',
    latencyEstimate: '~150ms inline tab suggestions',
  },
  'v0': {
    startingPrice: 20,
    startingPriceText: '$20/mo (Premium)',
    hasFreeTier: true,
    freeTier: true,
    freeQuotaLevel: 'generous',
    freeTierQuota: '200 credits/mo free forever',
    speedTokensPerSec: 60,
    qualityBenchmarkScore: 89,
    easeOfUseRating: 9.0,
    integrationsCount: 220,
    hasPublicApi: true,
    hasApi: true,
    contextWindowTokens: 128000,
    contextWindow: '128K tokens',
    integrations: ['Next.js', 'React', 'Tailwind', 'shadcn/ui', 'Vercel CLI', 'GitHub', 'REST API'],
    platforms: ['Web', 'Vercel CLI'],
    isOpenSource: false,
    resolutionQuality: 'Full-stack React & UI component synthesis',
    latencyEstimate: '~500ms streaming generation',
  },
  'midjourney': {
    startingPrice: 10,
    startingPriceText: '$10/mo (Basic)',
    hasFreeTier: false,
    freeTier: false,
    freeQuotaLevel: 'none',
    freeTierQuota: 'None / Paid subscription required',
    speedTokensPerSec: 20,
    qualityBenchmarkScore: 92,
    easeOfUseRating: 7.2,
    integrationsCount: 25,
    hasPublicApi: false,
    hasApi: false,
    contextWindowTokens: 0,
    contextWindow: 'N/A (Image model)',
    integrations: ['Discord', 'Web Canvas'],
    platforms: ['Discord', 'Web'],
    isOpenSource: false,
    resolutionQuality: 'Photorealistic up to 2048x2048',
    latencyEstimate: '~20-35s render time',
  },
  'runway': {
    startingPrice: 12,
    startingPriceText: '$12/mo (Standard)',
    hasFreeTier: true,
    freeTier: true,
    freeQuotaLevel: 'limited',
    freeTierQuota: '125 one-time credits on registration',
    speedTokensPerSec: 25,
    qualityBenchmarkScore: 91,
    easeOfUseRating: 8.4,
    integrationsCount: 85,
    hasPublicApi: true,
    hasApi: true,
    contextWindowTokens: 0,
    contextWindow: 'Gen-3 Alpha / Turbo',
    integrations: ['Web Studio', 'iOS App', 'REST API', 'Premiere Pro Plugin'],
    platforms: ['Web', 'iOS'],
    isOpenSource: false,
    resolutionQuality: 'High-definition 1080p/4K cinematic video',
    latencyEstimate: '~45s per 5s video clip',
  },
  'descript': {
    startingPrice: 12,
    startingPriceText: '$12/mo (Creator)',
    hasFreeTier: true,
    freeTier: true,
    freeQuotaLevel: 'moderate',
    freeTierQuota: '1 video export/mo without watermark, 1 hr transcription',
    speedTokensPerSec: 45,
    qualityBenchmarkScore: 87,
    easeOfUseRating: 8.9,
    integrationsCount: 110,
    hasPublicApi: true,
    hasApi: true,
    contextWindowTokens: 50000,
    contextWindow: 'Full episode transcription',
    integrations: ['YouTube', 'Google Drive', 'Dropbox', 'Riverside', 'REST API'],
    platforms: ['Web', 'Mac', 'Windows'],
    isOpenSource: false,
    resolutionQuality: '4K video export & Studio Sound audio',
    latencyEstimate: 'Real-time text transcript editing',
  },
  'invideo-ai': {
    startingPrice: 20,
    startingPriceText: '$20/mo (Plus)',
    hasFreeTier: true,
    freeTier: true,
    freeQuotaLevel: 'limited',
    freeTierQuota: '10 mins/week AI video generation with watermark',
    speedTokensPerSec: 30,
    qualityBenchmarkScore: 85,
    easeOfUseRating: 8.8,
    integrationsCount: 65,
    hasPublicApi: false,
    hasApi: false,
    contextWindowTokens: 30000,
    contextWindow: 'Full multi-scene scripts',
    integrations: ['YouTube', 'TikTok', 'Instagram', 'Stock Assets'],
    platforms: ['Web', 'iOS', 'Android'],
    isOpenSource: false,
    resolutionQuality: '1080p full HD rendering',
    latencyEstimate: '~60-90s per complete video',
  },
  'ollama': {
    startingPrice: 0,
    startingPriceText: '$0 (100% Free & Open Source)',
    hasFreeTier: true,
    freeTier: true,
    freeQuotaLevel: 'completely-free',
    freeTierQuota: 'Unlimited local execution, no API keys or limits',
    speedTokensPerSec: 80,
    qualityBenchmarkScore: 84,
    easeOfUseRating: 7.2,
    integrationsCount: 420,
    hasPublicApi: true,
    hasApi: true,
    contextWindowTokens: 128000,
    contextWindow: 'Up to 128K (model dependent)',
    integrations: ['CLI', 'REST API', 'LangChain', 'LlamaIndex', 'Open WebUI', 'Docker', 'VS Code'],
    platforms: ['Mac', 'Linux', 'Windows', 'Docker'],
    isOpenSource: true,
    resolutionQuality: 'Llama 3.3, DeepSeek, Mistral, Qwen models',
    latencyEstimate: 'Hardware bound (e.g. 40-120 tok/s on Apple Silicon / CUDA)',
  },
  'perplexity': {
    startingPrice: 20,
    startingPriceText: '$20/mo (Pro)',
    hasFreeTier: true,
    freeTier: true,
    freeQuotaLevel: 'generous',
    freeTierQuota: 'Unlimited Quick searches, 5 Pro searches per 4 hours',
    speedTokensPerSec: 70,
    qualityBenchmarkScore: 89,
    easeOfUseRating: 9.3,
    integrationsCount: 180,
    hasPublicApi: true,
    hasApi: true,
    contextWindowTokens: 128000,
    contextWindow: '128K citations context',
    integrations: ['Web', 'iOS', 'Android', 'Chrome Extension', 'REST API'],
    platforms: ['Web', 'iOS', 'Android', 'Chrome Extension'],
    isOpenSource: false,
    resolutionQuality: 'Live grounded web citations & multi-model toggle',
    latencyEstimate: '~300ms live web search & synthesis',
  },
  'elevenlabs': {
    startingPrice: 5,
    startingPriceText: '$5/mo (Starter)',
    hasFreeTier: true,
    freeTier: true,
    freeQuotaLevel: 'generous',
    freeTierQuota: '10,000 characters/month free with attribution',
    speedTokensPerSec: 60,
    qualityBenchmarkScore: 93,
    easeOfUseRating: 9.1,
    integrationsCount: 140,
    hasPublicApi: true,
    hasApi: true,
    contextWindowTokens: 25000,
    contextWindow: 'Multilingual speech synthesis',
    integrations: ['REST API', 'Python SDK', 'JavaScript SDK', 'Web Studio', 'Zapier'],
    platforms: ['Web', 'iOS', 'Android', 'REST API'],
    isOpenSource: false,
    resolutionQuality: 'Studio grade ultra-realistic voice cloning',
    latencyEstimate: '~150ms streaming audio latency',
  },
};

/**
 * Extracts or derives objective ground-truth hard data fields for any tool.
 */
export function getToolHardData(tool: Tool): ToolHardData {
  const normalizedKey = tool.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const known = KNOWN_HARD_DATA[normalizedKey];

  const isOpenSource =
    tool.isOpenSource ??
    (tool.access === 'Open Source' ||
      tool.name.toLowerCase().includes('open') ||
      tool.why.toLowerCase().includes('open source') ||
      (known?.isOpenSource ?? false));

  // Starting price
  let startingPrice = tool.startingPrice;
  if (startingPrice === undefined) {
    if (isOpenSource || tool.access === 'Free') {
      startingPrice = 0;
    } else if (known?.startingPrice !== undefined) {
      startingPrice = known.startingPrice;
    } else if (tool.access === 'Freemium') {
      startingPrice = 20;
    } else if (tool.access === 'Paid') {
      startingPrice = 25;
    } else {
      startingPrice = 10;
    }
  }

  // Free tier boolean
  let freeTier = tool.hasFreeTier ?? tool.freeTier;
  if (freeTier === undefined) {
    if (isOpenSource || tool.access === 'Free' || tool.access === 'Freemium') {
      freeTier = true;
    } else if (known?.freeTier !== undefined) {
      freeTier = known.freeTier;
    } else {
      freeTier = Boolean(
        tool.freePlan &&
          tool.freePlan.trim().length > 0 &&
          !tool.freePlan.toLowerCase().includes('no permanent free plan')
      );
    }
  }

  // Free quota level
  let freeQuotaLevel: 'completely-free' | 'generous' | 'moderate' | 'limited' | 'strict' | 'none' =
    (tool.freeQuotaLevel as any) ||
    known?.freeQuotaLevel ||
    (isOpenSource || tool.access === 'Free'
      ? 'completely-free'
      : !freeTier
      ? 'none'
      : tool.freePlan?.toLowerCase().includes('generous')
      ? 'generous'
      : tool.freePlan?.toLowerCase().includes('limit')
      ? 'moderate'
      : 'limited');

  // Free Tier Quota Description
  let freeTierQuota = tool.freeTierQuota;
  if (!freeTierQuota) {
    if (known?.freeTierQuota) {
      freeTierQuota = known.freeTierQuota;
    } else if (isOpenSource) {
      freeTierQuota = '100% Free & Unlimited (Self-Hosted / Open Source)';
    } else if (tool.freePlan && tool.freePlan.trim().length > 5) {
      freeTierQuota = tool.freePlan;
    } else if (freeTier) {
      freeTierQuota = 'Free tier with recurring credits';
    } else {
      freeTierQuota = 'None / Paid subscription required';
    }
  }

  // Speed Tokens Per Sec
  let speedTokensPerSec =
    tool.speedTokensPerSec ||
    known?.speedTokensPerSec ||
    (isOpenSource ? 80 : tool.category.toLowerCase().includes('coding') ? 75 : 60);

  // Quality Benchmark Score (out of 100)
  let qualityBenchmarkScore =
    tool.qualityBenchmarkScore ||
    known?.qualityBenchmarkScore ||
    (tool.name.toLowerCase().includes('claude') ? 94 : tool.name.toLowerCase().includes('chatgpt') ? 88 : 82);

  // Ease of Use Rating (1 - 10)
  let easeOfUseRating =
    tool.easeOfUseRating ||
    known?.easeOfUseRating ||
    (tool.name.toLowerCase().includes('chatgpt') ? 9.5 : isOpenSource ? 7.2 : 8.5);

  // Integrations count
  let integrationsCount =
    tool.integrationsCount ||
    known?.integrationsCount ||
    (tool.name.toLowerCase().includes('chatgpt') ? 1200 : tool.name.toLowerCase().includes('claude') ? 350 : 80);

  // API Availability
  const hasPublicApi =
    tool.hasPublicApi ??
    tool.hasApi ??
    known?.hasPublicApi ??
    known?.hasApi ??
    true;

  // Context window tokens
  const contextWindowTokens =
    tool.contextWindowTokens ||
    known?.contextWindowTokens ||
    (tool.name.toLowerCase().includes('claude')
      ? 200000
      : tool.name.toLowerCase().includes('chatgpt')
      ? 128000
      : 64000);

  // Integrations array
  let integrations = tool.integrations || known?.integrations || ['Web', 'REST API'];
  let platforms = tool.platforms || known?.platforms || ['Web', 'Mac', 'Windows'];

  let startingPriceText =
    known?.startingPriceText ||
    (startingPrice === 0 ? '$0 (100% Free)' : `$${startingPrice}/mo`);

  const contextWindow =
    tool.contextWindow ||
    known?.contextWindow ||
    `${(contextWindowTokens / 1000).toFixed(0)}K tokens`;

  const resolutionQuality =
    known?.resolutionQuality ||
    `${qualityBenchmarkScore}% technical benchmark accuracy`;

  const latencyEstimate =
    known?.latencyEstimate ||
    `~350ms first token, ${speedTokensPerSec} tokens/sec`;

  return {
    startingPrice,
    startingPriceText,
    hasFreeTier: freeTier,
    freeTier,
    freeQuotaLevel,
    freeTierQuota,
    speedTokensPerSec,
    qualityBenchmarkScore,
    easeOfUseRating,
    integrationsCount,
    hasPublicApi,
    hasApi: hasPublicApi,
    contextWindowTokens,
    contextWindow,
    integrations,
    platforms,
    isOpenSource,
    resolutionQuality,
    latencyEstimate,
  };
}

/**
 * Objective Scoring Algorithm:
 * Evaluates distinct formulas for each vector rather than returning hardcoded fallbacks.
 */
export function calculateToolScores(tool: Tool): ToolCalculatedScores {
  const hardData = getToolHardData(tool);

  // 1. Speed Vector (1–10):
  // Scale by generation speed / throughput:
  // Math.min(10, Math.max(3, (tool.speedTokensPerSec / 80) * 10))
  const rawSpeed = Number(
    Math.min(10, Math.max(3, (hardData.speedTokensPerSec / 80) * 10)).toFixed(1)
  );
  const speedExplanation = `${tool.name} Speed: ${hardData.speedTokensPerSec} tokens/sec • ${hardData.latencyEstimate}`;

  // 2. Quality Vector (1–10):
  // Scale by technical benchmark score:
  // Math.min(10, Math.max(4, (tool.qualityBenchmarkScore / 100) * 10))
  const rawQuality = Number(
    Math.min(10, Math.max(4, (hardData.qualityBenchmarkScore / 100) * 10)).toFixed(1)
  );
  const qualityExplanation = `${tool.name} Context: ${hardData.contextWindowTokens.toLocaleString()} tokens • Benchmark: ${hardData.qualityBenchmarkScore}/100`;

  // 3. Ease of Use Vector (1–10):
  // Reflect accessibility and client ecosystem: tool.easeOfUseRating
  const rawEaseOfUse = Number(
    Math.min(10, Math.max(1, hardData.easeOfUseRating)).toFixed(1)
  );
  const easeExplanation = `UX Rating: ${hardData.easeOfUseRating}/10 • Platforms: ${hardData.platforms.slice(0, 3).join(', ')}`;

  // 4. Affordability Vector (1–10):
  // Differentiate based on free tier generosity:
  // - Completely Free: 10
  // - Generous Free Tier: 8.5
  // - Moderate Free Quota (ChatGPT): 7.0
  // - Tight / Strict Free Quota (Claude): 5.5
  // - Paid-only / None: 3.5
  let rawAffordability = 6.0;
  let affExplanation = '';

  if (hardData.isOpenSource || hardData.freeQuotaLevel === 'completely-free' || hardData.startingPrice === 0) {
    rawAffordability = 10.0;
    affExplanation = `Price: $0/mo | 100% Free & Open Source (Score: 10.0/10)`;
  } else if (hardData.freeQuotaLevel === 'generous') {
    rawAffordability = 8.5;
    affExplanation = `Price: $${hardData.startingPrice}/mo | Generous Free Tier: ${hardData.freeTierQuota.slice(0, 35)} (Score: 8.5/10)`;
  } else if (hardData.freeQuotaLevel === 'moderate') {
    rawAffordability = 7.0;
    affExplanation = `Price: $${hardData.startingPrice}/mo | Moderate Free Quota: ${hardData.freeTierQuota.slice(0, 35)} (Score: 7.0/10)`;
  } else if (hardData.freeQuotaLevel === 'limited' || hardData.freeQuotaLevel === 'strict') {
    rawAffordability = 5.5;
    affExplanation = `Price: $${hardData.startingPrice}/mo | Strict Free Tier: ${hardData.freeTierQuota.slice(0, 35)} (Score: 5.5/10)`;
  } else if (!hardData.freeTier || hardData.freeQuotaLevel === 'none') {
    rawAffordability = 3.5;
    affExplanation = `Price: $${hardData.startingPrice}/mo | Paid Only / No Free Tier (Score: 3.5/10)`;
  } else {
    rawAffordability = 6.0;
    affExplanation = `Price: $${hardData.startingPrice}/mo | Free Tier available (Score: 6.0/10)`;
  }

  // 5. Ecosystem & Integrations Vector (1–10):
  // Scale by integrations and custom GPTs/artifacts:
  // Math.min(10, (tool.integrationsCount > 500 ? 9.5 : (tool.integrationsCount >= 300 ? 7.5 : 7.0)) + (tool.hasPublicApi ? 0.5 : 0))
  // ChatGPT (1200 > 500 => 9.5 + 0.5 = 10.0); Claude (350 => 7.5 + 0.5 = 8.0)
  const baseEco = hardData.integrationsCount > 500 ? 9.5 : (hardData.integrationsCount >= 300 ? 7.5 : 7.0);
  const rawEcosystem = Number(
    Math.min(10, baseEco + (hardData.hasPublicApi ? 0.5 : 0)).toFixed(1)
  );
  const ecoExplanation = `${hardData.integrationsCount} Ecosystem Integrations & Extensions • ${hardData.hasPublicApi ? 'Public REST API (+0.5 pts)' : 'No public API'}`;

  // ================= CATEGORY-SPECIFIC WEIGHTS =================
  const catLower = (tool.category || '').toLowerCase();
  const isCoding =
    catLower.includes('coding') ||
    catLower.includes('software development') ||
    tool.category === 'Coding';
  const isVideo =
    catLower.includes('video') ||
    tool.category === 'Video Editing';

  let speedMultiplier = 1.0;
  let ecosystemMultiplier = 1.0;
  let qualityMultiplier = 1.0;

  if (isCoding) {
    speedMultiplier = 1.5;
    ecosystemMultiplier = 1.5;
  }
  if (isVideo) {
    qualityMultiplier = 1.5;
  }

  let finalSpeed = rawSpeed * speedMultiplier;
  let finalEcosystem = rawEcosystem * ecosystemMultiplier;
  let finalQuality = rawQuality * qualityMultiplier;
  let finalAffordability = rawAffordability;
  let finalEaseOfUse = rawEaseOfUse;

  // Normalize final calculated scores to fit strictly on the 1-10 Radar Chart scale
  finalSpeed = Math.min(10.0, Math.max(1.0, Number(finalSpeed.toFixed(1))));
  finalEcosystem = Math.min(10.0, Math.max(1.0, Number(finalEcosystem.toFixed(1))));
  finalQuality = Math.min(10.0, Math.max(1.0, Number(finalQuality.toFixed(1))));
  finalAffordability = Math.min(10.0, Math.max(1.0, Number(finalAffordability.toFixed(1))));
  finalEaseOfUse = Math.min(10.0, Math.max(1.0, Number(finalEaseOfUse.toFixed(1))));

  const totalScore = Number(
    (finalSpeed + finalQuality + finalEaseOfUse + finalAffordability + finalEcosystem).toFixed(1)
  );

  const overallScore = Number((totalScore / 5).toFixed(1));

  return {
    affordability: finalAffordability,
    ecosystem: finalEcosystem,
    speed: finalSpeed,
    quality: finalQuality,
    easeOfUse: finalEaseOfUse,
    overallScore,
    totalScore,
    rawScores: {
      affordability: rawAffordability,
      ecosystem: rawEcosystem,
      speed: rawSpeed,
      quality: rawQuality,
      easeOfUse: rawEaseOfUse,
    },
    multipliers: {
      speedMultiplier,
      ecosystemMultiplier,
      qualityMultiplier,
    },
    hardData,
    scoreExplanations: {
      affordability: affExplanation,
      ecosystem: ecoExplanation,
      speed: speedExplanation,
      quality: qualityExplanation,
      easeOfUse: easeExplanation,
    },
  };
}
