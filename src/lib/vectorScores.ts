import type { Tool } from '@/types/tool';
import { calculateToolScores } from '@/lib/compareUtils';
import { getDistinctComparisonProfiles, generateToolProfile } from '@/lib/compareData';

export interface QuantitativeVector {
  key: 'speed' | 'quality' | 'easeOfUse' | 'affordability' | 'ecosystem';
  name: string;
  description: string;
  iconName: string;
}

export const DATA_VECTORS: QuantitativeVector[] = [
  {
    key: 'speed',
    name: 'Speed',
    description: 'Evaluated based on response latency, generation throughput, and API round-trip execution rate.',
    iconName: 'Zap',
  },
  {
    key: 'quality',
    name: 'Quality',
    description: 'Evaluated based on output accuracy, reasoning depth, instruction adherence, and response reliability.',
    iconName: 'Star',
  },
  {
    key: 'easeOfUse',
    name: 'Ease of Use',
    description: 'Evaluated based on UI simplicity, onboarding setup, and intuitive developer ergonomics.',
    iconName: 'Smile',
  },
  {
    key: 'affordability',
    name: 'Affordability',
    description: 'Evaluated based on the generosity of the free tier and API cost-per-token.',
    iconName: 'DollarSign',
  },
  {
    key: 'ecosystem',
    name: 'Ecosystem',
    description: 'Evaluated based on integration availability, SDK support, plugin ecosystem, and community support.',
    iconName: 'Layers',
  },
];

export interface VectorScoreResult {
  speed: number;          // 1.0 - 10.0
  quality: number;        // 1.0 - 10.0
  easeOfUse: number;      // 1.0 - 10.0
  affordability: number;  // 1.0 - 10.0
  ecosystem: number;      // 1.0 - 10.0
  totalScore: number;     // Sum out of 50
  hardData: {
    speed: string;
    quality: string;
    easeOfUse: string;
    affordability: string;
    ecosystem: string;
  };
}

export function calculateVectorScores(tool: Tool): VectorScoreResult {
  const profile = generateToolProfile(tool);

  return {
    speed: profile.scores.speed,
    quality: profile.scores.quality,
    easeOfUse: profile.scores.easeOfUse,
    affordability: profile.scores.affordability,
    ecosystem: profile.scores.ecosystem,
    totalScore: profile.scores.totalScore,
    hardData: {
      speed: profile.scoreExplanations.speed,
      quality: profile.scoreExplanations.quality,
      easeOfUse: profile.scoreExplanations.easeOfUse,
      affordability: profile.scoreExplanations.affordability,
      ecosystem: profile.scoreExplanations.ecosystem,
    },
  };
}

/**
 * Returns guaranteed distinct vector scores for compared tools,
 * ensuring no two tools have matching points on any vector or total score.
 */
export function getDistinctVectorScores(tools: Tool[]): Map<number, VectorScoreResult> {
  const distinctProfiles = getDistinctComparisonProfiles(tools);
  const result = new Map<number, VectorScoreResult>();

  distinctProfiles.forEach((profile, toolId) => {
    result.set(toolId, {
      speed: profile.scores.speed,
      quality: profile.scores.quality,
      easeOfUse: profile.scores.easeOfUse,
      affordability: profile.scores.affordability,
      ecosystem: profile.scores.ecosystem,
      totalScore: profile.scores.totalScore,
      hardData: {
        speed: profile.scoreExplanations.speed,
        quality: profile.scoreExplanations.quality,
        easeOfUse: profile.scoreExplanations.easeOfUse,
        affordability: profile.scoreExplanations.affordability,
        ecosystem: profile.scoreExplanations.ecosystem,
      },
    });
  });

  return result;
}

export interface VerdictResult {
  winner: Tool;
  winnerScore: number;
  losingTool: Tool | null;
  winnerTopVector: string;
  loserTopVector: string;
  summaryText: string;
}

export function calculateComparisonVerdict(
  tools: Tool[],
  scoresMap: Map<number, VectorScoreResult>
): VerdictResult | null {
  if (tools.length === 0) return null;

  if (tools.length === 1) {
    const single = tools[0];
    const score = scoresMap.get(single.id) || calculateVectorScores(single);
    return {
      winner: single,
      winnerScore: score.totalScore,
      losingTool: null,
      winnerTopVector: 'Overall Capabilities',
      loserTopVector: 'Specific Tiers',
      summaryText: `Select at least 2 tools to run the multi-vector matrix and generate a side-by-side comparative verdict.`,
    };
  }

  // Find overall winner with highest totalScore
  let winner = tools[0];
  let winnerScoreObj = scoresMap.get(winner.id) || calculateVectorScores(winner);

  for (let i = 1; i < tools.length; i++) {
    const current = tools[i];
    const currentScoreObj = scoresMap.get(current.id) || calculateVectorScores(current);
    if (currentScoreObj.totalScore > winnerScoreObj.totalScore) {
      winner = current;
      winnerScoreObj = currentScoreObj;
    }
  }

  // Find runner-up / losing tool
  const losers = tools.filter((t) => t.id !== winner.id);
  let losingTool = losers[0];
  let losingScoreObj = scoresMap.get(losingTool.id) || calculateVectorScores(losingTool);

  for (let i = 1; i < losers.length; i++) {
    const current = losers[i];
    const currentScoreObj = scoresMap.get(current.id) || calculateVectorScores(current);
    if (currentScoreObj.totalScore > losingScoreObj.totalScore) {
      losingTool = current;
      losingScoreObj = currentScoreObj;
    }
  }

  const vectorKeys: Array<{ key: 'speed' | 'quality' | 'easeOfUse' | 'affordability' | 'ecosystem'; name: string }> = [
    { key: 'speed', name: 'Speed' },
    { key: 'quality', name: 'Quality' },
    { key: 'easeOfUse', name: 'Ease of Use' },
    { key: 'affordability', name: 'Affordability' },
    { key: 'ecosystem', name: 'Ecosystem' },
  ];

  // Highest Scoring Vector of Winner
  let winnerTopVector = vectorKeys[0];
  let maxWinnerVal = winnerScoreObj[winnerTopVector.key];

  for (const v of vectorKeys) {
    if (winnerScoreObj[v.key] > maxWinnerVal) {
      maxWinnerVal = winnerScoreObj[v.key];
      winnerTopVector = v;
    }
  }

  // Highest Scoring Vector of Loser
  let loserTopVector = vectorKeys[0];
  let maxLoserVal = losingScoreObj[loserTopVector.key];

  for (const v of vectorKeys) {
    const val = losingScoreObj[v.key];
    if (val > maxLoserVal && v.key !== winnerTopVector.key) {
      maxLoserVal = val;
      loserTopVector = v;
    }
  }

  // Fallback if top vectors ended up same key
  if (loserTopVector.key === winnerTopVector.key) {
    const alternative = vectorKeys.find((v) => v.key !== winnerTopVector.key);
    if (alternative) loserTopVector = alternative;
  }

  // Build insightful dynamic summary highlighting real differences
  let summaryText = '';
  const winnerNameLower = winner.name.toLowerCase();
  const loserNameLower = losingTool.name.toLowerCase();

  const isChatGptAndClaude =
    (winnerNameLower.includes('chatgpt') && loserNameLower.includes('claude')) ||
    (winnerNameLower.includes('claude') && loserNameLower.includes('chatgpt'));

  if (isChatGptAndClaude) {
    const chatgptScore = winnerNameLower.includes('chatgpt') ? winnerScoreObj : losingScoreObj;
    const claudeScore = winnerNameLower.includes('claude') ? winnerScoreObj : losingScoreObj;
    summaryText = `ChatGPT leads in Ecosystem (${chatgptScore.ecosystem.toFixed(1)} vs ${claudeScore.ecosystem.toFixed(1)}) and Accessibility, while Claude takes the lead in Output Quality & Coding (${claudeScore.quality.toFixed(1)} vs ${chatgptScore.quality.toFixed(1)}).`;
  } else {
    const winnerVector = winnerTopVector.key;
    const winnerVal = winnerScoreObj[winnerVector];
    const loserSameVal = losingScoreObj[winnerVector];

    const loserVector = loserTopVector.key;
    const loserVal = losingScoreObj[loserVector];
    const winnerSameVal = winnerScoreObj[loserVector];

    summaryText = `${winner.name} leads in ${winnerTopVector.name} (${winnerVal.toFixed(1)} vs ${loserSameVal.toFixed(1)}), while ${losingTool.name} takes the lead in ${loserTopVector.name} (${loserVal.toFixed(1)} vs ${winnerSameVal.toFixed(1)}).`;
  }

  return {
    winner,
    winnerScore: winnerScoreObj.totalScore,
    losingTool,
    winnerTopVector: winnerTopVector.name,
    loserTopVector: loserTopVector.name,
    summaryText,
  };
}
