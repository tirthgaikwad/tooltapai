import { Sparkles, Shield, Zap, GraduationCap, Search, Globe, Target, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Target,
    title: 'Task-Based Search',
    desc: 'Search by what you want to accomplish — not by tool name. Our intent engine understands your workflow goal.',
  },
  {
    icon: Shield,
    title: 'Official Direct Links',
    desc: 'Every link leads directly to the official product website. No affiliate redirects or sponsored placements.',
  },
  {
    icon: GraduationCap,
    title: 'Student Mode',
    desc: 'Toggle Student Mode in the header to filter out paid tools and spotlight zero-cost and student-friendly options.',
  },
  {
    icon: Zap,
    title: 'Instant Local Search',
    desc: 'Zero-latency search across 500 AI tools stored client-side with instant fuzzy matching and synonym support.',
  },
  {
    icon: Search,
    title: 'Categorized Rankings',
    desc: 'Tools are organized into 25 domain categories with clear indications of pricing and free plan limits.',
  },
  {
    icon: Users,
    title: 'Side-by-Side Compare',
    desc: 'Compare up to 3 tools side-by-side to make informed decisions for your projects.',
  },
];

const stats = [
  { n: '500+', label: 'AI Tools' },
  { n: '25', label: 'Categories' },
  { n: '0', label: 'Sponsored Placements' },
  { n: '100%', label: 'Official Links' },
];

export default function AboutPage() {
  return (
    <PageLayout>
      <div className="py-6 sm:py-8 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <div className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            About ToolTap
          </div>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-foreground tracking-tight mb-4 leading-tight">
            The World's Most Refined<br className="hidden sm:inline" />
            <span className="text-amber-400"> AI Tool Discovery Directory</span>
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base leading-relaxed mb-4 max-w-2xl">
            ToolTap is a curated directory of 500 AI tools organized into 25 domain categories. Built for students, developers, researchers, creators, and professionals searching for the right AI tools for any task.
          </p>
          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-2xl">
            Designed around <strong className="text-foreground">task intent</strong>: describe what you want to achieve, and immediately discover the best software options tailored to your needs.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map(({ n, label }) => (
            <div key={label} className="p-5 rounded-2xl bg-[#1E1E24] border border-white/[0.08] text-center shadow-lg">
              <div className="font-heading font-bold text-2xl sm:text-3xl text-amber-400 mb-1">{n}</div>
              <div className="text-xs text-muted-foreground font-medium">{label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-foreground mb-6">Key Platform Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-5 rounded-2xl bg-[#1E1E24] border border-white/[0.08]">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-xs sm:text-sm text-foreground mb-1">{title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-12">
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-xs sm:text-sm text-foreground mb-1">Data Verification Disclaimer</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Tool specs reflect research verified as of <strong className="text-foreground">July 2026</strong>. Always confirm free plan limits and pricing details directly on the official product website.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-10 px-6 rounded-2xl bg-[#1E1E24] border border-white/[0.08] shadow-xl">
          <Globe className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-foreground mb-2">Explore the Directory</h2>
          <p className="text-muted-foreground text-xs sm:text-sm mb-6 max-w-md mx-auto leading-relaxed">
            500 curated tools. 25 specialized categories. Fast local search.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl h-10 px-6">
              <Link to="/search">Search Directory</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="text-foreground border-white/10 hover:bg-white/[0.06] font-semibold rounded-xl h-10 px-6">
              <Link to="/categories">Browse Categories</Link>
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
