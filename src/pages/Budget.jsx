import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Target, Save, TrendingUp, TrendingDown, Wallet, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import CurrencyInput from '@/components/ui/currency-input';
import MonthPicker from '@/components/ui/month-picker';
import useStore from '@/store/useStore';
import { CATEGORIES } from '@/lib/constants';
import { filterTransactionsByMonth, formatCurrency } from '@/lib/utils';

export default function Budget() {
  const { transactions, budgets, setBudget } = useStore();
  const [currentMonth, setCurrentMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [editingBudgets, setEditingBudgets] = useState({});

  const monthTx = useMemo(() => filterTransactionsByMonth(transactions, currentMonth), [transactions, currentMonth]);

  const income = useMemo(() =>
    monthTx.filter((t) => t.category === 'income').reduce((s, t) => s + t.amount, 0),
  [monthTx]);

  const budgetCategories = useMemo(() =>
    Object.entries(CATEGORIES)
      .filter(([key]) => key !== 'income' && key !== 'transfer')
      .map(([key, cat]) => {
        const spent = monthTx.filter((t) => t.category === key).reduce((s, t) => s + t.amount, 0);
        const budgetAmt = budgets[currentMonth]?.[key] || 0;
        const pctSpent = budgetAmt > 0 ? Math.round((spent / budgetAmt) * 100) : 0;
        return {
          key, label: cat.label, color: cat.color, spent, budget: budgetAmt,
          remaining: budgetAmt - spent,
          pct: Math.min(pctSpent, 100),
          pctRaw: pctSpent,
          isOver: spent > budgetAmt && budgetAmt > 0,
        };
      }),
  [monthTx, budgets, currentMonth]);

  const totalBudget = budgetCategories.reduce((s, c) => s + c.budget, 0);
  const totalSpent = budgetCategories.reduce((s, c) => s + c.spent, 0);
  const totalPct = totalBudget > 0 ? Math.min(Math.round((totalSpent / totalBudget) * 100), 100) : 0;
  const unallocated = income - totalBudget;
  const budgetPctOfIncome = income > 0 ? Math.round((totalBudget / income) * 100) : 0;

  const handleSave = (categoryKey) => {
    setBudget(currentMonth, categoryKey, parseFloat(editingBudgets[categoryKey]) || 0);
    setEditingBudgets((prev) => { const next = { ...prev }; delete next[categoryKey]; return next; });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Budget</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Set and track your monthly spending limits</p>
        </div>
        <MonthPicker value={currentMonth} onChange={setCurrentMonth} />
      </div>

      {/* Income & Allocation Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Income</p>
                <p className="text-xl font-bold tabular-nums text-chart-1">{formatCurrency(income)}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-chart-1/15 flex items-center justify-center">
                <TrendingUp size={18} className="text-chart-1" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Budget</p>
                <p className="text-xl font-bold tabular-nums">{formatCurrency(totalBudget)}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                <Target size={18} className="text-muted-foreground" />
              </div>
            </div>
            {income > 0 && <p className="text-xs text-muted-foreground mt-1">{budgetPctOfIncome}% of income</p>}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Spent</p>
                <p className={`text-xl font-bold tabular-nums ${totalSpent > totalBudget && totalBudget > 0 ? 'text-destructive' : ''}`}>{formatCurrency(totalSpent)}</p>
              </div>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${totalSpent > totalBudget && totalBudget > 0 ? 'bg-destructive/15' : 'bg-muted'}`}>
                <TrendingDown size={18} className={totalSpent > totalBudget && totalBudget > 0 ? 'text-destructive' : 'text-muted-foreground'} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Unallocated</p>
                <p className={`text-xl font-bold tabular-nums ${unallocated < 0 ? 'text-destructive' : 'text-chart-1'}`}>{formatCurrency(unallocated)}</p>
              </div>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${unallocated < 0 ? 'bg-destructive/15' : 'bg-chart-1/15'}`}>
                <Wallet size={18} className={unallocated < 0 ? 'text-destructive' : 'text-chart-1'} />
              </div>
            </div>
            {unallocated < 0 && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertTriangle size={10} /> Over-allocated</p>}
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardContent className="pt-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Target size={18} className="text-chart-1" />
                <h3 className="text-sm font-semibold">Total Budget Usage</h3>
              </div>
              <p className="text-2xl font-bold">
                {formatCurrency(totalSpent)}{' '}
                <span className="text-sm font-normal text-muted-foreground">of {formatCurrency(totalBudget)}</span>
              </p>
            </div>
            <div className="text-right">
              <p className={`text-3xl font-bold ${totalSpent > totalBudget && totalBudget > 0 ? 'text-destructive' : 'text-chart-1'}`}>
                {totalPct}%
              </p>
              <p className="text-xs text-muted-foreground">used</p>
            </div>
          </div>
          <Progress value={totalPct} className="h-2" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {budgetCategories.map((cat) => {
          const isEditing = cat.key in editingBudgets;
          return (
            <Card key={cat.key}>
              <CardContent className="pt-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <h4 className="text-sm font-semibold">{cat.label}</h4>
                  </div>
                  {cat.isOver && <span className="text-xs text-destructive font-medium">Over budget!</span>}
                </div>

                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">{formatCurrency(cat.spent)} spent</span>
                  <span className="text-muted-foreground">
                    {cat.budget > 0
                      ? cat.pctRaw > 100 ? `${cat.pctRaw}% (over!)` : `${cat.pct}%`
                      : 'No budget set'}
                  </span>
                </div>

                <div className="h-2 rounded-full overflow-hidden mb-3">
                  <Progress value={cat.pct} className="h-2" style={{ '--progress-color': cat.isOver ? 'var(--destructive)' : cat.color }} />
                </div>

                <div className="flex items-center gap-2">
                  <CurrencyInput
                    name={`budget-${cat.key}`}
                    value={isEditing ? editingBudgets[cat.key] : cat.budget || ''}
                    onChange={(e) => setEditingBudgets((prev) => ({ ...prev, [cat.key]: e.target.value }))}
                    onFocus={() => { if (!isEditing) setEditingBudgets((prev) => ({ ...prev, [cat.key]: cat.budget || '' })); }}
                    className="text-xs h-8"
                  />
                  {isEditing && (
                    <Button size="sm" className="h-8" onClick={() => handleSave(cat.key)}>
                      <Save size={14} /> Save
                    </Button>
                  )}
                </div>

                {cat.budget > 0 && (
                  <p className={`text-xs mt-2 ${cat.isOver ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {cat.isOver ? `${formatCurrency(cat.spent - cat.budget)} over budget` : `${formatCurrency(cat.remaining)} remaining`}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
