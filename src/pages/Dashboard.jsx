import { Play, ChevronRight, Flame, Target, Zap } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { useTodayWorkout, useWeeklyStats, useTodayLogs } from '../lib/hooks';
import { DAY_NAMES } from '../data/workouts';

export default function Dashboard({ onNavigate, onStartWorkout }) {
  const workout = useTodayWorkout();
  const stats = useWeeklyStats();
  const todayLogs = useTodayLogs();
  const dayName = DAY_NAMES[new Date().getDay()];
  const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;
  const todayCompleted = todayLogs?.length || 0;

  return (
    <div className="flex flex-col gap-8 pt-16">
      {/* Header */}
      <div>
        <p className="text-text-secondary text-[13px] font-medium">{dayName}</p>
        <h1 className="text-[32px] font-bold tracking-tight leading-tight mt-1">
          {isWeekend ? 'Rest Day' : "Today's Training"}
        </h1>
      </div>

      {/* Hero Workout Card */}
      {!isWeekend && workout && (
        <GlassCard>
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-text-tertiary text-[11px] font-semibold uppercase tracking-widest mb-1.5">
                  {workout.exercises.length} exercises
                </p>
                <h2 className="text-[22px] font-bold">{workout.name}</h2>
              </div>
              <button
                onClick={() => onStartWorkout(workout.id)}
                className="w-14 h-14 rounded-full bg-primary flex items-center justify-center cursor-pointer active:scale-95 transition-transform shrink-0"
              >
                <Play size={20} fill="#000" className="text-bg ml-0.5" />
              </button>
            </div>

            <div className="flex flex-col">
              {workout.exercises.map((ex, i) => {
                const isLogged = todayLogs?.some((l) => l.exerciseId === ex.id);
                const isLast = i === workout.exercises.length - 1;
                return (
                  <div
                    key={ex.id}
                    className={`flex items-center justify-between py-4 ${
                      !isLast ? 'border-b border-separator' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`text-[13px] font-semibold tabular-nums w-5 ${
                        isLogged ? 'text-success' : 'text-text-tertiary'
                      }`}>
                        {isLogged ? '✓' : i + 1}
                      </span>
                      <span className={`text-[15px] font-medium ${
                        isLogged ? 'text-text-tertiary line-through' : 'text-text'
                      }`}>
                        {ex.name}
                      </span>
                    </div>
                    <span className="text-text-tertiary text-[13px] tabular-nums">
                      {ex.baseSets} × {ex.baseReps > 0 ? ex.baseReps : 'fail'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </GlassCard>
      )}

      {isWeekend && (
        <GlassCard>
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-fill flex items-center justify-center mx-auto mb-5">
              <Target size={28} className="text-success" />
            </div>
            <h2 className="text-[20px] font-bold">Recovery Day</h2>
            <p className="text-text-secondary text-[15px] mt-3 max-w-[260px] mx-auto leading-relaxed">
              Your muscles grow during rest. Stretch, hydrate, come back stronger.
            </p>
          </div>
        </GlassCard>
      )}

      {/* Weekly Stats */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-semibold">This Week</h3>
          <button
            onClick={() => onNavigate('progress')}
            className="flex items-center gap-0.5 text-[13px] text-text-secondary font-medium cursor-pointer"
          >
            See All <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Flame, value: stats?.workoutDays || 0, label: 'Days', color: 'text-warning' },
            { icon: Target, value: stats?.totalSets || 0, label: 'Sets', color: 'text-text' },
            { icon: Zap, value: stats?.totalReps || 0, label: 'Reps', color: 'text-text' },
          ].map(({ icon: Icon, value, label, color }) => (
            <GlassCard key={label}>
              <div className="p-5 flex flex-col items-center gap-3">
                <Icon size={20} strokeWidth={1.5} className={color} />
                <span className="text-[22px] font-bold tabular-nums">{value}</span>
                <span className="text-[11px] text-text-tertiary font-medium uppercase tracking-wider">{label}</span>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Start CTA */}
      {!isWeekend && workout && (
        <button
          onClick={() => onStartWorkout(workout.id)}
          className="w-full h-14 rounded-2xl bg-primary text-bg font-semibold text-[15px] cursor-pointer active:scale-[0.98] transition-transform"
        >
          {todayCompleted > 0 ? 'Continue Training' : 'Start Training'}
        </button>
      )}
    </div>
  );
}
