import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, Wrench, Sparkles, Terminal } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import type { Tool } from '@/types/tool';
import { getPromptWorkshop } from '@/data/mockWorkshops';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

interface PromptWorkshopSheetProps {
  tool: Tool | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PromptWorkshopSheet({ tool, isOpen, onClose }: PromptWorkshopSheetProps) {
  useBodyScrollLock(isOpen);

  const workshop = tool ? getPromptWorkshop(tool) : null;
  const [activeTab, setActiveTab] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Sync initial tab when workshop changes or opens
  useEffect(() => {
    if (workshop && workshop.templates.length > 0) {
      setActiveTab(workshop.templates[0].useCase);
    }
  }, [workshop, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!tool || !workshop) return null;

  const currentTemplate =
    workshop.templates.find((t) => t.useCase === activeTab) || workshop.templates[0];

  const handleCopy = async () => {
    if (!currentTemplate) return;
    try {
      await navigator.clipboard.writeText(currentTemplate.copyTemplate);
      setCopied(true);
      toast.success('Prompt template copied to clipboard!', {
        duration: 2500,
        id: 'prompt-copy-success',
      });
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      toast.error('Failed to copy prompt to clipboard.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Subtle Dark Blur Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-[#121212]/60 backdrop-blur-sm z-50 cursor-pointer"
            onClick={onClose}
            aria-label="Close backdrop"
          />

          {/* Slide-out Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed inset-y-0 right-0 w-full sm:w-[450px] z-50 bg-[#1E1E24]/98 backdrop-blur-sm transform-gpu [transform:translateZ(0)] border-l border-white/10 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto"
          >
            {/* Upper Content */}
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F2994A]/15 border border-[#F2994A]/30 text-[#F2994A] text-xs font-bold uppercase tracking-wider">
                    <Wrench className="w-3.5 h-3.5" />
                    Prompt Workshop
                  </div>
                  <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-white tracking-tight pt-1">
                    {tool.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                    Architectural prompt layouts to generate professional results.
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 hover:text-white flex items-center justify-center transition-all shrink-0 active:scale-95"
                  aria-label="Close workshop panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Category Tabs (Horizontal Scrollable Pills) */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-white/50 block">
                  Select Use Case Formula
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {workshop.templates.map((tpl) => {
                    const isActive = tpl.useCase === activeTab;
                    return (
                      <button
                        key={`usecase-tab-${tpl.useCase}`}
                        onClick={() => {
                          setActiveTab(tpl.useCase);
                          setCopied(false);
                        }}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                          isActive
                            ? 'border-[#F2994A] bg-[#F2994A]/20 text-white shadow-[0_0_12px_rgba(242,153,74,0.3)]'
                            : 'border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/20'
                        }`}
                      >
                        {tpl.useCase}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Modular Formula Display */}
              {currentTemplate && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between text-xs font-bold text-white/70">
                    <span className="flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-[#F2994A]" />
                      Formula Structure ({currentTemplate.blocks.length} Blocks)
                    </span>
                    <span className="text-[11px] font-mono text-[#F2994A] opacity-90">
                      {currentTemplate.useCase}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {currentTemplate.blocks.map((block, idx) => (
                      <div
                        key={`block-${idx}-${block.label}`}
                        className="bg-white/5 border border-white/10 rounded-lg p-3.5 hover:border-white/20 transition-all space-y-1.5"
                      >
                        <div className="text-[#F2994A] text-xs uppercase font-bold tracking-wider flex items-center justify-between">
                          <span>[{block.label}]</span>
                          <span className="text-[10px] text-white/40 font-mono font-normal">
                            Block {idx + 1}
                          </span>
                        </div>
                        <p className="text-white/90 text-sm leading-relaxed font-sans">
                          {block.example}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Action Bar */}
            <div className="pt-6 border-t border-white/10 mt-6 sticky bottom-0 bg-[#1E1E24]/98 backdrop-blur-sm transform-gpu [transform:translateZ(0)]">
              <Button
                onClick={handleCopy}
                disabled={!currentTemplate}
                className="w-full h-12 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-[#F2994A] to-[#E05A47] hover:brightness-110 active:scale-[0.98] transition-all shadow-xl flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>✅ Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-white" />
                    <span>📋 Copy Prompt Template</span>
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
