interface TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'small' | 'error';
  children: React.ReactNode;
  className?: string;
}

export default function Text({
  variant = 'body',
  children,
  className = '',
}: TextProps) {
  const variantClasses = {
    h1: 'text-3xl font-bold',
    h2: 'text-2xl font-bold',
    h3: 'text-xl font-semibold',
    body: 'text-base',
    small: 'text-sm text-gray-400',
    error: 'text-sm text-red-500',
  };

  const Component = variant.startsWith('h') ? variant : 'p';

  return (
    <Component className={`${variantClasses[variant]} ${className}`}>
      {children}
    </Component>
  );
}
