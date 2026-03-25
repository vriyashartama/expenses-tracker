# Penny

A personal finance tracker I built for myself to keep tabs on where my money goes each month. Handles income, expenses, savings, investments, and transfers between accounts — basically everything I need to stay on top of my finances without relying on spreadsheets.

## What it does

- **Dashboard** — Monthly snapshot of income vs expenses, category breakdowns via pie chart, account balances, and a year-to-date trend line
- **Transactions** — Add, edit, delete transactions with categories/subcategories, search and filter by month
- **Transfers** — Move money between accounts (e.g. salary account → savings) without it counting as income or expense
- **Accounts** — Manage multiple bank accounts with auto-calculated balances based on transaction history
- **Budget** — Set spending limits per category, see how much of your income is allocated, get warnings when you overspend
- **Analytics** — Pie charts, bar charts, radar charts — monthly or yearly view
- **Reports** — Detailed breakdowns by category, subcategory, and account. Export to Excel
- **Backup/Restore** — Export all your data as JSON, import it on another device
- **PWA** — Installable on mobile, works offline

## Stack

- React 19 + Vite 8
- Tailwind CSS v4 + shadcn/ui
- Zustand (state persisted to localStorage)
- Recharts for charts
- date-fns, xlsx

## Getting started

```bash
# install dependencies
npm install

# run dev server
npm run dev

# build for production
npm run build

# preview production build
npm run preview
```

The app runs on `http://localhost:5173` by default.

## Data storage

Everything is stored in localStorage under the key `penny-storage`. There's no backend — your data lives in your browser. Use the backup/restore feature if you want to move data between devices.
