import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '../lib/utils';

const useStore = create(
  persist(
    (set, get) => ({
      transactions: [],
      budgets: {},

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
        const budgets = get().budgets;
        return budgets[monthKey]?.[category] || 0;
      },
    }),
    {
      name: 'fintrack-storage',
    }
  )
);

export default useStore;
