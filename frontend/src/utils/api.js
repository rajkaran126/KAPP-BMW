import axios from 'axios';

const getBaseUrl = () => {
    if (import.meta.env.VITE_API_URL) {
        const url = import.meta.env.VITE_API_URL.replace(/\/$/, '');
        return url.endsWith('/api') ? url : `${url}/api`;
    }
    return 'http://localhost:5000/api';
};

const api = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper to standardise response
const handleResponse = (response) => response.data;
const handleError = (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
};

// ─── Employee API ──────────────────────────────────────────────────────────────
export const employeeAPI = {
    getAll: () => api.get('/employees').then(handleResponse).catch(handleError),
    create: (data) => api.post('/employees', data).then(handleResponse).catch(handleError),
    update: (id, data) => api.put(`/employees/${id}`, data).then(handleResponse).catch(handleError),
    delete: (id) => api.delete(`/employees/${id}`).then(handleResponse).catch(handleError),
};

// ─── Car API ───────────────────────────────────────────────────────────────────
export const carAPI = {
    getAll: () => api.get('/cars').then(handleResponse).catch(handleError),
    create: (data) => api.post('/cars', data).then(handleResponse).catch(handleError),
    update: (id, data) => api.put(`/cars/${id}`, data).then(handleResponse).catch(handleError),
    delete: (id) => api.delete(`/cars/${id}`).then(handleResponse).catch(handleError),
};

// ─── Customer API ──────────────────────────────────────────────────────────────
export const customerAPI = {
    getAll: () => api.get('/customers').then(handleResponse).catch(handleError),
    create: (data) => api.post('/customers', data).then(handleResponse).catch(handleError),
    update: (id, data) => api.put(`/customers/${id}`, data).then(handleResponse).catch(handleError),
    delete: (id) => api.delete(`/customers/${id}`).then(handleResponse).catch(handleError),
};

// ─── Invoice API ───────────────────────────────────────────────────────────────
export const invoiceAPI = {
    getAll: () => api.get('/invoices').then(handleResponse).catch(handleError),
    create: (data) => api.post('/invoices', data).then(handleResponse).catch(handleError),
    delete: (id) => api.delete(`/invoices/${id}`).then(handleResponse).catch(handleError),
};

// ─── Reports API ────────────────────────────────────────────────────────────────
export const reportsAPI = {
    getSalesReport: () => api.get('/reports/sales').then(handleResponse).catch(handleError),
    getAvailableCarsSummary: () => api.get('/reports/available-cars').then(handleResponse).catch(handleError),
};

// ─── Analytics API ──────────────────────────────────────────────────────────────
export const analyticsAPI = {
    getOverview: () => api.get('/analytics/overview').then(handleResponse).catch(handleError),
    getSalesTrend: () => api.get('/analytics/sales-trend').then(handleResponse).catch(handleError),
    getModelPerformance: () => api.get('/analytics/model-performance').then(handleResponse).catch(handleError),
    getEmployeePerformance: () => api.get('/analytics/employee-performance').then(handleResponse).catch(handleError),
    getCustomerInsights: () => api.get('/analytics/customer-insights').then(handleResponse).catch(handleError),
    getAIInsights: (data) => api.post('/analytics/ai-insights', data).then(handleResponse).catch(handleError),
};

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials).then(handleResponse).catch(handleError),
    signup: (data) => api.post('/auth/signup', data).then(handleResponse).catch(handleError),
    updateProfile: (id, data) => api.put(`/auth/${id}`, data).then(handleResponse).catch(handleError),
};

// Default export helpers for quick invocation
export default {
    getEmployees: employeeAPI.getAll,
    getCars: carAPI.getAll,
    getCustomers: customerAPI.getAll,
    getInvoices: invoiceAPI.getAll,
    createInvoice: invoiceAPI.create,
    deleteInvoice: invoiceAPI.delete,
    employeeAPI,
    carAPI,
    customerAPI,
    invoiceAPI,
    reportsAPI,
    analyticsAPI,
    authAPI
};

