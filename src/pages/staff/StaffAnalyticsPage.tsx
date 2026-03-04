import React from 'react';
import { BarChart3, CheckCircle2, Clock, Star, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/api/supabase';
import { useAuthStore } from '../../lib/stores/useAuthStore';

export default function StaffAnalyticsPage() {
  const session = useAuthStore((s) => s.session);
  const userId = session?.user?.id;

  const { data: stats, isLoading } = useQuery({
    queryKey: ['staff', 'my-analytics', userId],
    queryFn: async () => {
      const { data: requests, error } = await supabase
        .from('service_requests')
        .select('id, status, rating, feedback, created_at, completed_at')
        .eq('assigned_to', userId!);
      if (error) throw error;

      const all = requests || [];
      const completed = all.filter(r => r.status === 'completed');
      const ratings = completed.filter(r => r.rating != null);
      const avgRating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / ratings.length : null;

      // Average resolution time
      const resolutionTimes = completed
        .filter(r => r.completed_at && r.created_at)
        .map(r => (new Date(r.completed_at!).getTime() - new Date(r.created_at).getTime()) / (1000 * 60));
      const avgResolution = resolutionTimes.length > 0 ? resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length : null;

      return {
        total: all.length,
        completed: completed.length,
        pending: all.filter(r => r.status === 'pending').length,
        inProgress: all.filter(r => ['assigned', 'in-progress'].includes(r.status)).length,
        avgRating,
        avgResolutionMinutes: avgResolution,
        recentFeedback: completed.filter(r => r.feedback).slice(-5).reverse(),
      };
    },
    enabled: !!userId,
    staleTime: 60_000,
  });

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
  }

  const formatTime = (mins: number | null) => {
    if (mins == null) return '—';
    if (mins < 60) return `${Math.round(mins)}m`;
    return `${(mins / 60).toFixed(1)}h`;
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <h1 className="text-xl font-bold text-gray-900">My Performance</h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 text-accent"><BarChart3 className="w-5 h-5" /><span className="text-2xl font-bold">{stats?.total || 0}</span></div>
          <p className="text-sm text-gray-600 mt-1">Total Assigned</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 text-green-600"><CheckCircle2 className="w-5 h-5" /><span className="text-2xl font-bold">{stats?.completed || 0}</span></div>
          <p className="text-sm text-gray-600 mt-1">Completed</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 text-amber-600"><Star className="w-5 h-5" /><span className="text-2xl font-bold">{stats?.avgRating?.toFixed(1) || '—'}</span></div>
          <p className="text-sm text-gray-600 mt-1">Avg Rating</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 text-blue-600"><Clock className="w-5 h-5" /><span className="text-2xl font-bold">{formatTime(stats?.avgResolutionMinutes ?? null)}</span></div>
          <p className="text-sm text-gray-600 mt-1">Avg Resolution</p>
        </div>
      </div>

      {/* Recent Feedback */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Guest Feedback</h3>
        {stats?.recentFeedback && stats.recentFeedback.length > 0 ? (
          <div className="space-y-3">
            {stats.recentFeedback.map((r: any) => (
              <div key={r.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-1 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < (r.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-sm text-gray-700">{r.feedback}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No feedback yet. Complete requests and guests will be able to rate your service.</p>
        )}
      </div>
    </div>
  );
}
