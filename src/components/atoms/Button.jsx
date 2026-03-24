const variants = {
  primary: 'bg-forest-600 hover:bg-forest-500 text-sand-50',
  secondary: 'bg-forest-800 hover:bg-forest-700 text-sand-200 border border-forest-600',
  danger: 'bg-red-900/40 hover:bg-red-900/60 text-red-300 border border-red-800/50',
  ghost: 'hover:bg-forest-800 text-sand-300',
  accent: 'bg-moss-600 hover:bg-moss-500 text-sand-50',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
      {children}
    </button>
  );
}
