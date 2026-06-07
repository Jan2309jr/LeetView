import { useQuery, useQueries, useQueryClient, useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { fetchProfile, getTrackedProfiles, addTrackedProfile, removeTrackedProfile } from '../services/api';
import type { LeetCodeProfile } from '../types';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const POLL_INTERVAL = 60_000;

export function useProfiles() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Fetch the user's tracked usernames
  const { data: usernames = [] } = useQuery({
    queryKey: ['trackedProfiles'],
    queryFn: getTrackedProfiles,
    enabled: isAuthenticated,
  });

  // Fetch LeetCode stats for each tracked username
  const queries = useQueries({
    queries: usernames.map((username) => ({
      queryKey: ['profile', username],
      queryFn: () => fetchProfile(username),
      refetchInterval: POLL_INTERVAL,
      staleTime: 30_000,
      retry: 2,
      enabled: isAuthenticated,
    })),
  });

  const addMutation = useMutation({
    mutationFn: addTrackedProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trackedProfiles'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeTrackedProfile,
    onSuccess: (_, username) => {
      queryClient.invalidateQueries({ queryKey: ['trackedProfiles'] });
      queryClient.removeQueries({ queryKey: ['profile', username] });
    },
  });

  const addUsername = useCallback(
    async (username: string): Promise<boolean> => {
      if (!isAuthenticated) {
        toast.error('Please log in to track profiles');
        return false;
      }
      const lower = username.toLowerCase();
      if (usernames.map((u) => u.toLowerCase()).includes(lower)) return false;
      await addMutation.mutateAsync(username);
      return true;
    },
    [usernames, addMutation, isAuthenticated]
  );

  const removeUsername = useCallback(
    (username: string) => {
      if (!isAuthenticated) return;
      removeMutation.mutate(username);
    },
    [removeMutation, isAuthenticated]
  );

  const refreshUsername = useCallback(
    (username: string) => {
      queryClient.invalidateQueries({ queryKey: ['profile', username] });
    },
    [queryClient]
  );

  const clearAll = useCallback(() => {
    // Only implemented for local storage previously. Now managed by server.
  }, []);

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
