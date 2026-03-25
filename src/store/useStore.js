import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '@/lib/utils';

const DEFAULT_ACCOUNTS = [
  { id: 'nobu', name: 'Nobu', type: 'Salary', color: '#6b7d4a' },
  { id: 'bca', name: 'BCA', type: 'Spending', color: '#d47d52' },
  { id: 'jenius', name: 'Jenius', type: 'Savings', color: '#506180' },
  { id: 'mandiri', name: 'Mandiri', type: 'Insurance & E-Money', color: '#8a9f62' },
  { id: 'bibit', name: 'Bibit', type: 'Investment', color: '#9070ad' },
];

const useStore = create(
  persist(
    (set, get) => ({
      transactions: [],
      budgets: {},
      accounts: DEFAULT_ACCOUNTS,

      // Account CRUD
      addAccount: (account) =>
        set((state) => ({
          accounts: [...state.accounts, { ...account, id: generateId() }],
        })),

      updateAccount: (id, updates) =>
        set((state) => ({
          accounts: state.accounts.map((a) => (a.id === id ? { ...a, ...updates } : a)),
        })),

      deleteAccount: (id) =>
        set((state) => ({
          accounts: state.accounts.filter((a) => a.id !== id),
        })),

      // Transaction CRUD
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            ...state.transactions,
            { ...transaction, id: generateId(), createdAt: new Date().toISOString() },
          ],
        })),

      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      // Budget
      setBudget: (monthKey, category, amount) =>
        set((state) => ({
          budgets: {
            ...state.budgets,
            [monthKey]: {
              ...state.budgets[monthKey],
              [category]: amount,
            },
          },
        })),

      getBudget: (monthKey, category) => {
        return get().budgets[monthKey]?.[category] || 0;
      },

      // Data export/import
      exportData: () => {
        const { transactions, budgets, accounts } = get();
        return { transactions, budgets, accounts, exportedAt: new Date().toISOString(), version: 1 };
      },

      importData: (data) => {
        if (!data || !Array.isArray(data.transactions) || !Array.isArray(data.accounts)) {
          throw new Error('Invalid data format');
        }
        set({ transactions: data.transactions, accounts: data.accounts, budgets: data.budgets || {} });
      },
    }),
    {
      name: 'penny-storage',
    }
  )
);

export default useStore;
