import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import ExerciseDetail from '../components/ExerciseDetail';
import { useAllWorkouts } from '../lib/hooks';
import { DAY_NAMES } from '../data/workouts';

export default function ExerciseLibrary() {
  const workouts = useAllWorkouts();
  const [activeDay, setActiveDay] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);

  if (!workouts) {
    return <div className="flex items-center justify-center h-64 text-text-secondary">Loading...</div>;
  }

  const filtered = activeDay !== null
    ? workouts.filter((w) => w.dayOfWeek === activeDay)
    : workouts;

  return (
    <div className="flex flex-col gap-8 pt-16">
      <div>
        <p className="text-text-secondary text-[13px] font-medium">Browse</p>
        <h1 className="text-[32px] font-bold tracking-tight leading-tight mt-1">Exercises</h1>
      </div>

      {/* Day filter */}
      <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-1 px-1">
        <button
          onClick={() => setActiveDay(null)}
          className={`px-4 py-2.5 rounded-full text-[13px] font-medium whitespace-nowrap cursor-pointer active:scale-95 transition-all shrink-0 ${
            activeDay === null
              ? 'bg-primary text-bg'
              : 'bg-card text-text-secondary'
          }`}
        >
          All
        </button>
        {workouts.map((w) => (
          <button
            key={w.dayOfWeek}
            onClick={() => setActiveDay(w.dayOfWeek === activeDay ? null : w.dayOfWeek)}
            className={`px-4 py-2.5 rounded-full text-[13px] font-medium whitespace-nowrap cursor-pointer active:scale-95 transition-all shrink-0 ${
              activeDay === w.dayOfWeek
                ? 'bg-primary text-bg'
                : 'bg-card text-text-secondary'
            }`}
          >
            {DAY_NAMES[w.dayOfWeek].slice(0, 3)}
          </button>
        ))}
      </div>

      {/* Exercise list */}
      {filtered.map((workout) => (
        <div key={workout.id} className="flex flex-col gap-3">
          <h2 className="text-[13px] font-semibold text-text-tertiary uppercase tracking-wider">
            {DAY_NAMES[workout.dayOfWeek]} — {workout.name}
          </h2>

          {workout.exercises.map((exercise) => (
            <GlassCard
              key={exercise.id}
              onClick={() => setSelectedExercise(exercise)}
            >
              <div className="flex items-center gap-4" style={{ padding: '16px 20px' }}>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-semibold truncate">{exercise.name}</h3>
                  <p className="text-text-tertiary text-[13px] mt-0.5 tabular-nums">
                    {exercise.baseSets} × {exercise.baseReps > 0 ? exercise.baseReps : 'failure'}
                    {exercise.muscles ? ` · ${exercise.muscles[0]}` : ''}
                  </p>
                </div>

                <ChevronRight size={16} className="text-text-tertiary shrink-0" />
              </div>
            </GlassCard>
          ))}
        </div>
      ))}

      {/* Detail modal */}
      {selectedExercise && (
        <ExerciseDetail
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}
    </div>
  );
}
