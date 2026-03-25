export const ACCOUNTS = [
  { id: 'nobu', name: 'Nobu', type: 'Salary', color: '#f0a83a' },
  { id: 'bca', name: 'BCA', type: 'Spending', color: '#d07e6a' },
  { id: 'jenius', name: 'Jenius', type: 'Savings', color: '#538ba0' },
  { id: 'mandiri', name: 'Mandiri', type: 'Insurance & E-Money', color: '#e8932a' },
  { id: 'bibit', name: 'Bibit', type: 'Investment', color: '#7ea8b8' },
];

export const CATEGORIES = {
  income: {
    label: 'Income',
    color: '#f0a83a',
    subcategories: ['Freelance', 'Paycheck', 'Dividends', 'Other'],
  },
  bills: {
    label: 'Bills',
    color: '#d07e6a',
    subcategories: ['Kos', 'Insurance', 'Subscriptions', 'Phones & Internet', 'Other'],
  },
  expenses: {
    label: 'Expenses',
    color: '#b86450',
    subcategories: [
      'Groceries',
      'Transportation',
      'Dining Out',
      'Self Care',
      'Shopping',
      'Dating',
      'Gift',
      'Other',
    ],
  },
  savings: {
    label: 'Savings',
    color: '#538ba0',
    subcategories: ['Emergency Fund', 'Goal Savings', 'General Savings', 'Other'],
  },
  investments: {
    label: 'Investments',
    color: '#7ea8b8',
    subcategories: ['Reksa Dana', 'Stock', 'Cryptocurrency', 'Other'],
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
