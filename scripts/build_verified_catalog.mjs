import fs from 'fs';

// Canonical categories from src/types/tool.ts
const CANONICAL_CATEGORIES = [
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
];

const categorySet = new Set(CANONICAL_CATEGORIES);

// Define all 400 tools with their status
// status: 'duplicate' | 'new'
export const AUDIT_ENTRIES = [
  // === Page 2: AI Search, Research & Knowledge (601-631) ===
  { num: 601, name: "Consensus", status: "duplicate", matchId: 501, matchName: "Consensus", reason: "Identical product in research search (consensus.app)" },
  { num: 602, name: "Elicit", status: "duplicate", matchId: 502, matchName: "Elicit", reason: "Identical product in research paper discovery (elicit.com)" },
  { num: 603, name: "SciSpace", status: "duplicate", matchId: 503, matchName: "SciSpace", reason: "Identical product in scientific paper reading (typeset.io)" },
  { num: 604, name: "Research Rabbit", status: "duplicate", matchId: 504, matchName: "ResearchRabbit", reason: "Identical academic citation mapping tool (researchrabbitapp.com)" },
  { num: 605, name: "Connected Papers", status: "duplicate", matchId: 505, matchName: "Connected Papers", reason: "Identical visual academic paper network tool (connectedpapers.com)" },
  { num: 606, name: "Litmaps", status: "duplicate", matchId: 506, matchName: "Litmaps", reason: "Identical literature mapping and citation tracker (litmaps.com)" },
  { num: 607, name: "Scite", status: "duplicate", matchId: 507, matchName: "Scite", reason: "Identical smart citation context analysis tool (scite.ai)" },
  { num: 608, name: "Semantic Scholar", status: "duplicate", matchId: 508, matchName: "Semantic Scholar", reason: "Identical AI-backed scientific literature search by AI2 (semanticscholar.org)" },
  { 
    num: 609, 
    name: "OpenAlex", 
    status: "new",
    url: "https://openalex.org",
    category: "Research, Search, and Knowledge",
    access: "Open Source",
    freePlan: "Completely open dataset and API with generous rate limits; optional premium support available",
    why: "Open, comprehensive bibliographic index of scholarly papers, authors, institutions, and citations across all scientific disciplines."
  },
  { num: 610, name: "Iris.ai", status: "duplicate", matchId: 510, matchName: "Iris.ai", reason: "Identical research discovery and extraction workspace (iris.ai)" },
  { num: 611, name: "Undermind", status: "duplicate", matchId: 511, matchName: "Undermind", reason: "Identical deep AI literature discovery agent (undermind.ai)" },
  { num: 612, name: "Scholarcy", status: "duplicate", matchId: 512, matchName: "Scholarcy", reason: "Identical academic summary flashcard tool (scholarcy.com)" },
  { num: 613, name: "Explainpaper", status: "duplicate", matchId: 513, matchName: "Explainpaper", reason: "Identical complex academic paper text explainer (explainpaper.com)" },
  { num: 614, name: "Humata", status: "duplicate", matchId: 514, matchName: "Humata", reason: "Identical PDF and research document Q&A assistant (humata.ai)" },
  { num: 615, name: "Afforai", status: "duplicate", matchId: 515, matchName: "Afforai", reason: "Identical AI research assistant for reading, summarizing, and citing papers (afforai.com)" },
  {
    num: 616,
    name: "Genei",
    status: "new",
    url: "https://www.genei.io",
    category: "Research, Search, and Knowledge",
    access: "Freemium",
    freePlan: "14-day free trial with basic document analysis and summarization features",
    why: "AI-driven research workspace that summarizes articles, extracts key points, and organizes citations for faster academic writing."
  },
  {
    num: 617,
    name: "Mapify",
    status: "new",
    url: "https://mapify.so",
    category: "Research, Search, and Knowledge",
    access: "Freemium",
    freePlan: "Free tier with 10 mind map generations per day and interactive tree exploration",
    why: "Generates clear, interactive mind maps and knowledge trees from documents, web pages, and YouTube videos using AI."
  },
  {
    num: 618,
    name: "Glasp",
    status: "new",
    url: "https://glasp.co",
    category: "Research, Search, and Knowledge",
    access: "Freemium",
    freePlan: "Free web highlighter, social note-taking, and AI summaries with basic export options",
    why: "Social web highlighter that captures key passages from articles and YouTube videos, generating AI summaries to share with a community."
  },
  {
    num: 619,
    name: "Recall",
    status: "new",
    url: "https://www.getrecall.ai",
    category: "Research, Search, and Knowledge",
    access: "Freemium",
    freePlan: "Free tier with monthly credit quota for summarizing articles, videos, and podcasts",
    why: "Personal knowledge base that summarizes online content and links related concepts into an interconnected knowledge graph."
  },
  {
    num: 620,
    name: "Fabric",
    status: "new",
    url: "https://fabric.so",
    category: "Research, Search, and Knowledge",
    access: "Freemium",
    freePlan: "Free personal plan with up to 5GB storage and intelligent semantic search",
    why: "Self-organizing digital workspace and cloud drive that automatically tags, indexes, and retrieves documents, notes, and links."
  },
  { num: 621, name: "NotebookLM", status: "duplicate", matchId: 509, matchName: "NotebookLM", reason: "Identical Google AI personalized notebook with source-grounded answers (notebooklm.google)" },
  { num: 622, name: "Glean", status: "duplicate", matchId: 516, matchName: "Glean", reason: "Identical enterprise work assistant and enterprise search platform (glean.com)" },
  { num: 623, name: "Hebbia", status: "duplicate", matchId: 518, matchName: "Hebbia", reason: "Identical AI matrix search platform for financial and legal due diligence (hebbia.ai)" },
  { num: 624, name: "AlphaSense", status: "duplicate", matchId: 519, matchName: "AlphaSense", reason: "Identical market intelligence and financial search platform (alpha-sense.com)" },
  {
    num: 625,
    name: "Feedly AI",
    status: "new",
    url: "https://feedly.com",
    category: "Research, Search, and Knowledge",
    access: "Freemium",
    freePlan: "Free RSS reader up to 100 sources; AI assistant Leo available on premium trial",
    why: "Market intelligence and news feed aggregator with AI assistant Leo that filters noise, tracks competitor moves, and summarizes key insights."
  },
  {
    num: 626,
    name: "Inoreader AI",
    status: "new",
    url: "https://www.inoreader.com",
    category: "Research, Search, and Knowledge",
    access: "Freemium",
    freePlan: "Free news feed reader up to 150 feeds with limited AI summaries per month",
    why: "Content discovery and RSS reader platform with AI summarization, automatic translation, and smart duplicate filtering."
  },
  { num: 627, name: "Exa", status: "duplicate", matchId: 217, matchName: "Exa", reason: "Identical neural search API for AI agents and LLMs (exa.ai)" },
  { num: 628, name: "Tavily", status: "duplicate", matchId: 218, matchName: "Tavily", reason: "Identical search engine optimized for AI agents and RAG (tavily.com)" },
  { num: 629, name: "Kagi Assistant", status: "duplicate", matchId: 219, matchName: "Kagi Assistant", reason: "Identical private search engine AI assistant (kagi.com)" },
  { num: 630, name: "Perplexity Pages", status: "duplicate", matchId: 5, matchName: "Perplexity", reason: "Publishing and curation feature of Perplexity AI platform (perplexity.ai)" },
  { num: 631, name: "You.com Research", status: "duplicate", matchId: 220, matchName: "You.com Research", reason: "Identical multimodal research search mode of You.com (you.com)" },

  // === Page 3: AI Search (632-641) & Writing (642-660) ===
  {
    num: 632,
    name: "Felo",
    status: "new",
    url: "https://felo.ai",
    category: "Research, Search, and Knowledge",
    access: "Freemium",
    freePlan: "Free daily search queries with cross-language research and document generation",
    why: "Cross-language AI search engine that translates and summarizes global sources into your native tongue with source verification."
  },
  { num: 633, name: "Komo", status: "duplicate", matchId: 18, matchName: "Komo AI", reason: "Identical fast, ad-free AI search engine (komo.ai)" },
  { num: 634, name: "SearchGPT", status: "duplicate", matchId: 1, matchName: "ChatGPT", reason: "Prototype web search feature integrated directly into ChatGPT (chatgpt.com)" },
  {
    num: 635,
    name: "Arc Search",
    status: "new",
    url: "https://arc.net",
    category: "Research, Search, and Knowledge",
    access: "Free",
    freePlan: "Completely free mobile web browser with 'Browse for Me' AI page synthesis",
    why: "Mobile AI browser that synthesizes answers across top web pages into a clean, ad-free summary card with source links."
  },
  {
    num: 636,
    name: "Opera Aria",
    status: "new",
    url: "https://www.opera.com/features/aria",
    category: "Research, Search, and Knowledge",
    access: "Free",
    freePlan: "Free browser AI assistant built into Opera desktop and mobile with no subscription",
    why: "Native browser AI assistant by Opera delivering real-time web search, text generation, image generation, and webpage explanations."
  },
  { num: 637, name: "Andi Search", status: "duplicate", matchId: 19, matchName: "Andi", reason: "Identical conversational search engine that answers questions directly (andisearch.com)" },
  { num: 638, name: "Phind", status: "duplicate", matchId: 17, matchName: "Phind", reason: "Identical search engine tailored specifically for developers (phind.com)" },
  { num: 639, name: "Metaphor", status: "duplicate", matchId: 217, matchName: "Exa", reason: "Former name of Exa AI search (metaphor.systems redirected to exa.ai)" },
  {
    num: 640,
    name: "Brave Search Summarizer",
    status: "new",
    url: "https://search.brave.com",
    category: "Research, Search, and Knowledge",
    access: "Free",
    freePlan: "Completely free private search with integrated AI answer summaries and citations",
    why: "Privacy-focused search engine feature that summarizes search queries using an independent web index without tracking users."
  },
  { num: 641, name: "Perplexity Labs", status: "duplicate", matchId: 5, matchName: "Perplexity", reason: "Model playground feature hosted by Perplexity AI (labs.perplexity.ai)" },
  { num: 642, name: "Sudowrite", status: "duplicate", matchId: 186, matchName: "Sudowrite", reason: "Identical AI creative writing partner for novelists and screenwriters (sudowrite.com)" },
  {
    num: 643,
    name: "NovelAI",
    status: "new",
    url: "https://novelai.net",
    category: "Writing and Copywriting",
    access: "Paid",
    freePlan: "Free trial with 50 text generation credits; subscription tiers for unlimited storytelling",
    why: "Subscription cloud storytelling platform and novel generator powered by custom GPT models tailored for creative fiction."
  },
  { num: 644, name: "Lex", status: "duplicate", matchId: 564, matchName: "Lex.page", reason: "Identical collaborative AI word processor (lex.page)" },
  {
    num: 645,
    name: "Type.ai",
    status: "new",
    url: "https://type.ai",
    category: "Writing and Copywriting",
    access: "Freemium",
    freePlan: "Free tier with monthly word allowance and AI drafting tools",
    why: "AI-first document editor designed to help authors and marketers brainstorm, outline, draft, and rewrite content at lightning speed."
  },
  { num: 646, name: "Writer.com", status: "duplicate", matchId: 187, matchName: "Writer", reason: "Identical enterprise generative AI writing and style governance platform (writer.com)" },
  { num: 647, name: "Anyword", status: "duplicate", matchId: 188, matchName: "Anyword", reason: "Identical performance marketing copywriter with predictive scoring (anyword.com)" },
  { num: 648, name: "Writesonic", status: "duplicate", matchId: 183, matchName: "Writesonic", reason: "Identical AI writer and SEO content generation platform (writesonic.com)" },
  { num: 649, name: "Copy.ai", status: "duplicate", matchId: 184, matchName: "Copy.ai", reason: "Identical GTM AI platform for marketing and sales copy (copy.ai)" },
  { num: 650, name: "Rytr", status: "duplicate", matchId: 185, matchName: "Rytr", reason: "Identical AI writing assistant generating content in seconds (rytr.me)" },
  { num: 651, name: "Wordtune", status: "duplicate", matchId: 191, matchName: "Wordtune", reason: "Identical AI reading and writing companion by AI21 Labs (wordtune.com)" },
  { num: 652, name: "QuillBot", status: "duplicate", matchId: 192, matchName: "QuillBot", reason: "Identical paraphrasing tool and grammar checker (quillbot.com)" },
  { num: 653, name: "ProWritingAid", status: "duplicate", matchId: 567, matchName: "ProWritingAid", reason: "Identical comprehensive manuscript and grammar editing software (prowritingaid.com)" },
  {
    num: 654,
    name: "LanguageTool",
    status: "new",
    url: "https://languagetool.org",
    category: "Writing and Copywriting",
    access: "Freemium",
    freePlan: "Free grammar, spelling, and style check up to 10,000 characters per evaluation",
    why: "Multilingual grammar, style, and spell checker supporting over 30 languages with AI-powered paraphrasing suggestions."
  },
  {
    num: 655,
    name: "DeepL Write",
    status: "new",
    url: "https://www.deepl.com/write",
    category: "Writing and Copywriting",
    access: "Freemium",
    freePlan: "Free text improvement and tone adjustment for up to 2,000 characters per entry",
    why: "AI writing companion by DeepL that fixes syntax, eliminates ambiguity, and refines nuance for professional English and German text."
  },
  { num: 656, name: "HyperWrite", status: "duplicate", matchId: 568, matchName: "HyperWrite", reason: "Identical personal AI writing assistant and web agent (hyperwriteai.com)" },
  { num: 657, name: "Jasper", status: "duplicate", matchId: 181, matchName: "Jasper", reason: "Identical enterprise AI marketing copilot and content creator (jasper.ai)" },
  { num: 658, name: "TextCortex", status: "duplicate", matchId: 569, matchName: "TextCortex", reason: "Identical customizable AI workspace with browser extension Zeno (textcortex.com)" },
  {
    num: 659,
    name: "Smodin",
    status: "new",
    url: "https://smodin.io",
    category: "Writing and Copywriting",
    access: "Freemium",
    freePlan: "3 free daily writing and rewriting credits with basic citation tools",
    why: "Multi-tool writing assistant featuring an AI rewriter, essay grader, citation generator, and multilingual text translator."
  },
  { num: 660, name: "Simplified AI Writer", status: "duplicate", matchId: 189, matchName: "Simplified", reason: "Identical copywriting module of Simplified design suite (simplified.com)" },

  // === Page 4: Writing (661-682) & Coding (683-689) ===
  { num: 661, name: "Peppertype", status: "duplicate", matchId: 190, matchName: "Peppertype.ai", reason: "Identical content marketing AI platform by Pepper Content (peppertype.ai)" },
  {
    num: 662,
    name: "INK",
    status: "new",
    url: "https://inkforall.com",
    category: "Writing and Copywriting",
    access: "Paid",
    freePlan: "5-day free trial with full AI content generation and SEO protection suite",
    why: "All-in-one SEO content optimization suite combining AI writing, keyword clustering, and AI content shield defense."
  },
  { num: 663, name: "ClosersCopy", status: "duplicate", matchId: 571, matchName: "ClosersCopy", reason: "Identical proprietary AI copywriting tool for direct sales copy (closerscopy.com)" },
  { num: 664, name: "Frase", status: "duplicate", matchId: 572, matchName: "Frase", reason: "Identical SEO content brief and AI writing platform (frase.io)" },
  {
    num: 665,
    name: "Outwrite",
    status: "new",
    url: "https://www.outwrite.com",
    category: "Writing and Copywriting",
    access: "Freemium",
    freePlan: "Free spelling, grammar, and dictionary suggestions with browser extension",
    why: "Writing assistant that enhances readability, rephrases sentences for clarity, and checks plagiarism across web editors."
  },
  {
    num: 666,
    name: "Hemingway Editor",
    status: "new",
    url: "https://hemingwayapp.com",
    category: "Writing and Copywriting",
    access: "Freemium",
    freePlan: "Free web-based readability analyzer; paid desktop app and AI rewrite credits available",
    why: "Distraction-free readability editor highlighting complex sentences, passive voice, and weak adverbs, now enhanced with AI rewrites."
  },
  {
    num: 667,
    name: "Scribbr",
    status: "new",
    url: "https://www.scribbr.com",
    category: "Writing and Copywriting",
    access: "Freemium",
    freePlan: "Free APA, MLA, and Chicago citation generator and basic grammar proofing tools",
    why: "Academic student suite providing citation generators, plagiarism detection powered by Turnitin, and AI proofreading."
  },
  { num: 668, name: "Jenni AI", status: "duplicate", matchId: 573, matchName: "Jenni AI", reason: "Identical AI writing assistant for academic researchers and essays (jenni.ai)" },
  {
    num: 669,
    name: "EssayDone",
    status: "new",
    url: "https://essaydone.ai",
    category: "Writing and Copywriting",
    access: "Freemium",
    freePlan: "Free trial credits for generating outlines, citations, and introductory paragraphs",
    why: "Specialized academic writing assistant that helps students brainstorm thesis statements, structure arguments, and format citations."
  },
  { num: 670, name: "Paperpal", status: "duplicate", matchId: 576, matchName: "Paperpal", reason: "Identical academic writing tool tailored for journal submissions (paperpal.com)" },
  { num: 671, name: "Trinka", status: "duplicate", matchId: 577, matchName: "Trinka AI", reason: "Identical AI grammar checker for academic and technical writing (trinka.ai)" },
  {
    num: 672,
    name: "Aithor",
    status: "new",
    url: "https://aithor.com",
    category: "Writing and Copywriting",
    access: "Freemium",
    freePlan: "Free basic essay generation with limited word count and standard citation format",
    why: "AI research and essay assistant that generates structured academic papers with verifiable citations and invisible AI detection rephrasing."
  },
  {
    num: 673,
    name: "EssayWriter",
    status: "new",
    url: "https://essaywriter.org",
    category: "Writing and Copywriting",
    access: "Freemium",
    freePlan: "Free outline generator and topic brainstormer with sample essay drafts",
    why: "AI-driven writing tool for students and academics that drafts essay structures, bibliographies, and literature reviews."
  },
  {
    num: 674,
    name: "HIX.AI",
    status: "new",
    url: "https://hix.ai",
    category: "Writing and Copywriting",
    access: "Freemium",
    freePlan: "Free tier with 1,000 words per week across AI writer and search tools",
    why: "All-in-one AI writing copilot offering over 120 writing tools, AI search engine, grammar checker, and browser extension."
  },
  {
    num: 675,
    name: "Monica",
    status: "new",
    url: "https://monica.im",
    category: "General AI Assistants",
    access: "Freemium",
    freePlan: "Free daily AI queries powered by leading models with sidebar chrome extension",
    why: "Versatile browser copilot extension integrating ChatGPT, Claude, and Gemini for instant drafting, translation, and page summaries."
  },
  {
    num: 676,
    name: "Merlin",
    status: "new",
    url: "https://www.getmerlin.in",
    category: "General AI Assistants",
    access: "Freemium",
    freePlan: "Free daily query quota to chat with websites, YouTube videos, and PDFs",
    why: "AI browser extension that brings multi-model AI assistants to any webpage with a single keyboard shortcut."
  },
  {
    num: 677,
    name: "Sider",
    status: "new",
    url: "https://sider.ai",
    category: "General AI Assistants",
    access: "Freemium",
    freePlan: "30 free AI queries per day supporting web chat, writing, and reading",
    why: "All-in-one sidebar AI extension giving instant access to top LLM models, translation, and image generation anywhere online."
  },
  {
    num: 678,
    name: "MaxAI",
    status: "new",
    url: "https://www.maxai.me",
    category: "General AI Assistants",
    access: "Freemium",
    freePlan: "Free daily credits for inline AI writing, rewriting, and summarization in browser",
    why: "Browser extension that enables 1-click writing and reading assistance directly inside Gmail, Notion, Docs, and social media."
  },
  {
    num: 679,
    name: "Compose AI",
    status: "new",
    url: "https://www.compose.ai",
    category: "Writing and Copywriting",
    access: "Freemium",
    freePlan: "Free extension with autocompletion and 1,000 AI generated words per month",
    why: "Chrome extension that accelerates typing through real-time autocompletion and phrasing suggestions across email and web forms."
  },
  {
    num: 680,
    name: "Flowrite",
    status: "new",
    url: "https://www.flowrite.com",
    category: "Writing and Copywriting",
    access: "Freemium",
    freePlan: "14-day free trial with customizable email templates and message expansion",
    why: "Communication assistant that transforms short bullet points into ready-to-send professional emails and messages."
  },
  {
    num: 681,
    name: "Ellie",
    status: "new",
    url: "https://tryellie.com",
    category: "Writing and Copywriting",
    access: "Freemium",
    freePlan: "Free tier with 2 free email replies per day supporting standard tones",
    why: "AI email assistant that learns your personal writing voice and crafts contextual replies directly inside Gmail and Fastmail."
  },
  { num: 682, name: "Lavender Email Assistant", status: "duplicate", matchId: 309, matchName: "Lavender", reason: "Identical sales email coaching and inbox intelligence assistant (lavender.ai)" },
  { num: 683, name: "Sourcegraph Cody", status: "duplicate", matchId: 28, matchName: "Cody", reason: "Identical AI coding assistant with whole-codebase awareness (sourcegraph.com/cody)" },
  { num: 684, name: "Tabnine", status: "duplicate", matchId: 25, matchName: "Tabnine", reason: "Identical privacy-first AI code completion tool for developers (tabnine.com)" },
  { num: 685, name: "Continue", status: "duplicate", matchId: 29, matchName: "Continue", reason: "Identical open-source AI code assistant for VS Code and JetBrains (continue.dev)" },
  { num: 686, name: "Aider", status: "duplicate", matchId: 30, matchName: "Aider", reason: "Identical AI pair programming in terminal using git repositories (aider.chat)" },
  {
    num: 687,
    name: "OpenHands",
    status: "new",
    url: "https://github.com/All-Hands-AI/OpenHands",
    category: "Coding and Software Development",
    access: "Open Source",
    freePlan: "Completely open source software; free to self-host with your own LLM API keys",
    why: "Open-source autonomous AI software development agent platform (formerly OpenDevin) that can plan, code, run bash commands, and debug."
  },
  { num: 688, name: "Cline", status: "duplicate", matchId: 31, matchName: "Cline", reason: "Identical autonomous coding agent extension for VS Code (github.com/cline/cline)" },
  { num: 689, name: "Roo Code", status: "duplicate", matchId: 32, matchName: "Roo Code", reason: "Identical AI pair programmer fork of Cline with custom modes (roocode.com)" },

  // === Page 5: Developer & Coding (690-721) ===
  {
    num: 690,
    name: "Zed AI",
    status: "new",
    url: "https://zed.dev",
    category: "Coding and Software Development",
    access: "Freemium",
    freePlan: "Completely free open-source editor; bring your own API keys or use Zed AI subscription",
    why: "High-performance multiplayer code editor written in Rust with deeply integrated AI chat, inline transformation, and custom model routing."
  },
  { num: 691, name: "Amazon Q Developer", status: "duplicate", matchId: 27, matchName: "Amazon Q Developer", reason: "Identical generative AI coding assistant for AWS and software development (aws.amazon.com/q/developer)" },
  {
    num: 692,
    name: "IBM watsonx Code Assistant",
    status: "new",
    url: "https://www.ibm.com/products/watsonx-code-assistant",
    category: "Coding and Software Development",
    access: "Freemium",
    freePlan: "Free tier on IBM Cloud with 30-day evaluation period and starter tokens",
    why: "Enterprise code generation and modernization tool specialized for Java, Ansible automation, and COBOL application refactoring."
  },
  { num: 693, name: "Qodo", status: "duplicate", matchId: 36, matchName: "Qodo", reason: "Identical AI-powered code integrity, testing, and review platform (qodo.ai)" },
  { num: 694, name: "CodiumAI", status: "duplicate", matchId: 36, matchName: "Qodo", reason: "Former name of Qodo; rebranded in 2024 (qodo.ai)" },
  { num: 695, name: "Mutable.ai", status: "duplicate", matchId: 39, matchName: "MutableAI", reason: "Identical AI software development platform with automated documentation (mutable.ai)" },
  { num: 696, name: "CodeRabbit", status: "duplicate", matchId: 35, matchName: "CodeRabbit", reason: "Identical AI-powered automated pull request reviewer (coderabbit.ai)" },
  {
    num: 697,
    name: "Graphite",
    status: "new",
    url: "https://graphite.dev",
    category: "Coding and Software Development",
    access: "Freemium",
    freePlan: "Free tier for individual developers with stacked PR workflows and AI review summary",
    why: "Developer workflow platform for stacked Git pull requests featuring an autonomous AI review agent that catches bugs before merge."
  },
  {
    num: 698,
    name: "Greptile",
    status: "new",
    url: "https://www.greptile.com",
    category: "Coding and Software Development",
    access: "Freemium",
    freePlan: "Free trial for open-source repositories with full repository indexing",
    why: "Codebase-aware AI agent that reviews pull requests, answers complex architectural questions, and indexes private repos."
  },
  {
    num: 699,
    name: "Bito",
    status: "new",
    url: "https://bito.ai",
    category: "Coding and Software Development",
    access: "Freemium",
    freePlan: "Free tier with unlimited code completions and basic AI code review agents",
    why: "AI developer platform providing automated pull request reviews, unit test generation, and intelligent code completions inside IDEs."
  },
  { num: 700, name: "Pieces for Developers", status: "duplicate", matchId: 40, matchName: "Pieces for Developers", reason: "Identical on-device AI snippet management and contextual coding assistant (pieces.app)" },
  { num: 701, name: "Blackbox AI", status: "duplicate", matchId: 38, matchName: "Blackbox AI", reason: "Identical coding copilot and code search engine (blackbox.ai)" },
  {
    num: 702,
    name: "Codeium",
    status: "new",
    url: "https://codeium.com",
    category: "Coding and Software Development",
    access: "Freemium",
    freePlan: "Free forever for individual developers with unlimited fast autocomplete and in-IDE chat",
    why: "Lightning-fast, free-for-individuals AI code completion and chat extension supporting over 70 programming languages across 40+ IDEs."
  },
  { num: 703, name: "Windsurf", status: "duplicate", matchId: 23, matchName: "Windsurf", reason: "Identical agentic IDE built by Codeium (windsurf.com)" },
  { num: 704, name: "Replit Agent", status: "duplicate", matchId: 24, matchName: "Replit", reason: "Autonomous software development agent within Replit platform (replit.com)" },
  { num: 705, name: "Bolt.new", status: "duplicate", matchId: 41, matchName: "Bolt", reason: "Identical browser-based in-browser full-stack AI development workspace (bolt.new)" },
  { num: 706, name: "Lovable", status: "duplicate", matchId: 43, matchName: "Lovable", reason: "Identical full-stack web app builder from natural language prompts (lovable.dev)" },
  { num: 707, name: "v0", status: "duplicate", matchId: 42, matchName: "v0", reason: "Identical generative UI system by Vercel for React and Tailwind (v0.dev)" },
  { num: 708, name: "Firebase Studio", status: "duplicate", matchId: 44, matchName: "Firebase Studio", reason: "Identical cloud development environment for web and mobile apps (idx.dev)" },
  {
    num: 709,
    name: "Pythagora",
    status: "new",
    url: "https://www.pythagora.ai",
    category: "Coding and Software Development",
    access: "Freemium",
    freePlan: "Free trial with starter tokens to build and run initial web applications",
    why: "Autonomous developer agent that talks with you to clarify specs, plans architecture, and builds full-stack Node/React apps from scratch."
  },
  {
    num: 710,
    name: "Sweep",
    status: "new",
    url: "https://sweep.dev",
    category: "Coding and Software Development",
    access: "Freemium",
    freePlan: "Free tier for open-source repositories and limited monthly automated PRs",
    why: "AI junior developer that turns GitHub bug reports and feature requests directly into tested pull requests."
  },
  { num: 711, name: "Devin", status: "duplicate", matchId: 33, matchName: "Devin", reason: "Identical autonomous AI software engineer by Cognition (cognition.ai/devin)" },
  {
    num: 712,
    name: "Factory AI",
    status: "new",
    url: "https://www.factory.ai",
    category: "Coding and Software Development",
    access: "Paid",
    freePlan: "Enterprise pilot and trial available upon request for engineering teams",
    why: "Autonomous software engineering Droids that automate code migrations, code reviews, and test generation in enterprise repositories."
  },
  {
    num: 713,
    name: "Refact.ai",
    status: "new",
    url: "https://refact.ai",
    category: "Coding and Software Development",
    access: "Open Source",
    freePlan: "Open-source self-hostable edition free forever; cloud plans offer free starter tier",
    why: "Open-source AI coding assistant, agent, and self-hostable fine-tuned code completion server that keeps proprietary code private."
  },
  {
    num: 714,
    name: "AskCodi",
    status: "new",
    url: "https://www.askcodi.com",
    category: "Coding and Software Development",
    access: "Freemium",
    freePlan: "Free plan with 50 credits per month for code generation and syntax fixes",
    why: "AI development assistant offering quick syntax help, code translation between languages, and automated test suite creation."
  },
  {
    num: 715,
    name: "MarsCode",
    status: "new",
    url: "https://www.marscode.com",
    category: "Coding and Software Development",
    access: "Free",
    freePlan: "Free cloud-based IDE and code extension with unlimited AI code completion and debugging",
    why: "Cloud-based AI IDE and code completion assistant by ByteDance that simplifies project setup and accelerates everyday coding."
  },
  {
    num: 716,
    name: "CodeGeeX",
    status: "new",
    url: "https://codegeex.cn",
    category: "Coding and Software Development",
    access: "Free",
    freePlan: "Free for individual developers with open model weights and IDE plugins",
    why: "Multilingual open code generation model and IDE extension supporting cross-language code translation and automated comments."
  },
  {
    num: 717,
    name: "Twinny",
    status: "new",
    url: "https://github.com/rjmacarthy/twinny",
    category: "Coding and Software Development",
    access: "Open Source",
    freePlan: "100% free and open-source VS Code extension; runs with local Ollama or LM Studio models",
    why: "Local, private AI pair programmer for VS Code designed to work seamlessly with local LLMs without sending code to cloud servers."
  },
  {
    num: 718,
    name: "FauxPilot",
    status: "new",
    url: "https://github.com/fauxpilot/fauxpilot",
    category: "Coding and Software Development",
    access: "Open Source",
    freePlan: "Free open-source self-hosted server running on your own NVIDIA GPUs",
    why: "Open-source, self-hosted GitHub Copilot alternative that serves open code completion models locally via Triton Inference Server."
  },
  {
    num: 719,
    name: "GPT Pilot",
    status: "new",
    url: "https://github.com/Pythagora-io/gpt-pilot",
    category: "Coding and Software Development",
    access: "Open Source",
    freePlan: "Completely open-source core development agent on GitHub; bring your own LLM API keys",
    why: "Open-source developer agent that writes full-stack applications step by step while testing each layer and asking for feedback."
  },
  {
    num: 720,
    name: "Testim",
    status: "new",
    url: "https://www.testim.io",
    category: "Coding and Software Development",
    access: "Freemium",
    freePlan: "Free community tier with up to 1,000 test runs per month and self-healing tests",
    why: "AI-driven automated end-to-end testing platform with self-healing locators that prevent test flakiness in agile release cycles."
  },
  {
    num: 721,
    name: "Mabl",
    status: "new",
    url: "https://www.mabl.com",
    category: "Coding and Software Development",
    access: "Paid",
    freePlan: "14-day comprehensive trial with automated regression suites and visual assertions",
    why: "Enterprise intelligent test automation platform providing low-code API, browser, and mobile testing with self-healing capabilities."
  },

  // === Page 6: Developer, Coding & Testing (722-753) ===
  {
    num: 722,
    name: "Functionize",
    status: "new",
    url: "https://www.functionize.com",
    category: "Coding and Software Development",
    access: "Paid",
    freePlan: "Custom demo and free trial for enterprise QA engineering teams",
    why: "Cloud test automation platform leveraging computer vision and neural networks to run autonomous regression testing at scale."
  },
  {
    num: 723,
    name: "Applitools",
    status: "new",
    url: "https://applitools.com",
    category: "Coding and Software Development",
    access: "Freemium",
    freePlan: "Free starter tier with 100 visual checkpoint comparisons per month",
    why: "Visual AI testing and monitoring platform that automatically detects visual bugs, layout regressions, and cross-browser rendering flaws."
  },
  {
    num: 724,
    name: "Diffblue",
    status: "new",
    url: "https://www.diffblue.com",
    category: "Coding and Software Development",
    access: "Freemium",
    freePlan: "Free community edition for Java developers to generate unit tests locally in IntelliJ",
    why: "Autonomous AI-driven test writing tool that writes and updates complete Java unit test suites without human intervention."
  },
  {
    num: 725,
    name: "Codacy",
    status: "new",
    url: "https://www.codacy.com",
    category: "Coding and Software Development",
    access: "Freemium",
    freePlan: "Free forever for open-source projects; 14-day free trial for private team repositories",
    why: "Automated code review and code quality platform that monitors technical debt, security issues, and code coverage with AI fixes."
  },
  {
    num: 726,
    name: "SonarQube AI",
    status: "new",
    url: "https://www.sonarsource.com/products/sonarqube/",
    category: "Coding and Software Development",
    access: "Freemium",
    freePlan: "Free open-source Community Edition with static analysis for 17+ languages",
    why: "Industry-standard clean code platform that detects security vulnerabilities, code smells, and bugs, providing AI code fix suggestions."
  },
  {
    num: 727,
    name: "Snyk DeepCode",
    status: "new",
    url: "https://snyk.io/platform/deepcode-ai/",
    category: "Coding and Software Development",
    access: "Freemium",
    freePlan: "Free tier with up to 100 code security tests per month for individual developers",
    why: "AI-powered static application security testing engine trained on millions of open-source commits to find and fix security flaws."
  },
  { num: 728, name: "Qodo Merge", status: "duplicate", matchId: 36, matchName: "Qodo", reason: "Pull request review module of Qodo, formerly known as PR-Agent (qodo.ai)" },
  {
    num: 729,
    name: "Mintlify",
    status: "new",
    url: "https://mintlify.com",
    category: "Coding and Software Development",
    access: "Freemium",
    freePlan: "Free tier for personal projects and open source with beautiful responsive docs",
    why: "Modern developer documentation platform that auto-generates API references, interactive playgrounds, and doc pages using AI."
  },
  {
    num: 730,
    name: "Swimm",
    status: "new",
    url: "https://swimm.io",
    category: "Coding and Software Development",
    access: "Freemium",
    freePlan: "Free for small engineering teams up to 5 users with code-coupled documentation",
    why: "Knowledge-sharing platform that couples documentation directly to code snippets, auto-updating docs as codebases evolve."
  },
  {
    num: 731,
    name: "Documatic",
    status: "new",
    url: "https://www.documatic.com",
    category: "Coding and Software Development",
    access: "Freemium",
    freePlan: "Free tier for individual developers indexing up to 2 code repositories",
    why: "Developer tool that auto-documents codebases, generates changelogs, and enables plain-English code search across repos."
  },
  {
    num: 732,
    name: "WhatTheDiff",
    status: "new",
    url: "https://whatthediff.ai",
    category: "Coding and Software Development",
    access: "Freemium",
    freePlan: "Free plan with 25,000 monthly tokens for summarizing small pull requests",
    why: "AI-powered GitHub assistant that writes clear pull request summaries, notifies teams, and drafts release notes automatically."
  },
  { num: 733, name: "Mutable", status: "duplicate", matchId: 39, matchName: "MutableAI", reason: "Identical autonomous AI coding and wiki platform (mutable.ai)" },
  {
    num: 734,
    name: "GitBook AI",
    status: "new",
    url: "https://www.gitbook.com",
    category: "Coding and Software Development",
    access: "Freemium",
    freePlan: "Free plan for public documentation and community projects with AI search features",
    why: "Collaborative knowledge platform for technical teams featuring AI search, automatic drafting, and seamless Git sync."
  },
  {
    num: 735,
    name: "ReadMe AI",
    status: "new",
    url: "https://readme.com",
    category: "Coding and Software Development",
    access: "Freemium",
    freePlan: "14-day free trial to build interactive developer hubs and API references",
    why: "Interactive API documentation platform featuring Owl, an AI assistant that answers developer questions and writes code samples."
  },
  {
    num: 736,
    name: "Fern",
    status: "new",
    url: "https://buildwithfern.com",
    category: "Coding and Software Development",
    access: "Freemium",
    freePlan: "Free tier for generating TypeScript and Python SDKs and OpenAPI documentation",
    why: "Toolkit that generates idiomatic client SDKs in multiple languages and beautiful documentation directly from OpenAPI specs."
  },
  {
    num: 737,
    name: "Stainless",
    status: "new",
    url: "https://www.stainlessapi.com",
    category: "Coding and Software Development",
    access: "Freemium",
    freePlan: "Free evaluation to generate production-quality SDKs from API specifications",
    why: "SDK generation platform used by OpenAI and Anthropic to generate bulletproof, type-safe SDKs for TypeScript, Python, Go, and Java."
  },
  {
    num: 738,
    name: "Speakeasy",
    status: "new",
    url: "https://www.speakeasy.com",
    category: "Coding and Software Development",
    access: "Freemium",
    freePlan: "Free tier for creating up to 2 SDK targets with automated GitHub action workflows",
    why: "Developer platform that validates OpenAPI specs, generates production-grade SDKs, and manages Terraform providers."
  },
  {
    num: 739,
    name: "Bump.sh",
    status: "new",
    url: "https://bump.sh",
    category: "Coding and Software Development",
    access: "Freemium",
    freePlan: "Free plan for up to 1 API documentation hub with automatic diffs and changelogs",
    why: "Continuous API documentation platform that tracks breaking changes and generates human-readable changelogs on every commit."
  },
  {
    num: 740,
    name: "Scalar",
    status: "new",
    url: "https://scalar.com",
    category: "Coding and Software Development",
    access: "Open Source",
    freePlan: "100% free open-source API documentation tool and hosted developer community",
    why: "Open-source, highly customizable modern API documentation tool and interactive API client supporting OpenAPI and Swagger."
  },
  {
    num: 741,
    name: "Bruno AI",
    status: "new",
    url: "https://www.usebruno.com",
    category: "Coding and Software Development",
    access: "Open Source",
    freePlan: "100% free and open-source desktop app storing collections directly in Git repos",
    why: "Fast, Git-friendly open-source API client alternative to Postman that stores API collections directly as plain text files."
  },
  {
    num: 742,
    name: "Postman AI",
    status: "new",
    url: "https://www.postman.com",
    category: "Coding and Software Development",
    access: "Freemium",
    freePlan: "Free tier for up to 3 collaborators with basic Postbot AI test generation queries",
    why: "API collaboration and development platform with Postbot AI for generating test scripts, mock responses, and API documentation."
  },
  {
    num: 743,
    name: "Insomnia AI",
    status: "new",
    url: "https://insomnia.rest",
    category: "Coding and Software Development",
    access: "Open Source",
    freePlan: "Free local desktop application for REST, GraphQL, and gRPC with Git sync",
    why: "Open-source desktop API client and design platform by Kong with automated test runners and AI response diagnostics."
  },
  {
    num: 744,
    name: "Keploy",
    status: "new",
    url: "https://keploy.io",
    category: "Coding and Software Development",
    access: "Open Source",
    freePlan: "Open source community version free forever; self-hostable with no test cap",
    why: "Open-source test generation platform that records live API network calls and converts them into repeatable unit and integration tests."
  },
  {
    num: 745,
    name: "Qase AI",
    status: "new",
    url: "https://qase.io",
    category: "Coding and Software Development",
    access: "Freemium",
    freePlan: "Free tier for up to 3 users with 500 test cases and AI test generation prompts",
    why: "Modern test management software featuring AI-assisted test case authoring, defect reporting, and test run analysis."
  },
  {
    num: 746,
    name: "Jam.dev",
    status: "new",
    url: "https://jam.dev",
    category: "Coding and Software Development",
    access: "Freemium",
    freePlan: "Free for individual developers with unlimited instant bug captures and logs",
    why: "One-click bug reporting browser extension that records console errors, network requests, and repro steps for developers."
  },
  {
    num: 747,
    name: "Bugasura",
    status: "new",
    url: "https://bugasura.io",
    category: "Coding and Software Development",
    access: "Freemium",
    freePlan: "Free tier for small teams up to 5 members with unlimited bug tracking",
    why: "Lightweight AI-powered bug tracker designed for modern software teams to report, triage, and resolve issues collaboratively."
  },
  {
    num: 748,
    name: "Bird Eats Bug",
    status: "new",
    url: "https://birdeatsbug.com",
    category: "Coding and Software Development",
    access: "Freemium",
    freePlan: "Free plan with up to 10 bug recordings per month including technical data",
    why: "Visual bug reporting tool that captures screen recordings with automatically attached console logs, network activity, and system specs."
  },
  {
    num: 749,
    name: "Meticulous",
    status: "new",
    url: "https://www.meticulous.ai",
    category: "Coding and Software Development",
    access: "Freemium",
    freePlan: "Free tier for open source and small projects to catch UI regressions in CI",
    why: "Autonomous end-to-end regression testing platform that records user sessions and replays them on every PR without maintaining tests."
  },
  {
    num: 750,
    name: "Replay.io",
    status: "new",
    url: "https://www.replay.io",
    category: "Coding and Software Development",
    access: "Freemium",
    freePlan: "Free personal tier to record and time-travel debug browser application runs",
    why: "Time-travel recording and debugging tool for web apps that allows developers to pause, inspect state, and add print statements retroactively."
  },
  {
    num: 751,
    name: "Momentic",
    status: "new",
    url: "https://momentic.ai",
    category: "Coding and Software Development",
    access: "Freemium",
    freePlan: "Free starter tier with visual test authoring and 100 test runs per month",
    why: "AI-native testing platform that uses computer vision and LLMs to create resilient automated UI tests from natural language descriptions."
  },
  {
    num: 752,
    name: "Browserbase",
    status: "new",
    url: "https://www.browserbase.com",
    category: "Coding and Software Development",
    access: "Freemium",
    freePlan: "Free tier with 1 hour of headless browser run time per month and proxy management",
    why: "Serverless headless browser infrastructure built specifically to run, debug, and scale AI web automation agents safely."
  },
  {
    num: 753,
    name: "Stagehand",
    status: "new",
    url: "https://www.stagehand.dev",
    category: "Coding and Software Development",
    access: "Open Source",
    freePlan: "Open-source TypeScript SDK on GitHub; run locally with your own LLM keys",
    why: "AI web browsing framework built on Playwright that executes natural language browser actions, extracts structured data, and observes pages."
  },

  // === Page 7: Developer (754-767) & App Builders (768-782) ===
  {
    num: 754,
    name: "Browser Use",
    status: "new",
    url: "https://browser-use.com",
    category: "Coding and Software Development",
    access: "Open Source",
    freePlan: "Open-source Python library on GitHub; free to self-host with standard LLMs",
    why: "Open-source web automation library that connects LLMs to browser instances to autonomously navigate, click, fill forms, and extract info."
  },
  {
    num: 755,
    name: "Skyvern",
    status: "new",
    url: "https://www.skyvern.com",
    category: "Coding and Software Development",
    access: "Open Source",
    freePlan: "Open-source core on GitHub; cloud tier offers 100 free automation runs",
    why: "Computer-vision powered browser automation agent that navigates dynamic web interfaces without fragile XPath selectors."
  },
  {
    num: 756,
    name: "LaVague",
    status: "new",
    url: "https://github.com/lavague-ai/LaVague",
    category: "Coding and Software Development",
    access: "Open Source",
    freePlan: "100% free open-source framework under Apache 2.0 license",
    why: "Large Action Model (LAM) framework designed to build autonomous AI web agents from natural language instructions."
  },
  {
    num: 757,
    name: "ScrapeGraphAI",
    status: "new",
    url: "https://scrapegraphai.com",
    category: "Coding and Software Development",
    access: "Open Source",
    freePlan: "Open-source Python library on GitHub; free to run with local or cloud models",
    why: "Python web scraping library that uses LLMs and direct graph logic to automatically extract structured data from websites without manual parsers."
  },
  {
    num: 758,
    name: "Firecrawl",
    status: "new",
    url: "https://www.firecrawl.dev",
    category: "Coding and Software Development",
    access: "Open Source",
    freePlan: "Free cloud plan with 500 scraped pages per month; open-source and self-hostable",
    why: "API service that turns any website into clean, LLM-ready Markdown while handling JavaScript rendering, proxies, and sitemaps."
  },
  {
    num: 759,
    name: "Crawl4AI",
    status: "new",
    url: "https://crawl4ai.com",
    category: "Coding and Software Development",
    access: "Open Source",
    freePlan: "100% free open-source asynchronous web crawler on GitHub",
    why: "Blazing fast, open-source asynchronous web crawler and data extractor optimized for LLM pipelines and RAG architectures."
  },
  {
    num: 760,
    name: "ScrapingBee AI",
    status: "new",
    url: "https://www.scrapingbee.com",
    category: "Coding and Software Development",
    access: "Freemium",
    freePlan: "Free trial with 1,000 API credits including headless browser rendering",
    why: "Web scraping API that manages proxies, headless browsers, and CAPTCHAs, featuring AI-powered data extraction."
  },
  {
    num: 761,
    name: "Apify AI",
    status: "new",
    url: "https://apify.com",
    category: "Coding and Software Development",
    access: "Freemium",
    freePlan: "Free tier with $5 monthly compute credits and access to over 1,500 pre-built scrapers",
    why: "Cloud platform for web scraping and data extraction with pre-built AI actors and integrations for training and feeding LLMs."
  },
  {
    num: 762,
    name: "Octoparse AI",
    status: "new",
    url: "https://www.octoparse.com",
    category: "Coding and Software Development",
    access: "Freemium",
    freePlan: "Free tier with up to 10 local scraping tasks and automatic website structure detection",
    why: "No-code visual web data scraping software that uses AI to detect tables, pagination, and lists across complex websites."
  },
  {
    num: 763,
    name: "Browse AI",
    status: "new",
    url: "https://www.browse.ai",
    category: "Coding and Software Development",
    access: "Freemium",
    freePlan: "Free tier with 50 credits per month to monitor and scrape web pages",
    why: "No-code web scraper and monitoring robot that can be trained in 2 minutes simply by clicking elements on any page."
  },
  { num: 764, name: "Bardeen", status: "duplicate", matchId: 323, matchName: "Bardeen", reason: "Identical browser-based workflow automation and web data scraping platform (bardeen.ai)" },
  { num: 765, name: "Gumloop", status: "duplicate", matchId: 324, matchName: "Gumloop", reason: "Identical visual AI workflow and web scraping platform for non-developers (gumloop.com)" },
  { num: 766, name: "Pipedream AI", status: "duplicate", matchId: 325, matchName: "Pipedream", reason: "Identical integration platform for developers with AI workflow steps (pipedream.com)" },
  {
    num: 767,
    name: "Windmill AI",
    status: "new",
    url: "https://www.windmill.dev",
    category: "Coding and Software Development",
    access: "Open Source",
    freePlan: "Free community edition self-hosted; cloud tier offers free developer tier",
    why: "Open-source developer platform for workflows, internal UIs, and scheduled scripts with AI-assisted code generation."
  },
  { num: 768, name: "Softr AI", status: "duplicate", matchId: 52, matchName: "Softr", reason: "Identical no-code portal and internal tool builder on Airtable/Google Sheets (softr.io)" },
  { num: 769, name: "Glide AI", status: "duplicate", matchId: 53, matchName: "Glide", reason: "Identical no-code mobile and web app builder powered by spreadsheet data (glideapps.com)" },
  { num: 770, name: "Bubble AI", status: "duplicate", matchId: 51, matchName: "Bubble", reason: "Identical leading visual full-stack web application development platform (bubble.io)" },
  { num: 771, name: "FlutterFlow AI", status: "duplicate", matchId: 54, matchName: "FlutterFlow AI Gen", reason: "Identical visual native mobile and web app builder generating clean Flutter code (flutterflow.io)" },
  { num: 772, name: "WeWeb AI", status: "duplicate", matchId: 810, matchName: "WeWeb", reason: "Intra-directory duplicate of WeWeb (#810, weweb.io)" },
  { num: 773, name: "Framer AI", status: "duplicate", matchId: 47, matchName: "Framer AI", reason: "Identical AI website builder that designs and publishes responsive sites from prompts (framer.com)" },
  { num: 774, name: "Webflow AI", status: "duplicate", matchId: 46, matchName: "Webflow", reason: "Identical professional visual web design and CMS platform (webflow.com)" },
  { num: 775, name: "Wix AI", status: "duplicate", matchId: 45, matchName: "Wix AI Website Builder", reason: "Identical AI conversational website builder by Wix (wix.com)" },
  { num: 776, name: "Squarespace Blueprint AI", status: "duplicate", matchId: 48, matchName: "Squarespace Blueprint AI", reason: "Identical guided AI website layout and design generator (squarespace.com)" },
  { num: 777, name: "Durable", status: "duplicate", matchId: 49, matchName: "Durable", reason: "Identical AI website builder generating complete business sites in 30 seconds (durable.co)" },
  { num: 778, name: "10Web", status: "duplicate", matchId: 50, matchName: "10Web", reason: "Identical AI WordPress website builder and automated hosting manager (10web.io)" },
  { num: 779, name: "Hostinger AI Website Builder", status: "duplicate", matchId: 56, matchName: "Hostinger AI Website Builder", reason: "Identical drag-and-drop AI website builder for small businesses (hostinger.com)" },
  {
    num: 780,
    name: "Jimdo Dolphin",
    status: "new",
    url: "https://www.jimdo.com",
    category: "App and Website Builders",
    access: "Freemium",
    freePlan: "Free Play plan with sub-domain hosting and standard site creation",
    why: "Intuitive AI website builder that interviews business owners and generates a tailored, mobile-responsive website in minutes."
  },
  {
    num: 781,
    name: "Kleap",
    status: "new",
    url: "https://kleap.co",
    category: "App and Website Builders",
    access: "Freemium",
    freePlan: "Free tier with basic AI page generations and mobile-friendly publishing",
    why: "Mobile-first AI website generator that crafts lightning-fast landing pages and online shops optimized for conversions."
  },
  {
    num: 782,
    name: "Mixo",
    status: "new",
    url: "https://www.mixo.io",
    category: "App and Website Builders",
    access: "Freemium",
    freePlan: "Free tier with 1 generated site and built-in email waitlist collection",
    why: "Launches clean startup landing pages from a single prompt, collecting email sign-ups before you write a line of code."
  },

  // === Page 8: App Builders & Low Code (783-814) ===
  { num: 783, name: "Typedream", status: "duplicate", matchId: 551, matchName: "Typedream", reason: "Identical Notion-like visual web page and site builder (typedream.com)" },
  { num: 784, name: "Dorik AI", status: "duplicate", matchId: 552, matchName: "Dorik AI", reason: "Identical AI website builder and CMS platform (dorik.com)" },
  { num: 785, name: "Unicorn Platform", status: "duplicate", matchId: 553, matchName: "Unicorn Platform", reason: "Identical AI landing page creator for SaaS and startup founders (unicornplatform.com)" },
  {
    num: 786,
    name: "Butternut AI",
    status: "new",
    url: "https://butternut.ai",
    category: "App and Website Builders",
    access: "Freemium",
    freePlan: "Free plan generating up to 2 multi-page websites with standard SEO",
    why: "Generates complete multi-page business websites with pre-written copy, stock imagery, and SEO metadata in under 20 seconds."
  },
  {
    num: 787,
    name: "Pineapple Builder",
    status: "new",
    url: "https://www.pineapplebuilder.com",
    category: "App and Website Builders",
    access: "Freemium",
    freePlan: "Free tier with 1 published site, SSL, and custom blog generation",
    why: "Simple AI website and blog generator tailored for small businesses, agencies, and non-technical creators."
  },
  { num: 788, name: "Relume", status: "duplicate", matchId: 57, matchName: "Relume", reason: "Identical AI sitemap and wireframe generator for Figma and Webflow (relume.io)" },
  { num: 789, name: "Uizard", status: "duplicate", matchId: 59, matchName: "Uizard", reason: "Identical AI-powered UI design tool transforming sketches into wireframes (uizard.io)" },
  { num: 790, name: "Galileo AI", status: "duplicate", matchId: 60, matchName: "Galileo AI", reason: "Identical text-to-UI generative interface design platform (usegalileo.ai)" },
  { num: 791, name: "Visily", status: "duplicate", matchId: 554, matchName: "Visily", reason: "Identical AI wireframing and prototyping software for non-designers (visily.ai)" },
  { num: 792, name: "Motiff", status: "duplicate", matchId: 555, matchName: "Motiff", reason: "Identical AI design tool for professional interface and system design (motiff.com)" },
  {
    num: 793,
    name: "Banani",
    status: "new",
    url: "https://banani.ai",
    category: "Design, UI, and Branding",
    access: "Freemium",
    freePlan: "Free tier with daily generation credits for mobile and web screens",
    why: "AI interface generator that turns product ideas into interactive, visually polished mobile and web UI screens."
  },
  {
    num: 794,
    name: "UX Pilot",
    status: "new",
    url: "https://uxpilot.ai",
    category: "Design, UI, and Branding",
    access: "Freemium",
    freePlan: "Free tier with up to 10 AI design reviews and wireframe explorations per month",
    why: "AI copilot for UX/UI designers that conducts usability reviews, audits design systems, and generates user flow diagrams."
  },
  { num: 795, name: "Figma Make", status: "duplicate", matchId: 402, matchName: "Figma AI", reason: "Generative design features integrated directly into Figma (figma.com/ai)" },
  {
    num: 796,
    name: "Builder.io Visual Copilot",
    status: "new",
    url: "https://www.builder.io/m/visual-copilot",
    category: "App and Website Builders",
    access: "Freemium",
    freePlan: "Free plan with up to 50 design-to-code conversions per month",
    why: "One-click Figma plugin that transforms designs into clean, responsive React, Vue, Svelte, or HTML code using custom AI models."
  },
  {
    num: 797,
    name: "Locofy",
    status: "new",
    url: "https://www.locofy.ai",
    category: "App and Website Builders",
    access: "Freemium",
    freePlan: "Free plan with 5 screen exports and standard responsive code generation",
    why: "Converts Figma and Adobe XD prototypes into production-ready frontend code for React, React Native, Next.js, and HTML."
  },
  {
    num: 798,
    name: "Anima",
    status: "new",
    url: "https://www.animaapp.com",
    category: "App and Website Builders",
    access: "Freemium",
    freePlan: "Free plan for 1 project with automated code inspection and Figma export",
    why: "Design-to-code platform that translates Figma prototypes into component-driven React, Vue, and Tailwind code."
  },
  {
    num: 799,
    name: "Quest AI",
    status: "new",
    url: "https://www.quest.ai",
    category: "App and Website Builders",
    access: "Freemium",
    freePlan: "Free tier for 1 developer with unlimited local preview and code export",
    why: "Generates clean, full-stack React components from Figma designs with built-in state management and responsive styling."
  },
  {
    num: 800,
    name: "Plasmic",
    status: "new",
    url: "https://www.plasmic.app",
    category: "App and Website Builders",
    access: "Freemium",
    freePlan: "Free plan for unlimited visual editor users and up to 3 published projects",
    why: "Visual headless CMS and visual page builder that integrates seamlessly into existing React, Next.js, and Gatsby codebases."
  },
  {
    num: 801,
    name: "DhiWise",
    status: "new",
    url: "https://www.dhiwise.com",
    category: "App and Website Builders",
    access: "Freemium",
    freePlan: "Free tier with unlimited code viewing and up to 5 monthly code generations",
    why: "Programming platform that turns Figma designs into enterprise-grade Flutter, React, and Kotlin mobile and web applications."
  },
  {
    num: 802,
    name: "Draftbit",
    status: "new",
    url: "https://draftbit.com",
    category: "App and Website Builders",
    access: "Freemium",
    freePlan: "Free plan to build and test mobile apps with live browser preview",
    why: "Visual mobile app development tool that generates clean React Native source code, connects to any REST API, and deploys to app stores."
  },
  {
    num: 803,
    name: "Bravo Studio",
    status: "new",
    url: "https://www.bravostudio.app",
    category: "App and Website Builders",
    access: "Freemium",
    freePlan: "Free tier to connect Figma designs to APIs with real-time mobile preview",
    why: "App builder that turns Figma prototypes into native iOS and Android apps connected directly to backend REST APIs."
  },
  {
    num: 804,
    name: "Appsmith AI",
    status: "new",
    url: "https://www.appsmith.com",
    category: "App and Website Builders",
    access: "Open Source",
    freePlan: "Open-source community edition free forever with self-hosting and unlimited users",
    why: "Open-source low-code platform for building internal tools, admin portals, and CRUD dashboards with AI query assistance."
  },
  {
    num: 805,
    name: "Retool AI",
    status: "new",
    url: "https://retool.com/products/ai",
    category: "App and Website Builders",
    access: "Freemium",
    freePlan: "Free plan for up to 5 users with 500 AI workflow runs per month",
    why: "Fastest way for engineering teams to build custom business software, connect databases, and embed AI models into everyday workflows."
  },
  {
    num: 806,
    name: "Budibase AI",
    status: "new",
    url: "https://budibase.com",
    category: "App and Website Builders",
    access: "Open Source",
    freePlan: "Free self-hosted open-source version for up to 5 users with full UI builder",
    why: "Open-source low-code internal tool builder that connects to SQL, MongoDB, and REST APIs with AI query generation."
  },
  {
    num: 807,
    name: "ToolJet AI",
    status: "new",
    url: "https://www.tooljet.com",
    category: "App and Website Builders",
    access: "Open Source",
    freePlan: "Free open-source community edition with self-hosting and unlimited apps",
    why: "Open-source low-code platform for building enterprise internal software with drag-and-drop components and AI code generation."
  },
  {
    num: 808,
    name: "DronaHQ",
    status: "new",
    url: "https://www.dronahq.com",
    category: "App and Website Builders",
    access: "Freemium",
    freePlan: "14-day free trial with unlimited apps, visual UI builder, and API connectors",
    why: "Enterprise low-code internal tool platform that helps engineering teams build database GUIs, forms, and portals quickly."
  },
  {
    num: 809,
    name: "UI Bakery",
    status: "new",
    url: "https://uibakery.io",
    category: "App and Website Builders",
    access: "Freemium",
    freePlan: "Free tier for personal projects and up to 5 users with full visual app builder",
    why: "Low-code web application platform for internal dashboards, workflows, and portals with AI-assisted SQL generation."
  },
  {
    num: 810,
    name: "WeWeb",
    status: "new",
    url: "https://www.weweb.io",
    category: "App and Website Builders",
    access: "Freemium",
    freePlan: "Free plan to build and test frontend apps with WeWeb subdomain",
    why: "Visual frontend builder for scalable web applications that connects to any backend or database via REST or GraphQL."
  },
  {
    num: 811,
    name: "Thunkable AI",
    status: "new",
    url: "https://thunkable.com",
    category: "App and Website Builders",
    access: "Freemium",
    freePlan: "Free plan allowing up to 10 public mobile projects with standard drag-and-drop blocks",
    why: "No-code mobile app development platform enabling creators to build native iOS and Android apps with AI logic blocks."
  },
  {
    num: 812,
    name: "Adalo AI",
    status: "new",
    url: "https://www.adalo.com",
    category: "App and Website Builders",
    access: "Freemium",
    freePlan: "Free tier with unlimited test apps and built-in database under Adalo domain",
    why: "No-code platform that lets non-technical creators design and publish real native mobile and web applications with built-in database."
  },
  {
    num: 813,
    name: "Appy Pie AI",
    status: "new",
    url: "https://www.appypie.com",
    category: "App and Website Builders",
    access: "Freemium",
    freePlan: "Free trial to build mobile apps and view live prototypes on smartphones",
    why: "Drag-and-drop no-code app development platform that converts text descriptions into working mobile and web applications."
  },
  {
    num: 814,
    name: "SAP Build Code",
    status: "new",
    url: "https://www.sap.com/products/technology-platform/build-code.html",
    category: "Coding and Software Development",
    access: "Paid",
    freePlan: "Evaluation access available on SAP Business Technology Platform trial tier",
    why: "Turnkey development environment tailored for SAP applications, combining generative AI coding assistant Joule with enterprise tools."
  },

  // === Page 9: Enterprise Low Code (815-818) & Image (819-843) ===
  {
    num: 815,
    name: "Mendix Assist",
    status: "new",
    url: "https://www.mendix.com",
    category: "App and Website Builders",
    access: "Freemium",
    freePlan: "Free Community Edition with unlimited studio access and deployment to Mendix Cloud",
    why: "Enterprise low-code development platform featuring AI-assisted logic bots that guide developers through model validation and architecture."
  },
  {
    num: 816,
    name: "OutSystems Mentor",
    status: "new",
    url: "https://www.outsystems.com",
    category: "App and Website Builders",
    access: "Freemium",
    freePlan: "Free personal environment for building and running cloud-native applications",
    why: "High-performance low-code platform combining AI generation with automated security and architecture governance."
  },
  {
    num: 817,
    name: "Oracle APEX AI Assistant",
    status: "new",
    url: "https://apex.oracle.com",
    category: "App and Website Builders",
    access: "Free",
    freePlan: "Free hosted development workspaces on apex.oracle.com and Oracle Cloud Free Tier",
    why: "Enterprise low-code application development platform with native AI assistant that translates natural language into optimized SQL queries."
  },
  {
    num: 818,
    name: "Zoho Creator Zia",
    status: "new",
    url: "https://www.zoho.com/creator/",
    category: "App and Website Builders",
    access: "Freemium",
    freePlan: "15-day free trial with full application building and workflow automation",
    why: "Custom business application platform featuring Zia AI assistant for natural language querying, predictive analytics, and process automation."
  },
  { num: 819, name: "Leonardo.Ai", status: "duplicate", matchId: 62, matchName: "Leonardo.ai", reason: "Identical generative art and asset suite (leonardo.ai)" },
  { num: 820, name: "Ideogram", status: "duplicate", matchId: 63, matchName: "Ideogram", reason: "Identical AI image generator renowned for accurate typography in imagery (ideogram.ai)" },
  { num: 821, name: "Recraft", status: "duplicate", matchId: 65, matchName: "Recraft", reason: "Identical generative vector and 3D illustration design suite (recraft.ai)" },
  {
    num: 822,
    name: "FLUX.1",
    status: "new",
    url: "https://blackforestlabs.ai",
    category: "Image Generation",
    access: "Open Source",
    freePlan: "FLUX.1 [schnell] open weights available under Apache 2.0; demo hosted on Hugging Face",
    why: "State-of-the-art open-weights image generation model family by Black Forest Labs delivering exceptional visual fidelity and text rendering."
  },
  { num: 823, name: "Playground AI", status: "duplicate", matchId: 67, matchName: "Playground", reason: "Identical online creative image generator and graphic editor (playground.com)" },
  { num: 824, name: "Adobe Firefly", status: "duplicate", matchId: 64, matchName: "Adobe Firefly", reason: "Identical commercially safe generative AI model suite by Adobe (firefly.adobe.com)" },
  { num: 825, name: "Microsoft Designer", status: "duplicate", matchId: 68, matchName: "Microsoft Designer", reason: "Identical AI design and graphic creator powered by DALL-E (designer.microsoft.com)" },
  { num: 826, name: "ImagineArt", status: "duplicate", matchId: 520, matchName: "ImagineArt", reason: "Identical text-to-image generator with artistic filters (imagine.art)" },
  { num: 827, name: "OpenArt", status: "duplicate", matchId: 66, matchName: "OpenArt", reason: "Identical AI art platform with prompt book and model exploration (openart.ai)" },
  { num: 828, name: "NightCafe", status: "duplicate", matchId: 70, matchName: "NightCafe", reason: "Identical community-driven AI art generator with multiple algorithms (nightcafe.studio)" },
  { num: 829, name: "Artbreeder", status: "duplicate", matchId: 521, matchName: "Artbreeder", reason: "Identical collaborative genetic image mixing and character creation tool (artbreeder.com)" },
  {
    num: 830,
    name: "BlueWillow",
    status: "new",
    url: "https://www.bluewillow.ai",
    category: "Image Generation",
    access: "Freemium",
    freePlan: "Free daily image generation prompts via Discord community and web app",
    why: "Community-centric AI image generator offering intuitive text-to-image prompts across fantasy, photorealistic, and anime art styles."
  },
  { num: 831, name: "PicLumen", status: "duplicate", matchId: 523, matchName: "PicLumen", reason: "Identical free AI image generator with realistic portrait models (piclumen.com)" },
  { num: 832, name: "PixAI", status: "duplicate", matchId: 524, matchName: "PixAI", reason: "Identical anime art generator and character modeling platform (pixai.art)" },
  { num: 833, name: "SeaArt", status: "duplicate", matchId: 73, matchName: "SeaArt AI", reason: "Identical AI art platform with extensive model marketplace (seaart.ai)" },
  { num: 834, name: "Tensor.Art", status: "duplicate", matchId: 74, matchName: "Tensor.Art", reason: "Identical online checkpoint hosting and model inference platform (tensor.art)" },
  { num: 835, name: "Dezgo", status: "duplicate", matchId: 526, matchName: "Dezgo", reason: "Identical fast text-to-image and inpainting platform without mandatory sign-up (dezgo.com)" },
  {
    num: 836,
    name: "Pollinations",
    status: "new",
    url: "https://pollinations.ai",
    category: "Image Generation",
    access: "Free",
    freePlan: "Completely free open-source image generation API with no sign-up or paywalls",
    why: "Free and open-source generative media ecosystem providing simple REST APIs for on-demand image and text generation."
  },
  {
    num: 837,
    name: "Perchance AI Image Generator",
    status: "new",
    url: "https://perchance.org/ai-text-to-image",
    category: "Image Generation",
    access: "Free",
    freePlan: "Completely free with unlimited image generations, no registration, and no daily credits",
    why: "Lightweight, zero-login online image generator that produces unlimited creative illustrations and portraits without watermarks."
  },
  { num: 838, name: "DeepAI Image Generator", status: "duplicate", matchId: 527, matchName: "DeepAI", reason: "Identical suite of AI text-to-image tools by DeepAI (deepai.org)" },
  {
    num: 839,
    name: "Neural.love",
    status: "new",
    url: "https://neural.love",
    category: "Image Generation",
    access: "Freemium",
    freePlan: "Free basic tier with starter credits for image generation and audio enhancement",
    why: "AI media platform offering text-to-image creation, HD resolution upscaling, and vintage portrait restoration."
  },
  { num: 840, name: "StarryAI", status: "duplicate", matchId: 525, matchName: "Starryai", reason: "Identical mobile and web AI art generator with daily free credits (starryai.com)" },
  {
    num: 841,
    name: "Wombo Dream",
    status: "new",
    url: "https://dream.ai",
    category: "Image Generation",
    access: "Freemium",
    freePlan: "Free mobile and web generation with standard resolution and basic style presets",
    why: "Popular casual AI art generator creating stylized fantasy, surreal, and painterly artwork in seconds from text prompts."
  },
  { num: 842, name: "Mage", status: "duplicate", matchId: 75, matchName: "Mage.space", reason: "Identical fast web-based Stable Diffusion and SDXL generation canvas (mage.space)" },
  { num: 843, name: "InvokeAI", status: "duplicate", matchId: 396, matchName: "InvokeAI", reason: "Identical professional open-source creative studio for generative imaging (invoke-ai.github.io)" },

  // === Page 10: Image Generation & Editing (844-875) ===
  { num: 844, name: "Fooocus", status: "duplicate", matchId: 397, matchName: "Fooocus", reason: "Identical offline Midjourney-quality offline image generator (github.com/lllyasviel/Fooocus)" },
  { num: 845, name: "ComfyUI", status: "duplicate", matchId: 394, matchName: "ComfyUI", reason: "Identical node-based visual workflow GUI for Stable Diffusion (github.com/comfyanonymous/ComfyUI)" },
  { num: 846, name: "AUTOMATIC1111", status: "duplicate", matchId: 395, matchName: "AUTOMATIC1111 Stable", reason: "Identical web UI for Stable Diffusion models (github.com/AUTOMATIC1111/stable-diffusion-webui)" },
  { num: 847, name: "Krita AI Diffusion", status: "duplicate", matchId: 398, matchName: "Krita AI Diffusion", reason: "Identical generative painting plugin for the Krita open-source raster editor (github.com/Acly/krita-ai-diffusion)" },
  {
    num: 848,
    name: "Draw Things",
    status: "new",
    url: "https://drawthings.ai",
    category: "Image Generation",
    access: "Free",
    freePlan: "Completely free on macOS, iOS, and iPadOS; runs 100% offline with zero cloud fees",
    why: "Free on-device AI image generation studio for Mac, iPad, and iPhone that runs Stable Diffusion locally without internet."
  },
  {
    num: 849,
    name: "DiffusionBee",
    status: "new",
    url: "https://diffusionbee.com",
    category: "Image Generation",
    access: "Open Source",
    freePlan: "100% free open-source macOS app with one-click offline installation",
    why: "Easiest offline application to run Stable Diffusion on Apple Silicon Macs with full support for inpainting and upscaling."
  },
  {
    num: 850,
    name: "Dzine",
    status: "new",
    url: "https://www.dzine.ai",
    category: "Image Editing and Enhancement",
    access: "Freemium",
    freePlan: "Free tier with 30 starter credits for inpainting, style transfer, and character posing",
    why: "AI design studio (formerly Stylar) providing fine-grained control over character consistency, composition, and element replacement."
  },
  { num: 851, name: "Scenario", status: "duplicate", matchId: 427, matchName: "Scenario", reason: "Identical AI asset engine for game developers and 3D concept artists (scenario.com)" },
  { num: 852, name: "Layer AI", status: "duplicate", matchId: 435, matchName: "Layer AI", reason: "Identical production pipeline for 2D game assets and marketing graphics (layer.ai)" },
  {
    num: 853,
    name: "PromeAI",
    status: "new",
    url: "https://www.promeai.pro",
    category: "Image Generation",
    access: "Freemium",
    freePlan: "Free tier with 10 monthly coins for sketch-to-render and background generation",
    why: "Design assistant that turns hand-drawn architectural and interior sketches into photorealistic commercial renderings."
  },
  {
    num: 854,
    name: "LookX AI",
    status: "new",
    url: "https://www.lookx.ai",
    category: "Image Generation",
    access: "Freemium",
    freePlan: "Free trial credits for architectural rendering and 3D volume styling",
    why: "Spatial design AI platform customized for architects and interior designers to render massing models into architectural visualizations."
  },
  {
    num: 855,
    name: "Vizcom",
    status: "new",
    url: "https://www.vizcom.ai",
    category: "Image Generation",
    access: "Freemium",
    freePlan: "Free plan with unlimited basic sketches, 3D volume rendering, and cloud storage",
    why: "Industrial design tool that renders rough conceptual 2D sketches into high-fidelity physical product designs in real time."
  },
  {
    num: 856,
    name: "Magnific AI",
    status: "new",
    url: "https://magnific.ai",
    category: "Image Editing and Enhancement",
    access: "Paid",
    freePlan: "Subscription required for high-resolution AI hallucination and upscaling",
    why: "High-end generative upscaler that hallucinates realistic textures and micro-details to upscale low-res images into 8K assets."
  },
  { num: 857, name: "Topaz Photo AI", status: "duplicate", matchId: 84, matchName: "Topaz Photo AI", reason: "Identical standalone desktop tool for noise reduction and sharpening (topazlabs.com/topaz-photo-ai)" },
  { num: 858, name: "Upscayl", status: "duplicate", matchId: 538, matchName: "Upscayl", reason: "Identical free, open-source AI image upscaler for desktop (upscayl.org)" },
  { num: 859, name: "Let's Enhance", status: "duplicate", matchId: 85, matchName: "Let's Enhance", reason: "Identical web-based automated image upscaling and color correction platform (letsenhance.io)" },
  { num: 860, name: "VanceAI", status: "duplicate", matchId: 91, matchName: "VanceAI", reason: "Identical suite of AI image enhancement, restoration, and sharpening tools (vanceai.com)" },
  { num: 861, name: "Remini", status: "duplicate", matchId: 90, matchName: "Remini", reason: "Identical AI photo restoration app unblurring face details (remini.ai)" },
  { num: 862, name: "Pixelcut", status: "duplicate", matchId: 87, matchName: "Pixelcut", reason: "Identical AI photo editor for e-commerce background removal and mockups (pixelcut.ai)" },
  { num: 863, name: "Photoroom", status: "duplicate", matchId: 88, matchName: "Photoroom", reason: "Identical mobile and web studio for commercial product photography (photoroom.com)" },
  { num: 864, name: "Clipdrop", status: "duplicate", matchId: 82, matchName: "Clipdrop", reason: "Identical ecosystem of AI image editing apps including cleanup and relighting (clipdrop.co)" },
  { num: 865, name: "Cleanup.pictures", status: "duplicate", matchId: 83, matchName: "Cleanup.pictures", reason: "Identical web tool to remove unwanted objects, text, or people from photos (cleanup.pictures)" },
  { num: 866, name: "Evoto AI", status: "duplicate", matchId: 540, matchName: "Evoto AI", reason: "Identical portrait retouching software for photographers (evoto.ai)" },
  { num: 867, name: "Retouch4me", status: "duplicate", matchId: 533, matchName: "Retouch4me", reason: "Identical neural network plugins for automated skin, dodge & burn, and portrait retouching (retouch4.me)" },
  { num: 868, name: "Luminar Neo", status: "duplicate", matchId: 89, matchName: "Luminar Neo", reason: "Identical full-featured photo editing software with generative AI tools (skylum.com/luminar)" },
  {
    num: 869,
    name: "ON1 Photo RAW AI",
    status: "new",
    url: "https://www.on1.com",
    category: "Image Editing and Enhancement",
    access: "Paid",
    freePlan: "14-day fully functional free trial without credit card requirement",
    why: "Professional RAW photography editing suite integrating AI noise reduction, smart masking, and generative portrait adjustments."
  },
  {
    num: 870,
    name: "Aftershoot",
    status: "new",
    url: "https://aftershoot.com",
    category: "Image Editing and Enhancement",
    access: "Paid",
    freePlan: "30-day free trial with unlimited automated culling and sample AI editing credits",
    why: "Automated photo culling and color-grading software that speeds up wedding and event photography workflows by selecting top shots."
  },
  {
    num: 871,
    name: "Imagen AI",
    status: "new",
    url: "https://imagen-ai.com",
    category: "Image Editing and Enhancement",
    access: "Paid",
    freePlan: "Free trial with 1,000 free photo edits in Adobe Lightroom Classic",
    why: "Personalized AI photo editing assistant that learns a professional photographer's editing style and batches thousands of photos in minutes."
  },
  {
    num: 872,
    name: "Narrative Select",
    status: "new",
    url: "https://narrative.so",
    category: "Image Editing and Enhancement",
    access: "Freemium",
    freePlan: "Free plan with up to 6 projects per month with instant image culling and face detection",
    why: "Lightning-fast photo culling application that detects blink status, focus sharpness, and facial expressions in raw photo shoots."
  },
  { num: 873, name: "Aftershoot Edits", status: "duplicate", matchId: 870, matchName: "Aftershoot", reason: "Intra-directory duplicate of Aftershoot (#870, aftershoot.com)" },
  {
    num: 874,
    name: "RetouchMe",
    status: "new",
    url: "https://retouchme.com",
    category: "Image Editing and Enhancement",
    access: "Paid",
    freePlan: "Pay-per-photo editing service with free sample credits upon app installation",
    why: "Photo correction app combining AI assistance with real professional retouchers for natural body shaping and portrait touchups."
  },
  {
    num: 875,
    name: "Claid.ai",
    status: "new",
    url: "https://claid.ai",
    category: "Image Editing and Enhancement",
    access: "Freemium",
    freePlan: "Free trial with 50 credits to enhance product photos and generate studio scenes",
    why: "Automated image processing platform that cleans up user-generated marketplace images and generates consistent studio backdrops."
  },

  // === Page 11: Image & Branding (876-908) ===
  {
    num: 876,
    name: "Pebblely",
    status: "new",
    url: "https://pebblely.com",
    category: "Image Generation",
    access: "Freemium",
    freePlan: "Free plan with 40 photos per month and 17 default theme backgrounds",
    why: "AI product photography platform that turns regular product photos into styled marketing assets with customizable shadows and lighting."
  },
  {
    num: 877,
    name: "Flair.ai",
    status: "new",
    url: "https://flair.ai",
    category: "Image Generation",
    access: "Freemium",
    freePlan: "Free tier with 30 image generations per month and drag-and-drop scene staging",
    why: "Visual staging and product photoshoot tool for e-commerce brands to generate photorealistic lifestyle backdrops."
  },
  {
    num: 878,
    name: "Booth.ai",
    status: "new",
    url: "https://www.booth.ai",
    category: "Image Generation",
    access: "Paid",
    freePlan: "Commercial product generation trial with sample image generations",
    why: "Commercial generative AI platform enabling retail brands to produce high-resolution product photography using reference garments."
  },
  {
    num: 879,
    name: "Mokker AI",
    status: "new",
    url: "https://mokker.ai",
    category: "Image Generation",
    access: "Freemium",
    freePlan: "Free tier with 20 free product image renders and basic templates",
    why: "Instant AI product photo background replacement tool that creates clean e-commerce catalogue and social ad images."
  },
  {
    num: 880,
    name: "Blend",
    status: "new",
    url: "https://www.blendany.com",
    category: "Image Editing and Enhancement",
    access: "Freemium",
    freePlan: "Free mobile app with basic background removal and design templates",
    why: "E-commerce graphic design and photo editor app for online shop owners to create professional catalog listings and Instagram stories."
  },
  { num: 881, name: "PhotoRoom Product Beautifier", status: "duplicate", matchId: 88, matchName: "Photoroom", reason: "Product photo enhancement feature of Photoroom (photoroom.com)" },
  { num: 882, name: "Remove.bg", status: "duplicate", matchId: 81, matchName: "Remove.bg", reason: "Identical automated image background removal utility (remove.bg)" },
  { num: 883, name: "Erase.bg", status: "duplicate", matchId: 532, matchName: "Erase.bg", reason: "Identical free background eraser tool for portraits and graphics (erase.bg)" },
  { num: 884, name: "Cutout.pro", status: "duplicate", matchId: 92, matchName: "Cutout.Pro", reason: "Identical visual AI platform for background removal and photo enhancement (cutout.pro)" },
  { num: 885, name: "PicWish", status: "duplicate", matchId: 94, matchName: "PicWish", reason: "Identical AI photo editing platform for unblurring and cutouts (picwish.com)" },
  { num: 886, name: "insMind", status: "duplicate", matchId: 93, matchName: "insMind", reason: "Identical online design tool for e-commerce photo editing and backgrounds (insmind.com)" },
  {
    num: 887,
    name: "Pincel",
    status: "new",
    url: "https://pincel.app",
    category: "Image Editing and Enhancement",
    access: "Freemium",
    freePlan: "Free web trial for inpainting, object removal, and portrait adjustments",
    why: "Simple in-browser AI photo editing suite for instant background removal, inpainting, and creative text-to-photo overlays."
  },
  {
    num: 888,
    name: "Face26",
    status: "new",
    url: "https://face26.com",
    category: "Image Editing and Enhancement",
    access: "Freemium",
    freePlan: "Free trial with 3 photo restorations, colorization, and face enhancement",
    why: "AI photo restoration tool specializing in sharpening blurred faces, repairing scratches, and colorizing vintage family portraits."
  },
  { num: 889, name: "Fotor", status: "duplicate", matchId: 79, matchName: "Fotor AI Image Generator", reason: "Identical comprehensive web and mobile photo editor with AI tools (fotor.com)" },
  { num: 890, name: "BeFunky", status: "duplicate", matchId: 535, matchName: "BeFunky AI", reason: "Identical online photo editor and collage maker with AI portrait tools (befunky.com)" },
  { num: 891, name: "Canva Magic Studio", status: "duplicate", matchId: 401, matchName: "Canva", reason: "Generative AI design feature suite inside Canva (canva.com)" },
  {
    num: 892,
    name: "VistaCreate AI",
    status: "new",
    url: "https://create.vista.com",
    category: "Design, UI, and Branding",
    access: "Freemium",
    freePlan: "Free starter plan with 100K+ design templates, fonts, and basic AI editing",
    why: "Online graphic design platform equipped with AI background removal, social media resizing, and branded template generation."
  },
  {
    num: 893,
    name: "Kittl AI",
    status: "new",
    url: "https://www.kittl.com",
    category: "Design, UI, and Branding",
    access: "Freemium",
    freePlan: "Free tier with 15 AI generation credits and access to vector template library",
    why: "Next-gen graphic design platform with AI vector generation, complex text distortion effects, and print-on-demand mockup tools."
  },
  { num: 894, name: "Ideogram Canvas", status: "duplicate", matchId: 63, matchName: "Ideogram", reason: "Infinite canvas and inpainting feature of Ideogram AI (ideogram.ai)" },
  { num: 895, name: "Recraft Vector", status: "duplicate", matchId: 65, matchName: "Recraft", reason: "Vector illustration mode of Recraft AI design platform (recraft.ai)" },
  {
    num: 896,
    name: "Vectorizer.AI",
    status: "new",
    url: "https://vectorizer.ai",
    category: "Design, UI, and Branding",
    access: "Paid",
    freePlan: "Free interactive preview with side-by-side SVG comparison; paid token download",
    why: "Deep learning vectorizer that converts blurry bitmap PNG and JPG files into razor-sharp, geometric SVG vector graphics."
  },
  {
    num: 897,
    name: "SVG.io",
    status: "new",
    url: "https://svg.io",
    category: "Design, UI, and Branding",
    access: "Freemium",
    freePlan: "Free plan with 5 text-to-SVG vector generations per month and instant downloads",
    why: "AI-driven text-to-SVG vector generator that creates scalable icon sets, illustrations, and logos ready for web development."
  },
  { num: 898, name: "Illustroke", status: "duplicate", matchId: 420, matchName: "Illustroke", reason: "Identical text-to-SVG vector illustration platform (illustroke.com)" },
  {
    num: 899,
    name: "Logo Diffusion",
    status: "new",
    url: "https://logodiffusion.com",
    category: "Design, UI, and Branding",
    access: "Freemium",
    freePlan: "Free starter tier with 10 credits to test custom logo generation models",
    why: "Generative AI platform custom-trained to produce original vector logos, app icons, and brand marks without generic stock templates."
  },
  { num: 900, name: "Looka", status: "duplicate", matchId: 406, matchName: "Looka", reason: "Identical AI brand identity and logo generator (looka.com)" },
  { num: 901, name: "Brandmark", status: "duplicate", matchId: 407, matchName: "Brandmark", reason: "Identical AI-powered logo and brand asset generator (brandmark.io)" },
  { num: 902, name: "Designs.ai", status: "duplicate", matchId: 409, matchName: "Designs.ai", reason: "Identical creative agency suite with AI logo, video, and design tools (designs.ai)" },
  {
    num: 903,
    name: "Logomaster.ai",
    status: "new",
    url: "https://logomaster.ai",
    category: "Design, UI, and Branding",
    access: "Paid",
    freePlan: "Free to generate, customize, and preview unlimited logo variations; pay to download high-res files",
    why: "Online logo maker that helps startups and small businesses create professional logo packages including vector SVG files."
  },
  {
    num: 904,
    name: "Namecheap Logo Maker",
    status: "new",
    url: "https://www.namecheap.com/logo-maker/",
    category: "Design, UI, and Branding",
    access: "Free",
    freePlan: "100% free logo creation and high-resolution SVG/PNG downloads with no hidden fees",
    why: "Completely free online logo generator that asks for font and color preferences and outputs full vector brand packages."
  },
  {
    num: 905,
    name: "Logopony",
    status: "new",
    url: "https://www.logopony.com",
    category: "Design, UI, and Branding",
    access: "Paid",
    freePlan: "Free generation and live mockup preview; one-time fee to download commercial brand kit",
    why: "AI logo generator that automatically crafts hundreds of distinctive logo concepts and previews them on stationery, t-shirts, and signage."
  },
  { num: 906, name: "LogoAI", status: "duplicate", matchId: 408, matchName: "LogoAI", reason: "Identical AI logo maker and brand automation platform (logoai.com)" },
  {
    num: 907,
    name: "Turbologo",
    status: "new",
    url: "https://turbologo.com",
    category: "Design, UI, and Branding",
    access: "Paid",
    freePlan: "Free creation and design customization; one-time payment for commercial vector files",
    why: "AI logo design tool that generates versatile brand kits with matching business cards, favicons, and social media banners."
  },
  {
    num: 908,
    name: "Tailor Brands AI",
    status: "new",
    url: "https://www.tailorbrands.com",
    category: "Design, UI, and Branding",
    access: "Paid",
    freePlan: "Free logo generator and preview; paid subscriptions for complete brand identity and business formation",
    why: "All-in-one business launch platform combining AI logo creation, domain registration, digital business cards, and LLC filing."
  },

  // === Page 12: Video Generation & Avatars (909-936) ===
  { num: 909, name: "Runway", status: "duplicate", matchId: 101, matchName: "Runway", reason: "Identical pioneering text-to-video and video-to-video platform Gen-2/Gen-3 (runwayml.com)" },
  { num: 910, name: "Pika", status: "duplicate", matchId: 102, matchName: "Pika", reason: "Identical generative video platform with Pikaffects (pika.art)" },
  { num: 911, name: "Luma Dream Machine", status: "duplicate", matchId: 103, matchName: "Luma Dream Machine", reason: "Identical high-realism video generation model by Luma AI (lumalabs.ai/dream-machine)" },
  { num: 912, name: "Kling AI", status: "duplicate", matchId: 104, matchName: "Kling AI", reason: "Identical cinematic text-to-video model with physical motion fidelity (klingai.com)" },
  { num: 913, name: "Hailuo AI", status: "duplicate", matchId: 105, matchName: "Hailuo AI", reason: "Identical Minimax video generation model with photorealistic human motion (hailuoai.video)" },
  { num: 914, name: "PixVerse", status: "duplicate", matchId: 109, matchName: "PixVerse", reason: "Identical video generation platform with anime and realistic presets (pixverse.ai)" },
  { num: 915, name: "Haiper", status: "duplicate", matchId: 111, matchName: "Haiper", reason: "Identical visual foundation model for text-to-video generation (haiper.ai)" },
  { num: 916, name: "Genmo", status: "duplicate", matchId: 112, matchName: "Genmo", reason: "Identical creative video generation studio (genmo.ai)" },
  { num: 917, name: "Vidu", status: "duplicate", matchId: 110, matchName: "Vidu", reason: "Identical generative video model by ShengShu producing 1080p clips (vidu.studio)" },
  { num: 918, name: "Dreamina", status: "duplicate", matchId: 529, matchName: "Dreamina", reason: "Identical video and image generation tool by ByteDance (dreamina.capcut.com)" },
  { num: 919, name: "Krea Video", status: "duplicate", matchId: 76, matchName: "Krea", reason: "Video generation canvas feature within Krea platform (krea.ai)" },
  { num: 920, name: "Kaiber", status: "duplicate", matchId: 115, matchName: "Kaiber", reason: "Identical audiovisual animation and music video creator (kaiber.ai)" },
  {
    num: 921,
    name: "Neural Frames",
    status: "new",
    url: "https://www.neuralframes.com",
    category: "Video Generation",
    access: "Freemium",
    freePlan: "Free tier with 6 seconds of AI video generation and audio reactive modulation",
    why: "Audio-reactive AI video generator that pulses and transforms generative animations in sync with music frequencies and beats."
  },
  {
    num: 922,
    name: "Deforum",
    status: "new",
    url: "https://deforum.github.io",
    category: "Video Generation",
    access: "Open Source",
    freePlan: "100% free open-source script for Stable Diffusion; runs locally on consumer GPUs",
    why: "Open-source animation framework creating trippy, morphing camera motion videos from Stable Diffusion checkpoints."
  },
  {
    num: 923,
    name: "AnimateDiff",
    status: "new",
    url: "https://animatediff.github.io",
    category: "Video Generation",
    access: "Open Source",
    freePlan: "Open-source motion module on GitHub; free to run in ComfyUI or WebUI",
    why: "Pioneering open-source motion module that animates text-to-image Stable Diffusion checkpoints into smooth, coherent video clips."
  },
  { num: 924, name: "Stable Video Diffusion", status: "duplicate", matchId: 116, matchName: "Stable Video Diffusion", reason: "Identical open video model by Stability AI (stability.ai/stable-video)" },
  { num: 925, name: "Wan Video", status: "duplicate", matchId: 543, matchName: "Wan Video", reason: "Identical open-source video generation model Wan 2.1 by Alibaba (wanx.aliyun.com)" },
  {
    num: 926,
    name: "Mochi",
    status: "new",
    url: "https://github.com/genmoai/models",
    category: "Video Generation",
    access: "Open Source",
    freePlan: "Open-weights model released under Apache 2.0 license by Genmo",
    why: "Open-weights video model delivering high motion fidelity and prompt adherence in 480p photorealistic animations."
  },
  {
    num: 927,
    name: "Open-Sora",
    status: "new",
    url: "https://github.com/hpcaitech/Open-Sora",
    category: "Video Generation",
    access: "Open Source",
    freePlan: "100% free open-source reproduction of video generation pipeline by HPC-AI Tech",
    why: "Open-source initiative democratizing efficient text-to-video generation architectures with transparent training recipes."
  },
  {
    num: 928,
    name: "VideoCrafter",
    status: "new",
    url: "https://github.com/AILab-CVC/VideoCrafter",
    category: "Video Generation",
    access: "Open Source",
    freePlan: "Open-source research toolkit free for non-commercial research and local execution",
    why: "Open-source video generation toolbox by Tencent AI Lab featuring text-to-video, image-to-video, and cinematic style transfer models."
  },
  {
    num: 929,
    name: "CogVideoX",
    status: "new",
    url: "https://github.com/THUDM/CogVideo",
    category: "Video Generation",
    access: "Open Source",
    freePlan: "Open-source weights on Hugging Face under Apache 2.0 license by Zhipu AI",
    why: "Large open-source text-to-video model employing 3D variational autoencoders to generate high-resolution video clips."
  },
  { num: 930, name: "Higgsfield", status: "duplicate", matchId: 118, matchName: "Higgsfield", reason: "Identical social-first mobile video generator (higgsfield.ai)" },
  { num: 931, name: "Pollo AI", status: "duplicate", matchId: 114, matchName: "Pollo AI", reason: "Identical all-in-one generative video platform (pollo.ai)" },
  {
    num: 932,
    name: "GoEnhance",
    status: "new",
    url: "https://www.goenhance.ai",
    category: "Video Generation",
    access: "Freemium",
    freePlan: "Free trial credits for video-to-video style transformation and upscaling",
    why: "AI video style transfer platform that turns real human video footage into 3D animation, claymation, and anime styles."
  },
  { num: 933, name: "Viggle", status: "duplicate", matchId: 542, matchName: "Viggle", reason: "Identical controllable character motion animation tool (viggle.ai)" },
  { num: 934, name: "Hedra", status: "duplicate", matchId: 541, matchName: "Hedra", reason: "Identical multimodal foundation model creating expressive talking video avatars (hedra.com)" },
  { num: 935, name: "Captions", status: "duplicate", matchId: 135, matchName: "Captions", reason: "Identical mobile and desktop creator studio with AI dubbing and eye-contact (captions.ai)" },
  { num: 936, name: "HeyGen", status: "duplicate", matchId: 544, matchName: "HeyGen", reason: "Identical enterprise AI video avatar and video localization platform (heygen.com)" },

  // === Page 13: Video Avatars & Video Editing (937-968) ===
  { num: 937, name: "Synthesia", status: "duplicate", matchId: 545, matchName: "Synthesia", reason: "Identical AI video communications platform with photorealistic avatars (synthesia.io)" },
  { num: 938, name: "D-ID", status: "duplicate", matchId: 547, matchName: "D-ID", reason: "Identical talking portrait avatar generation platform (d-id.com)" },
  { num: 939, name: "Colossyan", status: "duplicate", matchId: 546, matchName: "Colossyan", reason: "Identical AI video creator for workplace learning and training (colossyan.com)" },
  { num: 940, name: "Elai.io", status: "duplicate", matchId: 549, matchName: "Elai.io", reason: "Identical digital presenter video creator from blog posts and slides (elai.io)" },
  {
    num: 941,
    name: "Hour One",
    status: "new",
    url: "https://hourone.ai",
    category: "Video Generation",
    access: "Freemium",
    freePlan: "Free tier with up to 3 minutes of published video with virtual avatars",
    why: "Enterprise video platform that automatically transforms training scripts, PDFs, and presentations into professional presenter videos."
  },
  { num: 942, name: "DeepBrain AI", status: "duplicate", matchId: 548, matchName: "DeepBrain AI", reason: "Identical generative video avatar studio with natural text-to-speech (deepbrain.io)" },
  {
    num: 943,
    name: "Akool",
    status: "new",
    url: "https://akool.com",
    category: "Video Generation",
    access: "Freemium",
    freePlan: "Free tier with 50 credits to test face swapping, avatar generation, and live streaming",
    why: "Generative AI marketing platform providing realistic avatar videos, live face swapping, and personalized advertising video campaigns."
  },
  { num: 944, name: "Tavus", status: "duplicate", matchId: 550, matchName: "Tavus", reason: "Identical conversational video avatar API platform (tavus.io)" },
  {
    num: 945,
    name: "Rephrase.ai",
    status: "new",
    url: "https://www.rephrase.ai",
    category: "Video Generation",
    access: "Paid",
    freePlan: "Custom corporate demo for personalized synthetic video campaigns",
    why: "Personalized synthetic video platform that turns customer data into custom video messages for sales and marketing."
  },
  {
    num: 946,
    name: "Pipio",
    status: "new",
    url: "https://pipio.ai",
    category: "Video Generation",
    access: "Freemium",
    freePlan: "Free starter tier with 1 video credit and access to 80+ digital actors",
    why: "Digital video spokesperson platform that turns written scripts into realistic avatar videos in over 40 languages."
  },
  {
    num: 947,
    name: "Vidnoz",
    status: "new",
    url: "https://www.vidnoz.com",
    category: "Video Generation",
    access: "Freemium",
    freePlan: "Free tier with 1 minute of daily video generation and 300+ free avatars",
    why: "Free online AI video generator offering over 1,000 realistic human avatars and automated voiceover synthesis."
  },
  { num: 948, name: "VEED AI", status: "duplicate", matchId: 125, matchName: "VEED", reason: "Identical browser-based video editing and subtitling suite (veed.io)" },
  {
    num: 949,
    name: "Kapwing AI",
    status: "new",
    url: "https://www.kapwing.com/ai",
    category: "Video Editing and Repurposing",
    access: "Freemium",
    freePlan: "Free plan with unlimited 720p video exports with small Kapwing watermark",
    why: "Collaborative online video editor featuring AI script-to-video generation, smart silence trimming, and auto-subtitles."
  },
  { num: 950, name: "Descript", status: "duplicate", matchId: 122, matchName: "Descript", reason: "Identical text-based video and podcast editor with Overdub (descript.com)" },
  { num: 951, name: "Wisecut", status: "duplicate", matchId: 126, matchName: "Wisecut", reason: "Identical automatic video editor using voice recognition to cut pauses (wisecut.video)" },
  { num: 952, name: "Gling", status: "duplicate", matchId: 134, matchName: "Gling", reason: "Identical video editor for YouTubers that automatically cuts silences and bad takes (gling.ai)" },
  { num: 953, name: "OpusClip", status: "duplicate", matchId: 123, matchName: "OpusClip", reason: "Identical generative video repurposing tool turning long videos into viral shorts (opus.pro)" },
  { num: 954, name: "Vizard", status: "duplicate", matchId: 127, matchName: "Vizard", reason: "Identical AI video editor that turns webinars into social media clips (vizard.ai)" },
  { num: 955, name: "Munch", status: "duplicate", matchId: 129, matchName: "Munch", reason: "Identical automated AI content repurposing for podcasts and interviews (getmunch.com)" },
  { num: 956, name: "Klap", status: "duplicate", matchId: 128, matchName: "Klap", reason: "Identical video repurposing app turning YouTube videos into TikToks and Shorts (klap.app)" },
  {
    num: 957,
    name: "Choppity",
    status: "new",
    url: "https://choppity.com",
    category: "Video Editing and Repurposing",
    access: "Freemium",
    freePlan: "Free tier with 30 minutes of video upload per month and auto-captioning",
    why: "AI video editor that converts long podcast footage into animated, captioned social media clips with smart speaker framing."
  },
  { num: 958, name: "Quso.ai", status: "duplicate", matchId: 137, matchName: "Quso.ai", reason: "Identical AI social video clipping and distribution suite (quso.ai)" },
  { num: 959, name: "Vidyo.ai", status: "duplicate", matchId: 130, matchName: "Vidyo.ai", reason: "Identical video clipping tool with automated templates and subtitles (vidyo.ai)" },
  { num: 960, name: "Submagic", status: "duplicate", matchId: 136, matchName: "Submagic", reason: "Identical viral short-form caption generator with emojis and B-roll (submagic.co)" },
  { num: 961, name: "AutoPod", status: "duplicate", matchId: 140, matchName: "AutoPod", reason: "Identical Adobe Premiere Pro multi-camera podcast automatic editing plugin (autopod.fm)" },
  { num: 962, name: "TimeBolt", status: "duplicate", matchId: 139, matchName: "TimeBolt", reason: "Identical rapid silence remover and fast-forward utility for video editors (timebolt.io)" },
  {
    num: 963,
    name: "FireCut",
    status: "new",
    url: "https://firecut.ai",
    category: "Video Editing and Repurposing",
    access: "Freemium",
    freePlan: "Free trial to edit 3 complete video projects directly inside Premiere Pro",
    why: "Premiere Pro AI plugin that automatically cuts silences, removes bad takes, adds zoom cuts, and generates viral captions."
  },
  {
    num: 964,
    name: "Recut",
    status: "new",
    url: "https://getrecut.com",
    category: "Video Editing and Repurposing",
    access: "Paid",
    freePlan: "Free trial with 5 exported video timelines to Final Cut, Premiere, or DaVinci",
    why: "Native macOS and Windows app that cuts silent pauses from recordings in seconds and exports clean XML timelines."
  },
  {
    num: 965,
    name: "Autocut",
    status: "new",
    url: "https://www.autocut.fr",
    category: "Video Editing and Repurposing",
    access: "Freemium",
    freePlan: "14-day free trial for Premiere Pro and DaVinci Resolve plugins",
    why: "Video editing plugin that eliminates dead air, zooms on speaking faces, and generates animated subtitles directly on your timeline."
  },
  {
    num: 966,
    name: "Eddie AI",
    status: "new",
    url: "https://eddieai.com",
    category: "Video Editing and Repurposing",
    access: "Freemium",
    freePlan: "Free beta access with automated footage transcription and story assembly",
    why: "AI assistant for video editors that transcribes footage, organizes B-roll, and builds initial rough-cut story assemblies."
  },
  { num: 967, name: "Filmora AI", status: "duplicate", matchId: 131, matchName: "Filmora", reason: "Identical desktop video editor with AI audio denoiser and smart cutouts (filmora.wondershare.com)" },
  {
    num: 968,
    name: "CyberLink PowerDirector AI",
    status: "new",
    url: "https://www.cyberlink.com/products/powerdirector-video-editing-software/",
    category: "Video Editing and Repurposing",
    access: "Freemium",
    freePlan: "Free download with standard video editing and watermarked AI export previews",
    why: "Consumer video editing suite featuring AI body effects, background removal, motion tracking, and automated speech-to-text."
  },

  // === Page 14: Video Enhancement, Dubbing & Animation (969-1000) ===
  { num: 969, name: "DaVinci Resolve Neural Engine", status: "duplicate", matchId: 133, matchName: "DaVinci Resolve", reason: "Neural Engine AI features integrated into Blackmagic DaVinci Resolve (blackmagicdesign.com/products/davinciresolve)" },
  {
    num: 970,
    name: "Topaz Video AI",
    status: "new",
    url: "https://www.topazlabs.com/topaz-video-ai",
    category: "Video Editing and Repurposing",
    access: "Paid",
    freePlan: "Free trial to preview deinterlacing, upscaling, and frame interpolation results",
    why: "Industry-standard desktop video enhancement tool that upscales footage up to 8K, stabilizes shake, and restores vintage film."
  },
  {
    num: 971,
    name: "AVCLabs Video Enhancer",
    status: "new",
    url: "https://www.avclabs.com/video-enhancer-ai.html",
    category: "Video Editing and Repurposing",
    access: "Paid",
    freePlan: "Free trial with watermarked video outputs to evaluate quality improvements",
    why: "AI video upscaler that sharpens blurry footage, reduces compression noise, and restores facial details up to 4K resolution."
  },
  {
    num: 972,
    name: "HitPaw Video Enhancer",
    status: "new",
    url: "https://www.hitpaw.com/hitpaw-video-enhancer.html",
    category: "Video Editing and Repurposing",
    access: "Paid",
    freePlan: "Free preview of upscaled footage with specialized animation and portrait models",
    why: "Desktop video upscaler offering specialized AI models for face enhancement, anime video sharpening, and black-and-white colorization."
  },
  {
    num: 973,
    name: "TensorPix",
    status: "new",
    url: "https://tensorpix.ai",
    category: "Video Editing and Repurposing",
    access: "Freemium",
    freePlan: "Free tier with 25 credits to upscale and enhance video clips in your web browser",
    why: "Browser-based video enhancement platform that upscales videos up to 4K, increases frame rate to 60fps, and fixes compression artifacts."
  },
  {
    num: 974,
    name: "Video2X",
    status: "new",
    url: "https://github.com/k4yt3x/video2x",
    category: "Video Editing and Repurposing",
    access: "Open Source",
    freePlan: "100% free open-source software under GPL-3.0; run on local GPU without limits",
    why: "Open-source video, GIF, and image upscaler using state-of-the-art super-resolution algorithms like Waifu2x and Real-ESRGAN."
  },
  {
    num: 975,
    name: "Flowframes",
    status: "new",
    url: "https://flowframes.net",
    category: "Video Editing and Repurposing",
    access: "Freemium",
    freePlan: "Free public release on itch.io and GitHub for GPU frame interpolation",
    why: "Fast, user-friendly video frame interpolation application utilizing RIFE to convert 24fps and 30fps footage into butter-smooth 60fps+."
  },
  {
    num: 976,
    name: "RIFE",
    status: "new",
    url: "https://github.com/megvii-research/ECCV2022-RIFE",
    category: "Video Editing and Repurposing",
    access: "Open Source",
    freePlan: "Open-source algorithm code and weights available on GitHub for research and development",
    why: "Real-time intermediate flow estimation algorithm for video frame interpolation, renowned for low latency and high visual fidelity."
  },
  {
    num: 977,
    name: "Wav2Lip",
    status: "new",
    url: "https://github.com/Rudrabha/Wav2Lip",
    category: "Video Generation",
    access: "Open Source",
    freePlan: "Open-source deep learning repository on GitHub; free to run on Colab or local GPU",
    why: "Groundbreaking open-source model that accurately synchronizes lip movements in any target video to match arbitrary speech audio."
  },
  {
    num: 978,
    name: "SadTalker",
    status: "new",
    url: "https://github.com/OpenTalker/SadTalker",
    category: "Video Generation",
    access: "Open Source",
    freePlan: "Free open-source code and model checkpoints on GitHub and Hugging Face",
    why: "Open-source framework that animates a single still portrait image into an expressive talking-head video driven by an audio speech track."
  },
  {
    num: 979,
    name: "LivePortrait",
    status: "new",
    url: "https://github.com/KwaiVGI/LivePortrait",
    category: "Video Generation",
    access: "Open Source",
    freePlan: "Open-source code and weights released by Kuaishou under MIT license",
    why: "State-of-the-art portrait animation framework that transfers facial expressions, gaze, and head pose from a driving video onto a still photo."
  },
  {
    num: 980,
    name: "MuseTalk",
    status: "new",
    url: "https://github.com/TMElyralab/MuseTalk",
    category: "Video Generation",
    access: "Open Source",
    freePlan: "Open-source real-time lip-sync model released by Tencent Music Entertainment",
    why: "Real-time, high-quality audio-driven lip-syncing avatar model that operates at over 30 fps on consumer GPUs."
  },
  {
    num: 981,
    name: "FaceFusion",
    status: "new",
    url: "https://github.com/facefusion/facefusion",
    category: "Video Editing and Repurposing",
    access: "Open Source",
    freePlan: "Open-source deepfake and face-swapping software on GitHub; free to run locally",
    why: "Next-generation face swapper and face enhancer supporting real-time webcam streaming and batch video processing."
  },
  {
    num: 982,
    name: "DeepFaceLab",
    status: "new",
    url: "https://github.com/iperov/DeepFaceLab",
    category: "Video Editing and Repurposing",
    access: "Open Source",
    freePlan: "100% free open-source software on GitHub; industry standard for visual effects artists",
    why: "Leading open-source deepfake software pipeline providing complete end-to-end extraction, training, and composition tools for VFX artists."
  },
  {
    num: 983,
    name: "Rask AI",
    status: "new",
    url: "https://www.rask.ai",
    category: "Video Editing and Repurposing",
    access: "Freemium",
    freePlan: "Free trial to translate and dub 1 video up to 20 minutes across 130+ languages",
    why: "Video localization and AI dubbing platform that translates speech into 130+ languages with voice cloning and lip-syncing."
  },
  {
    num: 984,
    name: "Papercup",
    status: "new",
    url: "https://www.papercup.com",
    category: "Video Editing and Repurposing",
    access: "Paid",
    freePlan: "Custom enterprise demo with sample dubbing and human quality verification",
    why: "Enterprise AI dubbing service that localizes video content using synthetic voices reviewed by human translators for broadcast accuracy."
  },
  {
    num: 985,
    name: "Dubverse",
    status: "new",
    url: "https://dubverse.ai",
    category: "Video Editing and Repurposing",
    access: "Freemium",
    freePlan: "Free tier with 50 monthly credits to dub videos in 30+ languages",
    why: "Generative video dubbing platform that converts video speech into multilingual voiceovers and subtitles with built-in script editors."
  },
  {
    num: 986,
    name: "Maestra",
    status: "new",
    url: "https://maestra.ai",
    category: "Video Editing and Repurposing",
    access: "Freemium",
    freePlan: "Free trial with 15 minutes of automatic transcription, captioning, and voiceover dubbing",
    why: "Cloud platform for automated video captioning, synthetic voiceover dubbing, and text transcription in over 125 languages."
  },
  {
    num: 987,
    name: "SyncLabs",
    status: "new",
    url: "https://synclabs.so",
    category: "Video Generation",
    access: "Freemium",
    freePlan: "Free plan with 5 minutes of real-time lip-sync API processing per month",
    why: "Real-time lip-sync API that modifies video lip movement in any video to match translated audio in any language without retraining."
  },
  { num: 988, name: "ElevenLabs Dubbing Studio", status: "duplicate", matchId: 141, matchName: "ElevenLabs", reason: "Video dubbing and translation studio within ElevenLabs (elevenlabs.io/dubbing)" },
  { num: 989, name: "Lalal.ai Video", status: "duplicate", matchId: 179, matchName: "LALAL.AI", reason: "Audio stem extraction from video within LALAL.AI service (lalal.ai)" },
  {
    num: 990,
    name: "Revid.ai",
    status: "new",
    url: "https://www.revid.ai",
    category: "Video Generation",
    access: "Freemium",
    freePlan: "Free tier with 1 generated video per month and standard templates",
    why: "AI video creation studio that turns text prompts, news articles, and ideas into viral short-form videos for TikTok and Shorts."
  },
  { num: 991, name: "InVideo AI", status: "duplicate", matchId: 124, matchName: "InVideo AI", reason: "Identical prompt-to-video generator with script, media, and voiceover (invideo.io)" },
  {
    num: 992,
    name: "FlexClip AI",
    status: "new",
    url: "https://www.flexclip.com",
    category: "Video Editing and Repurposing",
    access: "Freemium",
    freePlan: "Free plan with 720p downloads, 1 stock video per project, and up to 12 projects",
    why: "Web-based video creation platform with AI text-to-video, auto-subtitle generator, text-to-speech, and extensive stock asset library."
  },
  {
    num: 993,
    name: "Steve.AI",
    status: "new",
    url: "https://www.steve.ai",
    category: "Video Generation",
    access: "Freemium",
    freePlan: "Free tier with 3 video downloads per month in 720p with Steve.AI watermark",
    why: "Online video creation suite that converts blog posts, scripts, and audio into live-action and animated videos in minutes."
  },
  {
    num: 994,
    name: "Animaker AI",
    status: "new",
    url: "https://www.animaker.com",
    category: "Video Generation",
    access: "Freemium",
    freePlan: "Free tier with 5 video downloads per month with Animaker watermark and character builder",
    why: "Cloud animation and video making software featuring AI script generation, character customization, and automated voice sync."
  },
  {
    num: 995,
    name: "Powtoon AI",
    status: "new",
    url: "https://www.powtoon.com",
    category: "Video Generation",
    access: "Freemium",
    freePlan: "Free plan with up to 3-minute video exports in standard quality with Powtoon watermark",
    why: "Visual communication platform that turns text prompts into animated explainer videos and interactive business presentations."
  },
  {
    num: 996,
    name: "Renderforest AI",
    status: "new",
    url: "https://www.renderforest.com",
    category: "Video Generation",
    access: "Freemium",
    freePlan: "Free tier with 500MB storage and 360p watermarked video exports",
    why: "All-in-one branding suite for creating promotional animations, logo reveals, explainer videos, and mockup presentations."
  },
  {
    num: 997,
    name: "Biteable",
    status: "new",
    url: "https://biteable.com",
    category: "Video Generation",
    access: "Paid",
    freePlan: "7-day free trial with full access to smart video templates and brand kits",
    why: "Enterprise video platform for internal communications and HR, producing on-brand animated updates and training videos."
  },
  {
    num: 998,
    name: "Moovly",
    status: "new",
    url: "https://www.moovly.com",
    category: "Video Generation",
    access: "Freemium",
    freePlan: "Free trial to test video templates and export watermarked previews",
    why: "Online video creator that uses AI to convert text, product catalogs, and spreadsheets into animated marketing videos."
  },
  {
    num: 999,
    name: "Raw Shorts",
    status: "new",
    url: "https://www.rawshorts.com",
    category: "Video Generation",
    access: "Freemium",
    freePlan: "Free starter plan with 5 non-premium video exports in standard definition",
    why: "Text-to-video animator that parses written scripts to assemble animated whiteboard explainer videos automatically."
  },
  {
    num: 1000,
    name: "JoggAI",
    status: "new",
    url: "https://www.jogg.ai",
    category: "Video Generation",
    access: "Freemium",
    freePlan: "Free tier with 3 video credits and access to basic digital avatars and templates",
    why: "Video generation platform that turns e-commerce product URLs into high-converting video ads featuring AI avatars and viral captions."
  }
];

console.log(`Total entries defined: ${AUDIT_ENTRIES.length}`);
const dupes = AUDIT_ENTRIES.filter(e => e.status === 'duplicate');
const newTools = AUDIT_ENTRIES.filter(e => e.status === 'new');
console.log(`Duplicates: ${dupes.length}`);
console.log(`New tools: ${newTools.length}`);

// Validate all new tools have valid categories, URLs, and access types
const validAccess = new Set(['Free', 'Freemium', 'Paid', 'Open Source']);
for (const t of newTools) {
  if (!t.name || !t.url || !t.category || !t.access || !t.freePlan || !t.why) {
    throw new Error(`Missing field in new tool #${t.num} ${t.name}`);
  }
  if (!categorySet.has(t.category)) {
    throw new Error(`Invalid category "${t.category}" in tool #${t.num} ${t.name}`);
  }
  if (!validAccess.has(t.access)) {
    throw new Error(`Invalid access "${t.access}" in tool #${t.num} ${t.name}`);
  }
  if (!t.url.startsWith('https://')) {
    throw new Error(`Invalid URL "${t.url}" in tool #${t.num} ${t.name}`);
  }
}

console.log('All new tools passed validation!');
