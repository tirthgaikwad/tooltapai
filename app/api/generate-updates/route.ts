import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import fs from 'node:fs';
import path from 'node:path';

// Server-side Gemini initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const UPDATES_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'updates.json');

function loadUpdates() {
  try {
    if (fs.existsSync(UPDATES_FILE_PATH)) {
      const data = fs.readFileSync(UPDATES_FILE_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error loading updates:', e);
  }
  return [];
}

function saveUpdates(updates: any[]) {
  try {
    fs.writeFileSync(UPDATES_FILE_PATH, JSON.stringify(updates, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving updates:', e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawChangelog =
      body.rawChangelog ||
      'OpenAI announces GPT-4o mini audio output and price cut by 60%. Midjourney announces v6.2 release with instant video export.';

    const systemPrompt =
      'You are a tech news summarizer. I will provide raw changelogs or news snippets about AI tools. Condense them into a single, punchy 15-word sentence focusing only on new features, pricing changes, or launches.';

    let summary = '';
    try {
      // Generate summary using official @google/genai SDK
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: rawChangelog,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.2,
        },
      });
      summary = response.text ? response.text.trim() : '';
    } catch (err: any) {
      console.warn('Gemini 3.8 Flash high demand, trying 3.1 Flash-Lite fallback...', err.message);
      const fallbackRes = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: rawChangelog,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.2,
        },
      });
      summary = fallbackRes.text ? fallbackRes.text.trim() : 'New AI feature updates rolled out.';
    }

    const newUpdate = {
      id: `upd-${Date.now()}`,
      toolName: body.toolName || 'AI Ecosystem',
      type: (body.type as 'feature' | 'pricing' | 'launch') || 'feature',
      summary,
      date: 'Just now',
      read: false,
    };

    const existingUpdates = loadUpdates();
    const updatedList = [newUpdate, ...existingUpdates].slice(0, 30);
    saveUpdates(updatedList);

    return NextResponse.json({
      success: true,
      update: newUpdate,
      updates: updatedList,
    });
  } catch (error: any) {
    console.error('Error generating update summary:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to summarize updates' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const updates = loadUpdates();
  return NextResponse.json({
    success: true,
    updates,
  });
}
