import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { billsAPI } from '../services/api';
import { Bill } from '../types';
import MeterOCR from '../components/MeterOCR';

const BillForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    period_month: new Date().getMonth() + 1,
    period_year: new Date().getFullYear(),
    previous_reading: 0,
    current_reading: 0,
    status: 'unpaid' as 'paid' | 'unpaid' | 'overdue',
    due_date: '',
    paid_date: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOCR, setShowOCR] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      fetchBill(parseInt(id));
    }
  }, [isEditing, id]);

  const fetchBill = async (billId: number) => {
    try {
      setLoading(true);
      const response = await billsAPI.getBill(billId);
      const bill: Bill = response.data;
      setFormData({
        period_month: bill.period_month,
        period_year: bill.period_year,
        previous_reading: parseFloat(bill.previous_reading.toString()),
        current_reading: parseFloat(bill.current_reading.toString()),
        status: bill.status,
        due_date: bill.due_date ? bill.due_date.split('T')[0] : '',
        paid_date: bill.paid_date ? bill.paid_date.split('T')[0] : '',
        notes: bill.notes || '',
      });
    } catch (err: any) {
      setError('Failed to fetch bill data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('reading') || name.includes('month') || name.includes('year') 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleOCRReading = (reading: number) => {
    setFormData(prev => ({
      ...prev,
      current_reading: reading
    }));
    setShowOCR(false);
  };

  const calculateUsage = () => {
    return Math.max(0, formData.current_reading - formData.previous_reading);
  };

  const calculateCost = () => {
    const usage = calculateUsage();
    const baseRate = 20000; // Rp 20,000 for up to 20m³
    const excessRate = 3000; // Rp 3,000 per m³ above 20m³
    const baseLimit = 20; // 20m³ base limit

    if (usage <= baseLimit) {
      return baseRate;
    } else {
      const excessUsage = usage - baseLimit;
      return baseRate + (excessUsage * excessRate);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEditing && id) {
        await billsAPI.updateBill(parseInt(id), formData);
      } else {
        await billsAPI.createBill(formData);
      }
      navigate('/bills');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save bill');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading bill data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Bill' : 'Create New Bill'}
          </h1>
          <p className="mt-2 text-gray-600">
            {isEditing ? 'Update your water bill information' : 'Add a new water bill to track your usage'}
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* OCR Component */}
          {!isEditing && (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Meter Reading Input
                </h2>
                <button
                  type="button"
                  onClick={() => setShowOCR(!showOCR)}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  {showOCR ? 'Hide' : 'Use'} Photo OCR
                </button>
              </div>
              {showOCR && <MeterOCR onReadingExtracted={handleOCRReading} />}
            </div>
          )}

          {/* Bill Form */}
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="period_month" className="block text-sm font-medium text-gray-700">
                  Period Month
                </label>
                <select
                  id="period_month"
                  name="period_month"
                  value={formData.period_month}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(2023, i).toLocaleDateString('en-US', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="period_year" className="block text-sm font-medium text-gray-700">
                  Period Year
                </label>
                <input
                  type="number"
                  id="period_year"
                  name="period_year"
                  value={formData.period_year}
                  onChange={handleChange}
                  required
                  min="2020"
                  max="2030"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="previous_reading" className="block text-sm font-medium text-gray-700">
                  Previous Reading (m³)
                </label>
                <input
                  type="number"
                  id="previous_reading"
                  name="previous_reading"
                  value={formData.previous_reading}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="current_reading" className="block text-sm font-medium text-gray-700">
                  Current Reading (m³)
                </label>
                <input
                  type="number"
                  id="current_reading"
                  name="current_reading"
                  value={formData.current_reading}
                  onChange={handleChange}
                  required
                  step="0.01"
                  min="0"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <input
                  type="date"
                  id="due_date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>

              {formData.status === 'paid' && (
                <div>
                  <label htmlFor="paid_date" className="block text-sm font-medium text-gray-700">
                    Paid Date
                  </label>
                  <input
                    type="date"
                    id="paid_date"
                    name="paid_date"
                    value={formData.paid_date}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Optional notes about this bill..."
              />
            </div>

            {/* Bill Calculation Preview */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Bill Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Usage:</span>
                  <span className="font-medium">{calculateUsage().toFixed(2)} m³</span>
                </div>
                <div className="flex justify-between">
                  <span>Calculated Cost:</span>
                  <span className="font-medium text-lg text-green-600">
                    {formatCurrency(calculateCost())}
                  </span>
                </div>
                <div className="pt-2 text-xs text-gray-600 border-t">
                  <p>Calculation: Flat fee Rp 20,000 for ≤20m³, then Rp 3,000/m³ for usage above that</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/bills')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : (isEditing ? 'Update Bill' : 'Create Bill')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BillForm;