import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MonthPicker({ value, onChange }) {
  const date = new Date(value + '-01');
  const prev = () => {
    const d = new Date(date);
    d.setMonth(d.getMonth() - 1);
    onChange(format(d, 'yyyy-MM'));
  };
  const next = () => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + 1);
    onChange(format(d, 'yyyy-MM'));
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prev}>
        <ChevronLeft size={16} />
      </Button>
      <span className="text-sm font-semibold min-w-[130px] text-center">
        {format(date, 'MMMM yyyy')}
      </span>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={next}>
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}
