import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard, ArrowLeftRight, PieChart, Target,
  FileText, Menu, Download, X, Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import Dashboard from '@/pages/Dashboard';
import Transactions from '@/pages/Transactions';
import Analytics from '@/pages/Analytics';
import Budget from '@/pages/Budget';
import Reports from '@/pages/Reports';
import Accounts from '@/pages/Accounts';
import useStore from '@/store/useStore';
import { exportToExcel } from '@/lib/excel';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/analytics', label: 'Analytics', icon: PieChart },
  { to: '/budget', label: 'Budget', icon: Target },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/accounts', label: 'Accounts', icon: Wallet },
];

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/transactions': 'Transactions',
  '/analytics': 'Analytics',
  '/budget': 'Budget',
  '/reports': 'Reports',
  '/accounts': 'Accounts',
};

function SidebarNav({ onNavigate }) {
  const location = useLocation();

  return (
    <nav className="flex-1 p-3 space-y-1">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
        const isActive = location.pathname === to;
        return (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              isActive
                ? 'bg-secondary text-primary'
                : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
            )}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        );
      })}
    </nav>
  );
}

function DesktopSidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-background">
      <div className="flex items-center gap-2.5 p-5">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-sm font-bold text-primary-foreground">F</span>
        </div>
        <span className="text-lg font-bold tracking-tight">FinTrack</span>
      </div>
      <Separator />
      <SidebarNav />
      <Separator />
      <div className="p-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-chart-3 flex items-center justify-center text-xs font-bold text-white">
            R
          </div>
          <div>
            <p className="text-sm font-medium">Ryan</p>
            <p className="text-xs text-muted-foreground">Personal Finance</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <div className="flex items-center gap-2.5 p-5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">F</span>
          </div>
          <span className="text-lg font-bold tracking-tight">FinTrack</span>
        </div>
        <Separator />
        <SidebarNav onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

function AppShell() {
  const location = useLocation();
  const { transactions, accounts } = useStore();
  const title = PAGE_TITLES[location.pathname] || 'FinTrack';

  const handleExport = () => exportToExcel(transactions, accounts, 'fintrack-all-transactions');

  return (
    <div className="flex h-screen overflow-hidden">
      <DesktopSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center justify-between px-4 py-3 lg:px-6 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <MobileSidebar />
            <h1 className="text-lg font-bold">{title}</h1>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download size={14} />
            <span className="hidden sm:inline">Export Excel</span>
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/accounts" element={<Accounts />} />
            </Routes>
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}

function MobileBottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border px-2 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around">
        {NAV_ITEMS.slice(0, 5).map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center py-2.5 px-3 transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )
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

export default function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <AppShell />
      </TooltipProvider>
    </BrowserRouter>
  );
}
