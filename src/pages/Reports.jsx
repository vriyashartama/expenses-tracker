import { useState } from 'react';
import { format } from 'date-fns';
import { Download, FileSpreadsheet, Calendar, TrendingUp, TrendingDown, Scale } from 'lucide-react';
import useStore from '../store/useStore';
import { CATEGORIES, ACCOUNTS, MONTHS } from '../lib/constants';
import {
  filterTransactionsByMonth,
  filterTransactionsByYear,
  calculateTotals,
  formatCurrency,
  groupByCategory,
  groupBySubcategory,
  groupByAccount,
  getMonthsInYear,
} from '../lib/utils';
import { exportToExcel } from '../lib/excel';
import Card from '../components/atoms/Card';
import Button from '../components/atoms/Button';
import Badge from '../components/atoms/Badge';
import Select from '../components/atoms/Select';

export default function Reports() {
  const { transactions } = useStore();
  const [reportType, setReportType] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const years = [...new Set(transactions.map((t) => new Date(t.date).getFullYear()))];
  if (!years.includes(selectedYear)) years.push(selectedYear);
  years.sort((a, b) => b - a);

  const monthOpts = MONTHS.map((m, i) => ({
    value: `${selectedYear}-${String(i + 1).padStart(2, '0')}`,
    label: `${m} ${selectedYear}`,
  }));

  const yearOpts = years.map((y) => ({ value: y, label: String(y) }));

  const activeTx =
    reportType === 'monthly'
      ? filterTransactionsByMonth(transactions, selectedMonth)
      : filterTransactionsByYear(transactions, selectedYear);

  const totals = calculateTotals(activeTx);
  const catGroups = groupByCategory(activeTx);
  const accGroups = groupByAccount(activeTx);

  // Monthly breakdown for yearly report
  const monthlyBreakdown = reportType === 'yearly'
    ? getMonthsInYear(selectedYear).map((mk) => {
        const mTx = filterTransactionsByMonth(transactions, mk);
        const mTotals = calculateTotals(mTx);
        const monthIdx = parseInt(mk.split('-')[1]) - 1;
        return { month: MONTHS[monthIdx], ...mTotals, txCount: mTx.length };
      })
    : [];

  const handleExport = () => {
    const label = reportType === 'monthly'
      ? format(new Date(selectedMonth + '-01'), 'MMMM-yyyy')
      : String(selectedYear);
    exportToExcel(activeTx, `fintrack-report-${label}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-sand-100">Reports</h2>
          <p className="text-sm text-sand-500 mt-0.5">Financial audit and summary reports</p>
        </div>
        <Button icon={Download} onClick={handleExport}>
          Export to Excel
        </Button>
      </div>

      {/* Controls */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex bg-forest-900/60 rounded-lg p-1">
            {['monthly', 'yearly'].map((v) => (
              <button
                key={v}
                onClick={() => setReportType(v)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
                  reportType === v ? 'bg-forest-600 text-sand-100' : 'text-sand-400 hover:text-sand-200'
                }`}
              >
                {v === 'monthly' ? 'Monthly' : 'Yearly'}
              </button>
            ))}
          </div>
          {reportType === 'monthly' ? (
            <Select
              options={monthOpts}
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          ) : (
            <Select
              options={yearOpts}
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            />
          )}
        </div>
      </Card>

      {/* Financial Summary - Audit Style */}
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <Scale size={18} className="text-moss-400" />
          <h3 className="text-lg font-bold text-sand-200">Financial Summary</h3>
          <Badge color="#f0a83a">
            {reportType === 'monthly'
              ? format(new Date(selectedMonth + '-01'), 'MMMM yyyy')
              : String(selectedYear)}
          </Badge>
        </div>

        <div className="border border-forest-700/50 rounded-xl overflow-hidden">
          {/* Income Section */}
          <div className="border-b border-forest-700/50">
            <div className="bg-forest-800/40 px-4 py-2.5">
              <span className="text-xs font-bold text-moss-400 uppercase tracking-wider">Revenue / Income</span>
            </div>
            {catGroups.income?.length > 0 ? (
              <>
                {Object.entries(groupBySubcategory(catGroups.income)).map(([sub, data]) => (
                  <div key={sub} className="flex justify-between px-4 py-2 border-b border-forest-700/20">
                    <span className="text-sm text-sand-300 pl-4">{sub}</span>
                    <span className="text-sm text-sand-200 tabular-nums">{formatCurrency(data.total)}</span>
                  </div>
                ))}
                <div className="flex justify-between px-4 py-2.5 bg-forest-800/20 font-semibold">
                  <span className="text-sm text-moss-400">Total Income</span>
                  <span className="text-sm text-moss-400 tabular-nums">{formatCurrency(totals.income)}</span>
                </div>
              </>
            ) : (
              <div className="px-4 py-3 text-sm text-sand-500">No income recorded</div>
            )}
          </div>

          {/* Expenses Section */}
          {['bills', 'expenses'].map((catKey) => {
            const catTx = catGroups[catKey] || [];
            const catTotal = catTx.reduce((s, t) => s + t.amount, 0);
            return (
              <div key={catKey} className="border-b border-forest-700/50">
                <div className="bg-forest-800/40 px-4 py-2.5">
                  <span className="text-xs font-bold text-rosy-400 uppercase tracking-wider">
                    {CATEGORIES[catKey].label}
                  </span>
                </div>
                {catTx.length > 0 ? (
                  <>
                    {Object.entries(groupBySubcategory(catTx)).map(([sub, data]) => (
                      <div key={sub} className="flex justify-between px-4 py-2 border-b border-forest-700/20">
                        <span className="text-sm text-sand-300 pl-4">{sub}</span>
                        <span className="text-sm text-sand-200 tabular-nums">{formatCurrency(data.total)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between px-4 py-2.5 bg-forest-800/20 font-semibold">
                      <span className="text-sm text-rosy-400">Total {CATEGORIES[catKey].label}</span>
                      <span className="text-sm text-rosy-400 tabular-nums">{formatCurrency(catTotal)}</span>
                    </div>
                  </>
                ) : (
                  <div className="px-4 py-3 text-sm text-sand-500">No {CATEGORIES[catKey].label.toLowerCase()} recorded</div>
                )}
              </div>
            );
          })}

          {/* Savings & Investments */}
          {['savings', 'investments'].map((catKey) => {
            const catTx = catGroups[catKey] || [];
            const catTotal = catTx.reduce((s, t) => s + t.amount, 0);
            return (
              <div key={catKey} className="border-b border-forest-700/50">
                <div className="bg-forest-800/40 px-4 py-2.5">
                  <span className="text-xs font-bold text-midnight-300 uppercase tracking-wider">
                    {CATEGORIES[catKey].label}
                  </span>
                </div>
                {catTx.length > 0 ? (
                  <>
                    {Object.entries(groupBySubcategory(catTx)).map(([sub, data]) => (
                      <div key={sub} className="flex justify-between px-4 py-2 border-b border-forest-700/20">
                        <span className="text-sm text-sand-300 pl-4">{sub}</span>
                        <span className="text-sm text-sand-200 tabular-nums">{formatCurrency(data.total)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between px-4 py-2.5 bg-forest-800/20 font-semibold">
                      <span className="text-sm text-midnight-300">Total {CATEGORIES[catKey].label}</span>
                      <span className="text-sm text-midnight-300 tabular-nums">{formatCurrency(catTotal)}</span>
                    </div>
                  </>
                ) : (
                  <div className="px-4 py-3 text-sm text-sand-500">No {CATEGORIES[catKey].label.toLowerCase()} recorded</div>
                )}
              </div>
            );
          })}

          {/* Net Result */}
          <div className="bg-forest-800/60 px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {totals.net >= 0 ? (
                  <TrendingUp size={18} className="text-moss-400" />
                ) : (
                  <TrendingDown size={18} className="text-rosy-400" />
                )}
                <span className="font-bold text-sand-200">Net Result</span>
              </div>
              <span className={`text-lg font-bold tabular-nums ${totals.net >= 0 ? 'text-moss-400' : 'text-rosy-400'}`}>
                {formatCurrency(totals.net)}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Account Summary */}
      <Card>
        <h3 className="text-sm font-semibold text-sand-300 mb-4">Account Usage</h3>
        <div className="space-y-2">
          {ACCOUNTS.map((acc) => {
            const accTx = accGroups[acc.id] || { items: [], total: 0 };
            const accIncome = (accTx.items || []).filter((t) => t.category === 'income').reduce((s, t) => s + t.amount, 0);
            const accExpense = (accTx.items || []).filter((t) => t.category !== 'income').reduce((s, t) => s + t.amount, 0);
            return (
              <div key={acc.id} className="flex items-center justify-between p-3 rounded-xl bg-forest-900/40">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: `${acc.color}25`, color: acc.color }}
                  >
                    {acc.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-sand-200">{acc.name}</p>
                    <p className="text-xs text-sand-500">{(accTx.items || []).length} transactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-moss-400">+{formatCurrency(accIncome)}</p>
                  <p className="text-xs text-rosy-400">-{formatCurrency(accExpense)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Yearly Monthly Breakdown Table */}
      {reportType === 'yearly' && (
        <Card>
          <h3 className="text-sm font-semibold text-sand-300 mb-4">Monthly Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-forest-700/50">
                  <th className="text-left py-2 px-3 text-xs font-semibold text-sand-400">Month</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-sand-400">Income</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-sand-400">Expenses</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-sand-400">Savings</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-sand-400">Net</th>
                </tr>
              </thead>
              <tbody>
                {monthlyBreakdown.map((row) => (
                  <tr key={row.month} className="border-b border-forest-700/20 hover:bg-forest-800/30">
                    <td className="py-2 px-3 text-sand-300">{row.month}</td>
                    <td className="py-2 px-3 text-right text-moss-400 tabular-nums">{formatCurrency(row.income)}</td>
                    <td className="py-2 px-3 text-right text-rosy-400 tabular-nums">{formatCurrency(row.expenses)}</td>
                    <td className="py-2 px-3 text-right text-midnight-300 tabular-nums">{formatCurrency(row.savings)}</td>
                    <td className={`py-2 px-3 text-right font-semibold tabular-nums ${row.net >= 0 ? 'text-moss-400' : 'text-rosy-400'}`}>
                      {formatCurrency(row.net)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-forest-600/50 font-bold">
                  <td className="py-2.5 px-3 text-sand-200">Total</td>
                  <td className="py-2.5 px-3 text-right text-moss-400 tabular-nums">{formatCurrency(totals.income)}</td>
                  <td className="py-2.5 px-3 text-right text-rosy-400 tabular-nums">{formatCurrency(totals.expenses)}</td>
                  <td className="py-2.5 px-3 text-right text-midnight-300 tabular-nums">{formatCurrency(totals.savings)}</td>
                  <td className={`py-2.5 px-3 text-right tabular-nums ${totals.net >= 0 ? 'text-moss-400' : 'text-rosy-400'}`}>
                    {formatCurrency(totals.net)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
