import { useState, useEffect, useMemo, useTransition, Suspense } from 'react';
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
import { ToolGridSkeleton } from '@/components/tools/ToolCardSkeleton';
import SuspenseToolGrid from '@/components/tools/SuspenseToolGrid';
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

  // Active collection tab with transition
  const [activeTab, setActiveTab] = useState<'students' | 'coding' | 'media' | 'productivity'>('students');
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (tabId: 'students' | 'coding' | 'media' | 'productivity') => {
    startTransition(() => {
      setActiveTab(tabId);
    });
  };

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
        title="ToolTap | Discover, Compare, and Choose AI Tools"
        description="The ultimate directory for students, developers, and creators to find verified AI tools with transparent pricing and workflow benchmarks."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* SECTION 1: HERO SEARCH + TASK CHIPS + ROLE SELECTOR */}
        <section className="relative overflow-hidden py-16 sm:py-20 md:py-24 text-center rounded-3xl bg-[#18181C] border border-white/[0.08] shadow-2xl w-full transform-gpu [transform:translateZ(0)]">
          {/* Ambient Background Gradient Backlight for 3D Centerpiece */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-[#F2994A]/25 via-[#E05A47]/15 to-transparent rounded-full blur-[100px] pointer-events-none -z-20 transform-gpu [transform:translateZ(0)]" />
          <CinematicBackground />
          <InteractivePerspectiveGrid className="absolute inset-0 z-0 opacity-20 pointer-events-none" />
          <Hero3DCanvas />
          
          <div className="relative z-10 w-full mx-auto px-4 sm:px-6 md:px-8 max-w-4xl">
            {/* Badge Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold mb-6 animate-float-up opacity-0 [animation-fill-mode:forwards]">
              <Sparkles className="w-3.5 h-3.5" />
              Discover 500+ Verified AI Tools
            </div>

            {/* Headline & Dynamic Switcher */}
            <h1
              className="text-white font-bold tracking-tight text-4xl sm:text-6xl mb-6 text-balance mx-auto drop-shadow-md animate-float-up opacity-0 [animation-fill-mode:forwards]"
              style={{ animationDelay: '60ms' }}
            >
              Find the Best AI Tool
              <div className="block mt-2 sm:mt-3 min-h-[2.5rem] sm:min-h-[3.25rem] flex items-center justify-center">
                <span
                  className={cn(
                    'text-gradient font-black text-2xl sm:text-4xl md:text-5xl tracking-normal transition-all duration-300 inline-block px-2',
                    fade ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95'
                  )}
                >
                  {DYNAMIC_TAGLINES[taglineIdx]}
                </span>
              </div>
            </h1>

            <p
              className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed animate-float-up opacity-0 [animation-fill-mode:forwards]"
              style={{ animationDelay: '120ms' }}
            >
              Search, compare, and discover verified AI tools with official links, transparent pricing, free-tier quotas, and workflow benchmarks.
            </p>

            {/* Hero Search Bar */}
            <div
              className="relative z-20 mx-auto mb-6 w-full max-w-2xl animate-float-up opacity-0 [animation-fill-mode:forwards]"
              style={{ animationDelay: '180ms' }}
            >
              <SearchBar size="hero" />
            </div>

            {/* Quick-Filter Task Chips */}
            <div
              className="relative z-10 flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto mb-6 px-2 animate-float-up opacity-0 [animation-fill-mode:forwards]"
              style={{ animationDelay: '240ms' }}
            >
              {TASK_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => handleTaskChipClick(chip.query)}
                  className="text-xs px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-white/75 hover:border-[#F2994A]/40 hover:text-white transition-all cursor-pointer flex items-center justify-center touch-manipulation active:scale-95"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Prominent Student Mode Toggle Banner */}
            <div
              className="relative z-10 max-w-md mx-auto bg-[#141417]/95 border border-white/10 rounded-2xl p-3.5 sm:p-4 shadow-xl backdrop-blur-sm transform-gpu [transform:translateZ(0)] flex items-center justify-between gap-4 animate-float-up opacity-0 [animation-fill-mode:forwards]"
              style={{ animationDelay: '300ms' }}
            >
              <div className="flex items-center gap-3 text-left">
                <div className={cn(
                  'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                  studentMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/60'
                )}>
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs sm:text-sm text-white">🎓 Student Mode</span>
                    <Badge className={cn('text-xs px-2 py-0.5', studentMode ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/10 text-white/70')}>
                      {studentMode ? 'Active' : 'Off'}
                    </Badge>
                  </div>
                  <p className="text-xs text-white/70 mt-0.5">
                    Prioritizes 100% Free and generous Freemium plans
                  </p>
                </div>
              </div>

              <Switch
                checked={studentMode}
                onCheckedChange={setStudentMode}
                className="data-[state=checked]:bg-emerald-500 scale-110 mr-1 touch-manipulation shrink-0"
                aria-label="Toggle Student Mode"
              />
            </div>
          </div>
        </section>

        {/* SECTION 2: FEATURED / TRENDING TOOL OF THE WEEK CARD */}
        {featuredTool && (
          <section>
            <div className="relative rounded-2xl p-6 sm:p-8 bg-[#18181C] border border-white/[0.08] hover:border-white/20 transition-all duration-200 shadow-xl overflow-hidden">
              <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
                
                <div className="space-y-4 max-w-2xl min-w-0 flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                    <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    Featured Tool of the Week
                  </div>

                  <div className="flex items-center gap-4 min-w-0">
                    <ToolLogo name={featuredTool.name} category={featuredTool.category} url={featuredTool.url} size="lg" className="w-12 h-12 rounded-xl shadow-md border border-white/10 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h2 className="font-bold text-xl sm:text-2xl text-white tracking-tight flex flex-wrap items-center gap-2.5">
                        <span>{featuredTool.name}</span>
                        <AccessBadge access={featuredTool.access} size="sm" />
                      </h2>
                      <p className="text-xs text-amber-400/90 font-medium mt-1">
                        {featuredTool.category}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-white/65 leading-relaxed">
                    {featuredTool.why}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <div className="bg-white/5 border border-white/[0.08] px-3 py-1.5 rounded-xl text-white/80 font-medium flex items-center gap-1.5 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Free Plan: <strong className="text-white">{featuredTool.freePlan}</strong></span>
                    </div>
                    <div className="bg-white/5 border border-white/[0.08] px-3 py-1.5 rounded-xl text-white/80 font-medium flex items-center gap-1.5 shrink-0">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                      <span>Rating: <strong className="text-white">4.9 / 5.0</strong></span>
                    </div>
                  </div>
                </div>

                {/* Actions & CTA Box */}
                <div className="w-full xl:w-auto shrink-0 flex flex-col sm:flex-row xl:flex-col gap-3 pt-4 xl:pt-0 border-t xl:border-t-0 border-white/[0.08]">
                  <Button
                    asChild
                    size="lg"
                    className="h-11 px-5 w-full sm:w-auto justify-center bg-amber-500 hover:bg-amber-500/90 text-black font-bold rounded-xl gap-2 shadow-lg touch-manipulation text-xs sm:text-sm active:scale-95 shrink-0"
                  >
                    <a
                      href={featuredTool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => addToHistory(featuredTool)}
                      className="inline-flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4 shrink-0" />
                      <span>Visit Official Site</span>
                    </a>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="h-11 px-5 w-full sm:w-auto justify-center border-white/10 hover:bg-white/[0.06] text-white font-semibold rounded-xl gap-2 touch-manipulation text-xs sm:text-sm active:scale-95 shrink-0"
                  >
                    <Link to={`/tools/${featuredTool.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="inline-flex items-center justify-center gap-2">
                      <span>Explore Details</span>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </Link>
                  </Button>
                </div>

              </div>
            </div>
          </section>
        )}

        {/* SECTION 3: INTERACTIVE CATEGORY GRID (All 25 Categories) */}
        <section>
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/[0.08] text-amber-400 text-xs font-semibold mb-2">
                <Layers className="w-3.5 h-3.5" />
                Comprehensive Directory
              </div>
              <h2 className="font-bold text-2xl sm:text-3xl text-white tracking-tight">
                Explore All 25 AI Categories
              </h2>
              <p className="text-sm text-white/60 mt-1">
                Organized by precise workflow needs and verified platform capabilities
              </p>
            </div>
            <Link
              to="/categories"
              className="hidden sm:flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300 font-semibold transition-colors shrink-0"
            >
              View Category Guide <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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

        {/* SECTION 4: CURATED COLLECTIONS */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/[0.08] text-amber-400 text-xs font-semibold mb-2">
                <Star className="w-3.5 h-3.5" />
                Handpicked Tool Sets
              </div>
              <h2 className="font-bold text-2xl sm:text-3xl text-white tracking-tight">
                Curated AI Collections
              </h2>
              <p className="text-sm text-white/60 mt-1">
                Hand-selected AI stacks tailored for specific roles and student workflows
              </p>
            </div>

            {/* Collection Tabs */}
            <div className="flex items-center gap-1.5 bg-[#18181C] p-1 rounded-xl border border-white/[0.08] overflow-x-auto max-w-full">
              {[
                { id: 'students', label: '🎓 For Students' },
                { id: 'coding', label: '💻 Coding AI' },
                { id: 'media', label: '🎨 Image & Video' },
                { id: 'productivity', label: '⚡ Productivity' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id as any)}
                  className={cn(
                    'px-3.5 py-1.5 min-h-[36px] rounded-lg text-xs font-semibold whitespace-nowrap transition-all touch-manipulation border',
                    activeTab === tab.id
                      ? 'bg-amber-500/15 border-amber-500/30 text-amber-400 font-bold'
                      : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Collection Grid with Suspense Skeleton */}
          <Suspense fallback={<ToolGridSkeleton count={6} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" />}>
            {isPending ? (
              <ToolGridSkeleton count={6} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
            )}
          </Suspense>
        </section>
      </div>
    </PageLayout>
  );
}
