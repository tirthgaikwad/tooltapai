export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

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
    const { messages, model = 'gemini-3.8-flash', role = 'advisor' } = await req.json();

    const roleInstructions: Record<string, string> = {
      advisor:
        'You are ToolTap AI Advisor, an expert guide helping users find, compare, and integrate the best AI tools from a catalog of 600+ tools. Provide clear, concise recommendations with pricing context (Free, Freemium, Paid) and direct workflow tips.',
      pricing:
        'You are ToolTap Pricing Specialist, an expert in analyzing AI subscription costs, free tier limits, API tokens, and student discounts.',
      speed:
        'You are ToolTap Fast Assist, providing ultra-quick, concise answers on AI tools and workflows in 1-2 bullet points.',
    };

    const systemInstruction = roleInstructions[role] || roleInstructions.advisor;

    const contents = (messages || []).map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // 2. Robust Try/Catch & Error Logging
    try {
      let response;
      try {
        response = await ai.models.generateContent({
          model: model === 'gemini-3.1-flash-lite' ? 'gemini-3.1-flash-lite' : 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction,
          },
        });
      } catch (primaryErr: any) {
        if (model !== 'gemini-3.1-flash-lite') {
          console.warn('Primary model failed, attempting gemini-3.1-flash-lite fallback...', primaryErr.message);
          response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents,
            config: {
              systemInstruction,
            },
          });
        } else {
          throw primaryErr;
        }
      }

      const reply = response.text || "I'm here to help you navigate ToolTap AI tools!";
      return NextResponse.json({ success: true, reply });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      return NextResponse.json(
        { error: 'Failed to generate content', details: error.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content', details: error.message },
      { status: 500 }
    );
  }
}
