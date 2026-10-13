import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export async function POST(req: NextRequest) {
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

    const response = await ai.models.generateContent({
      model: model === 'gemini-3.1-flash-lite' ? 'gemini-3.1-flash-lite' : 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
      },
    });

    const reply = response.text || "I'm here to help you navigate ToolTap AI tools!";
    return NextResponse.json({ success: true, reply });
  } catch (err: any) {
    console.error('Chat error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Chat generation failed' },
      { status: 500 }
    );
  }
}
