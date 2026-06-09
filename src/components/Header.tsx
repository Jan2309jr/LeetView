import { Activity } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#eaf0ec] shadow-sm text-[var(--color-brand-dark)]">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#0e4735]">
          <Activity className="w-6 h-6" />
          <h1 className="text-xl font-bold tracking-tight">LeetCode Tracker</h1>
        </div>
      </div>
    </header>
  );
}
