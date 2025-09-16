import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { billsAPI } from '../services/api';
import { Bill } from '../types';

const Bills: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const response = await billsAPI.getAllBills();
      setBills(response.data);
    } catch (err: any) {
      setError('Failed to fetch bills');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        await billsAPI.deleteBill(id);
        setBills(bills.filter(bill => bill.id !== id));
      } catch (err: any) {
        setError('Failed to delete bill');
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'unpaid':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading bills...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Water Bills</h1>
            <p className="mt-2 text-gray-600">
              Manage your PDAM water bills and payments
            </p>
          </div>
          <Link
            to="/bills/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Add New Bill
          </Link>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {bills.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No bills found
            </h3>
            <p className="text-gray-600 mb-4">
              Get started by creating your first water bill
            </p>
            <Link
              to="/bills/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Create First Bill
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {bills.map((bill) => (
                <li key={bill.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(bill.status)}`}>
                            {bill.status}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {new Date(bill.period_year, bill.period_month - 1).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long'
                            })}
                          </div>
                          <div className="text-sm text-gray-500">
                            Usage: {parseFloat(bill.usage_m3.toString()).toFixed(2)} m³
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(parseFloat(bill.cost.toString()))}
                          </div>
                          {bill.due_date && (
                            <div className="text-sm text-gray-500">
                              Due: {new Date(bill.due_date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Link
                            to={`/bills/edit/${bill.id}`}
                            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(bill.id)}
                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>
                          Previous: {parseFloat(bill.previous_reading.toString()).toFixed(2)} m³
                        </span>
                        <span>
                          Current: {parseFloat(bill.current_reading.toString()).toFixed(2)} m³
                        </span>
                      </div>
                      {bill.notes && (
                        <div className="mt-1 text-sm text-gray-600">
                          Notes: {bill.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bills;