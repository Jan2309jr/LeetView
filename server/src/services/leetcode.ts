import axios from 'axios';

const GRAPHQL_URL = process.env.LEETCODE_GRAPHQL_URL || 'https://leetcode.com/graphql';

// Simple in-memory cache to avoid hammering LeetCode API
const cache = new Map<string, { data: LeetCodeProfile; fetchedAt: number }>();
const CACHE_TTL = parseInt(process.env.CACHE_TTL_SECONDS || '30') * 1000;

export interface LeetCodeProfile {
  username: string;
  ranking: number | null;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalSubmissions: number;
  acceptanceRate: number | null;
  contestRating: number | null;
  fetchedAt: string;
}

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
        }
        totalSubmissionNum {
          difficulty
          count
        }
      }
    }
    userContestRanking(username: $username) {
      rating
    }
  }
`;

export async function fetchLeetCodeProfile(username: string): Promise<LeetCodeProfile> {
  // Check cache first
  const cached = cache.get(username.toLowerCase());
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
    return cached.data;
  }

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
    throw new Error(data.errors[0]?.message || 'GraphQL error');
  }

  const user = data.data?.matchedUser;
  if (!user) {
    throw new UserNotFoundError(`User "${username}" not found on LeetCode`);
  }

  const acStats: Array<{ difficulty: string; count: number }> =
    user.submitStats?.acSubmissionNum || [];
  const totalStats: Array<{ difficulty: string; count: number }> =
    user.submitStats?.totalSubmissionNum || [];

  const getCount = (arr: typeof acStats, difficulty: string) =>
    arr.find((s) => s.difficulty === difficulty)?.count ?? 0;

  const totalSolved = getCount(acStats, 'All');
  const easySolved = getCount(acStats, 'Easy');
  const mediumSolved = getCount(acStats, 'Medium');
  const hardSolved = getCount(acStats, 'Hard');
  const totalSubmissions = getCount(totalStats, 'All');

  const acceptanceRate =
    totalSubmissions > 0
      ? parseFloat(((totalSolved / totalSubmissions) * 100).toFixed(1))
      : null;

  const contestRating = data.data?.userContestRanking?.rating
    ? Math.round(data.data.userContestRanking.rating)
    : null;

  const profile: LeetCodeProfile = {
    username: user.username,
    ranking: user.profile?.ranking ?? null,
    totalSolved,
    easySolved,
    mediumSolved,
    hardSolved,
    totalSubmissions,
    acceptanceRate,
    contestRating,
    fetchedAt: new Date().toISOString(),
  };

  cache.set(username.toLowerCase(), { data: profile, fetchedAt: Date.now() });
  return profile;
}

export class UserNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserNotFoundError';
  }
}
