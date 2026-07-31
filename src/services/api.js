import axios from 'axios';

const getApiBase = () => {
  if (import.meta.env.VITE_AWS_API_URL) return import.meta.env.VITE_AWS_API_URL.replace(/\/$/, '');
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL.replace(/\/$/, '');
  return 'https://uhzosq0g0i.execute-api.eu-west-1.amazonaws.com/prod';
};

const api = axios.create({
  baseURL: getApiBase() + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;
