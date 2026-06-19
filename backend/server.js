import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import taskRoutes from './routes/taskRoutes.js';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Роуты API
  app.use('/tasks', taskRoutes);

  // Vite middleware для разработки / статика для продакшена
  if (process.env.NODE_ENV !== 'production') {
    const frontendDir = path.join(__dirname, '../frontend');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
      root: frontendDir,
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, '../frontend/dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
