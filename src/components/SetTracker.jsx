export default function SetTracker({ total, completed }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex gap-1.5">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              i < completed ? 'bg-success' : 'bg-fill'
            }`}
          />
        ))}
      </div>
      <span className="text-text-tertiary text-[11px] tabular-nums font-medium">
        {completed}/{total}
      </span>
    </div>
  );
}
