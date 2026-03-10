import { LayoutDashboard, Dumbbell, BookOpen, TrendingUp } from 'lucide-react';

const tabs = [
  { id: 'dashboard', label: 'Today', icon: LayoutDashboard },
  { id: 'workout', label: 'Workout', icon: Dumbbell },
  { id: 'library', label: 'Library', icon: BookOpen },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
];

export default function BottomNav({ active, onNavigate }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-2xl border-t border-separator">
      <div className="flex justify-around items-center h-20 max-w-lg mx-auto pb-[env(safe-area-inset-bottom)]">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className="flex flex-col items-center justify-center gap-1.5 min-w-[64px] cursor-pointer"
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2 : 1.5}
                className={isActive ? 'text-primary' : 'text-text-tertiary'}
              />
              <span className={`text-[10px] font-medium ${
                isActive ? 'text-primary' : 'text-text-tertiary'
              }`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
