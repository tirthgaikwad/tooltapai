import { useMemo } from 'react';
import { GraduationCap, Code2, ImageIcon, Video, Package, Layers } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import PageMeta from '@/components/common/PageMeta';
import ToolSection from '@/components/tools/ToolSection';
import { useApp } from '@/contexts/AppContext';

export default function CollectionsPage() {
  const { tools } = useApp();

  const collections = useMemo(() => [
    {
      id: 'students',
      title: '🎓 Top AI Tools for Students & Researchers',
      subtitle: 'Free & Freemium tools for research, essay writing, coding, and study support',
      icon: GraduationCap,
      color: 'text-emerald-400',
      tools: tools.filter(t => ['ChatGPT', 'Grammarly', 'Perplexity', 'Gamma', 'Quillbot', 'Notion AI', 'Otter.ai', 'Photomath', 'HuggingChat'].includes(t.name) && t.access !== 'Paid').slice(0, 6)
    },
    {
      id: 'coding',
      title: '💻 Essential AI Developer & Coding Stack',
      subtitle: 'Code completion, app generation, refactoring, and AI IDEs',
      icon: Code2,
      color: 'text-emerald-400',
      tools: tools.filter(t => t.category === 'Coding and Software Development' || t.category === 'App and Website Builders').slice(0, 6)
    },
    {
      id: 'creative',
      title: '🎨 AI Image & Design Studio',
      subtitle: 'Best tools for prompt-to-image, artwork generation, and visual editing',
      icon: ImageIcon,
      color: 'text-purple-400',
      tools: tools.filter(t => t.category === 'Image Generation' || t.category === 'Design, UI, and Branding').slice(0, 6)
    },
    {
      id: 'video-audio',
      title: '🎬 AI Video & Audio Production Suite',
      subtitle: 'Text-to-video, realistic voice synthesis, and music generation',
      icon: Video,
      color: 'text-amber-400',
      tools: tools.filter(t => t.category === 'Video Generation' || t.category === 'Voice and Text to Speech' || t.category === 'Audio, Music, and Podcasting').slice(0, 6)
    },
    {
      id: 'opensource',
      title: '🔓 Best Open Source & Local AI Models',
      subtitle: 'Run AI models locally on your hardware with zero subscription fees',
      icon: Package,
      color: 'text-amber-400',
      tools: tools.filter(t => t.access === 'Open Source' || t.category === 'Open Source Models and Local AI').slice(0, 6)
    }
  ], [tools]);

  return (
    <PageLayout>
      <PageMeta
        title="Curated AI Tool Collections | ToolTap"
        description="Explore handpicked AI tool bundles for students, developers, creators, and productivity workflows."
      />
      <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
            <Layers className="w-3.5 h-3.5" />
            Curated Bundles
          </div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-foreground tracking-tight mb-2">
            Handpicked AI Collections
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm max-w-2xl leading-relaxed">
            Explore curated stacks of AI tools grouped by practical workflows, student needs, developer stacks, and open-source models.
          </p>
        </div>

        {/* Collections */}
        <div className="space-y-8">
          {collections.map(col => (
            <div key={col.id} className="bg-[#1E1E24] border border-white/[0.08] rounded-2xl p-5 sm:p-7 shadow-xl">
              <ToolSection
                title={col.title}
                subtitle={col.subtitle}
                tools={col.tools}
                showBestFree
                cols={3}
              />
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
