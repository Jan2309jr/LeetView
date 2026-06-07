import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import profileRoutes from './routes/profiles';
import authRoutes from './routes/auth';
import trackedRoutes from './routes/tracked';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// Middleware
const corsOrigin = process.env.VERCEL === '1' ? '*' : ['http://localhost:5173', 'http://localhost:3000'];
app.use(cors({ origin: corsOrigin }));
app.use(express.json());

// Rate limiting — max 60 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { error: 'Too many requests, please slow down.' },
});
app.use('/api', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tracked', trackedRoutes);
app.use('/api/profile', profileRoutes);

// Health check
app.get('/', (_req, res) => res.json({ status: 'ok', message: 'LeetView Backend API is running!' }));
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Error handler (must be last)
app.use(errorHandler);

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 LeetView server running on http://localhost:${PORT}`);
  });
}

export default app;
