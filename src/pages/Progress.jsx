import { useState } from 'react';
import { TrendingUp, Target, Flame, Zap, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import ProgressChart from '../components/ProgressChart';
import { useProgressData, useWeeklyStats, useWorkoutHistory } from '../lib/hooks';

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.getTime() === today.getTime()) return 'Today';
  if (d.getTime() === yesterday.getTime()) return 'Yesterday';
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function Progress() {
  const data = useProgressData(30);
  const stats = useWeeklyStats();
  const history = useWorkoutHistory(30);
  const totalVolume = data?.reduce((sum, d) => sum + d.volume, 0) || 0;
  const [expandedDate, setExpandedDate] = useState(null);

  return (
    <div className="flex flex-col gap-8 pt-16">
      <div>
        <p className="text-text-secondary text-[13px] font-medium">Last 30 days</p>
        <h1 className="text-[32px] font-bold tracking-tight leading-tight mt-1">Progress</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: TrendingUp, value: totalVolume.toLocaleString(), label: 'Total Volume' },
          { icon: Flame, value: stats?.workoutDays || 0, label: 'Days Active' },
          { icon: Target, value: stats?.totalSets || 0, label: 'Sets Done' },
          { icon: Zap, value: stats?.totalReps || 0, label: 'Total Reps' },
        ].map(({ icon: Icon, value, label }) => (
          <GlassCard key={label}>
            <div className="p-5">
              <Icon size={20} strokeWidth={1.5} className="text-text-tertiary mb-3" />
              <p className="text-[22px] font-bold tabular-nums">{value}</p>
              <p className="text-[11px] text-text-tertiary font-medium uppercase tracking-wider mt-1">{label}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Chart */}
      <GlassCard>
        <div className="p-6">
          <h2 className="text-[15px] font-semibold mb-6">Volume Over Time</h2>
          <ProgressChart data={data} />
        </div>
      </GlassCard>

      {/* Workout History */}
      <div>
        <h2 className="text-[15px] font-semibold mb-4">Workout History</h2>

        {(!history || history.length === 0) ? (
          <GlassCard>
            <div className="p-8 text-center">
              <Calendar size={24} className="text-text-tertiary mx-auto mb-3" />
              <p className="text-text-secondary text-[14px]">No workouts logged yet</p>
              <p className="text-text-tertiary text-[13px] mt-1">Complete a workout to see your history</p>
            </div>
          </GlassCard>
        ) : (
          <div className="flex flex-col gap-3">
            {history.map((day) => {
              const isExpanded = expandedDate === day.date;
              return (
                <GlassCard key={day.date} onClick={() => setExpandedDate(isExpanded ? null : day.date)}>
                  <div className="p-4">
                    <div className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="text-[15px] font-semibold">{formatDate(day.date)}</p>
                        <p className="text-text-tertiary text-[13px] mt-0.5 tabular-nums">
                          {day.totalSets} sets · {day.totalReps} reps
                        </p>
                      </div>
                      <div className="text-text-tertiary">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-separator flex flex-col gap-2.5">
                        {day.exercises.map((ex, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-[13px] text-text-secondary">{ex.name}</span>
                            <span className="text-[13px] text-text-tertiary tabular-nums">
                              {ex.sets}×{ex.reps.join(', ')}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
