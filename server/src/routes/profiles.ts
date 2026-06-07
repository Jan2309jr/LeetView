import { Router, Request, Response, NextFunction } from 'express';
import { fetchLeetCodeProfile, UserNotFoundError } from '../services/leetcode';

const router = Router();

// GET /api/profile/:username
router.get('/:username', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;

    if (!username || username.length < 1 || username.length > 50) {
      return res.status(400).json({ error: 'Invalid username' });
    }

    const profile = await fetchLeetCodeProfile(username);
    return res.json(profile);
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
});

export default router;
