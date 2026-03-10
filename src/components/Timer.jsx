import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const PRESETS = [30, 60, 90, 120];

const Timer = forwardRef(function Timer(_, ref) {
  const [duration, setDuration] = useState(60);
  const [remaining, setRemaining] = useState(60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useImperativeHandle(ref, () => ({
    start() {
      setRemaining(duration);
      setRunning(true);
    },
  }));

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            setRunning(false);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, remaining]);

  const selectDuration = (secs) => {
    setDuration(secs);
    setRemaining(secs);
    setRunning(false);
  };

  const reset = () => {
    setRemaining(duration);
    setRunning(false);
  };

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const progress = duration > 0 ? remaining / duration : 0;
  const circumference = 2 * Math.PI * 52;

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="text-text-tertiary text-[11px] font-semibold uppercase tracking-widest">Rest Timer</p>

      <div className="relative w-40 h-40">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="6" />
          <circle
            cx="60" cy="60" r="52" fill="none"
            stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[42px] font-bold tabular-nums tracking-tight">
            {mins}:{secs.toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button
          onClick={reset}
          className="w-11 h-11 flex items-center justify-center rounded-full bg-fill text-text-secondary cursor-pointer active:scale-95 transition-transform"
        >
          <RotateCcw size={16} />
        </button>
        <button
          onClick={() => setRunning(!running)}
          className="w-14 h-14 flex items-center justify-center rounded-full bg-primary text-bg cursor-pointer active:scale-95 transition-transform"
        >
          {running ? <Pause size={22} /> : <Play size={22} fill="#000" className="ml-0.5" />}
        </button>
        <div className="w-11" />
      </div>

      <div className="flex gap-2">
        {PRESETS.map((s) => (
          <button
            key={s}
            onClick={() => selectDuration(s)}
            className={`px-4 py-2 rounded-full text-[13px] font-medium cursor-pointer active:scale-95 transition-all ${
              duration === s
                ? 'bg-primary text-bg'
                : 'bg-fill text-text-secondary'
            }`}
          >
            {s}s
          </button>
        ))}
      </div>
    </div>
  );
});

export default Timer;
