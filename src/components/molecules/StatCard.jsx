import Card from '../atoms/Card';
import StatValue from '../atoms/StatValue';

export default function StatCard({ label, value, icon: Icon, color, trend }) {
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <StatValue label={label} value={value} color={color} trend={trend} />
        {Icon && (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${color?.replace('text-', '')}15` }}
          >
            <Icon size={20} className={color || 'text-sand-400'} />
          </div>
        )}
      </div>
    </Card>
  );
}
