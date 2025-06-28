import axios from 'axios';

const API_BASE_URL = 'https://loopr-backend.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 unauthorized errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

// Transaction services
export const transactionService = {
  getTransactions: async (params) => {
    const response = await api.get('/transactions', { params });
    return response.data;
  },
  getTransactionAnalytics: async (params) => {
    const response = await api.get('/transactions/analytics', { params });
    return response.data;
  },
  getFilterOptions: async () => {
    const response = await api.get('/transactions/filters');
    return response.data;
  },
  createTransaction: async (transactionData) => {
    const response = await api.post('/transactions', transactionData);
    return response.data;
  }
};

// Export services
export const exportService = {
  getExportColumns: async () => {
    const response = await api.get('/export/columns');
    return response.data;
  },
  exportToCsv: async (exportData) => {
    const response = await api.post('/export/csv', exportData, { responseType: 'blob' });
    
    // Create a download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Set the filename based on Content-Disposition header if available
    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].trim()
      : `transactions_export_${new Date().toISOString().slice(0, 10)}.csv`;

    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return { success: true };
  }
};

// User services
export const userService = {
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.put('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  getAvatar: async () => {
    const response = await api.get('/users/avatar', { responseType: 'blob' });
    return response.data;
  },
};

export default api;
