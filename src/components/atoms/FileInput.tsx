import { InputHTMLAttributes } from 'react';

interface FileInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  onFileSelect?: (file: File | null) => void;
}

export default function FileInput({
  label,
  onFileSelect,
  ...props
}: FileInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileSelect?.(file);
  };

  return (
    <div>
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
        {...props}
      />
    </div>
  );
}
