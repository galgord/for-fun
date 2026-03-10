export default function GlassCard({ children, className = '', onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl bg-card
        ${onClick ? 'cursor-pointer active:bg-card-hover transition-colors duration-150' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
