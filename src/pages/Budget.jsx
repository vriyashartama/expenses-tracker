import { useState } from 'react';
import { format } from 'date-fns';
import useStore from '../store/useStore';
import { CATEGORIES } from '../lib/constants';
import { filterTransactionsByMonth, formatCurrency } from '../lib/utils';
import Card from '../components/atoms/Card';
import CurrencyInput from '../components/atoms/CurrencyInput';
import Button from '../components/atoms/Button';
import ProgressBar from '../components/atoms/ProgressBar';
import MonthPicker from '../components/molecules/MonthPicker';
import { Target, Save } from 'lucide-react';

export default function Budget() {
  const { transactions, budgets, setBudget } = useStore();
  const [currentMonth, setCurrentMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [editingBudgets, setEditingBudgets] = useState({});

  const monthTx = filterTransactionsByMonth(transactions, currentMonth);

  const budgetCategories = Object.entries(CATEGORIES)
    .filter(([key]) => key !== 'income')
    .map(([key, cat]) => {
      const spent = monthTx
        .filter((t) => t.category === key)
        .reduce((s, t) => s + t.amount, 0);
      const budgetAmt = budgets[currentMonth]?.[key] || 0;
      return {
        key,
        label: cat.label,
        color: cat.color,
        spent,
        budget: budgetAmt,
        remaining: budgetAmt - spent,
        pct: budgetAmt > 0 ? Math.round((spent / budgetAmt) * 100) : 0,
      };
    });

  const totalBudget = budgetCategories.reduce((s, c) => s + c.budget, 0);
  const totalSpent = budgetCategories.reduce((s, c) => s + c.spent, 0);

  const handleSave = (categoryKey) => {
    const amount = parseFloat(editingBudgets[categoryKey]) || 0;
    setBudget(currentMonth, categoryKey, amount);
    setEditingBudgets((prev) => {
      const next = { ...prev };
      delete next[categoryKey];
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-sand-100">Budget</h2>
          <p className="text-sm text-sand-500 mt-0.5">Set and track your monthly spending limits</p>
        </div>
        <MonthPicker currentMonth={currentMonth} onChange={setCurrentMonth} />
      </div>

      {/* Overview */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Target size={18} className="text-moss-400" />
              <h3 className="text-sm font-semibold text-sand-300">Total Budget Usage</h3>
            </div>
            <p className="text-2xl font-bold text-sand-100">
              {formatCurrency(totalSpent)} <span className="text-sm font-normal text-sand-500">of {formatCurrency(totalBudget)}</span>
            </p>
          </div>
          <div className="text-right">
            <p className={`text-3xl font-bold ${totalSpent > totalBudget && totalBudget > 0 ? 'text-red-400' : 'text-moss-400'}`}>
              {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%
            </p>
            <p className="text-xs text-sand-500">used</p>
          </div>
        </div>
        <ProgressBar value={totalSpent} max={totalBudget} color="#f0a83a" />
      </Card>

      {/* Category Budgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {budgetCategories.map((cat) => {
          const isEditing = cat.key in editingBudgets;
          const isOver = cat.spent > cat.budget && cat.budget > 0;

          return (
            <Card key={cat.key}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <h4 className="text-sm font-semibold text-sand-200">{cat.label}</h4>
                </div>
                {isOver && (
                  <span className="text-xs text-red-400 font-medium">Over budget!</span>
                )}
              </div>

              <div className="flex justify-between text-sm mb-2">
                <span className="text-sand-400">
                  {formatCurrency(cat.spent)} spent
                </span>
                <span className="text-sand-500">
                  {cat.budget > 0 ? `${cat.pct}%` : 'No budget set'}
                </span>
              </div>

              <ProgressBar value={cat.spent} max={cat.budget} color={cat.color} className="mb-3" />

              <div className="flex items-center gap-2">
                <CurrencyInput
                  name={`budget-${cat.key}`}
                  value={isEditing ? editingBudgets[cat.key] : cat.budget || ''}
                  onChange={(e) =>
                    setEditingBudgets((prev) => ({ ...prev, [cat.key]: e.target.value }))
                  }
                  onFocus={() => {
                    if (!isEditing) {
                      setEditingBudgets((prev) => ({
                        ...prev,
                        [cat.key]: cat.budget || '',
                      }));
                    }
                  }}
                  className="text-xs"
                />
                {isEditing && (
                  <Button
                    size="sm"
                    variant="accent"
                    icon={Save}
                    onClick={() => handleSave(cat.key)}
                  >
                    Save
                  </Button>
                )}
              </div>

              {cat.budget > 0 && (
                <p className={`text-xs mt-2 ${isOver ? 'text-red-400' : 'text-sand-500'}`}>
                  {isOver
                    ? `${formatCurrency(cat.spent - cat.budget)} over budget`
                    : `${formatCurrency(cat.remaining)} remaining`}
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
