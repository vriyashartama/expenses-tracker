import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';

export default function MonthPicker({ currentMonth, onChange }) {
  const date = new Date(currentMonth + '-01');

  const handlePrev = () => onChange(format(subMonths(date, 1), 'yyyy-MM'));
  const handleNext = () => onChange(format(addMonths(date, 1), 'yyyy-MM'));

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handlePrev}
        className="p-2 rounded-lg hover:bg-forest-700/50 text-sand-400 hover:text-sand-200 transition-colors cursor-pointer"
      >
        <ChevronLeft size={18} />
      </button>
      <span className="text-sm font-semibold text-sand-200 min-w-[140px] text-center">
        {format(date, 'MMMM yyyy')}
      </span>
      <button
        onClick={handleNext}
        className="p-2 rounded-lg hover:bg-forest-700/50 text-sand-400 hover:text-sand-200 transition-colors cursor-pointer"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
