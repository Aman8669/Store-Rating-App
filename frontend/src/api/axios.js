import axios from 'axios';

const API = axios.create({
  // Ensure "https://" and NO trailing slash at the end
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://store-rating-app-backend-aiv2.onrender.com/api',
  timeout: 30000, // ✅ 30s timeout — Render cold starts can take ~20s
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request Interceptor — Attach JWT token to every request
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem('token');
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor — Handle auth errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Auto-logout if token is invalid/expired
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Optional: redirect to login (uncomment if using react-router)
      // if (window.location.pathname !== '/login') {
      //   window.location.href = '/login';
      // }
    }
    return Promise.reject(error);
  }
);

export default API;