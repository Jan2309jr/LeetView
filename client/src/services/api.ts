import axios from 'axios';
import type { LeetCodeProfile } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({ baseURL: BASE_URL, timeout: 15000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('leetcode_tracker_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function loginUser(username: string, password: string) {
  const res = await api.post('/api/auth/login', { username, password });
  return res.data;
}

export async function registerUser(username: string, password: string) {
  const res = await api.post('/api/auth/register', { username, password });
  return res.data;
}

export async function fetchProfile(username: string): Promise<LeetCodeProfile> {
  const { data } = await api.get<LeetCodeProfile>(`/api/profile/${encodeURIComponent(username)}`);
  return data;
}

export async function getTrackedProfiles(): Promise<string[]> {
  const { data } = await api.get<string[]>('/api/tracked');
  return data;
}

export async function addTrackedProfile(username: string): Promise<void> {
  await api.post('/api/tracked', { username });
}

export async function removeTrackedProfile(username: string): Promise<void> {
  await api.delete(`/api/tracked/${encodeURIComponent(username)}`);
}

export async function bulkAddTrackedProfiles(usernames: string[]): Promise<{ added: number; skipped: number }> {
  const { data } = await api.post('/api/tracked/bulk', { usernames });
  return data;
}
