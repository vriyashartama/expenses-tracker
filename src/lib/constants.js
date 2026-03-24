export const ACCOUNTS = [
  { id: 'nobu', name: 'Nobu', type: 'Salary', color: '#4a7c4a' },
  { id: 'bca', name: 'BCA', type: 'Spending', color: '#a87058' },
  { id: 'jenius', name: 'Jenius', type: 'Savings', color: '#3a6e7d' },
  { id: 'mandiri', name: 'Mandiri', type: 'Insurance & E-Money', color: '#6e8740' },
  { id: 'bibit', name: 'Bibit', type: 'Investment', color: '#b5a078' },
];

export const CATEGORIES = {
  income: {
    label: 'Income',
    color: '#6b9e6b',
    subcategories: ['Freelance - Yesplis', 'Paycheck - Siloam'],
  },
  bills: {
    label: 'Bills',
    color: '#c08a73',
    subcategories: ['Kos', 'Insurance', 'Subscriptions', 'Phones & Internet'],
  },
  expenses: {
    label: 'Expenses',
    color: '#a87058',
    subcategories: [
      'Groceries',
      'Transportation',
      'Dining Out',
      'Self Care',
      'Shopping',
      'Dating',
      'Gift',
    ],
  },
  savings: {
    label: 'Savings',
    color: '#3a6e7d',
    subcategories: ['Emergency Fund', 'Goal Savings', 'General Savings'],
  },
  investments: {
    label: 'Investments',
    color: '#8da65a',
    subcategories: ['Reksa Dana'],
  },
};

export const CATEGORY_LIST = Object.entries(CATEGORIES).map(([key, val]) => ({
  id: key,
  ...val,
}));

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
