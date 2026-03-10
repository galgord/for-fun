import Dexie from 'dexie';
import { SEED_DATA } from './data/workouts';

export const db = new Dexie('CyberGymDB');

// v4: new routine (Push/Pull/Core), removed images
db.version(4).stores({
  workouts: '++id, name, dayOfWeek',
  exercises: '++id, workoutId, name',
  logs: '++id, exerciseId, createdAt',
  generatedImages: null,
});

db.on('populate', async () => {
  for (const workout of SEED_DATA) {
    const workoutId = await db.workouts.add({
      name: workout.name,
      dayOfWeek: workout.dayOfWeek,
    });
    for (const exercise of workout.exercises) {
      await db.exercises.add({
        workoutId,
        name: exercise.name,
        baseReps: exercise.baseReps,
        baseSets: exercise.baseSets,
        instructions: exercise.instructions,
        muscles: exercise.muscles,
        tips: exercise.tips,
        mistakes: exercise.mistakes,
        youtubeId: exercise.youtubeId,
      });
    }
  }
});
