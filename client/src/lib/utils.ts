import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractUsername(url: string): string | null {
  // Handles: https://leetcode.com/u/john_doe/ or https://leetcode.com/john_doe/
  const trimmed = url.trim();
  const patterns = [
    /leetcode\.com\/u\/([a-zA-Z0-9_-]+)\/?/,
    /leetcode\.com\/([a-zA-Z0-9_-]+)\/?/,
  ];
  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) return match[1];
  }
  // If they just typed a username directly (no URL)
  if (/^[a-zA-Z0-9_-]{2,50}$/.test(trimmed)) return trimmed;
  return null;
}

export function formatNumber(n: number | null | undefined): string {
  if (n == null) return '—';
  return n.toLocaleString();
}

export function formatRating(n: number | null | undefined): string {
  if (n == null) return '—';
  return n.toFixed(0);
}

export function formatAcceptance(n: number | null | undefined): string {
  if (n == null) return '—';
  return `${n.toFixed(1)}%`;
}
