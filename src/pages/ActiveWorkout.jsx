import { useState, useRef, useCallback } from 'react';
import { ArrowLeft, Check, ChevronDown, ChevronUp, Trash2, Pencil } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Timer from '../components/Timer';
import RepInput from '../components/RepInput';
import SetTracker from '../components/SetTracker';
import Toast from '../components/Toast';
import { useWorkoutById } from '../lib/hooks';
import { db } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';

export default function ActiveWorkout({ workoutId, onBack }) {
  const workout = useWorkoutById(workoutId);
  const [expandedExercise, setExpandedExercise] = useState(null);
  const [reps, setReps] = useState({});
  const [editingLog, setEditingLog] = useState(null);
  const [editReps, setEditReps] = useState(0);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const timerRef = useRef(null);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayLogs = useLiveQuery(async () => {
    if (!workout) return [];
    const exerciseIds = workout.exercises.map((e) => e.id);
    return db.logs
      .where('createdAt')
      .aboveOrEqual(todayStart.toISOString())
      .filter((log) => exerciseIds.includes(log.exerciseId))
      .toArray();
  }, [workout]);

  const showToast = useCallback((message) => {
    setToast({ visible: true, message });
  }, []);

  const hideToast = useCallback(() => {
    setToast({ visible: false, message: '' });
  }, []);

  if (!workout) {
    return <div className="flex items-center justify-center h-64 text-text-secondary">Loading...</div>;
  }

  const getExerciseLogs = (exerciseId) =>
    todayLogs?.filter((l) => l.exerciseId === exerciseId) || [];

  const getCompletedSets = (exerciseId) => getExerciseLogs(exerciseId).length;

  const getRepsValue = (exerciseId, baseReps) => reps[exerciseId] ?? baseReps;

  const completeSet = async (exercise) => {
    await db.logs.add({
      exerciseId: exercise.id,
      repsCompleted: getRepsValue(exercise.id, exercise.baseReps),
      setsCompleted: 1,
      createdAt: new Date().toISOString(),
    });
    showToast('Set logged');
    timerRef.current?.start();
  };

  const deleteLog = async (logId) => {
    await db.logs.delete(logId);
    showToast('Set removed');
  };

  const startEdit = (log) => {
    setEditingLog(log.id);
    setEditReps(log.repsCompleted);
  };

  const saveEdit = async () => {
    if (editingLog) {
      await db.logs.update(editingLog, { repsCompleted: editReps });
      setEditingLog(null);
      showToast('Reps updated');
    }
  };

  const totalSets = workout.exercises.reduce((s, e) => s + e.baseSets, 0);
  const completedSets = workout.exercises.reduce((s, e) => s + getCompletedSets(e.id), 0);
  const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
  const allDone = completedSets >= totalSets;

  return (
    <div className="flex flex-col gap-6 pt-16">
      <Toast message={toast.message} visible={toast.visible} onHide={hideToast} />

      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="w-11 h-11 flex items-center justify-center rounded-full bg-card text-text-secondary cursor-pointer active:scale-95 transition-transform"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h1 className="text-[22px] font-bold">{workout.name}</h1>
          <p className="text-text-tertiary text-[13px] mt-0.5 tabular-nums">
            {completedSets} of {totalSets} sets
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-fill rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Timer */}
      <GlassCard>
        <div className="p-6">
          <Timer ref={timerRef} />
        </div>
      </GlassCard>

      {/* Exercises */}
      <div className="flex flex-col gap-4">
        {workout.exercises.map((exercise, index) => {
          const logs = getExerciseLogs(exercise.id);
          const completed = logs.length;
          const isDone = completed >= exercise.baseSets;
          const isExpanded = expandedExercise === exercise.id;

          return (
            <GlassCard key={exercise.id}>
              <div className="p-5">
                <button
                  onClick={() => setExpandedExercise(isExpanded ? null : exercise.id)}
                  className="w-full flex items-center gap-4 cursor-pointer"
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 ${
                    isDone ? 'bg-success/15 text-success' : 'bg-fill text-text-tertiary'
                  }`}>
                    {isDone ? <Check size={16} /> : index + 1}
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`text-[15px] font-semibold ${isDone ? 'text-text-tertiary' : 'text-text'}`}>
                      {exercise.name}
                    </p>
                    <div className="mt-1.5">
                      <SetTracker total={exercise.baseSets} completed={completed} />
                    </div>
                  </div>
                  <div className="text-text-tertiary">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="mt-5 pt-5 border-t border-separator">
                    {/* Logged sets */}
                    {logs.length > 0 && (
                      <div className="flex flex-col gap-2 mb-5">
                        {logs.map((log, i) => (
                          <div key={log.id} className="flex items-center justify-between bg-fill rounded-xl"
                            style={{ padding: '10px 14px' }}
                          >
                            {editingLog === log.id ? (
                              <div className="flex items-center gap-3 flex-1">
                                <span className="text-[13px] text-text-tertiary">Set {i + 1}:</span>
                                <RepInput
                                  value={editReps}
                                  onChange={setEditReps}
                                  compact
                                />
                                <button
                                  onClick={saveEdit}
                                  className="px-3 py-1.5 rounded-lg bg-success/15 text-success text-[12px] font-semibold cursor-pointer active:scale-95 transition-transform"
                                >
                                  Save
                                </button>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center gap-2">
                                  <Check size={14} className="text-success" />
                                  <span className="text-[13px] text-text-secondary">
                                    Set {i + 1}: <span className="text-text font-semibold">{log.repsCompleted} reps</span>
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => startEdit(log)}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-text-tertiary cursor-pointer active:scale-95 transition-transform"
                                  >
                                    <Pencil size={14} />
                                  </button>
                                  <button
                                    onClick={() => deleteLog(log.id)}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-destructive/60 cursor-pointer active:scale-95 transition-transform"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Input for next set */}
                    {!isDone && (
                      <div className="flex flex-col items-center gap-5">
                        <p className="text-text-secondary text-[13px] text-center leading-relaxed">
                          {exercise.instructions}
                        </p>
                        <RepInput
                          label="Reps"
                          value={getRepsValue(exercise.id, exercise.baseReps)}
                          onChange={(v) => setReps({ ...reps, [exercise.id]: v })}
                        />
                        <button
                          onClick={() => completeSet(exercise)}
                          className="w-full h-12 rounded-xl bg-fill text-text font-semibold text-[14px] border border-border cursor-pointer active:bg-card-hover transition-colors"
                        >
                          Complete Set {completed + 1} of {exercise.baseSets}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>

      {allDone && (
        <button
          onClick={onBack}
          className="w-full h-14 rounded-2xl bg-success text-bg font-bold text-[15px] cursor-pointer active:scale-[0.98] transition-transform"
        >
          Workout Complete
        </button>
      )}
    </div>
  );
}
