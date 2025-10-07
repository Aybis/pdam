import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  fullWidth = false,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses =
    'font-medium rounded-lg text-sm px-5 py-3 text-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary:
      'text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-800',
    secondary:
      'text-white bg-gray-700 hover:bg-gray-600 focus:ring-4 focus:ring-gray-600',
    danger:
      'text-white bg-red-600 hover:bg-red-500 focus:ring-4 focus:ring-red-800',
    ghost: 'text-gray-400 hover:text-white hover:bg-gray-700 rounded-full p-2',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
