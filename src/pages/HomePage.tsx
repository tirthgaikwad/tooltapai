import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles, Star, GraduationCap, Flame, ChevronRight,
  ArrowRight, ExternalLink, CheckCircle2,
  Layers, Compass, Target
} from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import PageMeta from '@/components/common/PageMeta';
import Hero3DCanvas from '@/components/home/Hero3DCanvas';
import CinematicBackground from '@/components/home/CinematicBackground';
import InteractivePerspectiveGrid from '@/components/home/InteractivePerspectiveGrid';
import SearchBar from '@/components/search/SearchBar';
import ToolCard from '@/components/tools/ToolCard';
import ToolLogo from '@/components/tools/ToolLogo';
import CategoryCard from '@/components/tools/CategoryCard';
import AccessBadge from '@/components/tools/AccessBadge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { CATEGORIES } from '@/types/tool';
import { cn } from '@/lib/utils';

// Dynamic hero tagline phrases
const DYNAMIC_TAGLINES = [
  'for Presentations & Slides 📊',
  'for Coding & App Development 💻',
  'for Video Editing & Repurposing 🎥',
  'for PDF Summaries & Research 📄',
  'for Resume & Career Growth 📝',
  'for Students & Professionals 🎓',
];

// Task chips
const TASK_CHIPS = [
  { label: '✨ Create PPT', query: 'Presentation' },
  { label: '💻 Write Code', query: 'Coding' },
  { label: '🎥 Edit Video', query: 'Video' },
  { label: '📄 Summarize PDF', query: 'PDF' },
  { label: '📝 Write Resume', query: 'Resume' },
  { label: '🎙️ Voice & Audio', query: 'Audio' },
  { label: '🎵 Compose Music', query: 'Music' },
  { label: '🎨 Design & Art', query: 'Image' },
  { label: '🌐 SEO & Content', query: 'SEO' },
  { label: '💬 Chat & AI', query: 'Chatbot' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { tools, studentMode, setStudentMode, addToHistory } = useApp();

  // Dynamic phrase cycling state
  const [taglineIdx, setTaglineIdx] = useState(0);
  const [fade, setFade] = useState(true);

  // Active collection tab
  const [activeTab, setActiveTab] = useState<'students' | 'coding' | 'media' | 'productivity'>('students');

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setTaglineIdx((prev) => (prev + 1) % DYNAMIC_TAGLINES.length);
        setFade(true);
      }, 200);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  // Tool of the week selection
  const featuredTool = useMemo(() => {
    return tools.find(t => t.name === 'Claude') || tools.find(t => t.name === 'Claude Code') || tools[0];
  }, [tools]);

  // Collections filtering
  const studentCollection = useMemo(() =>
    tools.filter(t => (t.access === 'Free' || t.access === 'Open Source' || t.access === 'Freemium') && ['ChatGPT', 'Grammarly', 'Gamma', 'Perplexity', 'Canva', 'Notion AI'].includes(t.name)).slice(0, 6),
    [tools]
  );

  const codingCollection = useMemo(() =>
    tools.filter(t => t.category === 'Coding and Software Development' || ['Cursor', 'GitHub Copilot', 'Bolt', 'Lovable', 'v0 by Vercel', 'Replit'].includes(t.name)).slice(0, 6),
    [tools]
  );

  const mediaCollection = useMemo(() =>
    tools.filter(t => ['Image Generation', 'Video Generation', 'Video Editing and Repurposing'].includes(t.category) || ['Midjourney', 'Runway', 'CapCut', 'Suno', 'ElevenLabs', 'Luma Dream Machine'].includes(t.name)).slice(0, 6),
    [tools]
  );

  const productivityCollection = useMemo(() =>
    tools.filter(t => ['Meetings, Notes, and Productivity', 'PDF and Document AI', 'Presentations and Slides'].includes(t.category)).slice(0, 6),
    [tools]
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const t of tools) {
      counts[t.category] = (counts[t.category] ?? 0) + 1;
    }
    return counts;
  }, [tools]);

  const handleTaskChipClick = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <PageLayout>
      <PageMeta
        title="ToolTap – Discover and Compare AI Tools"
        description="ToolTap helps students, creators, developers, and professionals discover, compare, and save the best AI tools for any task."
      />
      {/* SECTION 1: HERO SEARCH + TASK CHIPS + STUDENT MODE TOGGLE */}
      <section className="relative overflow-hidden py-12 sm:py-16 md:py-20 text-center rounded-3xl mb-12 bg-[#1E1E24]/90 card-gradient border border-white/[0.08] shadow-2xl w-full">
        <Hero3DCanvas />
        <CinematicBackground />
        <InteractivePerspectiveGrid className="absolute inset-0 z-0 opacity-30 dark:opacity-25" />
        
        <div className="relative z-10 w-full mx-auto px-4 sm:px-6 md:px-8" style={{ width: 'min(100%, 1200px)', marginInline: 'auto' }}>
          {/* Badge Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-5 animate-float-up opacity-0 [animation-fill-mode:forwards]">
            <Sparkles className="w-3.5 h-3.5" />
            Discover 500+ Verified AI Tools
          </div>

          {/* Headline & Dynamic Switcher */}
          <h1
            className="font-heading font-extrabold text-[clamp(2.25rem,5vw,4rem)] text-high-emphasis tracking-tight text-balance max-w-[1050px] mx-auto mb-4 drop-shadow-md animate-float-up opacity-0 [animation-fill-mode:forwards]"
            style={{ animationDelay: '60ms' }}
          >
            Find the Best AI Tool
            <div className="block mt-2 sm:mt-3 min-h-[2.5rem] sm:min-h-[3.25rem] flex items-center justify-center">
              <span
                className={cn(
                  'text-gradient font-black text-[clamp(1.25rem,3.2vw,2.75rem)] tracking-normal transition-all duration-300 inline-block px-2',
                  fade ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95'
                )}
              >
                {DYNAMIC_TAGLINES[taglineIdx]}
              </span>
            </div>
          </h1>

          <p
            className="text-[clamp(0.95rem,1.8vw,1.25rem)] text-med-emphasis max-w-[820px] mx-auto mb-8 leading-relaxed animate-float-up opacity-0 [animation-fill-mode:forwards]"
            style={{ animationDelay: '120ms' }}
          >
            ToolTap helps you search, compare, and discover verified AI tools with official links, pricing information, free-plan limits, and practical use cases.
          </p>

          {/* Hero Search Bar */}
          <div
            className="relative z-[70] mx-auto mb-6 w-full max-w-[1180px] animate-float-up opacity-0 [animation-fill-mode:forwards]"
            style={{ animationDelay: '180ms' }}
          >
            <SearchBar size="hero" />
          </div>

          {/* 5 Clickable Task Chips */}
          <div
            className="relative z-10 flex overflow-x-auto sm:flex-wrap items-center justify-start sm:justify-center gap-2.5 sm:gap-3 w-full max-w-[1100px] mx-auto mb-8 px-2 py-1 scrollbar-none snap-x snap-mandatory [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)] sm:[mask-image:none] animate-float-up opacity-0 [animation-fill-mode:forwards]"
            style={{ animationDelay: '240ms' }}
          >
            {TASK_CHIPS.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => handleTaskChipClick(chip.query)}
                className="px-4 py-2.5 min-h-[44px] rounded-full text-xs sm:text-sm font-medium bg-white/5 border border-white/10 text-high-emphasis hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-400 transition-all duration-150 cursor-pointer flex items-center justify-center touch-manipulation active:scale-95 shadow-sm whitespace-nowrap snap-start shrink-0 sm:shrink"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Prominent Student Mode Toggle Banner */}
          <div
            className="relative z-10 max-w-[640px] mx-auto bg-[#121216]/90 border border-amber-500/30 rounded-2xl p-3.5 sm:p-4 shadow-lg backdrop-blur-md flex items-center justify-between gap-4 animate-float-up opacity-0 [animation-fill-mode:forwards]"
            style={{ animationDelay: '300ms' }}
          >
            <div className="flex items-center gap-3 text-left">
              <div className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                studentMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-med-emphasis'
              )}>
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-sm text-high-emphasis">🎓 Student Mode</span>
                  <Badge className={cn('text-[10px] px-2 py-0.2', studentMode ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/10 text-med-emphasis')}>
                    {studentMode ? 'Active' : 'Off'}
                  </Badge>
                </div>
                <p className="text-xs text-med-emphasis mt-0.5">
                  Filters purely paid tools & prioritizes 100% Free / Freemium tools
                </p>
              </div>
            </div>

            <Switch
              checked={studentMode}
              onCheckedChange={setStudentMode}
              className="data-[state=checked]:bg-emerald-500 scale-125 mr-1 touch-manipulation shrink-0"
              aria-label="Toggle Student Mode"
            />
          </div>
        </div>
      </section>

      {/* SECTION 2: FEATURED / TRENDING TOOL OF THE WEEK CARD */}
      {featuredTool && (
        <section className="mb-16">
          <div className="relative rounded-3xl p-6 sm:p-8 bg-[#1E1E24] border-2 border-amber-500/80 shadow-[0_0_30px_rgba(242,153,74,0.2)] transition-transform duration-200 hover:-translate-y-1">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-extrabold uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  Featured Tool of the Week
                </div>

                <div className="flex items-center gap-4">
                  <ToolLogo name={featuredTool.name} category={featuredTool.category} url={featuredTool.url} size="lg" className="rounded-2xl shadow-md border border-white/10" />
                  <div>
                    <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-foreground tracking-tight flex items-center gap-3">
                      {featuredTool.name}
                      <AccessBadge access={featuredTool.access} />
                    </h2>
                    <p className="text-xs sm:text-sm text-amber-400/90 font-medium mt-0.5">
                      {featuredTool.category}
                    </p>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {featuredTool.why}
                </p>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-foreground/90 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Free Plan: <strong className="text-foreground">{featuredTool.freePlan}</strong></span>
                  </div>
                  <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-foreground/90 font-medium flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>Rating: <strong>4.9 / 5.0</strong></span>
                  </div>
                </div>
              </div>

              {/* Actions & CTA Box */}
              <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/10">
                <Button
                  asChild
                  size="lg"
                  className="h-12 px-6 bg-amber-500 hover:bg-amber-500/90 text-black font-extrabold rounded-xl gap-2 shadow-lg touch-manipulation text-sm active:scale-95"
                >
                  <a
                    href={featuredTool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => addToHistory(featuredTool)}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit Official Site
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 px-6 border-white/15 hover:bg-white/10 text-foreground font-semibold rounded-xl gap-2 touch-manipulation text-sm active:scale-95"
                >
                  <Link to={`/tools/${featuredTool.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
                    Explore Details <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* SECTION 3: INTERACTIVE CATEGORY GRID (All 25 Categories) */}
      <section className="mb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-semibold mb-2">
              <Layers className="w-3.5 h-3.5" />
              Comprehensive Directory
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-foreground tracking-tight">
              Explore All 25 AI Categories
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Organized by precise workflow needs and dynamic category slug routing
            </p>
          </div>
          <Link
            to="/categories"
            className="hidden sm:flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300 font-semibold transition-colors shrink-0"
          >
            View Category Guide <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {CATEGORIES.map((cat, i) => (
            <CategoryCard
              key={cat}
              category={cat}
              count={categoryCounts[cat] ?? 0}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* SECTION 5: CURATED COLLECTIONS */}
      <section className="mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-semibold mb-2">
              <Star className="w-3.5 h-3.5" />
              Handpicked Tool Sets
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-foreground tracking-tight">
              Curated AI Collections
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Hand-selected AI stacks tailored for specific roles and student needs
            </p>
          </div>

          {/* Collection Tabs */}
          <div className="flex items-center gap-1.5 bg-[#1E1E24]/60 p-1 rounded-xl border border-white/[0.08] overflow-x-auto max-w-full">
            {[
              { id: 'students', label: '🎓 For Students' },
              { id: 'coding', label: '💻 Coding AI' },
              { id: 'media', label: '🎨 Image & Video' },
              { id: 'productivity', label: '⚡ Productivity' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'px-3.5 py-2 min-h-[44px] sm:min-h-[36px] rounded-lg text-xs font-semibold whitespace-nowrap transition-all touch-manipulation border',
                  activeTab === tab.id
                    ? 'filter-pill-active font-bold'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-white/5'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Collection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeTab === 'students' && studentCollection.map((tool, i) => (
            <ToolCard key={tool.id} tool={tool} animationDelay={i * 40} showBestFree />
          ))}
          {activeTab === 'coding' && codingCollection.map((tool, i) => (
            <ToolCard key={tool.id} tool={tool} animationDelay={i * 40} />
          ))}
          {activeTab === 'media' && mediaCollection.map((tool, i) => (
            <ToolCard key={tool.id} tool={tool} animationDelay={i * 40} />
          ))}
          {activeTab === 'productivity' && productivityCollection.map((tool, i) => (
            <ToolCard key={tool.id} tool={tool} animationDelay={i * 40} />
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
