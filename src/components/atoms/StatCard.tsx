interface StatCardProps {
  label: string;
  value: string;
  variant?: 'blue' | 'green';
}

export default function StatCard({
  label,
  value,
  variant = 'blue',
}: StatCardProps) {
  const colorClasses = {
    blue: 'text-blue-400',
    green: 'text-green-400',
  };

  return (
    <div className="bg-gray-700 p-4 rounded-lg text-center">
      <p className="text-sm text-gray-400">{label}</p>
      <p className={`text-2xl md:text-3xl font-bold ${colorClasses[variant]}`}>
        {value}
      </p>
    </div>
  );
}
