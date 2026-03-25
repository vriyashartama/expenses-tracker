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
      'Foods & Beverages',
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

export const ACCOUNT_COLORS = [
  '#f0a83a', '#d07e6a', '#538ba0', '#7ea8b8', '#b86450',
  '#e8932a', '#9a8b72', '#cc761e', '#3a6e84', '#974f3e',
];
