import axios from 'axios';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const GRAPHQL_URL = 'https://leetcode.com/graphql';

// Basic caching to prevent hitting rate limits
const cache = new Map<string, { data: any; fetchedAt: number }>();
const CACHE_TTL = 30 * 1000;

const PROFILE_QUERY = `
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      username
      profile {
        ranking
      }
      submitStats {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
        totalSubmissionNum {
          difficulty
          count
          submissions
        }
      }
    }
    userContestRanking(username: $username) {
      rating
    }
  }
`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const username = (req.query.username as string) || (req.body?.username as string);
  const forceRefresh = req.query.force === 'true';

  if (!username) {
    res.status(400).json({ error: 'Username is required' });
    return;
  }

  const lowerUser = username.toLowerCase();

  // Check cache (skip if forceRefresh is true)
  if (!forceRefresh) {
    const cached = cache.get(lowerUser);
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
      res.status(200).json(cached.data);
      return;
    }
  }

  try {
    const response = await axios.post(
      GRAPHQL_URL,
      {
        query: PROFILE_QUERY,
        variables: { username },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'https://leetcode.com',
          'User-Agent': 'Mozilla/5.0 (compatible; LeetViewBot/1.0)',
        },
        timeout: 10000,
      }
    );

    const data = response.data;

    if (data.errors) {
      res.status(400).json({ error: data.errors[0]?.message || 'GraphQL error' });
      return;
    }

    const user = data.data?.matchedUser;
    if (!user) {
      res.status(404).json({ error: `User "${username}" not found on LeetCode` });
      return;
    }

    const acStats: Array<{ difficulty: string; count: number; submissions: number }> =
      user.submitStats?.acSubmissionNum || [];
    const totalStats: Array<{ difficulty: string; count: number; submissions: number }> =
      user.submitStats?.totalSubmissionNum || [];

    const getCount = (arr: typeof acStats, difficulty: string) =>
      arr.find((s) => s.difficulty === difficulty)?.count ?? 0;
      
    const getSubmissions = (arr: typeof acStats, difficulty: string) =>
      arr.find((s) => s.difficulty === difficulty)?.submissions ?? 0;

    const totalSolved = getCount(acStats, 'All');
    const easySolved = getCount(acStats, 'Easy');
    const mediumSolved = getCount(acStats, 'Medium');
    const hardSolved = getCount(acStats, 'Hard');
    
    const totalAcceptedSubmissions = getSubmissions(acStats, 'All');
    const totalSubmissionsCount = getSubmissions(totalStats, 'All');

    const acceptanceRate =
      totalSubmissionsCount > 0
        ? parseFloat(((totalAcceptedSubmissions / totalSubmissionsCount) * 100).toFixed(1))
        : null;

    const contestRating = data.data?.userContestRanking?.rating
      ? Math.round(data.data.userContestRanking.rating)
      : null;

    const profile = {
      username: user.username,
      ranking: user.profile?.ranking ?? null,
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      totalSubmissions: totalSubmissionsCount,
      acceptanceRate,
      contestRating,
      fetchedAt: new Date().toISOString(),
    };

    cache.set(lowerUser, { data: profile, fetchedAt: Date.now() });

    res.status(200).json(profile);
  } catch (error: any) {
    console.error('Error fetching LeetCode profile:', error.message);
    res.status(500).json({ error: 'Failed to fetch LeetCode profile' });
  }
}
