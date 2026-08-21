import React, { useState } from 'react';
import {
  Workflow, ArrowRight, Sparkles, Copy, Check,
  Download, FileText, ExternalLink, GitCompare,
  DollarSign, Clock, Layers, ChevronRight, Share2
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ToolLogo from '@/components/tools/ToolLogo';
import { WORKFLOW_PIPELINES } from '@/data/workflowPipelines';
import { useApp } from '@/contexts/AppContext';
import type { WorkflowPipeline, WorkflowStep, UserRole } from '@/types/tool';
import { cn } from '@/lib/utils';

export function WorkflowStackBuilder({ className }: { className?: string }) {
  const { tools, userRole, setCompareTools, addToHistory } = useApp();
  
  // Default to a pipeline matching the user's role if available
  const initialPipeline = WORKFLOW_PIPELINES.find((p) => p.persona === userRole) || WORKFLOW_PIPELINES[0];
  const [selectedPipeline, setSelectedPipeline] = useState<WorkflowPipeline>(initialPipeline);
  const [copiedPromptStep, setCopiedPromptStep] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Copy specific step prompt
  const handleCopyPrompt = (step: WorkflowStep) => {
    navigator.clipboard.writeText(step.promptTemplate);
    setCopiedPromptStep(step.stepNumber);
    toast.success(`Copied prompt for Step ${step.stepNumber}: ${step.title}`);
    setTimeout(() => setCopiedPromptStep(null), 2000);
  };

  // Export full pipeline as Markdown / Notion document
  const handleExportMarkdown = () => {
    const markdown = `# AI Workflow Pipeline: ${selectedPipeline.title}
*Target Persona: ${selectedPipeline.persona.toUpperCase()} | Estimated Time: ${selectedPipeline.estimatedTime} | ROI: ${selectedPipeline.savingsVsPro}*

## Description
${selectedPipeline.description}

## Pipeline Architecture
${selectedPipeline.steps.map((s) => `
### Step ${s.stepNumber}: ${s.title}
- **Primary Tool**: ${s.recommendedToolName}
- **Free Alternative**: ${s.freeAlternativeName || 'N/A'}
- **Input**: \`${s.inputFormat}\`
- **Output**: \`${s.outputFormat}\`
- **Action**: ${s.roleDescription}

#### Step ${s.stepNumber} Prompt Template:
\`\`\`text
${s.promptTemplate}
\`\`\`
`).join('\n')}

---
*Generated via ToolTap AI Workflow Planner*
`;
    navigator.clipboard.writeText(markdown);
    setCopiedAll(true);
    toast.success('Pipeline exported to clipboard as Notion Markdown!');
    setTimeout(() => setCopiedAll(false), 2500);
  };

  // Load all tools in pipeline into Comparison
  const handleComparePipeline = () => {
    const pipelineToolNames = selectedPipeline.steps.map((s) => s.recommendedToolName.toLowerCase());
    const matchedTools = tools.filter((t) =>
      pipelineToolNames.some((name) => t.name.toLowerCase().includes(name) || name.includes(t.name.toLowerCase()))
    );

    if (matchedTools.length > 0) {
      setCompareTools(matchedTools.slice(0, 3));
      toast.success(`Loaded ${matchedTools.length} pipeline tools into Comparison Dock!`);
    } else {
      toast.info('Compare tools loaded.');
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Pipeline Selector Header Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold mb-2">
            <Workflow className="w-3.5 h-3.5" />
            AI Pipeline Engine
          </div>
          <h2 className="font-bold text-2xl sm:text-3xl text-white tracking-tight">
            Goal-to-Stack AI Workflows
          </h2>
          <p className="text-sm text-white/60 mt-1">
            Chained multi-tool pipelines configured for maximum speed and zero redundant subscription fees
          </p>
        </div>

        {/* Global Pipeline Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            onClick={handleExportMarkdown}
            variant="outline"
            size="sm"
            className="h-9 px-3.5 text-xs font-semibold border-white/10 hover:bg-white/[0.06] text-white rounded-xl gap-1.5"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileText className="w-3.5 h-3.5 text-amber-400" />}
            <span>{copiedAll ? 'Exported!' : 'Export to Notion'}</span>
          </Button>

          <Button
            onClick={handleComparePipeline}
            size="sm"
            className="h-9 px-3.5 text-xs font-bold bg-amber-500 hover:bg-amber-500/90 text-black rounded-xl gap-1.5 shadow-md active:scale-95"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Compare Stack</span>
          </Button>
        </div>
      </div>

      {/* Preset Workflow Chips */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-thin">
        {WORKFLOW_PIPELINES.map((pipeline) => {
          const isSelected = selectedPipeline.id === pipeline.id;
          return (
            <button
              key={pipeline.id}
              onClick={() => setSelectedPipeline(pipeline)}
              className={cn(
                'px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 text-left flex items-center gap-2.5',
                isSelected
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-md'
                  : 'bg-[#18181C] border-white/[0.08] text-white/60 hover:text-white hover:border-white/20'
              )}
            >
              <Workflow className={cn('w-3.5 h-3.5 shrink-0', isSelected ? 'text-amber-400' : 'text-white/40')} />
              <span>{pipeline.title}</span>
              <Badge className="text-[9px] px-1.5 py-0 bg-white/10 text-white/70 border-none">
                {pipeline.savingsVsPro}
              </Badge>
            </button>
          );
        })}
      </div>

      {/* Active Pipeline Card Overview */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#18181C] border border-white/[0.08] shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg sm:text-xl text-white">
                {selectedPipeline.title}
              </span>
              <Badge className="text-xs bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                {selectedPipeline.difficulty}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-white/65 max-w-2xl">
              {selectedPipeline.description}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 rounded-xl text-xs">
              <span className="text-white/40">Execution Time:</span>{' '}
              <strong className="text-white">{selectedPipeline.estimatedTime}</strong>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-xs text-emerald-400">
              <strong className="font-bold">{selectedPipeline.savingsVsPro}</strong>
            </div>
          </div>
        </div>

        {/* Step-by-Step Chained Visualization */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {selectedPipeline.steps.map((step, idx) => {
            const isLast = idx === selectedPipeline.steps.length - 1;
            const isPromptCopied = copiedPromptStep === step.stepNumber;

            return (
              <div
                key={step.stepNumber}
                className="relative flex flex-col justify-between p-4 rounded-xl bg-[#141417] border border-white/[0.07] hover:border-white/20 transition-all duration-200"
              >
                {/* Step Header */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                      Step {step.stepNumber}
                    </span>
                    <span className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">
                      {step.inputFormat} → {step.outputFormat}
                    </span>
                  </div>

                  <h4 className="font-semibold text-sm text-white leading-snug">
                    {step.title}
                  </h4>

                  <p className="text-xs text-white/60 leading-relaxed">
                    {step.roleDescription}
                  </p>

                  {/* Recommended Tool Pill */}
                  <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/50 text-[11px]">Primary Engine:</span>
                      <strong className="text-white font-semibold">{step.recommendedToolName}</strong>
                    </div>
                    {step.freeAlternativeName && (
                      <div className="flex items-center justify-between text-[11px] text-emerald-400/90">
                        <span className="text-white/40">$0 Alternative:</span>
                        <span>{step.freeAlternativeName}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Prompt Template Box */}
                <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-white/40 font-medium">Ready-to-use Prompt:</span>
                    <button
                      onClick={() => handleCopyPrompt(step)}
                      className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors"
                    >
                      {isPromptCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{isPromptCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-white/[0.05] text-[11px] font-mono text-white/70 line-clamp-2">
                    {step.promptTemplate}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
