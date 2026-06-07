import { useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Header } from './components/Header';
import { UrlInput } from './components/UrlInput';
import { BulkImport } from './components/BulkImport';
import { StatsCards } from './components/StatsCards';
import { ProfileTable } from './components/ProfileTable';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { useAuth } from './contexts/AuthContext';
import { useState } from 'react';
import { useProfiles } from './hooks/useProfiles';

export default function App() {
  const { profiles, usernames, addUsername, removeUsername, refreshUsername } = useProfiles();
  const { isAuthenticated } = useAuth();
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login',
  });
  const queryClient = useQueryClient();

  const handleAdd = useCallback(
    async (username: string) => {
      return await addUsername(username);
    },
    [addUsername]
  );

  const handleAddMany = useCallback(
    async (usernameList: string[]): Promise<{ added: number; skipped: number }> => {
      let added = 0;
      let skipped = 0;
      await Promise.allSettled(
        usernameList.map(async (u) => {
          try {
            const ok = await addUsername(u);
            if (ok) added++;
            else skipped++;
          } catch (error) {
            skipped++;
          }
        })
      );
      // Trigger React Query to load all newly added profiles
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      return { added, skipped };
    },
    [addUsername, queryClient]
  );

  return (
    <div className="min-h-screen bg-[#f3f7f5] transition-colors duration-300">
      <Header
        onLoginClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
        onSignupClick={() => setAuthModal({ isOpen: true, mode: 'register' })}
      />
      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
      />

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        {profiles.length === 0 ? (
          <>
            <LandingPage />
            {isAuthenticated && (
              <div className="space-y-4 mt-8 animate-fade-in">
                <UrlInput onAdd={handleAdd} existingUsernames={usernames} />
                <BulkImport onAddMany={handleAddMany} />
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <UrlInput onAdd={handleAdd} existingUsernames={usernames} />
            <BulkImport onAddMany={handleAddMany} />
            
            <div className="pt-4">
              <StatsCards profiles={profiles} />
            </div>
            
            <div className="pt-4">
              <ProfileTable
                profiles={profiles}
                onDelete={removeUsername}
                onRefresh={refreshUsername}
              />
            </div>
          </div>
        )}
      </main>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
        }}
      />
    </div>
  );
}
