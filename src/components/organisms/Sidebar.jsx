import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  FileText,
  Target,
  X,
} from 'lucide-react';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/analytics', label: 'Analytics', icon: PieChart },
  { to: '/budget', label: 'Budget', icon: Target },
  { to: '/reports', label: 'Reports', icon: FileText },
];

export default function Sidebar({ open, onClose }) {
  const location = useLocation();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-forest-900 border-r border-forest-700/50 transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-forest-700/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-moss-600 flex items-center justify-center">
              <span className="text-sm font-bold text-sand-50">F</span>
            </div>
            <span className="text-lg font-bold text-sand-100 tracking-tight">FinTrack</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-forest-800 text-sand-400 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {links.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-forest-700/60 text-moss-400'
                    : 'text-sand-400 hover:bg-forest-800/60 hover:text-sand-200'
                }`}
              >
                <Icon size={18} />
                {label}
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-forest-700/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-midnight-600 flex items-center justify-center text-xs font-bold text-sand-100">
              R
            </div>
            <div>
              <p className="text-sm font-medium text-sand-200">Ryan</p>
              <p className="text-xs text-sand-500">Personal Finance</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
