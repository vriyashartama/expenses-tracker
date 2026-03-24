import TransactionItem from '../molecules/TransactionItem';
import EmptyState from '../atoms/EmptyState';
import { Receipt } from 'lucide-react';

export default function TransactionList({ transactions, onEdit, onDelete }) {
  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title="No transactions yet"
        description="Add your first transaction to start tracking your finances."
      />
    );
  }

  const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="divide-y divide-forest-700/30">
      {sorted.map((tx) => (
        <TransactionItem
          key={tx.id}
          transaction={tx}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
