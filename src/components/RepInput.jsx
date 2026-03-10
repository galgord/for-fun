import { Minus, Plus } from 'lucide-react';

export default function RepInput({ value, onChange, label, compact }) {
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-card text-text-secondary cursor-pointer active:scale-95 transition-all"
        >
          <Minus size={14} />
        </button>
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (!isNaN(v) && v >= 0) onChange(v);
          }}
          className="w-12 h-7 text-center bg-card rounded-lg text-text text-[14px] font-bold tabular-nums outline-none"
        />
        <button
          onClick={() => onChange(value + 1)}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-card text-text-secondary cursor-pointer active:scale-95 transition-all"
        >
          <Plus size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-5">
      {label && <span className="text-text-tertiary text-[13px] font-medium w-10">{label}</span>}
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-14 h-14 flex items-center justify-center rounded-full bg-fill text-text-secondary cursor-pointer active:scale-95 active:bg-card-hover transition-all"
      >
        <Minus size={20} />
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => {
          const v = parseInt(e.target.value, 10);
          if (!isNaN(v) && v >= 0) onChange(v);
        }}
        className="w-20 h-14 text-center bg-fill rounded-2xl text-text text-[24px] font-bold tabular-nums outline-none focus:ring-2 focus:ring-white/20 transition-all"
      />
      <button
        onClick={() => onChange(value + 1)}
        className="w-14 h-14 flex items-center justify-center rounded-full bg-fill text-text-secondary cursor-pointer active:scale-95 active:bg-card-hover transition-all"
      >
        <Plus size={20} />
      </button>
    </div>
  );
}
