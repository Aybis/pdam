import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { billsAPI } from '../services/api';
import { ChartData } from '../types';
import { useAuth } from '../contexts/AuthContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await billsAPI.getDashboardStats();
      setChartData(response.data);
    } catch (err: any) {
      setError('Failed to fetch dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const usageChartData = {
    labels: chartData.map(item => item.period),
    datasets: [
      {
        label: 'Water Usage (m³)',
        data: chartData.map(item => item.usage),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const costChartData = {
    labels: chartData.map(item => item.period),
    datasets: [
      {
        label: 'Cost (IDR)',
        data: chartData.map(item => item.cost),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Water Usage and Cost Trends',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  const totalUsage = chartData.reduce((sum, item) => sum + item.usage, 0);
  const totalCost = chartData.reduce((sum, item) => sum + item.cost, 0);
  const averageUsage = chartData.length > 0 ? totalUsage / chartData.length : 0;
  const averageCost = chartData.length > 0 ? totalCost / chartData.length : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.full_name || user?.username}!
          </h1>
          <p className="mt-2 text-gray-600">
            Here's your water usage and billing overview
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">T</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Usage
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {totalUsage.toFixed(2)} m³
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">A</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Avg Usage
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {averageUsage.toFixed(2)} m³
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">T</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Cost
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {formatCurrency(totalCost)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">A</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Avg Cost
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {formatCurrency(averageCost)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        {chartData.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Water Usage Trends
              </h3>
              <Bar data={usageChartData} options={chartOptions} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Cost Trends
              </h3>
              <Line data={costChartData} options={chartOptions} />
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No bills data available
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first bill to see usage and cost trends
            </p>
            <a
              href="/bills/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Create First Bill
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;