import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Grid3X3,
  GitCompare,
  Bookmark,
  GraduationCap,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  Zap,
  Lightbulb
} from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import PageMeta from '@/components/common/PageMeta';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const STEPS = [
  {
    step: '01',
    title: 'Search by Task & Intent',
    icon: Search,
    color: 'text-primary bg-primary/10 border-primary/20',
    description: 'Find tools by describing what you want to achieve rather than searching for exact software names.',
    highlights: [
      'Type queries like "Create PowerPoint" or "Build website without coding"',
      'Use quick suggestion chips on the home page for common tasks',
      'Filter results instantly by access tier (Free, Freemium, Paid, Open Source)',
    ],
    actionText: 'Search Directory',
    actionLink: '/search',
  },
  {
    step: '02',
    title: 'Explore Categories & Hand-Picked Collections',
    icon: Grid3X3,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    description: 'Browse through 25 specialized categories ranging from Coding and Writing to Image Generation and Automation.',
    highlights: [
      'Filter tools by specific functional domain',
      'Discover curated collections like "Best for Students" or "Free Design Tools"',
      'View total tool counts and quick details for each domain',
    ],
    actionText: 'Browse Categories',
    actionLink: '/categories',
  },
  {
    step: '03',
    title: 'Compare Tools Side-by-Side',
    icon: GitCompare,
    color: 'text-primary bg-primary/10 border-primary/20',
    description: 'Select up to 3 tools to compare features, free plan limits, and access details in a structured grid.',
    highlights: [
      'Click the Compare button on any tool card to add it to your comparison drawer',
      'View side-by-side matrices for pricing models and free plan limits',
      'Identify key differences automatically with highlighted indicators',
    ],
    actionText: 'Open Compare Tool',
    actionLink: '/compare',
  },
  {
    step: '04',
    title: 'Enable Student Mode',
    icon: GraduationCap,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    description: 'Filter out expensive enterprise tools and highlight free, freemium, and beginner-friendly software.',
    highlights: [
      'Toggle Student Mode in the navigation bar anytime',
      'Highlights free tiers, open-source models, and student discounts',
      'Displays a green "Student Friendly" badge on compatible tools',
    ],
    actionText: 'Toggle in Header',
    actionLink: '#',
  },
  {
    step: '05',
    title: 'Bookmark Favorite Tools',
    icon: Bookmark,
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    description: 'Save your top tools locally on your device for quick access anytime.',
    highlights: [
      'Click the Bookmark icon on any card to save the tool locally',
      'Access your Saved Tools list from the navigation bar',
      'Your saved list persists automatically between sessions',
    ],
    actionText: 'View Saved Tools',
    actionLink: '/saved-tools',
  },
];

const FAQS = [
  {
    q: 'How does ToolTap select and classify tools?',
    a: 'We continuously test and document AI tools based on official documentation, verified pricing pages, user feedback, and feature capabilities. Each tool is categorized by task intent and pricing model.',
  },
  {
    q: 'Is my data tracked or sent to an external server?',
    a: 'No. All your saved bookmarks, comparison lists, search history, and Student Mode preferences are stored 100% locally on your device using HTML5 LocalStorage. No user login or tracking is required.',
  },
  {
    q: 'How does Student Mode work?',
    a: 'Student Mode prioritizes tools classified as Free, Open Source, or Freemium with generous free usage limits, helping students find zero-cost software for assignments and projects.',
  },
  {
    q: 'How can I report outdated information?',
    a: 'On any Tool Detail page, click the "Report Outdated Info" button at the bottom of the card to flag pricing changes, broken links, or updated free plan limits.',
  },
];

export default function HowToUsePage() {
  const scrollToAnchor = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const headerOffset = 96;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = Math.max(0, elementPosition - headerOffset);

      window.scrollTo({
        top: offsetPosition,
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
      window.history.pushState(null, '', `#${id}`);
    }
  };

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setTimeout(() => {
        scrollToAnchor(hash);
      }, 150);
    }
  }, []);

  return (
    <PageLayout>
      <PageMeta
        title="How to Use ToolTap | AI Tools Directory"
        description="Learn how to discover, search, compare, bookmark, and filter AI tools on ToolTap."
      />
      <div className="py-6 sm:py-8 max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Platform Guide & Onboarding
          </div>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-foreground tracking-tight">
            How to Use <span className="text-white">Tool</span><span className="text-amber-500">Tap</span>
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base leading-relaxed">
            Discover, evaluate, and choose the right AI tools for your workflow in a few simple steps.
          </p>

          {/* Quick Jump Anchors */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              onClick={() => scrollToAnchor('workflow')}
              className="px-3.5 py-1.5 rounded-full bg-[#1E1E24] border border-white/10 hover:border-primary/50 text-xs font-semibold text-foreground transition-all"
            >
              ⚡ Workflow Guide
            </button>
            <button
              onClick={() => scrollToAnchor('protips')}
              className="px-3.5 py-1.5 rounded-full bg-[#1E1E24] border border-white/10 hover:border-amber-500/50 text-xs font-semibold text-foreground transition-all"
            >
              💡 Pro Tips
            </button>
            <button
              onClick={() => scrollToAnchor('faq')}
              className="px-3.5 py-1.5 rounded-full bg-[#1E1E24] border border-white/10 hover:border-amber-500/50 text-xs font-semibold text-foreground transition-all"
            >
              ❓ FAQs
            </button>
          </div>
        </div>

        {/* Step-by-Step Cards */}
        <section id="workflow" className="how-to-use-section space-y-6">
          <h2 className="text-lg font-heading font-bold text-foreground flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" /> Step-by-Step Workflow Guide
          </h2>

          <div className="grid grid-cols-1 gap-5">
            {STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  className="bg-[#1E1E24] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all hover:border-amber-500/30"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-5">
                    {/* Step badge + Icon */}
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-2xl font-heading font-extrabold text-muted-foreground/40">
                        {s.step}
                      </span>
                      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${s.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Step details */}
                    <div className="space-y-3 flex-1">
                      <div>
                        <h3 className="font-heading font-bold text-base sm:text-lg text-foreground">{s.title}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{s.description}</p>
                      </div>

                      <ul className="space-y-2">
                        {s.highlights.map((h, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-foreground/80">
                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>

                      {s.actionLink !== '#' && (
                        <div className="pt-2">
                          <Button asChild size="sm" variant="outline" className="h-9 text-xs font-semibold rounded-xl border-white/10 hover:bg-white/5 gap-1.5">
                            <Link to={s.actionLink}>
                              {s.actionText} <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Pro Tips Section */}
        <section id="protips" className="how-to-use-section bg-gradient-to-r from-primary/10 via-[#16171C] to-[#16171C] border border-primary/20 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold text-base">
            <Lightbulb className="w-5 h-5 text-primary" /> Pro Tips for Choosing AI Software
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-foreground/80">
            <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-1">
              <strong className="text-amber-400 block font-semibold mb-1">Check Free Plan Limits First</strong>
              Always read the "Free Tier" details on tool cards or comparison view to ensure the limits suit your workflow before signing up.
            </div>
            <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-1">
              <strong className="text-amber-400 block font-semibold mb-1">Compare Before Registering</strong>
              Add 2 or 3 alternatives to your comparison list to verify differences in feature offerings and pricing structures.
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section id="faq" className="how-to-use-section space-y-4 pt-4">
          <h2 className="text-lg font-heading font-bold text-foreground flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" /> Frequently Asked Questions
          </h2>

          <Accordion type="single" collapsible className="space-y-3">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-white/10 rounded-2xl bg-[#1E1E24] px-5 py-1">
                <AccordionTrigger className="text-xs sm:text-sm font-semibold text-foreground hover:no-underline py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-muted-foreground pb-4 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>
    </PageLayout>
  );
}
