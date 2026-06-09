import axios from 'axios';
import type { LeetCodeProfile } from '../types';

// Points to the Vercel serverless function (api/profile.ts)
const BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({ baseURL: BASE_URL, timeout: 15000 });

export async function fetchProfile(username: string): Promise<LeetCodeProfile> {
  const { data } = await api.get<LeetCodeProfile>(`/api/profile?username=${encodeURIComponent(username)}`);
  return data;
}
