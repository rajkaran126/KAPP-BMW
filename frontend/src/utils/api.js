import axios from 'axios';

const API_URL = 'https://kapp-bmw.onrender.com/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper to standardise response
const handleResponse = (response) => ({ data: response.data });
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
    getSalesReport: () => api.get('/reports/sales-performance').then(handleResponse).catch(handleError),
    getAvailableCarsSummary: () => api.get('/reports/inventory-status').then(handleResponse).catch(handleError),
};

// ─── AI Chat API ──────────────────────────────────────────────────────────────
export const chatAPI = {
    sendMessage: (message, history, user) => api.post('/chat', { message, history, user }).then((res) => res.data).catch(handleError),
};

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials).then(handleResponse).catch(handleError),
    signup: (data) => api.post('/auth/signup', data).then(handleResponse).catch(handleError),
    updateProfile: (id, data) => api.put(`/auth/${id}`, data).then(handleResponse).catch(handleError),
};

export default { employeeAPI, carAPI, customerAPI, invoiceAPI, reportsAPI, chatAPI, authAPI };

