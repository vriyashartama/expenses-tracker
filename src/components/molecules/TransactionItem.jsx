import { Trash2, Pencil } from 'lucide-react';
import { ACCOUNTS, CATEGORIES } from '../../lib/constants';
import { formatCurrency, formatDate } from '../../lib/utils';
import Badge from '../atoms/Badge';

export default function TransactionItem({ transaction, onEdit, onDelete }) {
  const { date, category, subcategory, account, amount, description } = transaction;
  const cat = CATEGORIES[category];
  const acc = ACCOUNTS.find((a) => a.id === account);
  const isIncome = category === 'income';

  return (
    <div className="group flex items-center gap-4 p-3 rounded-xl hover:bg-forest-700/30 transition-colors">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold"
        style={{ backgroundColor: `${cat?.color}25`, color: cat?.color }}
      >
        {cat?.label?.charAt(0)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-medium text-sand-100 truncate">
            {subcategory}
          </p>
          <Badge color={acc?.color || '#888'}>{acc?.name}</Badge>
        </div>
        <p className="text-xs text-sand-500 truncate">
          {description || 'No description'} · {formatDate(date)}
        </p>
      </div>

      <p
        className={`text-sm font-semibold tabular-nums whitespace-nowrap ${
          isIncome ? 'text-moss-400' : 'text-rosy-400'
        }`}
      >
        {isIncome ? '+' : '-'}{formatCurrency(amount)}
      </p>

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(transaction)}
          className="p-1.5 rounded-lg hover:bg-forest-600/50 text-sand-400 hover:text-sand-200 transition-colors cursor-pointer"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => onDelete(transaction.id)}
          className="p-1.5 rounded-lg hover:bg-red-900/30 text-sand-400 hover:text-red-400 transition-colors cursor-pointer"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
