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

export interface TrackedProfile {
  username: string;
  addedAt: string;
  data: LeetCodeProfile | null;
  isLoading: boolean;
  error: string | null;
}
