import { CATEGORIES } from '../../lib/constants';
import { formatCurrency } from '../../lib/utils';
import ProgressBar from '../atoms/ProgressBar';

export default function BudgetRow({ category, spent, budget }) {
  const cat = CATEGORIES[category];
  if (!cat) return null;
  const pct = budget > 0 ? Math.round((spent / budget) * 100) : 0;
  const isOver = spent > budget && budget > 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: cat.color }}
          />
          <span className="text-sm font-medium text-sand-200">{cat.label}</span>
        </div>
        <div className="flex items-center gap-2 text-xs tabular-nums">
          <span className={isOver ? 'text-red-400 font-semibold' : 'text-sand-300'}>
            {formatCurrency(spent)}
          </span>
          <span className="text-sand-600">/</span>
          <span className="text-sand-500">{formatCurrency(budget)}</span>
          {budget > 0 && (
            <span className={`font-medium ${isOver ? 'text-red-400' : 'text-sand-400'}`}>
              ({pct}%)
            </span>
          )}
        </div>
      </div>
      <ProgressBar value={spent} max={budget} color={cat.color} />
    </div>
  );
}
