import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GraduationCap, Code2, ImageIcon, Video, Package, ArrowLeft, Layers } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import PageMeta from '@/components/common/PageMeta';
import ToolCard from '@/components/tools/ToolCard';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';

export default function CollectionDetailPage() {
  const { collectionSlug = '' } = useParams();
  const { tools } = useApp();

  const collection = useMemo(() => {
    const slug = collectionSlug.toLowerCase();
    
    if (slug.includes('student')) {
      return {
        id: 'students',
        title: '🎓 Top AI Tools for Students & Researchers',
        subtitle: 'Free & Freemium tools for research, essay writing, coding, and study support',
        icon: GraduationCap,
        color: 'text-emerald-400',
        tools: tools.filter(t => ['ChatGPT', 'Grammarly', 'Perplexity', 'Gamma', 'Quillbot', 'Notion AI', 'Otter.ai', 'Photomath', 'HuggingChat'].includes(t.name) && t.access !== 'Paid')
      };
    }
    if (slug.includes('coding') || slug.includes('dev')) {
      return {
        id: 'coding',
        title: '💻 Essential AI Developer & Coding Stack',
        subtitle: 'Code completion, app generation, refactoring, and AI IDEs',
        icon: Code2,
        color: 'text-emerald-400',
        tools: tools.filter(t => t.category === 'Coding and Software Development' || t.category === 'App and Website Builders')
      };
    }
    if (slug.includes('creative') || slug.includes('image') || slug.includes('design')) {
      return {
        id: 'creative',
        title: '🎨 AI Image & Design Studio',
        subtitle: 'Best tools for prompt-to-image, artwork generation, and visual editing',
        icon: ImageIcon,
        color: 'text-purple-400',
        tools: tools.filter(t => t.category === 'Image Generation' || t.category === 'Design, UI, and Branding')
      };
    }
    if (slug.includes('video') || slug.includes('audio') || slug.includes('voice')) {
      return {
        id: 'video-audio',
        title: '🎬 AI Video & Audio Production Suite',
        subtitle: 'Text-to-video, realistic voice synthesis, and music generation',
        icon: Video,
        color: 'text-amber-400',
        tools: tools.filter(t => t.category === 'Video Generation' || t.category === 'Voice and Text to Speech' || t.category === 'Audio, Music, and Podcasting')
      };
    }
    if (slug.includes('open') || slug.includes('local')) {
      return {
        id: 'opensource',
        title: '🔓 Best Open Source & Local AI Models',
        subtitle: 'Run AI models locally on your hardware with zero subscription fees',
        icon: Package,
        color: 'text-amber-400',
        tools: tools.filter(t => t.access === 'Open Source' || t.category === 'Open Source Models and Local AI')
      };
    }
    return null;
  }, [collectionSlug, tools]);

  if (!collection) {
    return (
      <PageLayout>
        <PageMeta title="Collection Not Found" description="The requested collection could not be found." />
        <div className="py-20 text-center max-w-lg mx-auto px-4 my-8">
          <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-6">
            <Layers className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-foreground mb-3">
            Collection Not Found
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-8 max-w-md mx-auto">
            The collection you are looking for may have been moved, renamed, or is currently unavailable.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl h-11 px-6">
              <Link to="/collections">
                Browse Collections
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="border-white/10 text-foreground font-semibold rounded-xl h-11 px-6">
              <Link to="/">
                Go Home
              </Link>
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const IconComponent = collection.icon;

  return (
    <PageLayout>
      <PageMeta
        title={`${collection.title.replace(/^[^\s]+\s+/, '')} | ToolTap`}
        description={collection.subtitle}
      />
      <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Back Button */}
        <Link
          to="/collections"
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group font-medium"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Collections
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-3">
            <IconComponent className="w-3.5 h-3.5" />
            Curated Stack
          </div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-foreground tracking-tight mb-2">
            {collection.title}
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm max-w-2xl leading-relaxed">
            {collection.subtitle}
          </p>
        </div>

        {/* Tools Grid */}
        {collection.tools.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No tools found in this collection.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collection.tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
