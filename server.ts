import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {createServer as createViteServer} from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NGARGOYOSO_LAT = '-7.6248';
const NGARGOYOSO_LNG = '111.1324';

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;

  app.get('/api/weather', async (_req, res) => {
    const apiKey =
      process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      res.status(200).json({
        available: false,
        reason: 'missing_key',
      });
      return;
    }

    try {
      const url = new URL('https://weather.googleapis.com/v1/currentConditions:lookup');
      url.searchParams.append('key', apiKey);
      url.searchParams.append('location.latitude', NGARGOYOSO_LAT);
      url.searchParams.append('location.longitude', NGARGOYOSO_LNG);
      url.searchParams.append('unitsSystem', 'METRIC');

      const apiResponse = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'X-Goog-Maps-Solution-ID': 'gmp_mcp_codeassist_v1_aistudio',
        },
      });

      const payload = (await apiResponse.json().catch(() => null)) as {
        error?: {status?: string; message?: string};
        [key: string]: unknown;
      } | null;

      if (
        apiResponse.status === 429 ||
        payload?.error?.status === 'RESOURCE_EXHAUSTED'
      ) {
        res.status(429).json({
          available: false,
          quotaExceeded: true,
          reason: 'quota_exceeded',
        });
        return;
      }

      if (!apiResponse.ok || !payload) {
        res.status(apiResponse.status || 502).json({
          available: false,
          reason: 'upstream_error',
        });
        return;
      }

      res.setHeader('Cache-Control', 'no-store');
      res.json({
        available: true,
        data: payload,
      });
    } catch (error) {
      console.error('Weather API request failed:', error);
      res.status(502).json({
        available: false,
        reason: 'network_error',
      });
    }
  });

  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: {middlewareMode: true},
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      const indexFile = path.join(distPath, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Not found');
      }
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
