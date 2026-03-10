import { X } from 'lucide-react';

export default function ExerciseDetail({ exercise, onClose }) {
  if (!exercise) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Sheet */}
      <div
        className="relative w-full max-w-lg bg-card rounded-t-3xl overflow-hidden"
        style={{ maxHeight: '92vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-fill text-text-secondary cursor-pointer active:scale-95 transition-transform z-10"
        >
          <X size={16} />
        </button>

        <div className="overflow-y-auto" style={{ maxHeight: 'calc(92vh - 40px)' }}>
          <div style={{ padding: '24px 24px 40px' }}>
            {/* Header */}
            <h2 className="text-[22px] font-bold">{exercise.name}</h2>
            <p className="text-text-tertiary text-[13px] mt-1 tabular-nums">
              {exercise.baseSets} {exercise.baseSets === 1 ? 'set' : 'sets'} {exercise.baseReps > 0 ? `x ${exercise.baseReps} reps` : '· to failure'}
            </p>
            <p className="text-text-tertiary text-[12px] mt-0.5 font-medium tracking-wide">
              TEMPO 3-0-1-1
            </p>

            {/* Muscles */}
            {exercise.muscles && (
              <div className="flex flex-wrap gap-2 mt-4">
                {exercise.muscles.map((m) => (
                  <span
                    key={m}
                    className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary bg-fill rounded-full"
                    style={{ padding: '6px 12px' }}
                  >
                    {m}
                  </span>
                ))}
              </div>
            )}

            {/* How to */}
            <div className="mt-6">
              <h3 className="text-[13px] font-semibold text-text-tertiary uppercase tracking-wider mb-2">
                How to perform
              </h3>
              <p className="text-[15px] text-text-secondary leading-relaxed">
                {exercise.instructions}
              </p>
            </div>

            {/* Tips */}
            {exercise.tips && (
              <div className="mt-5">
                <h3 className="text-[13px] font-semibold text-text-tertiary uppercase tracking-wider mb-2">
                  Tips
                </h3>
                <p className="text-[15px] text-text-secondary leading-relaxed">
                  {exercise.tips}
                </p>
              </div>
            )}

            {/* Common mistakes */}
            {exercise.mistakes && (
              <div className="mt-5">
                <h3 className="text-[13px] font-semibold text-text-tertiary uppercase tracking-wider mb-2">
                  Common mistakes
                </h3>
                <p className="text-[15px] text-destructive/80 leading-relaxed">
                  {exercise.mistakes}
                </p>
              </div>
            )}

            {/* YouTube embed */}
            {exercise.youtubeId && (
              <div className="mt-6">
                <h3 className="text-[13px] font-semibold text-text-tertiary uppercase tracking-wider mb-3">
                  Video Tutorial
                </h3>
                <div className="w-full rounded-2xl overflow-hidden bg-bg" style={{ aspectRatio: '16/9' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${exercise.youtubeId}?rel=0`}
                    title={`${exercise.name} tutorial`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
