import { useState } from 'react';
import { format } from 'date-fns';
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  BarChart3,
  DollarSign,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  AreaChart, Area,
} from 'recharts';
import useStore from '../store/useStore';
import { CATEGORIES, ACCOUNTS, MONTHS } from '../lib/constants';
import {
  filterTransactionsByMonth,
  calculateTotals,
  formatCurrency,
  groupBySubcategory,
  calculatePercentages,
  getMonthsInYear,
  filterTransactionsByYear,
} from '../lib/utils';
import Card from '../components/atoms/Card';
import StatValue from '../components/atoms/StatValue';
import MonthPicker from '../components/molecules/MonthPicker';
import AccountCard from '../components/molecules/AccountCard';

const PIE_COLORS = ['#d07e6a', '#b86450', '#538ba0', '#7ea8b8', '#9a8b72', '#f0a83a', '#e8932a'];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="bg-forest-800 border border-forest-700/50 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-sand-400">{name}</p>
      <p className="text-sm font-semibold text-sand-100">{formatCurrency(value)}</p>
    </div>
  );
}

export default function Dashboard() {
  const { transactions } = useStore();
  const [currentMonth, setCurrentMonth] = useState(format(new Date(), 'yyyy-MM'));

  const monthTx = filterTransactionsByMonth(transactions, currentMonth);
  const totals = calculateTotals(monthTx);
  const pct = calculatePercentages(totals);

  // Category breakdown for pie chart
  const categoryData = Object.entries(CATEGORIES)
    .filter(([key]) => key !== 'income')
    .map(([key, cat]) => {
      const total = monthTx
        .filter((t) => t.category === key)
        .reduce((s, t) => s + t.amount, 0);
      return { name: cat.label, value: total, color: cat.color };
    })
    .filter((d) => d.value > 0);

  // Account balances
  const accountBalances = ACCOUNTS.map((acc) => {
    const income = transactions
      .filter((t) => t.account === acc.id && t.category === 'income')
      .reduce((s, t) => s + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.account === acc.id && t.category !== 'income')
      .reduce((s, t) => s + t.amount, 0);
    return { accountId: acc.id, balance: income - expenses };
  });

  // Monthly trend for the year
  const year = currentMonth.split('-')[0];
  const monthKeys = getMonthsInYear(parseInt(year));
  const trendData = monthKeys.map((mk) => {
    const mTx = filterTransactionsByMonth(transactions, mk);
    const mTotals = calculateTotals(mTx);
    const monthIdx = parseInt(mk.split('-')[1]) - 1;
    return {
      month: MONTHS[monthIdx].slice(0, 3),
      Income: mTotals.income,
      Expenses: mTotals.expenses,
      Savings: mTotals.savings,
    };
  });

  // Top spending subcategories
  const expenseTx = monthTx.filter((t) => ['bills', 'expenses'].includes(t.category));
  const subGroups = groupBySubcategory(expenseTx);
  const topSpending = Object.entries(subGroups)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-sand-100">Dashboard</h2>
          <p className="text-sm text-sand-500 mt-0.5">Your financial overview at a glance</p>
        </div>
        <MonthPicker currentMonth={currentMonth} onChange={setCurrentMonth} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-start justify-between">
            <StatValue label="Income" value={totals.income} color="text-moss-400" />
            <div className="w-9 h-9 rounded-xl bg-moss-600/20 flex items-center justify-center">
              <TrendingUp size={18} className="text-moss-400" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-start justify-between">
            <StatValue label="Expenses" value={totals.expenses} color="text-rosy-400" />
            <div className="w-9 h-9 rounded-xl bg-rosy-600/20 flex items-center justify-center">
              <TrendingDown size={18} className="text-rosy-400" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-start justify-between">
            <StatValue label="Savings" value={totals.savings} color="text-midnight-300" />
            <div className="w-9 h-9 rounded-xl bg-midnight-600/20 flex items-center justify-center">
              <PiggyBank size={18} className="text-midnight-300" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-start justify-between">
            <StatValue label="Net Balance" value={totals.net} color={totals.net >= 0 ? 'text-moss-400' : 'text-rosy-400'} />
            <div className="w-9 h-9 rounded-xl bg-sand-600/20 flex items-center justify-center">
              <DollarSign size={18} className="text-sand-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Allocation Percentages */}
      {totals.income > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-sand-300 mb-4">Budget Allocation</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Expenses', pct: pct.expenses, color: '#d07e6a' },
              { label: 'Savings', pct: pct.savings, color: '#538ba0' },
              { label: 'Investments', pct: pct.investments, color: '#7ea8b8' },
            ].map(({ label, pct: p, color }) => (
              <div key={label} className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-2">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#22262f"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={color}
                      strokeWidth="3"
                      strokeDasharray={`${p}, 100`}
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-sand-200">
                    {p}%
                  </span>
                </div>
                <p className="text-xs text-sand-400">{label}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Spending Breakdown Pie */}
        <Card>
          <h3 className="text-sm font-semibold text-sand-300 mb-4">Spending Breakdown</h3>
          {categoryData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 justify-center mt-2">
                {categoryData.map((d, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-xs text-sand-400">{d.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-sand-500 text-center py-12">No expenses this month</p>
          )}
        </Card>

        {/* Top Spending */}
        <Card>
          <h3 className="text-sm font-semibold text-sand-300 mb-4">Top Spending</h3>
          {topSpending.length > 0 ? (
            <div className="space-y-3">
              {topSpending.map(([name, data], i) => {
                const maxVal = topSpending[0][1].total;
                const widthPct = (data.total / maxVal) * 100;
                return (
                  <div key={name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-sand-300">{name}</span>
                      <span className="text-sand-400 tabular-nums">{formatCurrency(data.total)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-forest-900/60 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${widthPct}%`,
                          backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-sand-500 text-center py-12">No spending this month</p>
          )}
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card>
        <h3 className="text-sm font-semibold text-sand-300 mb-4">Monthly Trend ({year})</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f0a83a" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f0a83a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d07e6a" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#d07e6a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#323744" />
              <XAxis dataKey="month" tick={{ fill: '#9a8b72', fontSize: 12 }} axisLine={false} />
              <YAxis tick={{ fill: '#9a8b72', fontSize: 12 }} axisLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '12px' }}
                formatter={(val) => <span className="text-sand-400">{val}</span>}
              />
              <Area type="monotone" dataKey="Income" stroke="#f0a83a" fill="url(#incomeGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="Expenses" stroke="#d07e6a" fill="url(#expenseGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Accounts */}
      <div>
        <h3 className="text-sm font-semibold text-sand-300 mb-3">Account Balances</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {accountBalances.map((ab) => (
            <AccountCard key={ab.accountId} {...ab} />
          ))}
        </div>
      </div>
    </div>
  );
}
