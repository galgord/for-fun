import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

export function useTodayWorkout() {
  const dayOfWeek = new Date().getDay(); // 0=Sun, 1=Mon...
  return useLiveQuery(async () => {
    if (dayOfWeek === 0 || dayOfWeek === 6) return null; // Weekend
    const workout = await db.workouts.where('dayOfWeek').equals(dayOfWeek).first();
    if (!workout) return null;
    const exercises = await db.exercises.where('workoutId').equals(workout.id).toArray();
    return { ...workout, exercises };
  }, [dayOfWeek]);
}

export function useWorkoutById(workoutId) {
  return useLiveQuery(async () => {
    if (!workoutId) return null;
    const workout = await db.workouts.get(workoutId);
    if (!workout) return null;
    const exercises = await db.exercises.where('workoutId').equals(workout.id).toArray();
    return { ...workout, exercises };
  }, [workoutId]);
}

export function useAllWorkouts() {
  return useLiveQuery(async () => {
    const workouts = await db.workouts.orderBy('dayOfWeek').toArray();
    const result = [];
    for (const w of workouts) {
      const exercises = await db.exercises.where('workoutId').equals(w.id).toArray();
      result.push({ ...w, exercises });
    }
    return result;
  });
}

export function useTodayLogs() {
  return useLiveQuery(async () => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return db.logs.where('createdAt').aboveOrEqual(startOfDay.toISOString()).toArray();
  });
}

export function useExerciseLogs(exerciseId) {
  return useLiveQuery(
    () => db.logs.where('exerciseId').equals(exerciseId).toArray(),
    [exerciseId]
  );
}

export function useProgressData(days = 30) {
  return useLiveQuery(async () => {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const logs = await db.logs.where('createdAt').aboveOrEqual(since.toISOString()).toArray();

    const byDate = {};
    for (const log of logs) {
      const date = log.createdAt.split('T')[0];
      if (!byDate[date]) byDate[date] = 0;
      byDate[date] += log.repsCompleted * log.setsCompleted;
    }

    return Object.entries(byDate)
      .map(([date, volume]) => ({ date, volume }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [days]);
}

export function useWorkoutHistory(days = 30) {
  return useLiveQuery(async () => {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const logs = await db.logs.where('createdAt').aboveOrEqual(since.toISOString()).toArray();
    if (!logs.length) return [];

    const exercises = await db.exercises.toArray();
    const exerciseMap = Object.fromEntries(exercises.map((e) => [e.id, e]));

    // Group by date
    const byDate = {};
    for (const log of logs) {
      const date = log.createdAt.split('T')[0];
      if (!byDate[date]) byDate[date] = [];
      byDate[date].push(log);
    }

    return Object.entries(byDate)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, dateLogs]) => {
        // Group by exercise
        const byExercise = {};
        for (const log of dateLogs) {
          if (!byExercise[log.exerciseId]) byExercise[log.exerciseId] = [];
          byExercise[log.exerciseId].push(log);
        }

        const exerciseSummaries = Object.entries(byExercise).map(([exId, exLogs]) => {
          const ex = exerciseMap[Number(exId)];
          return {
            name: ex?.name || 'Unknown',
            sets: exLogs.length,
            reps: exLogs.map((l) => l.repsCompleted),
            totalReps: exLogs.reduce((s, l) => s + l.repsCompleted, 0),
          };
        });

        return {
          date,
          totalSets: dateLogs.length,
          totalReps: dateLogs.reduce((s, l) => s + l.repsCompleted, 0),
          exercises: exerciseSummaries,
        };
      });
  }, [days]);
}

export function useWeeklyStats() {
  return useLiveQuery(async () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const logs = await db.logs.where('createdAt').aboveOrEqual(startOfWeek.toISOString()).toArray();
    const totalReps = logs.reduce((sum, l) => sum + l.repsCompleted, 0);
    const workoutDays = new Set(logs.map((l) => l.createdAt.split('T')[0])).size;

    return { totalReps, workoutDays, totalSets: logs.length };
  });
}