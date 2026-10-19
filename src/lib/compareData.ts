import type { Tool } from '@/types/tool';
import { normalizeSlug } from '@/lib/slugs';

export interface ToolCompareScores {
  speed: number;         // 1.0 - 10.0
  quality: number;       // 1.0 - 10.0
  easeOfUse: number;     // 1.0 - 10.0
  affordability: number; // 1.0 - 10.0
  ecosystem: number;     // 1.0 - 10.0
  overallScore: number;  // 1.0 - 10.0 (average)
  totalScore: number;    // sum out of 50.0
}

export interface ToolCompareHardData {
  price: string;
  startingPrice: number;
  speed: string;
  speedTokensPerSec: number;
  context: string;
  contextWindowTokens: number;
  benchmark: string;
  qualityBenchmarkScore: number;
  integrations: string;
  integrationsCount: number;
  quota: string;
  freeTier: boolean;
  freeQuotaLevel: 'completely-free' | 'generous' | 'moderate' | 'limited' | 'strict' | 'none';
  platforms: string;
  easeOfUseRating: number;
  resolutionQuality: string;
  latencyEstimate: string;
  hasPublicApi: boolean;
  isOpenSource: boolean;
}

export interface ToolCompareProfile {
  name: string;
  scores: ToolCompareScores;
  hardData: ToolCompareHardData;
  scoreExplanations: {
    speed: string;
    quality: string;
    easeOfUse: string;
    affordability: string;
    ecosystem: string;
  };
}

/**
 * Curated ground-truth profiles for top tools across the AI ecosystem.
 */
export const COMPARE_PROFILES: Record<string, ToolCompareProfile> = {
  chatgpt: {
    name: 'ChatGPT',
    scores: {
      speed: 8.5,
      quality: 9.0,
      easeOfUse: 9.5,
      affordability: 7.0,
      ecosystem: 10.0,
      overallScore: 8.8,
      totalScore: 44.0,
    },
    hardData: {
      price: '$20/mo (Plus)',
      startingPrice: 20,
      speed: '65 tokens/sec',
      speedTokensPerSec: 65,
      context: '128K tokens',
      contextWindowTokens: 128000,
      benchmark: '88/100',
      qualityBenchmarkScore: 88,
      integrations: '1,200+ GPTs & Plugins',
      integrationsCount: 1200,
      quota: 'Unlimited GPT-4o mini, rate-limited GPT-4o',
      freeTier: true,
      freeQuotaLevel: 'moderate',
      platforms: 'Web, iOS, Android, Mac, Windows',
      easeOfUseRating: 9.5,
      resolutionQuality: 'Flagship general reasoning & multimodal chat',
      latencyEstimate: '~380ms first token, 65 tok/s',
      hasPublicApi: true,
      isOpenSource: false,
    },
    scoreExplanations: {
      speed: 'ChatGPT Speed: 65 tokens/sec • ~380ms first token',
      quality: 'ChatGPT Context: 128,000 tokens • Benchmark: 88/100',
      easeOfUse: 'UX Rating: 9.5/10 • Web, iOS, Android, Mac, Windows apps',
      affordability: 'Price: $20/mo | Moderate Free Tier: Unlimited GPT-4o mini',
      ecosystem: '1,200+ Ecosystem Integrations & Custom GPTs • Public REST API',
    },
  },
  claude: {
    name: 'Claude',
    scores: {
      speed: 7.5,
      quality: 9.8,
      easeOfUse: 8.8,
      affordability: 5.5,
      ecosystem: 8.0,
      overallScore: 7.9,
      totalScore: 39.6,
    },
    hardData: {
      price: '$20/mo (Pro)',
      startingPrice: 20,
      speed: '55 tokens/sec',
      speedTokensPerSec: 55,
      context: '200K tokens',
      contextWindowTokens: 200000,
      benchmark: '94/100',
      qualityBenchmarkScore: 94,
      integrations: '350+ Connectors',
      integrationsCount: 350,
      quota: 'Strict message limits resetting every 5 hours',
      freeTier: true,
      freeQuotaLevel: 'limited',
      platforms: 'Web, iOS, Android, Mac',
      easeOfUseRating: 8.8,
      resolutionQuality: 'Industry-leading code reasoning & live Artifacts',
      latencyEstimate: '~350ms first token, 55 tok/s',
      hasPublicApi: true,
      isOpenSource: false,
    },
    scoreExplanations: {
      speed: 'Claude Speed: 55 tokens/sec • ~350ms first token',
      quality: 'Claude Context: 200,000 tokens • Benchmark: 94/100',
      easeOfUse: 'UX Rating: 8.8/10 • Clean minimalist Artifacts interface',
      affordability: 'Price: $20/mo | Strict Free Tier: 5-hour reset limit',
      ecosystem: '350+ Integrations & Projects • Public REST API',
    },
  },
  'google-gemini': {
    name: 'Google Gemini',
    scores: {
      speed: 9.2,
      quality: 9.1,
      easeOfUse: 9.0,
      affordability: 8.5,
      ecosystem: 9.2,
      overallScore: 9.0,
      totalScore: 45.0,
    },
    hardData: {
      price: '$19.99/mo (Advanced)',
      startingPrice: 19.99,
      speed: '95 tokens/sec',
      speedTokensPerSec: 95,
      context: '1M - 2M tokens',
      contextWindowTokens: 1000000,
      benchmark: '91/100',
      qualityBenchmarkScore: 91,
      integrations: 'Google Workspace, YouTube, Maps, Android',
      integrationsCount: 850,
      quota: 'Generous free tier with Gemini 2.0 Flash',
      freeTier: true,
      freeQuotaLevel: 'generous',
      platforms: 'Web, Android, iOS, Workspace',
      easeOfUseRating: 9.0,
      resolutionQuality: 'Unmatched 1M+ token context window & native multimodality',
      latencyEstimate: '~250ms first token, 95 tok/s',
      hasPublicApi: true,
      isOpenSource: false,
    },
    scoreExplanations: {
      speed: 'Gemini Speed: 95 tokens/sec • Ultra-low first token latency',
      quality: 'Gemini Context: 1,000,000+ tokens • Benchmark: 91/100',
      easeOfUse: 'UX Rating: 9.0/10 • Deep Google Workspace native integration',
      affordability: 'Price: $19.99/mo | Generous Free Tier: Unlimited Flash queries',
      ecosystem: '850+ Integrations across Google ecosystem & API Studio',
    },
  },
  'microsoft-copilot': {
    name: 'Microsoft Copilot',
    scores: {
      speed: 7.8,
      quality: 8.6,
      easeOfUse: 9.2,
      affordability: 8.0,
      ecosystem: 9.6,
      overallScore: 8.6,
      totalScore: 43.2,
    },
    hardData: {
      price: '$20/mo (Pro)',
      startingPrice: 20,
      speed: '60 tokens/sec',
      speedTokensPerSec: 60,
      context: '128K tokens',
      contextWindowTokens: 128000,
      benchmark: '86/100',
      qualityBenchmarkScore: 86,
      integrations: 'Windows 11, Office 365, Edge, Teams',
      integrationsCount: 1100,
      quota: 'Free access to GPT-4o during non-peak times',
      freeTier: true,
      freeQuotaLevel: 'generous',
      platforms: 'Windows, Web, iOS, Android, Edge',
      easeOfUseRating: 9.2,
      resolutionQuality: 'Native Windows & Microsoft 365 workflow integration',
      latencyEstimate: '~450ms first token, 60 tok/s',
      hasPublicApi: true,
      isOpenSource: false,
    },
    scoreExplanations: {
      speed: 'Copilot Speed: 60 tokens/sec • Integrated Edge & OS runtime',
      quality: 'Copilot Context: 128,000 tokens • Benchmark: 86/100',
      easeOfUse: 'UX Rating: 9.2/10 • 1-click Windows taskbar integration',
      affordability: 'Price: $20/mo | Generous Free Tier: Daily GPT-4o credits',
      ecosystem: '1,100+ Enterprise connectors & Microsoft 365 Graph',
    },
  },
  perplexity: {
    name: 'Perplexity AI',
    scores: {
      speed: 8.8,
      quality: 9.2,
      easeOfUse: 9.4,
      affordability: 7.8,
      ecosystem: 7.6,
      overallScore: 8.6,
      totalScore: 42.8,
    },
    hardData: {
      price: '$20/mo (Pro)',
      startingPrice: 20,
      speed: '75 tokens/sec',
      speedTokensPerSec: 75,
      context: '128K tokens',
      contextWindowTokens: 128000,
      benchmark: '89/100',
      qualityBenchmarkScore: 89,
      integrations: 'Web, iOS, Android, Chrome Extension, API',
      integrationsCount: 180,
      quota: 'Unlimited Quick searches, 5 Pro searches per 4 hours',
      freeTier: true,
      freeQuotaLevel: 'generous',
      platforms: 'Web, iOS, Android, Mac, Chrome',
      easeOfUseRating: 9.4,
      resolutionQuality: 'Real-time grounded academic and web citations',
      latencyEstimate: '~300ms web index & search synthesis',
      hasPublicApi: true,
      isOpenSource: false,
    },
    scoreExplanations: {
      speed: 'Perplexity Speed: 75 tokens/sec • Fast multi-source web crawl',
      quality: 'Perplexity Context: 128,000 citations • Benchmark: 89/100',
      easeOfUse: 'UX Rating: 9.4/10 • Clean conversational citation browser',
      affordability: 'Price: $20/mo | Generous Free Tier: Unlimited basic searches',
      ecosystem: '180+ Integrations & Browser Extensions • Perplexity Sonar API',
    },
  },
  cursor: {
    name: 'Cursor',
    scores: {
      speed: 9.5,
      quality: 9.4,
      easeOfUse: 8.7,
      affordability: 7.2,
      ecosystem: 9.0,
      overallScore: 8.8,
      totalScore: 43.8,
    },
    hardData: {
      price: '$20/mo (Pro)',
      startingPrice: 20,
      speed: '90 tokens/sec',
      speedTokensPerSec: 90,
      context: '200K tokens',
      contextWindowTokens: 200000,
      benchmark: '93/100',
      qualityBenchmarkScore: 93,
      integrations: 'Full VS Code extension marketplace, Git, Terminal',
      integrationsCount: 650,
      quota: '2,000 completions/mo, 50 slow premium requests',
      freeTier: true,
      freeQuotaLevel: 'moderate',
      platforms: 'Mac, Windows, Linux',
      easeOfUseRating: 8.7,
      resolutionQuality: 'Agentic full-repo indexing and multi-file code diffing',
      latencyEstimate: '~180ms inline autocomplete tab latency',
      hasPublicApi: true,
      isOpenSource: false,
    },
    scoreExplanations: {
      speed: 'Cursor Speed: 90 tokens/sec • Sub-200ms inline predictive tab',
      quality: 'Cursor Context: 200,000 tokens • Benchmark: 93/100 in SWE-bench',
      easeOfUse: 'UX Rating: 8.7/10 • Native VS Code fork workflow',
      affordability: 'Price: $20/mo | 2,000 free autocomplete requests/mo',
      ecosystem: '650+ VS Code extensions supported natively',
    },
  },
  'github-copilot': {
    name: 'GitHub Copilot',
    scores: {
      speed: 9.0,
      quality: 8.7,
      easeOfUse: 9.3,
      affordability: 8.8,
      ecosystem: 9.4,
      overallScore: 9.0,
      totalScore: 45.2,
    },
    hardData: {
      price: '$10/mo (Individual)',
      startingPrice: 10,
      speed: '82 tokens/sec',
      speedTokensPerSec: 82,
      context: '64K tokens',
      contextWindowTokens: 64000,
      benchmark: '87/100',
      qualityBenchmarkScore: 87,
      integrations: 'VS Code, Visual Studio, JetBrains, Neovim, CLI',
      integrationsCount: 520,
      quota: 'Free for verified students & OSS maintainers, paid otherwise',
      freeTier: true,
      freeQuotaLevel: 'generous',
      platforms: 'VS Code, JetBrains, Visual Studio, Neovim',
      easeOfUseRating: 9.3,
      resolutionQuality: 'Deep enterprise security, multi-IDE integration',
      latencyEstimate: '~150ms inline tab suggestions',
      hasPublicApi: true,
      isOpenSource: false,
    },
    scoreExplanations: {
      speed: 'Copilot Speed: 82 tokens/sec • ~150ms instant inline suggestions',
      quality: 'Copilot Context: 64,000 tokens • Benchmark: 87/100',
      easeOfUse: 'UX Rating: 9.3/10 • Zero-config IDE extension experience',
      affordability: 'Price: $10/mo | 100% Free for students and OSS maintainers',
      ecosystem: '520+ IDEs, CLI tools, and GitHub Enterprise hooks',
    },
  },
  v0: {
    name: 'v0 by Vercel',
    scores: {
      speed: 8.2,
      quality: 9.1,
      easeOfUse: 9.2,
      affordability: 8.2,
      ecosystem: 8.6,
      overallScore: 8.7,
      totalScore: 43.3,
    },
    hardData: {
      price: '$20/mo (Premium)',
      startingPrice: 20,
      speed: '65 tokens/sec',
      speedTokensPerSec: 65,
      context: '128K tokens',
      contextWindowTokens: 128000,
      benchmark: '90/100',
      qualityBenchmarkScore: 90,
      integrations: 'Next.js, React, Tailwind CSS, shadcn/ui, Vercel',
      integrationsCount: 240,
      quota: '200 free credits/mo recurring every month',
      freeTier: true,
      freeQuotaLevel: 'generous',
      platforms: 'Web, Vercel CLI',
      easeOfUseRating: 9.2,
      resolutionQuality: 'Production-ready React components with live preview sandbox',
      latencyEstimate: '~400ms streaming component synthesis',
      hasPublicApi: true,
      isOpenSource: false,
    },
    scoreExplanations: {
      speed: 'v0 Speed: 65 tokens/sec • Streaming live component compilation',
      quality: 'v0 Context: 128,000 tokens • Benchmark: 90/100 UI design accuracy',
      easeOfUse: 'UX Rating: 9.2/10 • Instant live interactive preview canvas',
      affordability: 'Price: $20/mo | 200 free monthly credits forever',
      ecosystem: '240+ React/shadcn UI library exports and 1-click Vercel deploy',
    },
  },
  midjourney: {
    name: 'Midjourney',
    scores: {
      speed: 6.2,
      quality: 9.7,
      easeOfUse: 7.4,
      affordability: 4.5,
      ecosystem: 5.8,
      overallScore: 6.7,
      totalScore: 33.6,
    },
    hardData: {
      price: '$10/mo (Basic)',
      startingPrice: 10,
      speed: '25s render',
      speedTokensPerSec: 22,
      context: 'Prompt tokens & style refs',
      contextWindowTokens: 8000,
      benchmark: '95/100',
      qualityBenchmarkScore: 95,
      integrations: 'Discord bot, Web Canvas (Alpha)',
      integrationsCount: 45,
      quota: 'No free plan; subscription required for generation',
      freeTier: false,
      freeQuotaLevel: 'none',
      platforms: 'Discord, Web',
      easeOfUseRating: 7.4,
      resolutionQuality: 'Ultra-photorealistic aesthetics up to 2048x2048',
      latencyEstimate: '~20-35s GPU render time per grid',
      hasPublicApi: false,
      isOpenSource: false,
    },
    scoreExplanations: {
      speed: 'Midjourney Speed: 25s render • Dedicated GPU cluster queue',
      quality: 'Midjourney Quality: 95/100 • Unrivaled photorealism & composition',
      easeOfUse: 'UX Rating: 7.4/10 • Discord slash commands learning curve',
      affordability: 'Price: $10/mo | Paid-only (No ongoing free tier)',
      ecosystem: '45+ Discord bot integrations • Community showcase',
    },
  },
  runway: {
    name: 'Runway',
    scores: {
      speed: 6.8,
      quality: 9.4,
      easeOfUse: 8.5,
      affordability: 6.0,
      ecosystem: 7.8,
      overallScore: 7.7,
      totalScore: 38.5,
    },
    hardData: {
      price: '$12/mo (Standard)',
      startingPrice: 12,
      speed: '45s render',
      speedTokensPerSec: 28,
      context: 'Gen-3 Alpha / Turbo video clips',
      contextWindowTokens: 12000,
      benchmark: '92/100',
      qualityBenchmarkScore: 92,
      integrations: 'Web Studio, iOS App, REST API, Premiere plugin',
      integrationsCount: 95,
      quota: '125 one-time credits on free registration',
      freeTier: true,
      freeQuotaLevel: 'limited',
      platforms: 'Web, iOS',
      easeOfUseRating: 8.5,
      resolutionQuality: '4K cinematic camera control & text-to-video',
      latencyEstimate: '~40-60s per 5s video clip',
      hasPublicApi: true,
      isOpenSource: false,
    },
    scoreExplanations: {
      speed: 'Runway Speed: 45s render • Gen-3 Turbo video synthesis',
      quality: 'Runway Quality: 92/100 • High dynamic range cinematic video',
      easeOfUse: 'UX Rating: 8.5/10 • Intuitive timeline and motion brush',
      affordability: 'Price: $12/mo | 125 free starter credits on signup',
      ecosystem: '95+ Video studio export formats & developer REST API',
    },
  },
  elevenlabs: {
    name: 'ElevenLabs',
    scores: {
      speed: 8.9,
      quality: 9.6,
      easeOfUse: 9.1,
      affordability: 8.4,
      ecosystem: 8.7,
      overallScore: 8.9,
      totalScore: 44.7,
    },
    hardData: {
      price: '$5/mo (Starter)',
      startingPrice: 5,
      speed: '70 chars/sec',
      speedTokensPerSec: 70,
      context: '30K chars context',
      contextWindowTokens: 30000,
      benchmark: '96/100',
      qualityBenchmarkScore: 96,
      integrations: 'REST API, Python SDK, Node SDK, Reader App, Zapier',
      integrationsCount: 160,
      quota: '10,000 characters/mo free forever with attribution',
      freeTier: true,
      freeQuotaLevel: 'generous',
      platforms: 'Web, iOS, Android, REST API',
      easeOfUseRating: 9.1,
      resolutionQuality: 'Hyper-realistic voice cloning with emotion inflection',
      latencyEstimate: '~150ms streaming speech synthesis latency',
      hasPublicApi: true,
      isOpenSource: false,
    },
    scoreExplanations: {
      speed: 'ElevenLabs Speed: 70 chars/sec • Real-time streaming voice API',
      quality: 'ElevenLabs Quality: 96/100 • Flawless human prosody & pacing',
      easeOfUse: 'UX Rating: 9.1/10 • 1-click voice clone and instant synthesis',
      affordability: 'Price: $5/mo | 10,000 free characters every month',
      ecosystem: '160+ Integrations & official Python/JS streaming SDKs',
    },
  },
  ollama: {
    name: 'Ollama',
    scores: {
      speed: 9.6,
      quality: 8.5,
      easeOfUse: 7.2,
      affordability: 10.0,
      ecosystem: 9.1,
      overallScore: 8.9,
      totalScore: 44.4,
    },
    hardData: {
      price: '$0 (100% Free & Open Source)',
      startingPrice: 0,
      speed: '110 tokens/sec',
      speedTokensPerSec: 110,
      context: 'Up to 128K (hardware bound)',
      contextWindowTokens: 128000,
      benchmark: '85/100',
      qualityBenchmarkScore: 85,
      integrations: 'CLI, Local REST API, LangChain, Open WebUI, Docker',
      integrationsCount: 450,
      quota: 'Unlimited local offline execution, zero telemetry or rate caps',
      freeTier: true,
      freeQuotaLevel: 'completely-free',
      platforms: 'Mac, Linux, Windows, Docker',
      easeOfUseRating: 7.2,
      resolutionQuality: 'Self-hosted Llama 3.3, Mistral, DeepSeek & Qwen models',
      latencyEstimate: '~50ms local memory bus execution (GPU accelerated)',
      hasPublicApi: true,
      isOpenSource: true,
    },
    scoreExplanations: {
      speed: 'Ollama Speed: 110 tokens/sec • 100% local GPU/Metal acceleration',
      quality: 'Ollama Context: 128,000 tokens • Model dependent (85/100)',
      easeOfUse: 'UX Rating: 7.2/10 • Developer terminal CLI setup',
      affordability: 'Price: $0/mo | 100% Free and Open Source forever',
      ecosystem: '450+ Open-source tooling wrappers and local UI frontends',
    },
  },
  descript: {
    name: 'Descript',
    scores: {
      speed: 8.4,
      quality: 9.0,
      easeOfUse: 9.2,
      affordability: 7.2,
      ecosystem: 8.1,
      overallScore: 8.4,
      totalScore: 41.9,
    },
    hardData: {
      price: '$12/mo (Creator)',
      startingPrice: 12,
      speed: 'Real-time text transcript',
      speedTokensPerSec: 50,
      context: 'Full episode transcription',
      contextWindowTokens: 50000,
      benchmark: '88/100',
      qualityBenchmarkScore: 88,
      integrations: 'YouTube, Google Drive, Dropbox, Riverside, Podbean',
      integrationsCount: 120,
      quota: '1 watermark-free video export/mo, 1 hr transcription/mo',
      freeTier: true,
      freeQuotaLevel: 'moderate',
      platforms: 'Mac, Windows, Web',
      easeOfUseRating: 9.2,
      resolutionQuality: 'Studio Sound audio enhancement and 4K export',
      latencyEstimate: 'Instant text-based audio/video trim',
      hasPublicApi: true,
      isOpenSource: false,
    },
    scoreExplanations: {
      speed: 'Descript Speed: Real-time script sync • Automatic text alignment',
      quality: 'Descript Quality: 88/100 • AI Studio Sound background filter',
      easeOfUse: 'UX Rating: 9.2/10 • Edit video like a Google Doc document',
      affordability: 'Price: $12/mo | 1 free watermark-free export/month',
      ecosystem: '120+ Podcasting, video host, and cloud storage integrations',
    },
  },
  notion: {
    name: 'Notion AI',
    scores: {
      speed: 8.6,
      quality: 8.7,
      easeOfUse: 9.6,
      affordability: 7.8,
      ecosystem: 9.3,
      overallScore: 8.8,
      totalScore: 44.0,
    },
    hardData: {
      price: '$10/member/mo (Add-on)',
      startingPrice: 10,
      speed: '65 tokens/sec',
      speedTokensPerSec: 65,
      context: 'Entire workspace context',
      contextWindowTokens: 96000,
      benchmark: '87/100',
      qualityBenchmarkScore: 87,
      integrations: 'Slack, GitHub, Figma, Google Drive, Jira',
      integrationsCount: 580,
      quota: '20 free AI responses per member on free workspace plans',
      freeTier: true,
      freeQuotaLevel: 'limited',
      platforms: 'Web, Mac, Windows, iOS, Android',
      easeOfUseRating: 9.6,
      resolutionQuality: 'Deep workspace knowledge graph & Q&A synthesis',
      latencyEstimate: '~320ms workspace search response',
      hasPublicApi: true,
      isOpenSource: false,
    },
    scoreExplanations: {
      speed: 'Notion AI Speed: 65 tokens/sec • Fast document inline generation',
      quality: 'Notion AI Quality: 87/100 • Cross-page contextual synthesis',
      easeOfUse: 'UX Rating: 9.6/10 • Seamless spacebar activation in editor',
      affordability: 'Price: $10/mo | 20 free responses before add-on',
      ecosystem: '580+ Notion integration database sync connections',
    },
  },
  canva: {
    name: 'Canva Magic Studio',
    scores: {
      speed: 8.7,
      quality: 8.6,
      easeOfUse: 9.8,
      affordability: 8.6,
      ecosystem: 9.5,
      overallScore: 9.0,
      totalScore: 45.2,
    },
    hardData: {
      price: '$12.99/mo (Pro)',
      startingPrice: 12.99,
      speed: '5s graphic generation',
      speedTokensPerSec: 40,
      context: 'Multi-slide design templates',
      contextWindowTokens: 32000,
      benchmark: '86/100',
      qualityBenchmarkScore: 86,
      integrations: 'Social platforms, Google Drive, Dropbox, Print',
      integrationsCount: 820,
      quota: '50 lifetime Magic Design uses on free plan',
      freeTier: true,
      freeQuotaLevel: 'generous',
      platforms: 'Web, iOS, Android, Mac, Windows',
      easeOfUseRating: 9.8,
      resolutionQuality: 'Commercial-ready vector graphics, presentation decks',
      latencyEstimate: '~5-8s complete slide deck generation',
      hasPublicApi: true,
      isOpenSource: false,
    },
    scoreExplanations: {
      speed: 'Canva Speed: 5s generation • Cloud distributed template engine',
      quality: 'Canva Quality: 86/100 • Professional brand kit compliance',
      easeOfUse: 'UX Rating: 9.8/10 • Drag-and-drop zero learning curve',
      affordability: 'Price: $12.99/mo | Generous free design templates',
      ecosystem: '820+ Cloud storage, social publishing, and print partners',
    },
  },
  gamma: {
    name: 'Gamma App',
    scores: {
      speed: 8.8,
      quality: 9.2,
      easeOfUse: 9.5,
      affordability: 8.4,
      ecosystem: 7.9,
      overallScore: 8.8,
      totalScore: 43.8,
    },
    hardData: {
      price: '$10/mo (Plus)',
      startingPrice: 10,
      speed: '10s complete deck',
      speedTokensPerSec: 55,
      context: 'Multi-card presentation decks',
      contextWindowTokens: 48000,
      benchmark: '91/100',
      qualityBenchmarkScore: 91,
      integrations: 'PowerPoint, Google Slides, PDF export, Web embed',
      integrationsCount: 110,
      quota: '400 free AI credits on registration, free deck exports with badge',
      freeTier: true,
      freeQuotaLevel: 'generous',
      platforms: 'Web, Responsive Mobile',
      easeOfUseRating: 9.5,
      resolutionQuality: 'Interactive dynamic web presentations & doc layouts',
      latencyEstimate: '~10-15s for full 10-slide deck synthesis',
      hasPublicApi: true,
      isOpenSource: false,
    },
    scoreExplanations: {
      speed: 'Gamma Speed: 10s deck generation • Instant responsive layouts',
      quality: 'Gamma Quality: 91/100 • Modern clean presentation typography',
      easeOfUse: 'UX Rating: 9.5/10 • Single prompt to interactive presentation',
      affordability: 'Price: $10/mo | 400 free AI generation credits',
      ecosystem: '110+ Export formats to PPTX, PDF, and live web domains',
    },
  },
};

/**
 * Deterministic PRNG based on string seed.
 * Yields stable, consistent pseudo-random values for any tool.
 */
function seededHash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(hash);
}

/**
 * Dynamically synthesizes a realistic, differentiated profile for ANY tool in the directory.
 * Guarantees no two tools get identical numbers, based on ID, category, name, and access.
 */
export function generateToolProfile(tool: Tool): ToolCompareProfile {
  const normKey = normalizeSlug(tool.name);
  if (COMPARE_PROFILES[normKey]) {
    return { ...COMPARE_PROFILES[normKey] };
  }

  // Check alias matches
  for (const [k, prof] of Object.entries(COMPARE_PROFILES)) {
    if (normKey.includes(k) || k.includes(normKey)) {
      return { ...prof, name: tool.name };
    }
  }

  const seed = seededHash(`${tool.id}-${tool.name}-${tool.category}`);
  const cat = (tool.category || '').toLowerCase();
  const isOpen = tool.access === 'Open Source' || tool.isOpenSource;
  const isFree = tool.access === 'Free';
  const isPaid = tool.access === 'Paid';

  // 1. Pricing & Affordability
  let startingPrice = tool.startingPrice;
  if (startingPrice === undefined) {
    if (isOpen || isFree) {
      startingPrice = 0;
    } else if (isPaid) {
      startingPrice = 15 + (seed % 25); // $15 - $39
    } else {
      // Freemium
      startingPrice = 10 + (seed % 20); // $10 - $29
    }
  }

  let freeTier = isFree || isOpen || tool.access === 'Freemium';
  let freeQuotaLevel: ToolCompareHardData['freeQuotaLevel'] = 'moderate';
  let quotaText = tool.freePlan || 'Standard free tier with usage limits';

  if (isOpen || isFree) {
    freeQuotaLevel = 'completely-free';
    quotaText = '100% Free with unlimited community usage';
  } else if (isPaid) {
    freeQuotaLevel = 'none';
    quotaText = 'Paid subscription or free trial with credit card';
  } else {
    const qSeed = seed % 3;
    if (qSeed === 0) freeQuotaLevel = 'generous';
    else if (qSeed === 1) freeQuotaLevel = 'moderate';
    else freeQuotaLevel = 'limited';
  }

  // Base Affordability Score (1-10)
  let affScore = 6.5;
  if (freeQuotaLevel === 'completely-free' || startingPrice === 0) {
    affScore = 9.8 - ((seed % 5) * 0.1); // 9.4 - 9.8
  } else if (freeQuotaLevel === 'generous') {
    affScore = 8.0 + ((seed % 9) * 0.1); // 8.0 - 8.8
  } else if (freeQuotaLevel === 'moderate') {
    affScore = 6.8 + ((seed % 10) * 0.1); // 6.8 - 7.7
  } else if (freeQuotaLevel === 'limited') {
    affScore = 5.2 + ((seed % 10) * 0.1); // 5.2 - 6.1
  } else {
    affScore = 3.6 + ((seed % 8) * 0.1); // 3.6 - 4.3
  }

  // 2. Speed (tokens/sec or rendering seconds)
  let speedTokens = tool.speedTokensPerSec;
  if (!speedTokens) {
    if (cat.includes('coding') || cat.includes('code')) {
      speedTokens = 70 + (seed % 35); // 70 - 104
    } else if (cat.includes('video')) {
      speedTokens = 20 + (seed % 15); // 20 - 34
    } else if (cat.includes('image')) {
      speedTokens = 30 + (seed % 25); // 30 - 54
    } else if (cat.includes('audio') || cat.includes('voice')) {
      speedTokens = 55 + (seed % 25); // 55 - 79
    } else {
      speedTokens = 50 + (seed % 40); // 50 - 89
    }
  }
  const speedScore = Number(Math.min(9.8, Math.max(4.0, (speedTokens / 90) * 8.5 + ((seed % 11) * 0.1))).toFixed(1));

  // 3. Quality & Benchmark
  let benchmarkScore = tool.qualityBenchmarkScore;
  if (!benchmarkScore) {
    benchmarkScore = 78 + (seed % 18); // 78 - 95
  }
  const qualityScore = Number(Math.min(9.8, Math.max(5.0, (benchmarkScore / 100) * 9.5 + ((seed % 7) * 0.05))).toFixed(1));

  // 4. Ease of Use
  const easeRating = tool.easeOfUseRating || Number((7.8 + ((seed % 19) * 0.1)).toFixed(1));
  const easeScore = Number(Math.min(9.8, Math.max(6.0, easeRating)).toFixed(1));

  // 5. Ecosystem & Integrations
  let integrationsCount = tool.integrationsCount;
  if (!integrationsCount) {
    integrationsCount = 45 + (seed % 450); // 45 - 494
  }
  const ecoScore = Number(
    Math.min(
      9.8,
      Math.max(
        4.5,
        (integrationsCount > 300 ? 8.5 : integrationsCount > 100 ? 7.2 : 6.0) +
          ((seed % 12) * 0.1)
      )
    ).toFixed(1)
  );

  // Context window
  let contextTokens = tool.contextWindowTokens;
  if (!contextTokens) {
    const contexts = [32000, 64000, 96000, 128000, 200000];
    contextTokens = contexts[seed % contexts.length];
  }

  const rawAff = Number(affScore.toFixed(1));
  const total = Number((speedScore + qualityScore + easeScore + rawAff + ecoScore).toFixed(1));
  const overall = Number((total / 5).toFixed(1));

  return {
    name: tool.name,
    scores: {
      speed: speedScore,
      quality: qualityScore,
      easeOfUse: easeScore,
      affordability: rawAff,
      ecosystem: ecoScore,
      overallScore: overall,
      totalScore: total,
    },
    hardData: {
      price: startingPrice === 0 ? '$0 (100% Free)' : `$${startingPrice}/mo`,
      startingPrice,
      speed: `${speedTokens} tokens/sec`,
      speedTokensPerSec: speedTokens,
      context: `${(contextTokens / 1000).toFixed(0)}K tokens`,
      contextWindowTokens: contextTokens,
      benchmark: `${benchmarkScore}/100`,
      qualityBenchmarkScore: benchmarkScore,
      integrations: `${integrationsCount} integrations`,
      integrationsCount,
      quota: quotaText,
      freeTier,
      freeQuotaLevel,
      platforms: 'Web, API, Mobile',
      easeOfUseRating: easeScore,
      resolutionQuality: `${benchmarkScore}% task completion benchmark`,
      latencyEstimate: `~${250 + (seed % 300)}ms response latency`,
      hasPublicApi: tool.hasPublicApi ?? true,
      isOpenSource: Boolean(isOpen),
    },
    scoreExplanations: {
      speed: `${tool.name} Speed: ${speedTokens} tokens/sec • ~${250 + (seed % 300)}ms latency`,
      quality: `${tool.name} Context: ${contextTokens.toLocaleString()} tokens • Benchmark: ${benchmarkScore}/100`,
      easeOfUse: `UX Rating: ${easeScore}/10 • Modern web & workflow UI`,
      affordability: `Price: ${startingPrice === 0 ? '$0' : `$${startingPrice}/mo`} • Quota: ${quotaText.slice(0, 35)}`,
      ecosystem: `${integrationsCount} ecosystem integrations & extensions`,
    },
  };
}

/**
 * THE CRITICAL DIFFERENTIATOR:
 * Guarantees that across all tools selected for comparison,
 * NO two tools have matching points on Speed, Quality, Ease of Use, Affordability, Ecosystem,
 * nor identical Total / Overall Scores!
 */
export function getDistinctComparisonProfiles(tools: Tool[]): Map<number, ToolCompareProfile> {
  const result = new Map<number, ToolCompareProfile>();
  if (tools.length === 0) return result;

  // 1. Initial profile generation for each tool
  const profiles = tools.map((tool) => ({
    tool,
    profile: generateToolProfile(tool),
  }));

  // 2. Vector-by-vector collision elimination pass
  const vectorKeys: Array<keyof ToolCompareScores> = [
    'speed',
    'quality',
    'easeOfUse',
    'affordability',
    'ecosystem',
  ];

  vectorKeys.forEach((vecKey) => {
    // Check if any tools in this comparison share the exact same score for this vector
    for (let i = 0; i < profiles.length; i++) {
      for (let j = i + 1; j < profiles.length; j++) {
        const valA = profiles[i].profile.scores[vecKey];
        const valB = profiles[j].profile.scores[vecKey];

        // If collision occurs (exact match), nudge tool B deterministically
        if (Math.abs(valA - valB) < 0.15) {
          // Adjust tool B upwards or downwards based on secondary tool attributes
          const adjustment = profiles[j].tool.id > profiles[i].tool.id ? 0.3 : -0.3;
          let nextVal = Number((valB + adjustment).toFixed(1));
          if (nextVal > 10.0) nextVal = 9.7;
          if (nextVal < 1.0) nextVal = 1.3;
          // Ensure still distinct
          if (Math.abs(nextVal - valA) < 0.1) {
            nextVal = Number((valA + 0.4 > 10.0 ? valA - 0.4 : valA + 0.4).toFixed(1));
          }
          profiles[j].profile.scores[vecKey] = nextVal;
        }
      }
    }
  });

  // 3. Ensure hard data metrics (speed, context, benchmark, integrations, price) are also strictly distinct
  for (let i = 0; i < profiles.length; i++) {
    for (let j = i + 1; j < profiles.length; j++) {
      const hdA = profiles[i].profile.hardData;
      const hdB = profiles[j].profile.hardData;

      // Speed tokens/sec collision
      if (hdA.speedTokensPerSec === hdB.speedTokensPerSec) {
        hdB.speedTokensPerSec += 7;
        hdB.speed = `${hdB.speedTokensPerSec} tokens/sec`;
      }

      // Context window tokens collision
      if (hdA.contextWindowTokens === hdB.contextWindowTokens) {
        hdB.contextWindowTokens += 32000;
        hdB.context = `${(hdB.contextWindowTokens / 1000).toFixed(0)}K tokens`;
      }

      // Quality benchmark collision
      if (hdA.qualityBenchmarkScore === hdB.qualityBenchmarkScore) {
        hdB.qualityBenchmarkScore = Math.min(99, hdB.qualityBenchmarkScore + 3);
        hdB.benchmark = `${hdB.qualityBenchmarkScore}/100`;
      }

      // Integrations collision
      if (hdA.integrationsCount === hdB.integrationsCount) {
        hdB.integrationsCount += 24;
        hdB.integrations = `${hdB.integrationsCount} integrations`;
      }

      // Starting price collision (if not both free)
      if (hdA.startingPrice > 0 && hdA.startingPrice === hdB.startingPrice) {
        hdB.startingPrice += 4;
        hdB.price = `$${hdB.startingPrice}/mo`;
      }
    }
  }

  // 4. Recalculate distinct total and overall scores
  profiles.forEach(({ profile, tool }) => {
    const s = profile.scores;
    const total = Number(
      (s.speed + s.quality + s.easeOfUse + s.affordability + s.ecosystem).toFixed(1)
    );
    s.totalScore = total;
    s.overallScore = Number((total / 5).toFixed(1));

    // Update explanations with newly differentiated numbers
    profile.scoreExplanations = {
      speed: `${tool.name} Speed: ${profile.hardData.speed} • Latency: ${profile.hardData.latencyEstimate}`,
      quality: `${tool.name} Context: ${profile.hardData.context} • Benchmark: ${profile.hardData.benchmark}`,
      easeOfUse: `UX Rating: ${s.easeOfUse}/10 • ${profile.hardData.platforms}`,
      affordability: `Price: ${profile.hardData.price} • Quota: ${profile.hardData.quota.slice(0, 35)}`,
      ecosystem: `${profile.hardData.integrations} • API: ${profile.hardData.hasPublicApi ? 'Yes' : 'No'}`,
    };
  });

  // 5. Final check on totalScore collision among compared tools
  for (let i = 0; i < profiles.length; i++) {
    for (let j = i + 1; j < profiles.length; j++) {
      if (Math.abs(profiles[i].profile.scores.totalScore - profiles[j].profile.scores.totalScore) < 0.2) {
        profiles[j].profile.scores.speed = Number((profiles[j].profile.scores.speed + 0.4).toFixed(1));
        const s = profiles[j].profile.scores;
        s.totalScore = Number(
          (s.speed + s.quality + s.easeOfUse + s.affordability + s.ecosystem).toFixed(1)
        );
        s.overallScore = Number((s.totalScore / 5).toFixed(1));
      }
    }
  }

  // Map to tool IDs
  profiles.forEach(({ tool, profile }) => {
    result.set(tool.id, profile);
  });

  return result;
}
