import { Activity, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

export function Header({ onLoginClick, onSignupClick }: HeaderProps) {
  const { isAuthenticated, username, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#eaf0ec] shadow-sm text-[var(--color-brand-dark)]">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#0e4735]">
          <Activity className="w-6 h-6" />
          <h1 className="text-xl font-bold tracking-tight">LeetCode Tracker</h1>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 text-sm font-medium bg-[#f3f7f5] text-[#0e4735] px-3 py-1.5 rounded-full border border-[#d1e5db]">
                <User className="w-4 h-4" />
                <span>{username}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onLoginClick}
                className="text-sm font-semibold text-[#0e4735] hover:text-[#115e45] px-3 py-1.5 transition-colors"
              >
                Log in
              </button>
              <button
                onClick={onSignupClick}
                className="text-sm font-semibold bg-[#0e4735] hover:bg-[#115e45] text-white px-4 py-1.5 rounded-lg shadow-sm transition-colors"
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
