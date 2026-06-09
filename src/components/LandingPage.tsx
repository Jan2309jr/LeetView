import { LineChart, Users, BarChart3, Trophy } from 'lucide-react';
import { UrlInput } from './UrlInput';
import { BulkImport } from './BulkImport';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="card p-6 border-transparent hover:border-[#eaf0ec] transition-colors bg-white">
      <div className="mb-4">
        <div className="inline-flex p-3 bg-emerald-50 rounded-xl">
          {icon}
        </div>
      </div>
      <h3 className="text-sm font-bold text-[var(--color-brand-dark)] mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

interface LandingPageProps {
  onAdd: (username: string) => Promise<boolean>;
  existingUsernames: string[];
  onAddMany: (usernames: string[]) => Promise<{ added: number; skipped: number }>;
}

export function LandingPage({ onAdd, existingUsernames, onAddMany }: LandingPageProps) {
  return (
    <div className="flex flex-col animate-fade-in w-full pb-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#f2f8f5] to-[#e4f1ea] px-8 py-16 sm:px-16 sm:py-24 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="z-10">
            <p className="text-sm font-semibold text-[var(--color-brand-dark)] mb-6 border-b border-[var(--color-brand-dark)] inline-block pb-1">
              Welcome to LeetCode Tracker
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--color-brand-dark)] leading-tight mb-4">
              Track your progress.<br />
              <span className="font-[cursive] italic text-[var(--color-brand-600)] font-normal">Crack your goals.</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md">
              Monitor your LeetCode journey, analyze performance, and stay consistent every day.
            </p>
          </div>

          <div className="relative z-10 w-full max-w-lg mx-auto lg:mx-0 lg:ml-auto">
            <div className="space-y-4">
              <UrlInput onAdd={onAdd} existingUsernames={existingUsernames} />
              <BulkImport onAddMany={onAddMany} />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-[var(--color-brand-dark)] inline-block border-b-2 border-[var(--color-brand-dark)] pb-2">
          Everything you need to stay ahead
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard
          icon={<LineChart className="w-5 h-5 text-[var(--color-brand-600)]" />}
          title="Live Stats"
          description="Track your real-time progress with live data and analytics."
        />
        <FeatureCard
          icon={<Users className="w-5 h-5 text-[var(--color-brand-600)]" />}
          title="Multiple Profiles"
          description="Add and manage multiple profiles in one place."
        />
        <FeatureCard
          icon={<BarChart3 className="w-5 h-5 text-[var(--color-brand-600)]" />}
          title="Detailed Insights"
          description="Analyze strengths, weaknesses, and improvement areas."
        />
        <FeatureCard
          icon={<Trophy className="w-5 h-5 text-[var(--color-brand-600)]" />}
          title="Stay Consistent"
          description="Build streaks, track contests, and stay motivated."
        />
      </div>
    </div>
  );
}
