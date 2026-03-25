import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '@/lib/utils';

const DEFAULT_ACCOUNTS = [
  { id: 'nobu', name: 'Nobu', type: 'Salary', color: '#f0a83a' },
  { id: 'bca', name: 'BCA', type: 'Spending', color: '#d07e6a' },
  { id: 'jenius', name: 'Jenius', type: 'Savings', color: '#538ba0' },
  { id: 'mandiri', name: 'Mandiri', type: 'Insurance & E-Money', color: '#e8932a' },
  { id: 'bibit', name: 'Bibit', type: 'Investment', color: '#7ea8b8' },
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
    }),
    {
      name: 'fintrack-storage',
    }
  )
);

export default useStore;
