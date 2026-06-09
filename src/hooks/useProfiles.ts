import { useQueries, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState, useEffect } from 'react';
import { fetchProfile } from '../services/api';
import type { LeetCodeProfile } from '../types';
import toast from 'react-hot-toast';

const POLL_INTERVAL = 60_000;
const STORAGE_KEY = 'leetview_tracked_profiles';

export function useProfiles() {
  const queryClient = useQueryClient();
  const [usernames, setUsernames] = useState<string[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUsernames(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored profiles');
      }
    }
  }, []);

  // Save to local storage whenever usernames change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usernames));
  }, [usernames]);

  // Fetch LeetCode stats for each tracked username
  const queries = useQueries({
    queries: usernames.map((username) => ({
      queryKey: ['profile', username],
      queryFn: () => fetchProfile(username),
      refetchInterval: POLL_INTERVAL,
      staleTime: 30_000,
      retry: 2,
    })),
  });

  const addUsername = useCallback(
    async (username: string): Promise<boolean> => {
      const lower = username.toLowerCase();
      if (usernames.map((u) => u.toLowerCase()).includes(lower)) {
        toast.error('User already tracked');
        return false;
      }
      setUsernames((prev) => [...prev, username]);
      toast.success(`Added ${username}`);
      return true;
    },
    [usernames]
  );

  const removeUsername = useCallback(
    (username: string) => {
      setUsernames((prev) => prev.filter((u) => u.toLowerCase() !== username.toLowerCase()));
      queryClient.removeQueries({ queryKey: ['profile', username] });
      toast.success(`Removed ${username}`);
    },
    [queryClient]
  );

  const refreshUsername = useCallback(
    async (username: string) => {
      try {
        await queryClient.fetchQuery({
          queryKey: ['profile', username],
          queryFn: () => fetchProfile(username, true),
        });
        toast.success(`Refreshed ${username}`);
      } catch (err) {
        toast.error(`Failed to refresh ${username}`);
      }
    },
    [queryClient]
  );

  const clearAll = useCallback(() => {
    setUsernames([]);
    queryClient.clear();
    toast.success('Cleared all tracked profiles');
  }, [queryClient]);

  const profiles = usernames.map((username, i) => {
    const q = queries[i];
    return {
      username,
      data: (q?.data as LeetCodeProfile) ?? null,
      isLoading: q?.isLoading ?? false,
      isFetching: q?.isFetching ?? false,
      error: q?.error ? (q.error as Error).message : null,
      fetchedAt: (q?.data as LeetCodeProfile)?.fetchedAt ?? null,
    };
  });

  return { profiles, usernames, addUsername, removeUsername, refreshUsername, clearAll };
}
