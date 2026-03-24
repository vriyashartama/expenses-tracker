export default function Card({ children, className = '', padding = true }) {
  return (
    <div
      className={`bg-forest-800/60 backdrop-blur-sm border border-forest-700/50 rounded-2xl ${
        padding ? 'p-5' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
