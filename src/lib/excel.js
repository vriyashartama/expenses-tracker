import * as XLSX from 'xlsx';
import { CATEGORIES } from './constants';
import { formatCurrency, formatDate } from './utils';

export function exportToExcel(transactions, accounts, filename = 'financial-report') {
  const wb = XLSX.utils.book_new();

  const allData = transactions.map((t) => ({
    Date: formatDate(t.date),
    Category: CATEGORIES[t.category]?.label || t.category,
    Subcategory: t.subcategory,
    Account: accounts.find((a) => a.id === t.account)?.name || t.account,
    Description: t.description,
    Amount: t.amount,
    Type: t.category === 'income' ? 'Income' : 'Expense',
  }));

  const wsAll = XLSX.utils.json_to_sheet(allData);
  wsAll['!cols'] = [
    { wch: 14 }, { wch: 14 }, { wch: 20 }, { wch: 12 },
    { wch: 30 }, { wch: 16 }, { wch: 10 },
  ];
  XLSX.utils.book_append_sheet(wb, wsAll, 'All Transactions');

  const categories = ['income', 'bills', 'expenses', 'savings', 'investments'];
  for (const cat of categories) {
    const catTx = transactions.filter((t) => t.category === cat);
    if (catTx.length === 0) continue;

    const catData = catTx.map((t) => ({
      Date: formatDate(t.date),
      Subcategory: t.subcategory,
      Account: accounts.find((a) => a.id === t.account)?.name || t.account,
      Description: t.description,
      Amount: t.amount,
    }));

    const total = catTx.reduce((s, t) => s + t.amount, 0);
    catData.push({ Date: '', Subcategory: '', Account: '', Description: 'TOTAL', Amount: total });

    const ws = XLSX.utils.json_to_sheet(catData);
    ws['!cols'] = [{ wch: 14 }, { wch: 20 }, { wch: 12 }, { wch: 30 }, { wch: 16 }];
    XLSX.utils.book_append_sheet(wb, ws, CATEGORIES[cat].label);
  }

  const summaryData = categories.map((cat) => {
    const total = transactions
      .filter((t) => t.category === cat)
      .reduce((s, t) => s + t.amount, 0);
    return { Category: CATEGORIES[cat].label, Total: total, Formatted: formatCurrency(total) };
  });

  const income = summaryData.find((s) => s.Category === 'Income')?.Total || 0;
  const totalExpenses = summaryData
    .filter((s) => s.Category !== 'Income')
    .reduce((s, item) => s + item.Total, 0);

  summaryData.push(
    { Category: '', Total: '', Formatted: '' },
    { Category: 'Total Income', Total: income, Formatted: formatCurrency(income) },
    { Category: 'Total Outflow', Total: totalExpenses, Formatted: formatCurrency(totalExpenses) },
    { Category: 'Net', Total: income - totalExpenses, Formatted: formatCurrency(income - totalExpenses) },
  );

  const wsSummary = XLSX.utils.json_to_sheet(summaryData);
  wsSummary['!cols'] = [{ wch: 16 }, { wch: 16 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

  XLSX.writeFile(wb, `${filename}.xlsx`);
}
