import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

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
      return JSON.parse(fs.readFileSync(UPDATES_FILE_PATH, 'utf-8'));
    }
  } catch (err: any) {
    console.error('Error reading updates:', err.message);
  }
  return [];
}

function saveUpdates(updates: any[]) {
  try {
    fs.writeFileSync(UPDATES_FILE_PATH, JSON.stringify(updates, null, 2), 'utf-8');
  } catch (err: any) {
    console.error('Error saving updates:', err.message);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'ToolTap API Server',
      time: new Date().toISOString(),
    });
  });

  // API Route: Fetch live database tools
  app.get('/api/tools', (_req, res) => {
    try {
      const toolsPath = path.join(process.cwd(), 'src', 'data', 'tools.json');
      if (fs.existsSync(toolsPath)) {
        const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf-8'));
        return res.json({ success: true, count: tools.length, tools });
      }
      res.json({ success: true, count: 0, tools: [] });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Failed to fetch tools' });
    }
  });

  // API Route: Fetch notification updates
  app.get('/api/updates', (_req, res) => {
    try {
      const updates = loadUpdates();
      res.json({ success: true, updates });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Mark update(s) as read
  app.post('/api/updates/mark-read', (req, res) => {
    try {
      const { id, all } = req.body;
      let updates = loadUpdates();
      if (all) {
        updates = updates.map((u: any) => ({ ...u, read: true }));
      } else if (id) {
        updates = updates.map((u: any) => (u.id === id ? { ...u, read: true } : u));
      }
      saveUpdates(updates);
      res.json({ success: true, updates });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Generate updates using Gemini Summarizer
  app.post('/api/generate-updates', async (req, res) => {
    try {
      const { rawChangelog, toolName, type } = req.body;
      const changelogText =
        rawChangelog ||
        'Anthropic launched Claude 3.5 Sonnet with 200k context window and computer use API. OpenAI rolled out ChatGPT Search for Plus and Free users with realtime sports, stocks, and news.';

      const systemPrompt =
        'You are a tech news summarizer. I will provide raw changelogs or news snippets about AI tools. Condense them into a single, punchy 15-word sentence focusing only on new features, pricing changes, or launches.';

      let summary = '';
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: changelogText,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.3,
          },
        });
        summary = response.text ? response.text.trim() : '';
      } catch (err: any) {
        console.warn('Gemini 3.8 Flash high demand, trying 3.1 Flash-Lite fallback...', err.message);
        try {
          const fallbackRes = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents: changelogText,
            config: {
              systemInstruction: systemPrompt,
              temperature: 0.3,
            },
          });
          summary = fallbackRes.text ? fallbackRes.text.trim() : '';
        } catch (innerErr: any) {
          console.warn('Fallback model also encountered error:', innerErr.message);
        }
      }

      if (!summary) {
        // Clean first sentence or 15-word excerpt as fallback
        const words = changelogText.split(/\s+/).slice(0, 15).join(' ');
        summary = words ? `${words}...` : 'New feature updates and enhancements rolled out.';
      }

      const newUpdate = {
        id: `upd-${Date.now()}`,
        toolName: toolName || 'AI Ecosystem',
        type: type || 'feature',
        summary,
        date: 'Just now',
        read: false,
      };

      const existing = loadUpdates();
      const updatedList = [newUpdate, ...existing].slice(0, 30);
      saveUpdates(updatedList);

      res.json({
        success: true,
        update: newUpdate,
        updates: updatedList,
      });
    } catch (err: any) {
      console.error('Gemini Summarizer Error:', err);
      res.status(500).json({ success: false, error: err.message || 'Summarization failed' });
    }
  });

  // API Route: Multi-turn Chatbot using Gemini
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages, model = 'gemini-3.8-flash', role = 'advisor' } = req.body;

      const roleInstructions: Record<string, string> = {
        advisor:
          'You are ToolTap AI Advisor, an expert guide helping users find, compare, and integrate the best AI tools from a catalog of 600+ tools. Provide clear, concise recommendations with pricing context (Free, Freemium, Paid) and direct workflow tips.',
        pricing:
          'You are ToolTap Pricing Specialist, an expert in analyzing AI subscription costs, free tier limits, API tokens, and student discounts.',
        speed:
          'You are ToolTap Fast Assist, providing ultra-quick, concise answers on AI tools and workflows in 1-2 bullet points.',
      };

      const systemInstruction = roleInstructions[role] || roleInstructions.advisor;

      // Format conversation turns for Gemini
      const contents = (messages || []).map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      let reply = '';
      try {
        const response = await ai.models.generateContent({
          model: model === 'gemini-3.1-flash-lite' ? 'gemini-3.1-flash-lite' : 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction,
          },
        });
        reply = response.text || '';
      } catch (err: any) {
        console.warn('Chat primary model failed, attempting 3.1-flash-lite fallback...', err.message);
        try {
          const fallbackRes = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents,
            config: {
              systemInstruction,
            },
          });
          reply = fallbackRes.text || '';
        } catch (innerErr: any) {
          console.warn('Chat fallback failed:', innerErr.message);
        }
      }

      if (!reply) {
        reply = "I'm here to help you navigate ToolTap AI tools! You can browse 600+ tools by category, compare pricing tiers, and find free plans.";
      }

      res.json({ success: true, reply });
    } catch (err: any) {
      console.error('Chat error:', err);
      res.status(500).json({ success: false, error: err.message || 'Chat generation failed' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ToolTap Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
