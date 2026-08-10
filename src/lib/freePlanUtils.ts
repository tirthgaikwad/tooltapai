import type { Tool, FreePlanDetails, FreePlanStatus, FreePlanFilter } from '@/types/tool';

export function getFreePlanDetails(tool: Tool): FreePlanDetails {
  if (tool.freePlanDetails) {
    return tool.freePlanDetails;
  }

  const nameLower = tool.name.toLowerCase();
  const freePlanLower = (tool.freePlan || '').toLowerCase();
  const access = tool.access;

  // Specific high-profile tools with verified 2026 data
  if (nameLower.includes('gamma')) {
    return {
      status: 'Generous',
      badgeColor: 'emerald',
      summary: '400 one-time AI credits on sign-up',
      breakdown: {
        creditQuota: '400 AI Credits',
        resetFrequency: 'One-time (Non-renewable)',
        restrictions: 'Gamma branding watermark on PDF/PPT exports',
        requiresCreditCard: false,
      },
    };
  }

  if (nameLower.includes('chatgpt') || nameLower.includes('openai')) {
    return {
      status: 'Limited',
      badgeColor: 'amber',
      summary: 'Free GPT-4o mini + limited GPT-4o peak usage',
      breakdown: {
        creditQuota: 'Unlimited Mini / ~10-15 GPT-4o msgs',
        resetFrequency: 'Daily',
        restrictions: 'Rate-limited during peak server traffic',
        requiresCreditCard: false,
      },
    };
  }

  if (nameLower.includes('claude')) {
    return {
      status: 'Limited',
      badgeColor: 'amber',
      summary: 'Free Claude 3.5 Sonnet with daily message caps',
      breakdown: {
        creditQuota: '10–30 messages per 5 hours',
        resetFrequency: 'Daily',
        restrictions: '5-hour wait timer when message limit reached',
        requiresCreditCard: false,
      },
    };
  }

  if (nameLower.includes('runway')) {
    return {
      status: 'Strict',
      badgeColor: 'rose',
      summary: '125 non-renewable credits on free tier',
      breakdown: {
        creditQuota: '125 credits total (~25 sec video)',
        resetFrequency: 'One-time (Non-renewable)',
        restrictions: 'Watermark on exports, 720p resolution limit',
        requiresCreditCard: false,
      },
    };
  }

  if (nameLower.includes('midjourney')) {
    return {
      status: 'Trial/Paid',
      badgeColor: 'slate',
      summary: 'Paid plans starting at $10/mo (No free plan)',
      breakdown: {
        creditQuota: 'None (Paid subscription required)',
        resetFrequency: 'N/A',
        restrictions: 'Subscription mandatory for image generation',
        requiresCreditCard: true,
      },
    };
  }

  if (nameLower.includes('cursor')) {
    return {
      status: 'Generous',
      badgeColor: 'emerald',
      summary: '50 slow premium calls + 2,000 completions/mo',
      breakdown: {
        creditQuota: '2,000 completions + 50 premium requests',
        resetFrequency: 'Monthly',
        restrictions: 'Slower response queue after fast usage',
        requiresCreditCard: false,
      },
    };
  }

  if (nameLower.includes('elevenlabs')) {
    return {
      status: 'Limited',
      badgeColor: 'amber',
      summary: '10,000 free characters per month',
      breakdown: {
        creditQuota: '10,000 characters/mo (~10 mins audio)',
        resetFrequency: 'Monthly',
        restrictions: 'Requires ElevenLabs attribution for commercial use',
        requiresCreditCard: false,
      },
    };
  }

  if (nameLower.includes('perplexity')) {
    return {
      status: 'Generous',
      badgeColor: 'emerald',
      summary: 'Unlimited basic search + 5 Pro queries daily',
      breakdown: {
        creditQuota: 'Unlimited Quick / 5 Pro searches per day',
        resetFrequency: 'Daily',
        restrictions: 'Pro searches reset every 4 hours',
        requiresCreditCard: false,
      },
    };
  }

  if (nameLower.includes('canva')) {
    return {
      status: 'Generous',
      badgeColor: 'emerald',
      summary: '50 Magic Design AI credits + 1,000s templates',
      breakdown: {
        creditQuota: '50 AI generation credits/mo',
        resetFrequency: 'Monthly',
        restrictions: 'Pro stock elements locked behind paid plan',
        requiresCreditCard: false,
      },
    };
  }

  if (nameLower.includes('firefly') || nameLower.includes('adobe')) {
    return {
      status: 'Limited',
      badgeColor: 'amber',
      summary: '25 generative credits per month',
      breakdown: {
        creditQuota: '25 credits/mo',
        resetFrequency: 'Monthly',
        restrictions: 'Watermark on high-resolution image downloads',
        requiresCreditCard: false,
      },
    };
  }

  if (nameLower.includes('grammarly')) {
    return {
      status: 'Generous',
      badgeColor: 'emerald',
      summary: '100 AI prompts/mo + free grammar checking',
      breakdown: {
        creditQuota: '100 AI prompts/mo',
        resetFrequency: 'Monthly',
        restrictions: 'Advanced sentence rewrites restricted to Premium',
        requiresCreditCard: false,
      },
    };
  }

  if (nameLower.includes('suno')) {
    return {
      status: 'Limited',
      badgeColor: 'amber',
      summary: '50 free credits daily (10 songs per day)',
      breakdown: {
        creditQuota: '50 credits/day',
        resetFrequency: 'Daily',
        restrictions: 'Non-commercial license on free tier',
        requiresCreditCard: false,
      },
    };
  }

  if (nameLower.includes('luma') || nameLower.includes('dream machine')) {
    return {
      status: 'Limited',
      badgeColor: 'amber',
      summary: '30 free video generations per month',
      breakdown: {
        creditQuota: '30 video generations/mo',
        resetFrequency: 'Monthly',
        restrictions: 'Standard queue speed & watermark',
        requiresCreditCard: false,
      },
    };
  }

  // General heuristics based on access type & keywords
  if (access === 'Open Source') {
    return {
      status: 'Open Source',
      badgeColor: 'emerald',
      summary: tool.freePlan || '100% Free & Open Source software',
      breakdown: {
        creditQuota: 'Unlimited self-hosted',
        resetFrequency: 'N/A',
        restrictions: 'Requires local GPU compute or custom API key',
        requiresCreditCard: false,
      },
    };
  }

  if (access === 'Free') {
    return {
      status: 'Generous',
      badgeColor: 'emerald',
      summary: tool.freePlan || '100% free with no mandatory paid tier',
      breakdown: {
        creditQuota: 'Unlimited standard access',
        resetFrequency: 'N/A',
        restrictions: 'None',
        requiresCreditCard: false,
      },
    };
  }

  if (access === 'Paid') {
    return {
      status: 'Trial/Paid',
      badgeColor: 'slate',
      summary: tool.freePlan || 'No permanent free plan (Trial/Demo only)',
      breakdown: {
        creditQuota: 'Limited trial / Demo access',
        resetFrequency: 'N/A',
        restrictions: 'Subscription required after trial period',
        requiresCreditCard: freePlanLower.includes('credit card') || freePlanLower.includes('card required'),
      },
    };
  }

  // Default Freemium parsing heuristics
  if (
    freePlanLower.includes('non-renewable') ||
    freePlanLower.includes('one-time') ||
    freePlanLower.includes('125 credits') ||
    freePlanLower.includes('strict')
  ) {
    return {
      status: 'Strict',
      badgeColor: 'rose',
      summary: tool.freePlan || 'Limited non-renewable free credits',
      breakdown: {
        creditQuota: tool.freePlan || 'One-time bonus credits',
        resetFrequency: 'One-time (Non-renewable)',
        restrictions: 'No automatic monthly or daily credit reset',
        requiresCreditCard: false,
      },
    };
  }

  if (
    freePlanLower.includes('daily') ||
    freePlanLower.includes('day') ||
    freePlanLower.includes('per day') ||
    freePlanLower.includes('rate limit') ||
    freePlanLower.includes('24h')
  ) {
    return {
      status: 'Limited',
      badgeColor: 'amber',
      summary: tool.freePlan || 'Daily query/generation cap',
      breakdown: {
        creditQuota: tool.freePlan || 'Daily quota',
        resetFrequency: 'Daily',
        restrictions: 'Rate-limited once daily threshold reached',
        requiresCreditCard: false,
      },
    };
  }

  if (
    freePlanLower.includes('generous') ||
    freePlanLower.includes('unlimited') ||
    freePlanLower.includes('400') ||
    freePlanLower.includes('free tier') ||
    freePlanLower.includes('free plan')
  ) {
    return {
      status: 'Generous',
      badgeColor: 'emerald',
      summary: tool.freePlan || 'Generous free tier available',
      breakdown: {
        creditQuota: tool.freePlan || 'Generous usage allowance',
        resetFrequency: 'Monthly',
        restrictions: 'Basic features free; advanced features behind Pro',
        requiresCreditCard: false,
      },
    };
  }

  // Fallback for Freemium
  return {
    status: 'Limited',
    badgeColor: 'amber',
    summary: tool.freePlan || 'Limited free allowance per month',
    breakdown: {
      creditQuota: tool.freePlan || 'Standard free tier',
      resetFrequency: 'Monthly',
      restrictions: 'Usage limits reset each billing cycle',
      requiresCreditCard: false,
    },
  };
}

export function filterByFreePlanStatus(tool: Tool, filter: FreePlanFilter): boolean {
  if (filter === 'all') return true;
  const details = getFreePlanDetails(tool);

  if (filter === 'generous') {
    return details.status === 'Generous';
  }
  if (filter === 'reset') {
    return details.breakdown.resetFrequency === 'Daily' || details.breakdown.resetFrequency === 'Monthly';
  }
  if (filter === 'strict') {
    return details.status === 'Strict' || details.breakdown.resetFrequency === 'One-time (Non-renewable)';
  }
  if (filter === 'open-source') {
    return details.status === 'Open Source' || tool.access === 'Open Source';
  }

  return true;
}
