import { Users, Target, TrendingUp, Trophy, Crown } from 'lucide-react';
import type { LeetCodeProfile } from '../types';

interface StatsCardsProps {
  profiles: Array<{ username: string; data: LeetCodeProfile | null }>;
}

export function StatsCards({ profiles }: StatsCardsProps) {
  const loaded = profiles.filter((p) => p.data !== null);

  const stats = {
    totalSolved: loaded.reduce((sum, p) => sum + (p.data?.totalSolved || 0), 0),
    avgAcceptance: loaded.length
      ? loaded.reduce((sum, p) => sum + (p.data?.acceptanceRate || 0), 0) / loaded.length
      : 0,
    topPerformer: loaded.reduce(
      (best, current) =>
        (current.data?.totalSolved || 0) > (best?.data?.totalSolved || 0) ? current : best,
      null as typeof profiles[0] | null
    ),
    contestLeader: loaded.reduce(
      (best, current) =>
        (current.data?.contestRating || 0) > (best?.data?.contestRating || 0) ? current : best,
      null as typeof profiles[0] | null
    ),
  };

  const formatNumber = (n: number) => new Intl.NumberFormat().format(n);
  const formatAcceptance = (n: number) => (n > 0 ? `${n.toFixed(1)}%` : '—');

  return (
    <div className="space-y-4">
      {/* 4 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total profiles */}
        <div className="card p-5 flex flex-col justify-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ecfdf5] flex items-center justify-center shrink-0 border border-[#a7f3d0]/50">
              <Users className="w-5 h-5 text-[#059669]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Profiles Tracked</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-gray-900 leading-none">{profiles.length}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">{loaded.length} loaded</p>
            </div>
          </div>
        </div>

        {/* Total Solved */}
        <div className="card p-5 flex flex-col justify-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100/50">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Total Solved</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-gray-900 leading-none">
                  {formatNumber(stats.totalSolved)}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-1">Across all profiles</p>
            </div>
          </div>
        </div>

        {/* Avg acceptance */}
        <div className="card p-5 flex flex-col justify-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100/50">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Avg Acceptance</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-gray-900 leading-none">
                  {formatAcceptance(stats.avgAcceptance)}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-1">Average rate</p>
            </div>
          </div>
        </div>

        {/* Top performer */}
        <div className="card p-5 flex flex-col justify-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center shrink-0 border border-yellow-100/50">
              <Trophy className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Top Performer</p>
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-bold text-[#059669] truncate leading-none">
                  {stats.topPerformer?.username ?? '—'}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.topPerformer?.data?.totalSolved
                  ? `${formatNumber(stats.topPerformer.data.totalSolved)} solved`
                  : 'Waiting for data...'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contest Rating Leader Banner */}
      {stats.contestLeader && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#f2fcf6] via-white to-[#f2fcf6] border border-[#e1f0e8] py-8 px-6 shadow-sm flex flex-col items-center justify-center text-center">
          
          {/* Left Laurel */}
          <svg className="absolute left-6 top-1/2 -translate-y-1/2 w-16 h-40 text-[#b5ddc5] opacity-50" viewBox="0 0 100 200" fill="currentColor">
            <path d="M40,180 C20,150 10,110 20,70 C30,30 60,10 90,0 C80,20 60,40 40,60 C20,80 10,120 40,180 Z" />
            <path d="M50,160 C30,130 25,90 40,50 C50,20 80,5 100,0 C85,25 65,45 50,65 C30,85 25,120 50,160 Z" transform="translate(-15, -20) scale(0.8)" />
            <path d="M60,140 C40,110 40,70 60,30 C70,10 90,0 110,0 C90,30 70,50 60,70 C40,90 40,120 60,140 Z" transform="translate(-25, -40) scale(0.6)" />
          </svg>

          {/* Right Laurel */}
          <svg className="absolute right-6 top-1/2 -translate-y-1/2 w-16 h-40 text-[#b5ddc5] opacity-50 scale-x-[-1]" viewBox="0 0 100 200" fill="currentColor">
            <path d="M40,180 C20,150 10,110 20,70 C30,30 60,10 90,0 C80,20 60,40 40,60 C20,80 10,120 40,180 Z" />
            <path d="M50,160 C30,130 25,90 40,50 C50,20 80,5 100,0 C85,25 65,45 50,65 C30,85 25,120 50,160 Z" transform="translate(-15, -20) scale(0.8)" />
            <path d="M60,140 C40,110 40,70 60,30 C70,10 90,0 110,0 C90,30 70,50 60,70 C40,90 40,120 60,140 Z" transform="translate(-25, -40) scale(0.6)" />
          </svg>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-3 text-yellow-600 ring-4 ring-white shadow-sm">
              <Crown className="w-6 h-6" />
            </div>
            
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
              Contest Rating Leader
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 tracking-tight">
              {stats.contestLeader.username}
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#059669] leading-none">
                {Math.round(stats.contestLeader.data?.contestRating || 0)}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-widest">
              Contest Rating
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
