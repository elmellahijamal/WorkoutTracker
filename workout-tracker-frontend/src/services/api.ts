import axios from 'axios';

//const API_BASE_URL = 'http://localhost:5077/api'; // Update with your API URL
const API_BASE_URL = 'http://localhost:5000/api';  // For Docker


export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});