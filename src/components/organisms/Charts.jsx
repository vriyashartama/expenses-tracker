import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area, Legend,
} from 'recharts';
import { CATEGORIES } from '../../lib/constants';
import { formatCurrency } from '../../lib/utils';
import Card from '../atoms/Card';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value, fill } = payload[0];
  return (
    <div className="bg-forest-800 border border-forest-600/50 rounded-lg p-3 shadow-xl">
      <p className="text-xs text-sand-400">{name}</p>
      <p className="text-sm font-bold" style={{ color: fill }}>{formatCurrency(value)}</p>
    </div>
  );
};

export function CategoryPieChart({ data, title }) {
  const chartData = Object.entries(data).map(([key, val]) => ({
    name: CATEGORIES[key]?.label || key,
    value: val,
    color: CATEGORIES[key]?.color || '#888',
  }));

  const total = chartData.reduce((s, d) => s + d.value, 0);

  return (
    <Card>
      {title && <h3 className="text-sm font-semibold text-sand-200 mb-4">{title}</h3>}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="w-48 h-48">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sand-300">{item.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sand-400 text-xs">
                  {total > 0 ? Math.round((item.value / total) * 100) : 0}%
                </span>
                <span className="font-medium text-sand-200 tabular-nums">
                  {formatCurrency(item.value)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export function MonthlyBarChart({ data, title }) {
  return (
    <Card>
      {title && <h3 className="text-sm font-semibold text-sand-200 mb-4">{title}</h3>}
      <div className="h-64">
        <ResponsiveContainer>
          <BarChart data={data} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#323744" />
            <XAxis dataKey="month" tick={{ fill: '#9a8b72', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#9a8b72', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12, color: '#cdc1ad' }}
            />
            <Bar dataKey="income" name="Income" fill="#f0a83a" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" name="Expenses" fill="#d07e6a" radius={[4, 4, 0, 0]} />
            <Bar dataKey="savings" name="Savings" fill="#538ba0" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function TrendAreaChart({ data, title }) {
  return (
    <Card>
      {title && <h3 className="text-sm font-semibold text-sand-200 mb-4">{title}</h3>}
      <div className="h-64">
        <ResponsiveContainer>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f0a83a" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f0a83a" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d07e6a" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#d07e6a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#323744" />
            <XAxis dataKey="month" tick={{ fill: '#9a8b72', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#9a8b72', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#cdc1ad' }} />
            <Area type="monotone" dataKey="income" name="Income" stroke="#f0a83a" fill="url(#incomeGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#d07e6a" fill="url(#expenseGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function SubcategoryBarChart({ data, title, color = '#f0a83a' }) {
  const chartData = Object.entries(data)
    .map(([name, { total }]) => ({ name, total }))
    .sort((a, b) => b.total - a.total);

  return (
    <Card>
      {title && <h3 className="text-sm font-semibold text-sand-200 mb-4">{title}</h3>}
      <div className="h-64">
        <ResponsiveContainer>
          <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#323744" horizontal={false} />
            <XAxis type="number" tick={{ fill: '#9a8b72', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#cdc1ad', fontSize: 11 }} axisLine={false} tickLine={false} width={110} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="total" fill={color} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
