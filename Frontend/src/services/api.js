import axios from 'axios';
import { config } from '../config/config';

const API_BASE_URL = config.API_BASE_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (fullName, email, password) => 
    api.post('/auth/register', { fullName, email, password }),
};

// Chat API
export const chatAPI = {
  getChats: () => api.get('/chat'),
  createChat: (title) => api.post('/chat', { title }),
  getChatMessages: (chatId) => api.get(`/chat/${chatId}/messages`),
  deleteChat: (chatId) => api.delete(`/chat/${chatId}`),
  updateChat: (chatId, title) => api.patch(`/chat/${chatId}`, { title }),
};

export default api;
