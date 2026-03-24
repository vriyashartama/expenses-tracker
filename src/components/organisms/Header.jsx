import { Menu, Download } from 'lucide-react';
import Button from '../atoms/Button';

export default function Header({ onMenuClick, onExport, title }) {
  return (
    <header className="flex items-center justify-between p-4 lg:px-6 border-b border-forest-700/50 bg-forest-900/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-forest-800 text-sand-400 cursor-pointer"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-bold text-sand-100">{title}</h1>
      </div>
      {onExport && (
        <Button variant="secondary" size="sm" icon={Download} onClick={onExport}>
          <span className="hidden sm:inline">Export Excel</span>
        </Button>
      )}
    </header>
  );
}
