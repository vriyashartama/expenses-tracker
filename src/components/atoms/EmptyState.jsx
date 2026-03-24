export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-forest-800 flex items-center justify-center mb-4">
          <Icon size={28} className="text-sand-500" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-sand-200 mb-1">{title}</h3>
      {description && <p className="text-sm text-sand-500 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
