import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all tracked profiles for the logged-in user
router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const tracked = await prisma.trackedProfile.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'asc' },
    });
    res.json(tracked.map((t) => t.leetcodeUsername));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tracked profiles' });
  }
});

// Add a single tracked profile
router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: 'Username is required' });

    await prisma.trackedProfile.create({
      data: {
        userId: req.userId as string,
        leetcodeUsername: username,
      },
    });
    res.status(201).json({ success: true });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Profile already tracked' });
    }
    res.status(500).json({ error: 'Failed to track profile' });
  }
});

// Remove a tracked profile
router.delete('/:username', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { username } = req.params;
    await prisma.trackedProfile.deleteMany({
      where: {
        userId: req.userId,
        leetcodeUsername: username,
      },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove profile' });
  }
});

// Bulk add tracked profiles
router.post('/bulk', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { usernames } = req.body;
    if (!Array.isArray(usernames)) {
      return res.status(400).json({ error: 'Usernames must be an array' });
    }

    let added = 0;
    let skipped = 0;

    for (const username of usernames) {
      try {
        await prisma.trackedProfile.create({
          data: {
            userId: req.userId as string,
            leetcodeUsername: username,
          },
        });
        added++;
      } catch (error: any) {
        skipped++;
      }
    }

    res.status(201).json({ added, skipped });
  } catch (error) {
    res.status(500).json({ error: 'Failed to bulk add profiles' });
  }
});

export default router;
