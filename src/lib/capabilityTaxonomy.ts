/**
 * Capability Taxonomy and Mapping Engine for ToolTap
 * Provides normalized capability identifiers, synonyms, category associations,
 * and rule-based capability matchers for 600 AI tools.
 */

export interface CapabilityDefinition {
  id: string;
  name: string;
  category: string;
  keywords: string[];
  description: string;
}

export const CAPABILITY_TAXONOMY: Record<string, CapabilityDefinition> = {
  // Presentation & Slides
  presentation_generation: {
    id: 'presentation_generation',
    name: 'Presentation & Slide Generation',
    category: 'Presentations and Slides',
    keywords: ['presentation', 'presentations', 'slide', 'slides', 'powerpoint', 'ppt', 'deck', 'pitch deck', 'keynote'],
    description: 'Generates professional presentation decks and slides from text prompts or outlines.',
  },
  ai_storytelling_deck: {
    id: 'ai_storytelling_deck',
    name: 'Narrative & Story Deck Creation',
    category: 'Presentations and Slides',
    keywords: ['storytelling', 'narrative deck', 'interactive slides', 'visual outline'],
    description: 'Formats business ideas and lecture notes into interactive visual slide layouts.',
  },

  // Coding & Software Development
  python_code_generation: {
    id: 'python_code_generation',
    name: 'Python Code Generation',
    category: 'Coding and Software Development',
    keywords: ['python', 'py', 'python script', 'python code', 'jupyter', 'django', 'fastapi', 'flask', 'pandas'],
    description: 'Generates clean, idiomatic Python code, scripts, algorithms, and modules.',
  },
  debugging: {
    id: 'debugging',
    name: 'Error Debugging & Troubleshooting',
    category: 'Coding and Software Development',
    keywords: ['debug', 'debugging', 'troubleshoot', 'fix error', 'stack trace', 'bug fix', 'solve bug', 'explain errors'],
    description: 'Diagnoses runtime errors, syntax bugs, and stack traces with targeted code fixes.',
  },
  code_explanation: {
    id: 'code_explanation',
    name: 'Code Explanation & Documentation',
    category: 'Coding and Software Development',
    keywords: ['explain code', 'code explanation', 'docstring', 'document code', 'understand code', 'walkthrough'],
    description: 'Breaks down complex codebases, legacy code, and unfamiliar libraries into plain explanations.',
  },
  ide_integration: {
    id: 'ide_integration',
    name: 'IDE & Editor Integration',
    category: 'Coding and Software Development',
    keywords: ['vscode', 'vs code', 'ide', 'jetbrains', 'neovim', 'editor extension', 'inline autocomplete'],
    description: 'Integrates natively into code editors for real-time autocomplete and agentic inline edits.',
  },

  // Website & App Builders
  website_builder: {
    id: 'website_builder',
    name: 'Website & Landing Page Builder',
    category: 'App and Website Builders',
    keywords: ['website builder', 'website', 'landing page', 'build site', 'web page', 'html builder', 'portfolio website'],
    description: 'Generates responsive websites, landing pages, and components visually or from prompts.',
  },
  react_ui_generation: {
    id: 'react_ui_generation',
    name: 'React & Full-Stack UI Synthesis',
    category: 'App and Website Builders',
    keywords: ['react', 'next.js', 'nextjs', 'tailwind', 'shadcn', 'frontend component', 'full-stack app'],
    description: 'Generates production-ready React, Tailwind, and full-stack web applications.',
  },

  // Video Generation & Editing
  video_generation: {
    id: 'video_generation',
    name: 'Text-to-Video Generation',
    category: 'Video Generation',
    keywords: ['video generation', 'generate video', 'text to video', 'ai video', 'cinematic video', 'animate image'],
    description: 'Synthesizes video clips, animations, and camera motion directly from text prompts.',
  },
  video_editing: {
    id: 'video_editing',
    name: 'Video Editing & Repurposing',
    category: 'Video Editing and Repurposing',
    keywords: ['video editor', 'edit video', 'repurpose video', 'clip video', 'cut video', 'trim video', 'video editing'],
    description: 'Edits, trims, enhances, and reformats video content for social platforms.',
  },
  auto_subtitles: {
    id: 'auto_subtitles',
    name: 'Automatic Subtitles & Captions',
    category: 'Video Editing and Repurposing',
    keywords: ['subtitles', 'subtitle', 'automatic subtitles', 'auto subtitle', 'auto caption', 'captions', 'transcribe video', 'hardcoded subtitles'],
    description: 'Transcribes spoken dialogue into synchronized, styled subtitles and captions automatically.',
  },

  // Image Generation & Editing
  text_to_image: {
    id: 'text_to_image',
    name: 'Text-to-Image Generation',
    category: 'Image Generation',
    keywords: ['image generation', 'generate images', 'text to image', 'images from text', 'ai art', 'realistic photos', 'illustrations'],
    description: 'Creates photorealistic artwork, illustrations, concept art, and graphics from text prompts.',
  },
  image_editing: {
    id: 'image_editing',
    name: 'Image Editing & Enhancement',
    category: 'Image Editing and Enhancement',
    keywords: ['image editor', 'edit image', 'remove background', 'upscale image', 'inpaint', 'photo retouch'],
    description: 'Edits existing photos, removes backgrounds, upscales resolution, and performs generative inpainting.',
  },

  // Research & Knowledge
  cited_research: {
    id: 'cited_research',
    name: 'Research with Cited Sources',
    category: 'Research, Search, and Knowledge',
    keywords: ['research', 'cited sources', 'citations', 'academic search', 'literature review', 'verified sources', 'fact check'],
    description: 'Conducts deep web research and synthesizes answers backed by verifiable links and citations.',
  },
  pdf_analysis: {
    id: 'pdf_analysis',
    name: 'PDF & Document Analysis',
    category: 'PDF and Document AI',
    keywords: ['pdf', 'summarize pdf', 'document analysis', 'read pdf', 'extract from pdf', 'contract review'],
    description: 'Extracts data, summarizes long documents, and answers questions from uploaded PDF files.',
  },

  // Voice & Audio
  voice_synthesis: {
    id: 'voice_synthesis',
    name: 'Voice & Speech Synthesis',
    category: 'Voice and Text to Speech',
    keywords: ['voice', 'text to speech', 'tts', 'voiceover', 'voice cloning', 'speech synthesis', 'narrator'],
    description: 'Converts text into lifelike speech, voiceovers, and cloned audio personas.',
  },

  // General Assistants & All-Round Value
  value_for_money: {
    id: 'value_for_money',
    name: 'Value for Money & Cost Efficiency',
    category: 'General AI Assistants',
    keywords: ['value for money', 'best value', 'value', 'cost effective', 'bang for buck', 'affordable', 'worth it', 'cheapest'],
    description: 'Delivers maximum reasoning, context length, and capabilities relative to free allowances or subscription price.',
  },
  general_reasoning: {
    id: 'general_reasoning',
    name: 'General Conversational Reasoning',
    category: 'General AI Assistants',
    keywords: ['general assistant', 'chat', 'conversational', 'reasoning', 'multimodal', 'q&a', 'all-rounder'],
    description: 'Multi-purpose AI assistant capable of reasoning, writing, brainstorming, and analysis.',
  },
};

/**
 * Known Tool Capability Mapping Database
 * Provides verified facts, specific capabilities, verified free tiers,
 * and limitations for key tools across the 600-tool library.
 */
export interface ToolProfileRecord {
  tool_id?: number;
  name: string;
  category: string;
  supported_capabilities: string[];
  unsupported_capabilities: string[];
  verified_free_plan: boolean;
  free_plan_type: 'completely_free' | 'generous_recurring' | 'limited_trial' | 'none';
  free_plan_limitations: string;
  starting_price: number;
  platforms: ('web' | 'windows' | 'mac' | 'linux' | 'ios' | 'android')[];
  skill_level: 'beginner' | 'intermediate' | 'advanced';
  key_advantages: string[];
  key_limitations: string[];
  best_use_case: string;
}

export const VERIFIED_TOOL_PROFILES: Record<string, ToolProfileRecord> = {
  // Presentations & Slides
  gamma: {
    name: 'Gamma',
    category: 'Presentations and Slides',
    supported_capabilities: ['presentation_generation', 'ai_storytelling_deck', 'website_builder'],
    unsupported_capabilities: ['python_code_generation', 'video_editing'],
    verified_free_plan: true,
    free_plan_type: 'generous_recurring',
    free_plan_limitations: '400 AI credits on signup; basic templates free, Gamma badge on exports',
    starting_price: 10,
    platforms: ['web'],
    skill_level: 'beginner',
    key_advantages: ['Beautiful one-click slide design', 'Dynamic web presentation links', 'Extremely beginner friendly'],
    key_limitations: ['Credits depleted quickly with repeated regenerations', 'Limited manual pixel-level layout editing'],
    best_use_case: 'Instant professional presentations, pitch decks, and visual documents for beginners',
  },
  tome: {
    name: 'Tome',
    category: 'Presentations and Slides',
    supported_capabilities: ['presentation_generation', 'ai_storytelling_deck'],
    unsupported_capabilities: ['python_code_generation', 'auto_subtitles'],
    verified_free_plan: true,
    free_plan_type: 'generous_recurring',
    free_plan_limitations: 'Free starter tier with limited AI credits and standard exports',
    starting_price: 16,
    platforms: ['web', 'ios'],
    skill_level: 'beginner',
    key_advantages: ['Narrative-first canvas', 'Interactive media embeds', 'Clean mobile viewing'],
    key_limitations: ['Advanced AI generation requires Pro', 'Less traditional PowerPoint layout export'],
    best_use_case: 'Visual storytelling, executive summaries, and portfolio decks',
  },
  beautiful_ai: {
    name: 'Beautiful.ai',
    category: 'Presentations and Slides',
    supported_capabilities: ['presentation_generation'],
    unsupported_capabilities: ['python_code_generation'],
    verified_free_plan: false,
    free_plan_type: 'none',
    free_plan_limitations: '14-day trial only, requires credit card for trial activation',
    starting_price: 12,
    platforms: ['web'],
    skill_level: 'beginner',
    key_advantages: ['Smart slide templates with auto-adapting layouts', 'Export to PowerPoint PPTX'],
    key_limitations: ['No permanent free plan (trial only)', 'Credit card required upfront'],
    best_use_case: 'Enterprise presentation design with strict brand guidelines',
  },

  // Coding & Software Development
  cursor: {
    name: 'Cursor',
    category: 'Coding and Software Development',
    supported_capabilities: ['python_code_generation', 'debugging', 'code_explanation', 'ide_integration'],
    unsupported_capabilities: ['presentation_generation', 'video_editing'],
    verified_free_plan: true,
    free_plan_type: 'generous_recurring',
    free_plan_limitations: '2,000 free code completions/month and 50 slow premium requests included',
    starting_price: 20,
    platforms: ['mac', 'windows', 'linux'],
    skill_level: 'intermediate',
    key_advantages: ['Full codebase indexing & multi-file edits', 'Native VS Code fork', 'Superior inline autocomplete'],
    key_limitations: ['Requires desktop IDE installation (not purely web browser)', 'Pro quota needed for heavy Claude 3.5 Sonnet usage'],
    best_use_case: 'AI-assisted coding, multi-file refactoring, and project-wide debugging',
  },
  github_copilot: {
    name: 'GitHub Copilot',
    category: 'Coding and Software Development',
    supported_capabilities: ['python_code_generation', 'debugging', 'code_explanation', 'ide_integration'],
    unsupported_capabilities: ['presentation_generation'],
    verified_free_plan: true,
    free_plan_type: 'generous_recurring',
    free_plan_limitations: 'Completely free for verified students, educators, and popular OSS maintainers; $10/mo for individuals',
    starting_price: 10,
    platforms: ['mac', 'windows', 'linux', 'web'],
    skill_level: 'beginner',
    key_advantages: ['100% free for verified students', 'Seamless VS Code, Visual Studio, and JetBrains integration'],
    key_limitations: ['Standard commercial users must pay $10/mo after trial', 'Less agentic across large project directories than Cursor'],
    best_use_case: 'Student coding, everyday tab-autocomplete, and inline code explanations',
  },
  chatgpt: {
    name: 'ChatGPT',
    category: 'General AI Assistants',
    supported_capabilities: ['general_reasoning', 'python_code_generation', 'debugging', 'code_explanation', 'text_to_image', 'value_for_money'],
    unsupported_capabilities: ['auto_subtitles', 'ide_integration'],
    verified_free_plan: true,
    free_plan_type: 'generous_recurring',
    free_plan_limitations: 'Unlimited GPT-4o mini, periodic rate-limited GPT-4o access, memory resets',
    starting_price: 20,
    platforms: ['web', 'ios', 'android', 'mac', 'windows'],
    skill_level: 'beginner',
    key_advantages: ['Massive ecosystem & GPT Store', 'Generous free tier with web search & Python interpreter', 'Universal availability'],
    key_limitations: ['Rate limits on flagship models during peak hours', 'Not integrated directly as an IDE extension without third-party plugins'],
    best_use_case: 'Everyday general assistance, code explanation, learning, and multipurpose brainstorming',
  },
  claude: {
    name: 'Claude',
    category: 'General AI Assistants',
    supported_capabilities: ['general_reasoning', 'python_code_generation', 'debugging', 'code_explanation', 'react_ui_generation', 'value_for_money'],
    unsupported_capabilities: ['auto_subtitles', 'text_to_image'],
    verified_free_plan: true,
    free_plan_type: 'limited_trial',
    free_plan_limitations: 'Strict message quota that resets every 5 hours; includes live UI Artifacts and Claude 3.5 Sonnet',
    starting_price: 20,
    platforms: ['web', 'ios', 'android', 'mac'],
    skill_level: 'beginner',
    key_advantages: ['Top-tier coding benchmark performance', 'Live interactive Artifacts preview', '200K token context window'],
    key_limitations: ['Free tier message limits can be exhausted in 10-15 prompts on long sessions', 'No native image generation tool'],
    best_use_case: 'Complex logic reasoning, in-depth code reviews, and technical writing',
  },

  // Research with Cited Sources
  perplexity: {
    name: 'Perplexity',
    category: 'Research, Search, and Knowledge',
    supported_capabilities: ['cited_research', 'general_reasoning', 'code_explanation', 'value_for_money'],
    unsupported_capabilities: ['video_editing', 'auto_subtitles'],
    verified_free_plan: true,
    free_plan_type: 'generous_recurring',
    free_plan_limitations: 'Unlimited Quick searches with citations, 5 Pro searches every 4 hours free',
    starting_price: 20,
    platforms: ['web', 'ios', 'android'],
    skill_level: 'beginner',
    key_advantages: ['Direct inline academic & web citations', 'Up-to-date real-time web grounding', 'Clean source cards'],
    key_limitations: ['Pro search requires subscription for deep file uploads and multi-step reasoning'],
    best_use_case: 'Research, fact-checking, literature exploration with verifiable links',
  },
  consensus: {
    name: 'Consensus',
    category: 'Research, Search, and Knowledge',
    supported_capabilities: ['cited_research'],
    unsupported_capabilities: ['python_code_generation', 'video_editing'],
    verified_free_plan: true,
    free_plan_type: 'generous_recurring',
    free_plan_limitations: 'Free plan with unlimited searches across 200M+ peer-reviewed papers',
    starting_price: 9,
    platforms: ['web'],
    skill_level: 'beginner',
    key_advantages: ['Searches peer-reviewed science papers directly', 'Consensus meter showing scientific agreement'],
    key_limitations: ['Not intended for general web search or consumer questions'],
    best_use_case: 'Academic scientific research, medical queries, and literature citations',
  },

  // Video Editing & Automatic Subtitles
  capcut: {
    name: 'CapCut',
    category: 'Video Editing and Repurposing',
    supported_capabilities: ['video_editing', 'auto_subtitles'],
    unsupported_capabilities: ['python_code_generation', 'presentation_generation'],
    verified_free_plan: true,
    free_plan_type: 'generous_recurring',
    free_plan_limitations: 'Completely usable free tier for auto-captions and editing; optional Pro templates and effects',
    starting_price: 8,
    platforms: ['web', 'mac', 'windows', 'ios', 'android'],
    skill_level: 'beginner',
    key_advantages: ['Automatic accurate subtitles in 20+ languages', 'Runs directly in web browser and desktop', 'Extremely generous free tier'],
    key_limitations: ['Certain trending fonts and filters locked behind Pro subscription'],
    best_use_case: 'Social video editing, auto-caption generation for TikTok, YouTube Shorts, and Reels',
  },
  descript: {
    name: 'Descript',
    category: 'Video Editing and Repurposing',
    supported_capabilities: ['video_editing', 'auto_subtitles', 'voice_synthesis'],
    unsupported_capabilities: ['python_code_generation'],
    verified_free_plan: true,
    free_plan_type: 'generous_recurring',
    free_plan_limitations: '1 video export/mo without watermark, 1 hour transcription per month free',
    starting_price: 12,
    platforms: ['web', 'mac', 'windows'],
    skill_level: 'beginner',
    key_advantages: ['Edit video by editing the text transcript', 'Studio Sound audio cleanup', 'Overdub voice fix'],
    key_limitations: ['Watermark on free tier after 1 export/mo', 'Advanced exports limited without Creator plan'],
    best_use_case: 'Podcast editing, interview video transcription, and text-based video cuts',
  },
  invideo_ai: {
    name: 'invideo AI',
    category: 'Video Editing and Repurposing',
    supported_capabilities: ['video_editing', 'video_generation', 'auto_subtitles'],
    unsupported_capabilities: ['python_code_generation'],
    verified_free_plan: true,
    free_plan_type: 'limited_trial',
    free_plan_limitations: '10 mins/week AI generation with watermark on exported video',
    starting_price: 20,
    platforms: ['web', 'ios', 'android'],
    skill_level: 'beginner',
    key_advantages: ['Generates full video from text prompt with voiceover and captions', 'Fast turnaround for marketers'],
    key_limitations: ['Watermark on all free exports', 'Stock footage limits on low tiers'],
    best_use_case: 'Quick social video clips and promotional scripts from text prompts',
  },

  // Website Builders
  framer: {
    name: 'Framer',
    category: 'App and Website Builders',
    supported_capabilities: ['website_builder'],
    unsupported_capabilities: ['python_code_generation', 'video_editing'],
    verified_free_plan: true,
    free_plan_type: 'generous_recurring',
    free_plan_limitations: 'Free forever on framer.app subdomain with Framer badge',
    starting_price: 5,
    platforms: ['web', 'mac', 'windows'],
    skill_level: 'beginner',
    key_advantages: ['Visual canvas with responsive AI generation', 'Production speed & SEO out of the box', 'Free publishing on framer.app'],
    key_limitations: ['Custom domain requires paid plan ($5-$15/mo)'],
    best_use_case: 'Interactive design-first website building for designers and beginners',
  },
  v0: {
    name: 'v0 by Vercel',
    category: 'App and Website Builders',
    supported_capabilities: ['website_builder', 'react_ui_generation', 'code_explanation'],
    unsupported_capabilities: ['video_editing', 'presentation_generation'],
    verified_free_plan: true,
    free_plan_type: 'generous_recurring',
    free_plan_limitations: '200 free credits/mo renewing monthly; web preview and React code copy',
    starting_price: 20,
    platforms: ['web'],
    skill_level: 'intermediate',
    key_advantages: ['Generates clean React, Tailwind CSS, and shadcn/ui components', 'Direct copy-paste into Next.js projects'],
    key_limitations: ['Requires basic knowledge of React/npm to deploy code into full apps'],
    best_use_case: 'Full-stack React components, modern dashboards, and UI prototypes from text',
  },
  bolt: {
    name: 'Bolt.new',
    category: 'App and Website Builders',
    supported_capabilities: ['website_builder', 'react_ui_generation', 'python_code_generation'],
    unsupported_capabilities: ['video_editing'],
    verified_free_plan: true,
    free_plan_type: 'limited_trial',
    free_plan_limitations: 'Free tokens for initial project scaffolding; subscription for extended continuous dev',
    starting_price: 20,
    platforms: ['web'],
    skill_level: 'beginner',
    key_advantages: ['In-browser WebContainer running full node stack', 'One-click Netlify deploy'],
    key_limitations: ['Free tokens exhaust quickly on complex bug fixing loops'],
    best_use_case: 'Instant in-browser full-stack application prototyping',
  },

  // Image Generation
  midjourney: {
    name: 'Midjourney',
    category: 'Image Generation',
    supported_capabilities: ['text_to_image'],
    unsupported_capabilities: ['video_editing', 'python_code_generation'],
    verified_free_plan: false,
    free_plan_type: 'none',
    free_plan_limitations: 'Paid subscription required ($10/mo minimum)',
    starting_price: 10,
    platforms: ['web'],
    skill_level: 'beginner',
    key_advantages: ['Unmatched aesthetic coherence, lighting, and photorealism', 'Active community showcase'],
    key_limitations: ['Zero free tier (must pay $10/mo)', 'Web access requires prior generation history or standard plan'],
    best_use_case: 'High-end commercial illustrations, concept art, and photorealistic imagery',
  },
  recraft: {
    name: 'Recraft',
    category: 'Image Generation',
    supported_capabilities: ['text_to_image', 'image_editing'],
    unsupported_capabilities: ['video_editing', 'python_code_generation'],
    verified_free_plan: true,
    free_plan_type: 'generous_recurring',
    free_plan_limitations: 'Generous daily free credits; vector SVG export included',
    starting_price: 20,
    platforms: ['web'],
    skill_level: 'beginner',
    key_advantages: ['Generates true vector SVGs as well as raster 3D images', 'Brand palette color matching'],
    key_limitations: ['Commercial privacy features require Pro plan'],
    best_use_case: 'Graphic design, vector icons, illustrations, and marketing assets with free vector exports',
  },
};

/**
 * Normalizes user search input and detects target capabilities,
 * budget constraints, skill levels, platforms, and exclusions.
 */
export function analyzeQuerySemantics(query: string) {
  const q = query.toLowerCase().trim();

  // 1. Check for exclusions like "alternative to X", "replace X", "instead of X"
  const excludedTools: string[] = [];
  const altPatterns = [
    /(?:alternative|alternatives|competitor|competitors|similar)\s+(?:to|for)\s+([a-z0-9\s._-]+?)(?:\s+(?:for|with|that|and|but|$))/i,
    /(?:replace|instead of)\s+([a-z0-9\s._-]+?)(?:\s+(?:for|with|that|and|but|$))/i,
  ];

  for (const pattern of altPatterns) {
    const match = q.match(pattern);
    if (match && match[1]) {
      const toolCandidate = match[1].trim().toLowerCase();
      // Only exclude if it looks like a tool name
      if (['chatgpt', 'claude', 'gemini', 'copilot', 'midjourney', 'runway', 'canva', 'cursor', 'perplexity'].some(t => toolCandidate.includes(t))) {
        excludedTools.push(toolCandidate);
      }
    }
  }

  // 2. Detect budget constraint
  let budgetType: 'free_only' | 'freemium' | 'paid' | 'any' = 'any';
  let isFreePlanMandatory = false;

  if (
    q.includes('free only') ||
    q.includes('completely free') ||
    q.includes('100% free') ||
    q.includes('totally free') ||
    q.includes('no cost') ||
    q.includes('without paying') ||
    q.includes('best free') ||
    (q.includes('free') && (q.includes('must') || q.includes('require') || q.includes('only')))
  ) {
    budgetType = 'free_only';
    isFreePlanMandatory = true;
  } else if (q.includes('free plan') || q.includes('free tier') || q.includes('has a free') || q.includes('free')) {
    budgetType = 'freemium';
    isFreePlanMandatory = true;
  } else if (q.includes('paid') || q.includes('premium') || q.includes('commercial')) {
    budgetType = 'paid';
  }

  // 3. Detect skill level
  let skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'any' = 'any';
  if (q.includes('beginner') || q.includes('for a beginner') || q.includes('easy to use') || q.includes('simple') || q.includes('no code') || q.includes('student')) {
    skillLevel = 'beginner';
  } else if (q.includes('advanced') || q.includes('expert') || q.includes('professional') || q.includes('pro')) {
    skillLevel = 'advanced';
  }

  // 4. Detect platform
  const platforms: ('web' | 'windows' | 'mac' | 'linux' | 'ios' | 'android')[] = [];
  if (q.includes('browser') || q.includes('web') || q.includes('online') || q.includes('in browser') || q.includes('no download')) {
    platforms.push('web');
  }
  if (q.includes('mac') || q.includes('macos')) platforms.push('mac');
  if (q.includes('windows') || q.includes('pc')) platforms.push('windows');
  if (q.includes('linux')) platforms.push('linux');
  if (q.includes('ios') || q.includes('iphone') || q.includes('ipad')) platforms.push('ios');
  if (q.includes('android')) platforms.push('android');

  // 5. Detect capabilities from taxonomy
  const matchedCapabilities: string[] = [];
  for (const [capKey, capDef] of Object.entries(CAPABILITY_TAXONOMY)) {
    const hasMatch = capDef.keywords.some((kw) => {
      // word boundary match
      const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      return regex.test(q);
    });
    if (hasMatch) {
      matchedCapabilities.push(capKey);
    }
  }

  // 6. Detect primary category suggestion
  let suggestedCategory: string | undefined;
  if (matchedCapabilities.length > 0) {
    const firstCap = CAPABILITY_TAXONOMY[matchedCapabilities[0]];
    if (firstCap) suggestedCategory = firstCap.category;
  }

  return {
    excludedTools,
    budgetType,
    isFreePlanMandatory,
    skillLevel,
    platforms,
    matchedCapabilities,
    suggestedCategory,
  };
}
