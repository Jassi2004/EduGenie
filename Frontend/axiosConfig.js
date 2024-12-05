import axios from 'axios';

// Create an axios instance with default configurations
const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Optional: Add request interceptor for additional configuration
api.interceptors.request.use((config) => {
    // You can add authentication tokens here if needed
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;