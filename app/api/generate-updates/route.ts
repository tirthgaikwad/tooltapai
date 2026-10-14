export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import initialUpdates from '@/data/updates.json';

// In-memory updates store for edge execution
let updatesList = [...(initialUpdates as any[])];

export async function POST(req: NextRequest) {
  // 3. API Key Validation
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  // Initialize the Google Gen AI client
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  try {
    const body = await req.json().catch(() => ({}));
    const rawChangelog =
      body.rawChangelog ||
      'Anthropic announced Claude 3.5 Sonnet upgraded with enhanced computer use and 20% lower token pricing. OpenAI launched ChatGPT Search feature for all free tier users.';

    const systemPrompt =
      'You are a tech news summarizer. I will provide raw changelogs or news snippets about AI tools. Condense them into a single, punchy 15-word sentence focusing only on new features, pricing changes, or launches.';

    let summary = '';
    // 2. Robust Try/Catch & Error Logging
    try {
      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: rawChangelog,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.2,
          },
        });
      } catch (primaryErr: any) {
        console.warn('Primary model failed, attempting gemini-3.1-flash-lite fallback...', primaryErr.message);
        response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: rawChangelog,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.2,
          },
        });
      }
      summary = response.text ? response.text.trim() : '';
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      return NextResponse.json(
        { error: 'Failed to generate content', details: error.message },
        { status: 500 }
      );
    }

    const newUpdate = {
      id: `upd-${Date.now()}`,
      toolName: body.toolName || 'AI Ecosystem',
      type: (body.type as 'feature' | 'pricing' | 'launch') || 'feature',
      summary: summary || 'New AI capabilities and product updates announced.',
      date: 'Just now',
      read: false,
    };

    updatesList = [newUpdate, ...updatesList].slice(0, 30);

    return NextResponse.json({
      success: true,
      update: newUpdate,
      updates: updatesList,
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    updates: updatesList,
  });
}
