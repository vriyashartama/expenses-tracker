import { ACCOUNTS } from '../../lib/constants';
import { formatCurrency } from '../../lib/utils';
import Card from '../atoms/Card';

export default function AccountCard({ accountId, balance }) {
  const account = ACCOUNTS.find((a) => a.id === accountId);
  if (!account) return null;

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
          style={{ backgroundColor: `${account.color}25`, color: account.color }}
        >
          {account.name.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-sand-200 truncate">{account.name}</p>
          <p className="text-xs text-sand-500">{account.type}</p>
        </div>
        <p className="text-sm font-bold text-sand-100 tabular-nums">
          {formatCurrency(balance)}
        </p>
      </div>
    </Card>
  );
}
