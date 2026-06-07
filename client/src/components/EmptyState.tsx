import { LayoutDashboard } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center animate-fade-in">
      {/* Illustration */}
      <div className="relative mb-6">
        <div className="w-28 h-28 bg-brand-50 dark:bg-brand-900/20 rounded-3xl flex items-center justify-center">
          <LayoutDashboard className="w-14 h-14 text-brand-400 dark:text-brand-500" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center text-base">
          📊
        </div>
        <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center text-base">
          🏆
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
        No profiles added yet.
      </h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-xs text-sm leading-relaxed">
        Paste a LeetCode profile URL to begin tracking. Your data will be saved and updated automatically every 60 seconds.
      </p>

      {/* Sample URLs hint */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-left max-w-sm w-full">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
          Example URLs
        </p>
        {['https://leetcode.com/u/john_doe/', 'https://leetcode.com/u/neal_wu/'].map((url) => (
          <p key={url} className="text-xs text-brand-600 dark:text-brand-400 font-mono truncate">
            {url}
          </p>
        ))}
      </div>
    </div>
  );
}
