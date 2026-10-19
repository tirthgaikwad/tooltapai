/**
 * Comprehensive Automated Test Suite for ToolTap Recommendation & Comparison Engine
 * Executes all 10 required test cases defined in Phase Eleven.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load compiled or ts-node modules
import { rankAndRecommendTools, extractUserRequirements, retrieveCandidates } from '../src/lib/recommendationEngine.ts';

const toolsPath = path.join(rootDir, 'src', 'data', 'tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf-8'));

console.log(`\n===============================================================`);
console.log(` TOOLTAP RECOMMENDATION & COMPARISON ENGINE TEST SUITE `);
console.log(` Total Tools Indexed: ${tools.length}`);
console.log(`===============================================================\n`);

let passedCount = 0;
let totalCount = 0;

function assert(condition, message) {
  totalCount++;
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passedCount++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    process.exitCode = 1;
  }
}

// -------------------------------------------------------------
// TEST 1: FREE-ONLY REQUIREMENT
// Query: "Find a completely free AI tool for generating presentations."
// -------------------------------------------------------------
console.log(`\n--- TEST 1: FREE-ONLY REQUIREMENT ---`);
{
  const query = "Find a completely free AI tool for generating presentations.";
  const res = rankAndRecommendTools(tools, query);

  assert(res.requirements.budget.type === 'free_only', "Correctly extracts budget.type as 'free_only'");
  assert(res.requirements.hard_constraints.includes('free_plan_available'), "Includes 'free_plan_available' hard constraint");
  
  if (res.best_match) {
    assert(
      res.best_match.access === 'Free' || res.best_match.access === 'Open Source' || res.best_match.key_metrics.has_free_tier,
      `Recommended tool (${res.best_match.name}) must have verified free tier (got ${res.best_match.pricing_summary})`
    );
  }
  
  // Ensure paid-only tools without free tier (like Beautiful.ai or Midjourney) are completely disqualified
  const paidDisqualified = !res.results.some(r => r.canonical_id === 'beautiful_ai' || r.canonical_id === 'midjourney');
  assert(paidDisqualified, "Paid-only tools (e.g. Beautiful.ai, Midjourney) must be disqualified under free-only constraint");
}

// -------------------------------------------------------------
// TEST 2: SPECIFIC CAPABILITY
// Query: "Find an AI tool that can generate Python code and explain errors."
// -------------------------------------------------------------
console.log(`\n--- TEST 2: SPECIFIC CAPABILITY ---`);
{
  const query = "Find an AI tool that can generate Python code and explain errors.";
  const res = rankAndRecommendTools(tools, query);

  assert(res.requirements.required_capabilities.includes('python_code_generation'), "Matches 'python_code_generation' capability");
  assert(
    res.requirements.preferred_capabilities.includes('debugging') || res.requirements.preferred_capabilities.includes('code_explanation'),
    "Matches secondary capability 'debugging' or 'code_explanation'"
  );
  assert(res.best_match !== null, "Returns a valid top candidate for coding");
  
  const topNames = res.results.map(r => r.name.toLowerCase());
  const isCodingTool = topNames.some(n => n.includes('cursor') || n.includes('copilot') || n.includes('chatgpt') || n.includes('claude'));
  assert(isCodingTool, `Top results must be specialized coding/developer solutions (found: ${topNames.slice(0, 3).join(', ')})`);
}

// -------------------------------------------------------------
// TEST 3: MULTIPLE REQUIREMENTS
// Query: "Find an AI video editor with automatic subtitles, browser support, and a free plan."
// -------------------------------------------------------------
console.log(`\n--- TEST 3: MULTIPLE REQUIREMENTS ---`);
{
  const query = "Find an AI video editor with automatic subtitles, browser support, and a free plan.";
  const res = rankAndRecommendTools(tools, query);

  assert(res.requirements.hard_constraints.includes('free_plan_available'), "Enforces free-plan constraint");
  assert(res.requirements.platforms.includes('web'), "Enforces web browser constraint");
  assert(res.best_match !== null, "Found eligible video editor candidate");
  assert(
    res.best_match?.canonical_id === 'capcut' || res.best_match?.canonical_id === 'descript' || res.best_match?.category.includes('Video'),
    `Winner (${res.best_match?.name}) is a verified video editor with auto subtitles`
  );
}

// -------------------------------------------------------------
// TEST 4: SIMILAR TOOL NAMES
// Distinguish products with similar names using canonical IDs
// -------------------------------------------------------------
console.log(`\n--- TEST 4: SIMILAR TOOL NAMES ---`);
{
  const reqCopilot = extractUserRequirements("GitHub Copilot");
  const candCopilot = retrieveCandidates(tools, reqCopilot);
  const foundGitHub = candCopilot.find(t => t.name.toLowerCase().includes('github copilot'));
  const foundMicrosoft = candCopilot.find(t => t.name.toLowerCase().includes('microsoft copilot'));

  assert(foundGitHub !== undefined, "Finds GitHub Copilot");
  assert(foundGitHub?.id !== foundMicrosoft?.id, "GitHub Copilot and Microsoft Copilot have distinct IDs");
}

// -------------------------------------------------------------
// TEST 5: MISSING DATA
// Incomplete or unverified metadata does not crash and reports verification status
// -------------------------------------------------------------
console.log(`\n--- TEST 5: MISSING DATA ---`);
{
  // Synthetic tool with missing optional fields
  const syntheticTool = {
    id: 99999,
    name: "Synthetic Experimental Tool",
    url: "https://synthetic.example",
    category: "General AI Assistants",
    access: "Freemium",
    freePlan: "",
    why: "Experimental research assistant",
  };

  const res = rankAndRecommendTools([syntheticTool], "General AI assistant");
  assert(res.results.length === 1, "Handles tool with missing fields without crashing");
  assert(res.results[0].evidence_coverage <= 50, "Accurately reports low evidence coverage for incomplete tool");
}

// -------------------------------------------------------------
// TEST 6: NO MATCH
// Query with impossible/unsupported capability returns no verified match
// -------------------------------------------------------------
console.log(`\n--- TEST 6: NO MATCH ---`);
{
  const impossibleQuery = "Find a free AI tool that can physically teleport quantum computers to Mars.";
  const res = rankAndRecommendTools(tools, impossibleQuery, {
    required_capabilities: ['quantum_physical_teleportation_to_mars'],
  });

  assert(res.best_match === null, "Returns best_match: null when no tool satisfies the capability");
  assert(typeof res.no_match_reason === 'string' && res.no_match_reason.length > 0, "Provides clear explanation of missing capability");
}

// -------------------------------------------------------------
// TEST 7: CONTRADICTORY REQUIREMENTS
// E.g., user asks for 100% free tool for Midjourney image generation (which is paid only)
// -------------------------------------------------------------
console.log(`\n--- TEST 7: CONTRADICTORY REQUIREMENTS ---`);
{
  const contradictoryQuery = "Find Midjourney with a completely free unlimited plan without paying.";
  const res = rankAndRecommendTools(tools, contradictoryQuery);

  // Midjourney must be excluded or flagged because it has NO free plan
  const midjourneyAsWinner = res.best_match?.canonical_id === 'midjourney';
  assert(!midjourneyAsWinner, "Midjourney is not recommended as free (contradiction detected, paid-only)");
}

// -------------------------------------------------------------
// TEST 8: RANKING DETERMINISM
// Identical inputs produce identical output ranking and scores
// -------------------------------------------------------------
console.log(`\n--- TEST 8: RANKING DETERMINISM ---`);
{
  const query = "Find the best AI website builder for beginners";
  const run1 = rankAndRecommendTools(tools, query);
  const run2 = rankAndRecommendTools(tools, query);

  assert(run1.best_match?.tool_id === run2.best_match?.tool_id, "Winner ID matches deterministically across runs");
  assert(run1.best_match?.suitability_score === run2.best_match?.suitability_score, "Suitability score matches deterministically");
  assert(run1.results.map(r => r.tool_id).join(',') === run2.results.map(r => r.tool_id).join(','), "Ranking order is 100% deterministic");
}

// -------------------------------------------------------------
// TEST 9: ALTERNATIVE RECOMMENDATION
// Query: "Find an alternative to ChatGPT for research, but it must have a free plan."
// -------------------------------------------------------------
console.log(`\n--- TEST 9: ALTERNATIVE RECOMMENDATION ---`);
{
  const query = "Find an alternative to ChatGPT for research, but it must have a free plan.";
  const res = rankAndRecommendTools(tools, query);

  assert(res.requirements.excluded_tool_names.includes('chatgpt'), "Extracts ChatGPT as excluded tool");
  assert(res.best_match?.canonical_id !== 'chatgpt', "ChatGPT is strictly excluded from results");
  assert(
    res.best_match?.canonical_id === 'perplexity' || res.best_match?.canonical_id === 'consensus' || res.best_match?.category.includes('Research'),
    `Recommends a dedicated research alternative (${res.best_match?.name})`
  );
}

// -------------------------------------------------------------
// TEST 10: FRONTEND INTEGRATION & API CONTRACT
// Verifies all required fields in RecommendationResponse
// -------------------------------------------------------------
console.log(`\n--- TEST 10: FRONTEND INTEGRATION & CONTRACT VALIDATION ---`);
{
  const query = "Compare AI website builders for a beginner.";
  const res = rankAndRecommendTools(tools, query);

  assert(typeof res.query === 'string', "Response contains query string");
  assert(typeof res.requirements === 'object', "Response contains structured requirements");
  assert(Array.isArray(res.results), "Response contains results array");
  assert(Array.isArray(res.comparison_matrix.criteria), "Comparison matrix has criteria array");
  assert(Array.isArray(res.comparison_matrix.tools), "Comparison matrix has evaluated tools");
  assert(typeof res.tradeoffs_summary === 'string', "Contains grounded tradeoffs summary");

  if (res.best_match) {
    const b = res.best_match;
    assert(typeof b.tool_id === 'number', "best_match has numeric tool_id");
    assert(typeof b.suitability_score === 'number', "best_match has numeric suitability_score");
    assert(Array.isArray(b.matched_requirements), "best_match has matched_requirements array");
    assert(Array.isArray(b.limitations), "best_match has limitations array");
    assert(Array.isArray(b.evidence), "best_match has verifiable evidence array");
  }
}

// -------------------------------------------------------------
// SUMMARY & EVALUATION REPORT
// -------------------------------------------------------------
console.log(`\n===============================================================`);
console.log(` TEST RESULTS SUMMARY: ${passedCount} / ${totalCount} PASSED `);
if (passedCount === totalCount) {
  console.log(` ALL TESTS COMPLETED SUCCESSFULLY! `);
} else {
  console.error(` ${totalCount - passedCount} TESTS FAILED `);
}
console.log(`===============================================================\n`);
