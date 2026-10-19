import { GoogleGenAI } from '@google/genai';
import type { RecommendationResponse } from '@/types/recommendation';

let aiInstance: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

/**
 * PHASE NINE: Grounded Explanation Generator
 * Controls LLM hallucinations by passing deterministic ranking results,
 * facts, and constraints to the LLM solely for natural language synthesis.
 * The ranking order, suitability scores, and facts are strictly pre-computed.
 */
export async function enhanceRecommendationExplanation(
  recResponse: RecommendationResponse
): Promise<RecommendationResponse> {
  // If no match was found, return deterministic explanation
  if (!recResponse.best_match) {
    return recResponse;
  }

  const ai = getAiClient();
  if (!ai) {
    // Graceful fallback to deterministic explanation when Gemini API key is not set
    return recResponse;
  }

  try {
    const prompt = `You are the Lead Recommendation Architect for ToolTap, an objective AI Tools directory.
The deterministic ranking algorithm has ALREADY evaluated the user query and ranked the candidate tools.
YOUR ROLE: Explain why the #1 tool was chosen and highlight the trade-offs with the alternatives based STRICTLY on the verified facts provided below.

RULES:
1. NEVER change the ranking order. Tool #1 is the winner.
2. NEVER invent tool names, prices, benchmarks, or features not in the input data.
3. If an attribute is marked "unknown" or not listed, do not claim it is supported.
4. Keep the response concise, punchy, and objective (2-3 short paragraphs max).
5. State the major limitation of the top tool honestly.

USER QUERY: "${recResponse.query}"
USER TASK: ${recResponse.requirements.task}
MANDATORY CONSTRAINTS: ${recResponse.requirements.hard_constraints.join(', ') || 'None'}

RANKED CANDIDATES:
${recResponse.results
  .map(
    (r) =>
      `Rank #${r.rank}: ${r.name} (${r.category})
- Suitability Score: ${r.suitability_score}/100 | Confidence: ${r.confidence}
- Pricing: ${r.pricing_summary}
- Free Tier: ${r.free_tier_status}
- Top Advantages: ${r.advantages.join('; ')}
- Known Limitations: ${r.limitations.join('; ')}
- Matched Constraints: ${r.matched_requirements.join('; ')}`
  )
  .join('\n\n')}

Write a clear, authoritative explanation for the user explaining the verdict and trade-offs.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const text = response.text?.trim();
    if (text) {
      return {
        ...recResponse,
        explanation: text,
      };
    }
  } catch (err) {
    console.warn('[Gemini Service] Falling back to deterministic explanation:', (err as any)?.message);
  }

  return recResponse;
}
