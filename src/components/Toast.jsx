import { useEffect } from 'react';
import { Check } from 'lucide-react';

export default function Toast({ message, visible, onHide }) {
  useEffect(() => {
    if (visible) {
      const t = setTimeout(onHide, 2000);
      return () => clearTimeout(t);
    }
  }, [visible, onHide]);

  if (!visible) return null;

  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-[200] animate-toast">
      <div className="flex items-center gap-2.5 bg-card border border-border rounded-full shadow-lg"
        style={{ padding: '10px 20px' }}
      >
        <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
          <Check size={12} className="text-success" />
        </div>
        <span className="text-[13px] font-medium text-text">{message}</span>
      </div>
    </div>
  );
}
