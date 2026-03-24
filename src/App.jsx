import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { LayoutDashboard, ArrowLeftRight, PieChart, Target, FileText, Menu, Download } from 'lucide-react';
import Sidebar from './components/organisms/Sidebar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Analytics from './pages/Analytics';
import Budget from './pages/Budget';
import Reports from './pages/Reports';
import useStore from './store/useStore';
import { exportToExcel } from './lib/excel';

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/transactions': 'Transactions',
  '/analytics': 'Analytics',
  '/budget': 'Budget',
  '/reports': 'Reports',
};

function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { transactions } = useStore();
  const title = PAGE_TITLES[location.pathname] || 'FinTrack';

  const handleExport = () => exportToExcel(transactions, 'fintrack-all-transactions');

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header bar */}
        <header className="flex items-center justify-between p-4 lg:px-6 border-b border-forest-700/50 bg-forest-900/80 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-forest-800 text-sand-400 cursor-pointer"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-bold text-sand-100">{title}</h1>
          </div>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg font-medium bg-forest-800 hover:bg-forest-700 text-sand-200 border border-forest-600 transition-all cursor-pointer"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export Excel</span>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

const mobileLinks = [
  { to: '/', label: 'Home', icon: LayoutDashboard },
  { to: '/transactions', label: 'Txns', icon: ArrowLeftRight },
  { to: '/analytics', label: 'Charts', icon: PieChart },
  { to: '/budget', label: 'Budget', icon: Target },
  { to: '/reports', label: 'Reports', icon: FileText },
];

function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-forest-900/95 backdrop-blur-md border-t border-forest-700/50 px-2 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around">
        {mobileLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center py-2.5 px-3 transition-colors ${
                isActive ? 'text-moss-400' : 'text-sand-500 hover:text-sand-300'
              }`
            }
          >
            <Icon size={18} />
            <span className="text-[10px] mt-0.5 font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
