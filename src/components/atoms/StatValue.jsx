import { formatCurrency } from '../../lib/utils';

export default function StatValue({ label, value, trend, prefix = '', color }) {
  return (
    <div>
      <p className="text-xs font-medium text-sand-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold tracking-tight ${color || 'text-sand-100'}`}>
        {prefix}{formatCurrency(value)}
      </p>
      {trend !== undefined && (
        <p className={`text-xs mt-0.5 ${trend >= 0 ? 'text-moss-400' : 'text-rosy-400'}`}>
          {trend >= 0 ? '+' : ''}{trend}% vs last month
        </p>
      )}
    </div>
  );
}
