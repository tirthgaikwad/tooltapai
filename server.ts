import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

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
