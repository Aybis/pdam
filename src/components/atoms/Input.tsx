import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="mb-6">
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <input
        className={`bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
