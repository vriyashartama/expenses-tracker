export default function Select({ label, options, className = '', ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-medium text-sand-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        className={`w-full bg-forest-900/60 border border-forest-600/50 rounded-lg px-3 py-2.5 text-sm text-sand-100 focus:outline-none focus:ring-2 focus:ring-moss-500/50 focus:border-moss-500 transition-all appearance-none cursor-pointer ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
