import { useState } from 'react';
import { format } from 'date-fns';
import { ACCOUNTS, CATEGORIES } from '../../lib/constants';
import Input from '../atoms/Input';
import CurrencyInput from '../atoms/CurrencyInput';
import Select from '../atoms/Select';
import Button from '../atoms/Button';
import { Plus } from 'lucide-react';

const initialForm = {
  date: format(new Date(), 'yyyy-MM-dd'),
  category: 'expenses',
  subcategory: '',
  account: 'bca',
  amount: '',
  description: '',
};

export default function TransactionForm({ onSubmit, initialData, onCancel }) {
  const [form, setForm] = useState(initialData || initialForm);

  const subcategories = CATEGORIES[form.category]?.subcategories || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'category') {
        const subs = CATEGORIES[value]?.subcategories || [];
        next.subcategory = subs[0] || '';
      }
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || !form.subcategory) return;
    onSubmit({
      ...form,
      amount: parseFloat(form.amount),
    });
    if (!initialData) setForm({ ...initialForm, date: format(new Date(), 'yyyy-MM-dd') });
  };

  const categoryOptions = Object.entries(CATEGORIES).map(([key, val]) => ({
    value: key,
    label: val.label,
  }));

  const subcategoryOptions = subcategories.map((s) => ({ value: s, label: s }));

  const accountOptions = ACCOUNTS.map((a) => ({
    value: a.id,
    label: `${a.name} (${a.type})`,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Date"
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
        />
        <CurrencyInput
          label="Amount (IDR)"
          name="amount"
          value={form.amount}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
          options={categoryOptions}
        />
        <Select
          label="Subcategory"
          name="subcategory"
          value={form.subcategory}
          onChange={handleChange}
          options={subcategoryOptions}
        />
      </div>

      <Select
        label="Account"
        name="account"
        value={form.account}
        onChange={handleChange}
        options={accountOptions}
      />

      <Input
        label="Description"
        type="text"
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="What's this transaction for?"
      />

      <div className="flex gap-3 pt-2">
        <Button type="submit" icon={Plus} className="flex-1">
          {initialData ? 'Update' : 'Add Transaction'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
