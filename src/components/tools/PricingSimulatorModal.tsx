import React, { useState, useMemo } from 'react';
import {
  Calculator, DollarSign, Sparkles, GraduationCap,
  TrendingDown, CheckCircle2, ArrowRight, ShieldCheck,
  Zap, Info, ExternalLink
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';

export function PricingSimulatorModal() {
  const { pricingCalculatorOpen, setPricingCalculatorOpen, setStudentMode, setCompareTools, tools } = useApp();

  const [promptsPerDay, setPromptsPerDay] = useState(40);
  const [imagesPerMonth, setImagesPerMonth] = useState(60);
  const [voiceMinutes, setVoiceMinutes] = useState(30);
  const [teamSeats, setTeamSeats] = useState(1);
  const [isStudent, setIsStudent] = useState(true);

  // Dynamic cost calculation
  const calculations = useMemo(() => {
    // Standard paid subscriptions estimate
    let paidChatCost = 20 * teamSeats; // ChatGPT Plus / Claude Pro
    let paidImageCost = imagesPerMonth > 0 ? (imagesPerMonth > 100 ? 30 : 10) : 0; // Midjourney
    let paidVoiceCost = voiceMinutes > 0 ? (voiceMinutes > 60 ? 22 : 5) : 0; // ElevenLabs
    let paidCodeCost = promptsPerDay > 50 ? 20 * teamSeats : 0; // Cursor / Copilot

    const totalPaidMonthly = paidChatCost + paidImageCost + paidVoiceCost + paidCodeCost;

    // ToolTap Freemium / Free Stack estimate
    let freemiumCost = 0;
    if (promptsPerDay > 150) {
      freemiumCost += 10; // Light API pay-as-you-go instead of full flat subscription
    }
    if (imagesPerMonth > 250) {
      freemiumCost += 10; // Flux / Ideogram top-up
    }

    if (isStudent) {
      freemiumCost = 0; // Fully zero with verified student perks & GitHub student pack
    }

    const monthlySavings = Math.max(0, totalPaidMonthly - freemiumCost);
    const annualSavings = monthlySavings * 12;

    return {
      totalPaidMonthly,
      freemiumCost,
      monthlySavings,
      annualSavings,
    };
  }, [promptsPerDay, imagesPerMonth, voiceMinutes, teamSeats, isStudent]);

  const handleApplyStudentStack = () => {
    setIsStudent(true);
    setStudentMode(true);
    // Find top free tools
    const freeTools = tools.filter(t => t.access === 'Free' || (t.access === 'Freemium' && t.freePlan.toLowerCase().includes('generous'))).slice(0, 3);
    setCompareTools(freeTools);
    setPricingCalculatorOpen(false);
    toast.success('Student Mode activated & loaded zero-cost stack into Compare Dock!');
  };

  return (
    <Dialog open={pricingCalculatorOpen} onOpenChange={setPricingCalculatorOpen}>
      <DialogContent className="max-w-3xl p-6 bg-[#141417] border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.8)] rounded-2xl text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Calculator className="w-4 h-4" />
            </div>
            <DialogTitle className="text-xl font-bold text-white">
              AI Stack Cost & ROI Simulator
            </DialogTitle>
          </div>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Calculate your monthly expense across individual subscriptions vs. ToolTap's zero-cost freemium stack.
          </p>
        </DialogHeader>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-4">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-5">
            {/* Student Mode Switch */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-xs sm:text-sm font-semibold text-white">
                    Student / Academic Status
                  </span>
                  <p className="text-[11px] text-emerald-300/80">
                    Unlocks GitHub Student Pack, Notion Plus & academic tiers
                  </p>
                </div>
              </div>
              <Switch
                checked={isStudent}
                onCheckedChange={setIsStudent}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>

            {/* Slider 1: Daily Prompts */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/70 font-medium">Daily AI Prompts / Reasoning Queries</span>
                <strong className="text-white font-bold">{promptsPerDay} prompts/day</strong>
              </div>
              <input
                type="range"
                min="5"
                max="200"
                step="5"
                value={promptsPerDay}
                onChange={(e) => setPromptsPerDay(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Slider 2: Monthly Images */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/70 font-medium">Monthly AI Image Generations</span>
                <strong className="text-white font-bold">{imagesPerMonth} images/mo</strong>
              </div>
              <input
                type="range"
                min="0"
                max="300"
                step="10"
                value={imagesPerMonth}
                onChange={(e) => setImagesPerMonth(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Slider 3: Voice / Audio Minutes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/70 font-medium">Voice Cloning / Audio Minutes</span>
                <strong className="text-white font-bold">{voiceMinutes} mins/mo</strong>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                step="10"
                value={voiceMinutes}
                onChange={(e) => setVoiceMinutes(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Slider 4: Team Seats */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/70 font-medium">Team Members / Seats</span>
                <strong className="text-white font-bold">{teamSeats} user{teamSeats > 1 ? 's' : ''}</strong>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={teamSeats}
                onChange={(e) => setTeamSeats(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          </div>

          {/* Savings / Results Card Column */}
          <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-2xl bg-[#18181C] border border-white/[0.08] shadow-inner space-y-4">
            <div className="space-y-3">
              <span className="text-[11px] uppercase tracking-wider text-white/40 font-bold">
                Projected Savings Breakdown
              </span>

              {/* Paid vs Free summary */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/50">All-in-One Subscriptions:</span>
                  <span className="text-rose-400 font-semibold line-through">
                    ${calculations.totalPaidMonthly}/mo
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/50">ToolTap Free/Freemium Stack:</span>
                  <span className="text-emerald-400 font-bold">
                    ${calculations.freemiumCost}/mo
                  </span>
                </div>
              </div>

              {/* Big Monthly Savings Number */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-center">
                <span className="text-xs text-emerald-300 font-medium block">
                  Estimated Monthly Savings
                </span>
                <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400 mt-1 block">
                  ${calculations.monthlySavings}
                  <span className="text-xs text-white/50 font-normal"> / month</span>
                </span>
                <span className="text-[11px] text-white/50 mt-1 block">
                  ~${calculations.annualSavings}/year kept in your pocket
                </span>
              </div>
            </div>

            {/* Quick action button */}
            <Button
              onClick={handleApplyStudentStack}
              size="sm"
              className="w-full h-10 text-xs font-bold bg-amber-500 hover:bg-amber-500/90 text-black rounded-xl gap-1.5 shadow-lg active:scale-95"
            >
              <Zap className="w-4 h-4" />
              <span>Apply Zero-Cost Stack</span>
            </Button>
          </div>
        </div>

        {/* Verified Academic & Free Perks Footer */}
        <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs text-white/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Includes 100% Free Tiers: NotebookLM, v0 Free, Flux.1, Perplexity Free</span>
          </div>
          <span className="text-amber-400 font-medium">Updated for 2026 AI Quotas</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
