import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleAuth } from 'google-auth-library';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, 'dist');
const BACKEND_URL = process.env.API_BACKEND_URL;
if (!BACKEND_URL) {
  console.error('API_BACKEND_URL not set');
  process.exit(1);
}

const app = express();
const auth = new GoogleAuth();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static SPA
app.use(express.static(DIST_DIR, { index: 'index.html' }));

console.log('Proxying API requests to', DIST_DIR);
// Proxy API calls to backend (strip /api prefix)
app.all('/api/*', async (req, res) => {
  try {
    const client = await auth.getIdTokenClient(BACKEND_URL);
    const targetPath = req.originalUrl.replace(/^\/api/, '');
    const url = `${BACKEND_URL}${targetPath}`;

    const headers = { ...req.headers };
    delete headers.host;

    const opts = {
      url,
      method: req.method,
      headers,
      data: ['GET', 'HEAD'].includes(req.method) ? undefined : req.body,
      responseType: 'stream',
    };

    const backendRes = await client.request(opts);
    const bHeaders = backendRes.headers || {};

    // forward headers (skip hop-by-hop)
    for (const [k, v] of Object.entries(bHeaders)) {
      const lk = k.toLowerCase();
      if (['transfer-encoding', 'connection', 'keep-alive', 'content-encoding', 'content-length'].includes(lk)) continue;
      // set-cookie is handled naturally
      res.setHeader(k, v);
    }
    res.status(backendRes.status || 200);

    const data = backendRes.data;
    if (data && typeof data.pipe === 'function') {
      data.pipe(res);
    } else {
      res.send(data);
    }
  } catch (err) {
    console.error('proxy error', err);
    res.status(500).json({ error: 'proxy error' });
  }
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

const port = process.env.PORT || 5173;
app.listen(port, () => console.log(`Frontend server listening on ${port}`));
