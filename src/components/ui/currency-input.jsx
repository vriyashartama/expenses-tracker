import { useCallback, useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

function formatDisplay(value) {
  if (!value && value !== 0) return '';
  const num = String(value).replace(/\D/g, '');
  if (!num) return '';
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function parseValue(formatted) {
  return formatted.replace(/\./g, '');
}

export default function CurrencyInput({ value, onChange, name, className, ...props }) {
  const [display, setDisplay] = useState(() => formatDisplay(value));

  const handleChange = useCallback((e) => {
    const raw = parseValue(e.target.value);
    if (raw && !/^\d+$/.test(raw)) return;
    setDisplay(formatDisplay(raw));
    onChange?.({ target: { name, value: raw } });
  }, [name, onChange]);

  const handleBlur = useCallback(() => {
    setDisplay(formatDisplay(value));
  }, [value]);

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium pointer-events-none">
        Rp
      </span>
      <Input
        type="text"
        inputMode="numeric"
        name={name}
        value={display}
        onChange={handleChange}
        onBlur={handleBlur}
        className={cn('pl-10 tabular-nums', className)}
        placeholder="0"
        {...props}
      />
    </div>
  );
}
