import { LineChart, Users, BarChart3, Trophy } from 'lucide-react';

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

export function LandingPage() {
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

          <div className="relative z-10 hidden lg:block">
            {/* The decorative asterisk */}
            <div className="absolute top-0 right-10 text-[#2a6d54] opacity-80" style={{ fontSize: '20rem', lineHeight: 1, marginTop: '-5rem' }}>
              *
            </div>
            {/* Floating Card */}
            <div className="relative card p-8 bg-white shadow-xl rotate-2 ml-auto max-w-sm mr-8">
              <div className="inline-flex p-2 bg-emerald-50 rounded-xl mb-4">
                <LineChart className="w-6 h-6 text-[var(--color-brand-dark)]" />
              </div>
              <h3 className="text-base font-bold text-[var(--color-brand-dark)] mb-2">Real-time Progress Tracking</h3>
              <p className="text-sm text-gray-500 mb-6">
                Get live updates on your solved problems, streaks, and contest performance.
              </p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white text-xs font-bold -mr-2 ring-2 ring-white">←</div>
                <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 text-xs font-bold -mr-2 ring-2 ring-white">U</div>
                <div className="w-8 h-8 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-700 text-xs font-bold -mr-2 ring-2 ring-white">M</div>
                <div className="w-8 h-8 rounded-full bg-yellow-200 flex items-center justify-center text-yellow-700 text-xs font-bold -mr-2 ring-2 ring-white">S</div>
                <div className="w-8 h-8 rounded-full bg-[var(--color-brand-dark)] flex items-center justify-center text-white text-xs font-bold ring-2 ring-white">+3</div>
              </div>
              <p className="text-xs text-gray-400 mt-4">7 profiles tracking live</p>
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
