import { useState } from 'react';
import { format } from 'date-fns';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';
import useStore from '../store/useStore';
import { CATEGORIES, MONTHS } from '../lib/constants';
import {
  filterTransactionsByMonth,
  filterTransactionsByYear,
  calculateTotals,
  formatCurrency,
  groupBySubcategory,
  groupByAccount,
  getMonthsInYear,
} from '../lib/utils';
import Card from '../components/atoms/Card';
import MonthPicker from '../components/molecules/MonthPicker';

const CHART_COLORS = ['#f0a83a', '#d07e6a', '#b86450', '#538ba0', '#7ea8b8', '#9a8b72', '#e8932a'];

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-forest-800 border border-forest-700/50 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-sand-400">{payload[0]?.name || payload[0]?.payload?.name}</p>
      <p className="text-sm font-semibold text-sand-100">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

export default function Analytics() {
  const { transactions } = useStore();
  const [currentMonth, setCurrentMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [view, setView] = useState('monthly');

  const year = parseInt(currentMonth.split('-')[0]);
  const monthTx = filterTransactionsByMonth(transactions, currentMonth);
  const yearTx = filterTransactionsByYear(transactions, year);
  const activeTx = view === 'monthly' ? monthTx : yearTx;

  const totals = calculateTotals(activeTx);

  // Category pie data
  const pieData = Object.entries(CATEGORIES)
    .map(([key, cat]) => ({
      name: cat.label,
      value: activeTx.filter((t) => t.category === key).reduce((s, t) => s + t.amount, 0),
      color: cat.color,
    }))
    .filter((d) => d.value > 0);

  // Subcategory breakdown for expenses
  const expenseTx = activeTx.filter((t) => ['bills', 'expenses'].includes(t.category));
  const subGroups = groupBySubcategory(expenseTx);
  const subData = Object.entries(subGroups)
    .sort((a, b) => b[1].total - a[1].total)
    .map(([name, data], i) => ({
      name,
      value: data.total,
      fill: CHART_COLORS[i % CHART_COLORS.length],
    }));

  // Monthly comparison bar chart
  const monthKeys = getMonthsInYear(year);
  const monthlyComparison = monthKeys.map((mk) => {
    const mTx = filterTransactionsByMonth(transactions, mk);
    const mTotals = calculateTotals(mTx);
    const monthIdx = parseInt(mk.split('-')[1]) - 1;
    return {
      month: MONTHS[monthIdx].slice(0, 3),
      Income: mTotals.income,
      Bills: mTx.filter((t) => t.category === 'bills').reduce((s, t) => s + t.amount, 0),
      Expenses: mTx.filter((t) => t.category === 'expenses').reduce((s, t) => s + t.amount, 0),
      Savings: mTotals.savings,
      Investments: mTotals.investments,
    };
  });

  // Radar chart - spending categories
  const radarData = Object.entries(CATEGORIES)
    .filter(([key]) => key !== 'income')
    .map(([key, cat]) => ({
      category: cat.label,
      amount: activeTx.filter((t) => t.category === key).reduce((s, t) => s + t.amount, 0),
    }));

  // Account usage bar chart
  const accGroups = groupByAccount(activeTx);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-sand-100">Analytics</h2>
          <p className="text-sm text-sand-500 mt-0.5">Deep dive into your spending patterns</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-forest-800/60 rounded-lg p-1">
            {['monthly', 'yearly'].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  view === v ? 'bg-forest-600 text-sand-100' : 'text-sand-400 hover:text-sand-200'
                }`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          <MonthPicker currentMonth={currentMonth} onChange={setCurrentMonth} />
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Income', val: totals.income, color: 'text-moss-400' },
          { label: 'Outflow', val: totals.expenses + totals.savings + totals.investments, color: 'text-rosy-400' },
          { label: 'Savings Rate', val: totals.income > 0 ? Math.round((totals.savings / totals.income) * 100) : 0, isPct: true, color: 'text-midnight-300' },
          { label: 'Net', val: totals.net, color: totals.net >= 0 ? 'text-moss-400' : 'text-rosy-400' },
        ].map(({ label, val, color, isPct }) => (
          <Card key={label}>
            <p className="text-xs text-sand-500 uppercase tracking-wider mb-1">{label}</p>
            <p className={`text-xl font-bold ${color}`}>
              {isPct ? `${val}%` : formatCurrency(val)}
            </p>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* All categories pie */}
        <Card>
          <h3 className="text-sm font-semibold text-sand-300 mb-4">Category Distribution</h3>
          {pieData.length > 0 ? (
            <>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {pieData.map((d, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-xs text-sand-400">{d.name}: {formatCurrency(d.value)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-sand-500 text-center py-16">No data available</p>
          )}
        </Card>

        {/* Expense subcategory bar */}
        <Card>
          <h3 className="text-sm font-semibold text-sand-300 mb-4">Expense Breakdown</h3>
          {subData.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#323744" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#9a8b72', fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <YAxis dataKey="name" type="category" tick={{ fill: '#9a8b72', fontSize: 11 }} width={100} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {subData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-sand-500 text-center py-16">No expenses recorded</p>
          )}
        </Card>

        {/* Monthly comparison */}
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-sand-300 mb-4">Monthly Comparison ({year})</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#323744" />
                <XAxis dataKey="month" tick={{ fill: '#9a8b72', fontSize: 12 }} />
                <YAxis tick={{ fill: '#9a8b72', fontSize: 11 }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px' }} formatter={(val) => <span className="text-sand-400">{val}</span>} />
                <Bar dataKey="Income" fill="#f0a83a" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Bills" fill="#d07e6a" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Expenses" fill="#b86450" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Savings" fill="#538ba0" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Investments" fill="#7ea8b8" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Radar */}
        <Card>
          <h3 className="text-sm font-semibold text-sand-300 mb-4">Spending Radar</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#323744" />
                <PolarAngleAxis dataKey="category" tick={{ fill: '#9a8b72', fontSize: 11 }} />
                <PolarRadiusAxis tick={{ fill: '#9a8b72', fontSize: 10 }} />
                <Radar name="Amount" dataKey="amount" stroke="#f0a83a" fill="#f0a83a" fillOpacity={0.3} />
                <Tooltip content={<ChartTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Quick Stats */}
        <Card>
          <h3 className="text-sm font-semibold text-sand-300 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-forest-700/30">
              <span className="text-sm text-sand-400">Total Transactions</span>
              <span className="text-sm font-bold text-sand-200">{activeTx.length}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-forest-700/30">
              <span className="text-sm text-sand-400">Avg. Transaction</span>
              <span className="text-sm font-bold text-sand-200">
                {activeTx.length > 0
                  ? formatCurrency(activeTx.reduce((s, t) => s + t.amount, 0) / activeTx.length)
                  : formatCurrency(0)}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-forest-700/30">
              <span className="text-sm text-sand-400">Largest Expense</span>
              <span className="text-sm font-bold text-rosy-400">
                {expenseTx.length > 0
                  ? formatCurrency(Math.max(...expenseTx.map((t) => t.amount)))
                  : formatCurrency(0)}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-forest-700/30">
              <span className="text-sm text-sand-400">Savings Rate</span>
              <span className="text-sm font-bold text-midnight-300">
                {totals.income > 0 ? Math.round((totals.savings / totals.income) * 100) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-sand-400">Investment Rate</span>
              <span className="text-sm font-bold text-moss-400">
                {totals.income > 0 ? Math.round((totals.investments / totals.income) * 100) : 0}%
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
