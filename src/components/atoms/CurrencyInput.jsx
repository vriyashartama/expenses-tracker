import { useState, useCallback } from 'react';

function formatDisplay(value) {
  if (!value && value !== 0) return '';
  const num = String(value).replace(/\D/g, '');
  if (!num) return '';
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function parseValue(formatted) {
  return formatted.replace(/\./g, '');
}

export default function CurrencyInput({ label, value, onChange, name, className = '', ...props }) {
  const [display, setDisplay] = useState(() => formatDisplay(value));

  const handleChange = useCallback((e) => {
    const raw = parseValue(e.target.value);
    if (raw && !/^\d+$/.test(raw)) return;
    setDisplay(formatDisplay(raw));
    if (onChange) {
      const syntheticEvent = {
        target: { name, value: raw },
      };
      onChange(syntheticEvent);
    }
  }, [name, onChange]);

  const handleBlur = useCallback(() => {
    setDisplay(formatDisplay(value));
  }, [value]);

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-medium text-sand-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-sand-500 font-medium">
          Rp
        </span>
        <input
          type="text"
          inputMode="numeric"
          name={name}
          value={display}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full bg-forest-900/60 border border-forest-600/50 rounded-lg pl-10 pr-3 py-2.5 text-sm text-sand-100 placeholder-sand-600 focus:outline-none focus:ring-2 focus:ring-moss-500/50 focus:border-moss-500 transition-all tabular-nums ${className}`}
          placeholder="0"
          {...props}
        />
      </div>
    </div>
  );
}
