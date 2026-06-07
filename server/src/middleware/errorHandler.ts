import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error('[Error]', err.message);

  if (err.message.includes('timeout') || err.message.includes('ECONNREFUSED')) {
    return res.status(503).json({ error: 'LeetCode API is unreachable. Try again later.' });
  }

  if (err.message.includes('429') || err.message.includes('rate limit')) {
    return res.status(429).json({ error: 'Rate limited by LeetCode. Wait a moment.' });
  }

  return res.status(500).json({ error: 'Internal server error' });
}
