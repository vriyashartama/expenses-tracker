export default function ProgressBar({ value, max, color = '#4a7c4a', className = '' }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const isOver = value > max && max > 0;

  return (
    <div className={`w-full ${className}`}>
      <div className="h-2 rounded-full bg-forest-900/60 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${pct}%`,
            backgroundColor: isOver ? '#ef4444' : color,
          }}
        />
      </div>
    </div>
  );
}
