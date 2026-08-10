import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Search,
  GitCompare,
  Bookmark,
  GraduationCap,
  FileText,
  Lock,
  MessageSquare,
  Sparkles,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import PageMeta from '@/components/common/PageMeta';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const SECTIONS = [
  { id: 'overview', title: 'Overview & Mission', icon: BookOpen },
  { id: 'features', title: 'Platform Features', icon: Sparkles },
  { id: 'search-guide', title: 'Search Guide', icon: Search },
  { id: 'compare-guide', title: 'Compare Guide', icon: GitCompare },
  { id: 'tool-info', title: 'Tool Specifications', icon: FileText },
  { id: 'privacy', title: 'Privacy & Local Storage', icon: Lock },
  { id: 'faq', title: 'FAQ', icon: HelpCircle },
  { id: 'support', title: 'Contact & Support', icon: MessageSquare },
];

export default function DocumentationPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const isManualScroll = useRef(false);

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    isManualScroll.current = true;

    const targetElement = document.getElementById(id);
    if (targetElement) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const headerOffset = 96;
      const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = Math.max(0, elementPosition - headerOffset);

      window.scrollTo({
        top: offsetPosition,
        behavior: reduceMotion ? 'auto' : 'smooth',
      });

      window.history.pushState(null, '', `#${id}`);

      setTimeout(() => {
        isManualScroll.current = false;
      }, 800);
    }
  };

  // Initial hash scroll handling
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && SECTIONS.some((s) => s.id === hash)) {
      setTimeout(() => {
        scrollToSection(hash);
      }, 150);
    }
  }, []);

  // IntersectionObserver for scroll position tracking
  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      if (isManualScroll.current) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveTab(entry.target.id);
        }
      });
    };

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '-96px 0px -50% 0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    SECTIONS.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }
    toast.success('Thank you! Your feedback or tool submission has been received.');
    setContactName('');
    setContactEmail('');
    setContactMessage('');
  };

  const currentSection = SECTIONS.find((s) => s.id === activeTab) || SECTIONS[0];

  return (
    <PageLayout>
      <PageMeta
        title="ToolTap Documentation | User & Developer Guide"
        description="Complete user guide, search documentation, comparison specs, and local privacy details for ToolTap."
      />
      <div className="py-6 sm:py-8 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" /> Documentation & Knowledge Base
          </div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-foreground tracking-tight">
            <span className="text-white">Tool</span><span className="text-amber-500">Tap</span> Documentation
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm max-w-2xl leading-relaxed">
            Everything you need to know about our AI directory, search engine capabilities, evaluation criteria, and local privacy guarantees.
          </p>
        </div>

        {/* Mobile Collapsible Navigation (below 768px) */}
        <div className="md:hidden sticky top-[76px] z-30 mb-6">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-[#1E1E24] border border-white/10 rounded-xl text-xs font-bold text-foreground shadow-2xl"
          >
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary shrink-0" />
              <span>Index: {currentSection.title}</span>
            </span>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${mobileMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {mobileMenuOpen && (
            <div className="mt-2 p-2 bg-[#1E1E24] border border-white/10 rounded-xl shadow-2xl max-h-[60vh] overflow-y-auto space-y-1">
              {SECTIONS.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeTab === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                      isActive
                        ? 'bg-primary text-primary-foreground font-bold'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{sec.title}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Documentation Main Layout */}
        <div className="documentation-layout">
          {/* Desktop Sidebar Nav */}
          <aside className="documentation-sidebar hidden md:block p-3 space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-3 py-2">
              Documentation Index
            </p>
            {SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeTab === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                    isActive
                      ? 'bg-primary text-primary-foreground font-bold shadow-md'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{sec.title}</span>
                </button>
              );
            })}
          </aside>

          {/* Main Content Body */}
          <main className="documentation-content space-y-10">
            {/* Overview & Mission */}
            <section id="overview" className="documentation-section bg-[#1E1E24] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <BookOpen className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <h2 className="text-lg sm:text-xl font-heading font-bold text-foreground">Overview & Directory Mission</h2>
                  <p className="text-xs text-muted-foreground">About ToolTap and our verification standards</p>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-foreground/90 leading-relaxed">
                <p>
                  <strong>ToolTap</strong> is a comprehensive AI tool directory designed to help students, developers, researchers, and creators quickly find the best artificial intelligence tools for their specific tasks.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                  <div className="p-4 rounded-xl bg-[#101115] border border-white/5 space-y-1">
                    <span className="text-2xl font-bold text-primary font-heading">500+</span>
                    <p className="text-xs text-muted-foreground font-medium">Curated AI Tools</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#101115] border border-white/5 space-y-1">
                    <span className="text-2xl font-bold text-amber-400 font-heading">25</span>
                    <p className="text-xs text-muted-foreground font-medium">Specialized Categories</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#101115] border border-white/5 space-y-1">
                    <span className="text-2xl font-bold text-emerald-400 font-heading">100%</span>
                    <p className="text-xs text-muted-foreground font-medium">Local Browser Storage</p>
                  </div>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-foreground pt-2">Core Principles</h3>
                <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                  <li><strong>Verified Official Links:</strong> Every tool entry links directly to official project homepages and products.</li>
                  <li><strong>Task-Oriented Discovery:</strong> Search by what you want to accomplish rather than guessing software names.</li>
                  <li><strong>Student-Friendly Focus:</strong> Highlighting free plans, open-source options, and zero-cost tools.</li>
                </ul>
              </div>
            </section>

            {/* Platform Features */}
            <section id="features" className="documentation-section bg-[#1E1E24] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <Sparkles className="w-6 h-6 text-amber-400 shrink-0" />
                <div>
                  <h2 className="text-lg sm:text-xl font-heading font-bold text-foreground">Platform Features</h2>
                  <p className="text-xs text-muted-foreground">Overview of core directory tools and capabilities</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl border border-white/10 bg-[#101115] space-y-2">
                  <div className="flex items-center gap-2 font-bold text-primary">
                    <Search className="w-4 h-4" /> Task-Based Search Engine
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Fuzzy search indexed across tool names, categories, and natural language task descriptions.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-white/10 bg-[#101115] space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-400">
                    <GitCompare className="w-4 h-4" /> Side-by-Side Comparison
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Compare up to 3 tools simultaneously to evaluate free tier limits, access models, and features.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-white/10 bg-[#101115] space-y-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-400">
                    <GraduationCap className="w-4 h-4" /> Student Mode
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Filter out paid software and highlight zero-cost, open source, and student-friendly tools.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-white/10 bg-[#101115] space-y-2">
                  <div className="flex items-center gap-2 font-bold text-purple-400">
                    <Bookmark className="w-4 h-4" /> Bookmarks & Activity
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Save favorite software locally in your browser and review your recently visited history anytime.
                  </p>
                </div>
              </div>
            </section>

            {/* Search Guide */}
            <section id="search-guide" className="documentation-section bg-[#1E1E24] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <Search className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <h2 className="text-lg sm:text-xl font-heading font-bold text-foreground">Search Guide</h2>
                  <p className="text-xs text-muted-foreground">How to find tools fast</p>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-foreground/90 leading-relaxed">
                <p>The search bar supports both direct tool names and task descriptions:</p>
                <div className="bg-[#101115] border border-white/10 rounded-xl p-4 space-y-2">
                  <p className="font-semibold text-primary text-xs">Example Searches:</p>
                  <ul className="space-y-1.5 text-muted-foreground list-disc list-inside">
                    <li><code className="text-foreground bg-black/50 px-2 py-0.5 rounded font-mono text-xs">"Create PowerPoint"</code> — Gamma, Tome, SlidesAI</li>
                    <li><code className="text-foreground bg-black/50 px-2 py-0.5 rounded font-mono text-xs">"Write Code"</code> — Cursor, GitHub Copilot, Replit</li>
                    <li><code className="text-foreground bg-black/50 px-2 py-0.5 rounded font-mono text-xs">"Summarize PDF"</code> — ChatPDF, Humata, PDF.ai</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Compare Guide */}
            <section id="compare-guide" className="documentation-section bg-[#1E1E24] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <GitCompare className="w-6 h-6 text-amber-400 shrink-0" />
                <div>
                  <h2 className="text-lg sm:text-xl font-heading font-bold text-foreground">Comparison Matrix Guide</h2>
                  <p className="text-xs text-muted-foreground">Side-by-side analysis criteria</p>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-foreground/90 leading-relaxed">
                <p>When comparing tools on the Compare page, we evaluate key attributes:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 bg-[#101115] rounded-xl border border-white/5">
                    <span className="font-bold text-primary block mb-1">Access Type</span>
                    <p className="text-xs text-muted-foreground">Free, Freemium, Paid, or Open Source licensing.</p>
                  </div>
                  <div className="p-3.5 bg-[#101115] rounded-xl border border-white/5">
                    <span className="font-bold text-amber-400 block mb-1">Free Tier Limits</span>
                    <p className="text-xs text-muted-foreground">Usage caps, trial credits, and free tier restrictions.</p>
                  </div>
                  <div className="p-3.5 bg-[#101115] rounded-xl border border-white/5">
                    <span className="font-bold text-emerald-400 block mb-1">Best For</span>
                    <p className="text-xs text-muted-foreground">Primary strengths and recommended workflows.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Tool Specifications */}
            <section id="tool-info" className="documentation-section bg-[#1E1E24] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <FileText className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <h2 className="text-lg sm:text-xl font-heading font-bold text-foreground">Access Types Explained</h2>
                  <p className="text-xs text-muted-foreground">Understanding directory badges</p>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                  <strong className="text-emerald-400 font-bold">Free:</strong> Completely free to use with no subscription required.
                </div>
                <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 space-y-1">
                  <strong className="text-primary font-bold">Freemium:</strong> Offers a free plan or credits alongside paid options.
                </div>
                <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-1">
                  <strong className="text-purple-400 font-bold">Open Source:</strong> Public source code, often self-hostable.
                </div>
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                  <strong className="text-amber-400 font-bold">Paid:</strong> Requires a paid license or plan.
                </div>
              </div>
            </section>

            {/* Privacy & Local Storage */}
            <section id="privacy" className="documentation-section bg-[#1E1E24] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <Lock className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <h2 className="text-lg sm:text-xl font-heading font-bold text-foreground">Privacy & Data Guarantees</h2>
                  <p className="text-xs text-muted-foreground">How your preferences remain private</p>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-foreground/90 leading-relaxed">
                <p>
                  ToolTap runs client-side in your browser environment.
                </p>
                <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                  <li>No account creation or login required.</li>
                  <li>Bookmarks, comparison lists, and history are stored 100% locally in browser <code className="text-foreground bg-black/50 px-1.5 py-0.5 rounded font-mono text-xs">localStorage</code>.</li>
                  <li>No tracking cookies or selling of personal information.</li>
                </ul>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="documentation-section bg-[#1E1E24] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <HelpCircle className="w-6 h-6 text-amber-400 shrink-0" />
                <div>
                  <h2 className="text-lg sm:text-xl font-heading font-bold text-foreground">Frequently Asked Questions</h2>
                  <p className="text-xs text-muted-foreground">Common queries</p>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="p-4 bg-[#101115] border border-white/5 rounded-xl space-y-1">
                  <strong className="text-foreground font-semibold">How frequently is tool data updated?</strong>
                  <p className="text-muted-foreground leading-relaxed">Data is regularly verified against official product releases, pricing pages, and feature announcements.</p>
                </div>
                <div className="p-4 bg-[#101115] border border-white/5 rounded-xl space-y-1">
                  <strong className="text-foreground font-semibold">Is ToolTap responsive on mobile?</strong>
                  <p className="text-muted-foreground leading-relaxed">Yes! All layouts, cards, and comparison matrices are fully optimized for mobile devices.</p>
                </div>
              </div>
            </section>

            {/* Contact & Support */}
            <section id="support" className="documentation-section bg-[#1E1E24] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <MessageSquare className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <h2 className="text-lg sm:text-xl font-heading font-bold text-foreground">Contact & Tool Submission</h2>
                  <p className="text-xs text-muted-foreground">Submit a tool or report pricing updates</p>
                </div>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground">Your Name</label>
                    <Input
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Alex Mercer"
                      className="bg-[#101115] border-white/10 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground">Your Email</label>
                    <Input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="bg-[#101115] border-white/10 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Message / Tool Submission</label>
                  <Textarea
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Provide details about an AI tool you'd like added or pricing changes..."
                    className="bg-[#101115] border-white/10 rounded-xl"
                  />
                </div>

                <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl h-10 px-6">
                  Submit Feedback
                </Button>
              </form>
            </section>
          </main>
        </div>
      </div>
    </PageLayout>
  );
}
