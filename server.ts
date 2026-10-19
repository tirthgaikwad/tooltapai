import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { rankAndRecommendTools } from './src/lib/recommendationEngine';
import { enhanceRecommendationExplanation } from './src/services/geminiService';
import type { Tool } from './src/types/tool';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Load tools dataset once in memory with hot reload capability
  let cachedTools: Tool[] = [];
  function loadTools(): Tool[] {
    try {
      const toolsPath = path.join(process.cwd(), 'src', 'data', 'tools.json');
      if (fs.existsSync(toolsPath)) {
        cachedTools = JSON.parse(fs.readFileSync(toolsPath, 'utf-8'));
      }
    } catch (err) {
      console.error('[ToolTap Server] Failed to load tools.json:', err);
    }
    return cachedTools;
  }
  loadTools();

  // API Route: Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'ToolTap API Server',
      tools_indexed: cachedTools.length,
      time: new Date().toISOString(),
    });
  });

  // API Route: Fetch live database tools
  app.get('/api/tools', (_req, res) => {
    try {
      const tools = cachedTools.length > 0 ? cachedTools : loadTools();
      return res.json({ success: true, count: tools.length, tools });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Failed to fetch tools' });
    }
  });

  // API Route: Intelligent Natural-Language Recommendation & Fair Comparison
  app.post('/api/recommend', async (req, res) => {
    try {
      const { query, constraints } = req.body || {};

      if (!query || typeof query !== 'string' || !query.trim()) {
        return res.status(400).json({
          error: 'Missing required field: query must be a non-empty string.',
        });
      }

      const tools = cachedTools.length > 0 ? cachedTools : loadTools();
      const rawRec = rankAndRecommendTools(tools, query.trim(), constraints);

      // Enhance with grounded Gemini synthesis if API key is configured
      const finalRec = await enhanceRecommendationExplanation(rawRec);

      res.json(finalRec);
    } catch (err: any) {
      console.error('[API /recommend Error]:', err);
      res.status(500).json({
        error: 'Failed to process recommendation query.',
        message: err.message,
      });
    }
  });

  // API Route: Compare specific tools side-by-side with hard data verification
  app.post('/api/compare', (req, res) => {
    try {
      const { toolIds, toolNames, query } = req.body || {};
      const tools = cachedTools.length > 0 ? cachedTools : loadTools();

      let targetTools: Tool[] = [];

      if (Array.isArray(toolIds) && toolIds.length > 0) {
        targetTools = tools.filter((t) => toolIds.includes(t.id));
      } else if (Array.isArray(toolNames) && toolNames.length > 0) {
        const lowerNames = toolNames.map((n: string) => n.toLowerCase().trim());
        targetTools = tools.filter((t) =>
          lowerNames.some((ln: string) => t.name.toLowerCase().includes(ln) || ln.includes(t.name.toLowerCase()))
        );
      }

      const effectiveQuery = query || targetTools.map((t) => t.name).join(' vs ');
      const result = rankAndRecommendTools(tools, effectiveQuery);

      res.json(result);
    } catch (err: any) {
      console.error('[API /compare Error]:', err);
      res.status(500).json({
        error: 'Failed to process tool comparison.',
        message: err.message,
      });
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
