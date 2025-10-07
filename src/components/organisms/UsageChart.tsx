import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import type { Reading } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

interface UsageChartProps {
  readings: Reading[];
}

export default function UsageChart({ readings }: UsageChartProps) {
  const labels = readings.map((r) => r.month);
  const usageData = readings.map((r) => r.penggunaan);
  const billData = readings.map((r) => r.tagihan);

  const data = {
    labels,
    datasets: [
      {
        label: 'Penggunaan (m³)',
        data: usageData,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        yAxisID: 'yUsage',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Tagihan (Rp)',
        data: billData,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        yAxisID: 'yBill',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: { mode: 'index' as const, intersect: false },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: '#d1d5db' },
      },
      yUsage: {
        type: 'linear' as const,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Penggunaan (m³)',
          color: '#3b82f6',
        },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: '#d1d5db' },
      },
      yBill: {
        type: 'linear' as const,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Tagihan (Rp)',
          color: '#10b981',
        },
        grid: { drawOnChartArea: false },
        ticks: {
          color: '#d1d5db',
          callback: function (value: number | string) {
            return 'Rp' + Number(value) / 1000 + 'k';
          },
        },
      },
    },
  };

  return (
    <div className="bg-gray-900 p-4 rounded-xl">
      <Line data={data} options={options} />
    </div>
  );
}
