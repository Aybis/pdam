import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  register: (userData: any) =>
    api.post('/auth/register', userData),
};

export const billsAPI = {
  getAllBills: () => api.get('/bills'),
  getBill: (id: number) => api.get(`/bills/${id}`),
  createBill: (billData: any) => api.post('/bills', billData),
  updateBill: (id: number, billData: any) => api.put(`/bills/${id}`, billData),
  deleteBill: (id: number) => api.delete(`/bills/${id}`),
  getDashboardStats: () => api.get('/bills/dashboard/stats'),
};

export const ocrAPI = {
  processMeterPhoto: (file: File) => {
    const formData = new FormData();
    formData.append('meterPhoto', file);
    return api.post('/ocr/process-meter', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api;