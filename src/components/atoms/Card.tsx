interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'dark';
}

export default function Card({
  children,
  className = '',
  variant = 'default',
}: CardProps) {
  const variantClasses = {
    default: 'bg-gray-800',
    dark: 'bg-gray-900',
  };

  return (
    <div
      className={`p-6 md:p-8 rounded-2xl shadow-2xl ${variantClasses[variant]} ${className}`}
    >
      {children}
    </div>
  );
}
