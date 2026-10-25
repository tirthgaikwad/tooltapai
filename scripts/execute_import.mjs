import fs from 'fs';
import { AUDIT_ENTRIES } from './build_verified_catalog.mjs';

const existingTools = JSON.parse(fs.readFileSync('./src/data/tools.json', 'utf-8'));
console.log(`Initial tools count: ${existingTools.length}`);

if (existingTools.length !== 600) {
  throw new Error(`Expected exactly 600 existing tools, found ${existingTools.length}`);
}

const duplicates = AUDIT_ENTRIES.filter(e => e.status === 'duplicate');
const newTools = AUDIT_ENTRIES.filter(e => e.status === 'new');

console.log(`Duplicates to exclude: ${duplicates.length}`);
console.log(`New tools to add: ${newTools.length}`);

let nextId = 601;
const formattedNewTools = newTools.map(t => {
  return {
    id: nextId++,
    name: t.name,
    url: t.url,
    category: t.category,
    access: t.access,
    freePlan: t.freePlan,
    why: t.why
  };
});

const mergedTools = [...existingTools, ...formattedNewTools];
console.log(`Final tools count: ${mergedTools.length}`);

// Write updated tools.json
fs.writeFileSync('./src/data/tools.json', JSON.stringify(mergedTools, null, 2) + '\n', 'utf-8');
console.log('Successfully written updated ./src/data/tools.json');

// Generate JSON report
const reportData = {
  summary: {
    totalEvaluatedFromPdf: AUDIT_ENTRIES.length,
    pdfNumberRange: "601-1000",
    initialExistingCount: existingTools.length,
    duplicatesDetected: duplicates.length,
    newToolsAdded: formattedNewTools.length,
    finalDirectoryCount: mergedTools.length
  },
  duplicates: duplicates.map(d => ({
    pdfNum: d.num,
    toolName: d.name,
    status: "Excluded (Duplicate/Feature/Rebrand)",
    matchedExistingId: d.matchId,
    matchedExistingName: d.matchName,
    reason: d.reason
  })),
  newToolsAdded: formattedNewTools.map((t, idx) => ({
    assignedId: t.id,
    originalPdfNum: newTools[idx].num,
    name: t.name,
    category: t.category,
    access: t.access,
    url: t.url,
    freePlan: t.freePlan,
    why: t.why
  }))
};

fs.writeFileSync('./docs/duplicate_audit_report.json', JSON.stringify(reportData, null, 2) + '\n', 'utf-8');
console.log('Saved ./docs/duplicate_audit_report.json');

// Generate comprehensive Markdown report
let md = `# ToolTap 400 New AI Tools Integration & Duplicate Audit Report\n\n`;
md += `## Executive Summary\n\n`;
md += `- **Source PDF:** \`ToolTap_400_More_AI_Tools_601-1000_with_Links.pdf\` (400 tools, numbered 601–1000)\n`;
md += `- **Original Directory Count:** 600 tools (IDs 1–600)\n`;
md += `- **Duplicates / Rebrands / Sub-Features Detected & Excluded:** ${duplicates.length}\n`;
md += `- **Genuinely New AI Tools Added:** ${formattedNewTools.length}\n`;
md += `- **New Directory Total:** ${mergedTools.length} tools (IDs 1–${mergedTools[mergedTools.length - 1].id})\n\n`;

md += `### Why Were Duplicates Present in the PDF?\n`;
md += `As noted on Page 1 of the PDF:\n`;
md += `> *"Duplicate-check note: The available 500-tool PDF was considered, but the separate earlier 100-tool PDF (501–600) was not available for a full cross-check. This directory should be verified against that file before claiming zero duplicates across all 1,000 entries."*\n\n`;
md += `Because ToolTap's database already contained tools 1–600 (incorporating both the initial 500 tools and the 501–600 tools, plus major tools across all categories), many tools in the 601–1000 list were already present (e.g., Consensus, Elicit, Writesonic, Copy.ai, Runway, Pika, HeyGen, Descript, v0, Bolt, Qodo). In addition, several entries in the PDF represented rebranded products (e.g., CodiumAI → Qodo, Metaphor → Exa) or sub-features of existing tools (e.g., Perplexity Pages, Canva Magic Studio, ElevenLabs Dubbing Studio).\n\n`;

md += `## Audit of Excluded Duplicates (${duplicates.length} tools)\n\n`;
md += `| PDF # | Tool Name | Matched Existing Tool | Matched ID | Reason for Exclusion |\n`;
md += `|---|---|---|---|---|\n`;
for (const d of duplicates) {
  md += `| ${d.num} | **${d.name}** | ${d.matchName} | #${d.matchId} | ${d.reason} |\n`;
}

md += `\n## Genuinely New Tools Added (${formattedNewTools.length} tools)\n\n`;
md += `| New ID | PDF # | Tool Name | Canonical Category | Access | Verified URL |\n`;
md += `|---|---|---|---|---|---|\n`;
for (let i = 0; i < formattedNewTools.length; i++) {
  const t = formattedNewTools[i];
  const orig = newTools[i];
  md += `| ${t.id} | ${orig.num} | **${t.name}** | ${t.category} | ${t.access} | [${t.url}](${t.url}) |\n`;
}

fs.writeFileSync('./docs/DUPLICATE_AUDIT_REPORT.md', md, 'utf-8');
console.log('Saved ./docs/DUPLICATE_AUDIT_REPORT.md');
