import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001', // Replace with your backend URL
});

// Add an interceptor to include the JWT in the Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token; // No "Bearer" prefix
  }
  return config;
});

export default api;