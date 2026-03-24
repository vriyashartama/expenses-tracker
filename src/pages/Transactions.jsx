import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, X, Search, Filter } from 'lucide-react';
import useStore from '../store/useStore';
import { CATEGORIES, ACCOUNTS } from '../lib/constants';
import { filterTransactionsByMonth } from '../lib/utils';
import Card from '../components/atoms/Card';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import Select from '../components/atoms/Select';
import MonthPicker from '../components/molecules/MonthPicker';
import TransactionForm from '../components/molecules/TransactionForm';
import TransactionList from '../components/organisms/TransactionList';
import { exportToExcel } from '../lib/excel';

export default function Transactions() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useStore();
  const [currentMonth, setCurrentMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [showForm, setShowForm] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterAccount, setFilterAccount] = useState('all');

  let monthTx = filterTransactionsByMonth(transactions, currentMonth);

  if (filterCategory !== 'all') {
    monthTx = monthTx.filter((t) => t.category === filterCategory);
  }
  if (filterAccount !== 'all') {
    monthTx = monthTx.filter((t) => t.account === filterAccount);
  }
  if (search) {
    const q = search.toLowerCase();
    monthTx = monthTx.filter(
      (t) =>
        t.description?.toLowerCase().includes(q) ||
        t.subcategory?.toLowerCase().includes(q)
    );
  }

  const handleAdd = (data) => {
    addTransaction(data);
    setShowForm(false);
  };

  const handleUpdate = (data) => {
    updateTransaction(editingTx.id, data);
    setEditingTx(null);
  };

  const handleEdit = (tx) => {
    setEditingTx(tx);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTx(null);
  };

  const handleExport = () => {
    const monthlyTx = filterTransactionsByMonth(transactions, currentMonth);
    const monthLabel = format(new Date(currentMonth + '-01'), 'MMMM-yyyy');
    exportToExcel(monthlyTx, `fintrack-${monthLabel}`);
  };

  const categoryOpts = [
    { value: 'all', label: 'All Categories' },
    ...Object.entries(CATEGORIES).map(([k, v]) => ({ value: k, label: v.label })),
  ];

  const accountOpts = [
    { value: 'all', label: 'All Accounts' },
    ...ACCOUNTS.map((a) => ({ value: a.id, label: a.name })),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-sand-100">Transactions</h2>
          <p className="text-sm text-sand-500 mt-0.5">Manage your income and expenses</p>
        </div>
        <div className="flex items-center gap-3">
          <MonthPicker currentMonth={currentMonth} onChange={setCurrentMonth} />
          <Button
            icon={showForm ? X : Plus}
            onClick={() => {
              if (showForm) handleCancel();
              else setShowForm(true);
            }}
          >
            <span className="hidden sm:inline">{showForm ? 'Close' : 'Add'}</span>
          </Button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <h3 className="text-sm font-semibold text-sand-300 mb-4">
            {editingTx ? 'Edit Transaction' : 'New Transaction'}
          </h3>
          <TransactionForm
            onSubmit={editingTx ? handleUpdate : handleAdd}
            initialData={editingTx}
            onCancel={handleCancel}
          />
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-500" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-forest-800/60 border border-forest-700/50 rounded-lg pl-9 pr-3 py-2.5 text-sm text-sand-100 placeholder-sand-600 focus:outline-none focus:ring-2 focus:ring-moss-500/50"
          />
        </div>
        <Select
          options={categoryOpts}
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="sm:w-44"
        />
        <Select
          options={accountOpts}
          value={filterAccount}
          onChange={(e) => setFilterAccount(e.target.value)}
          className="sm:w-36"
        />
      </div>

      {/* Export */}
      <div className="flex justify-end">
        <Button variant="secondary" size="sm" onClick={handleExport}>
          Export this month to Excel
        </Button>
      </div>

      {/* List */}
      <Card padding={false}>
        <div className="p-2">
          <TransactionList
            transactions={monthTx}
            onEdit={handleEdit}
            onDelete={deleteTransaction}
          />
        </div>
      </Card>
    </div>
  );
}
