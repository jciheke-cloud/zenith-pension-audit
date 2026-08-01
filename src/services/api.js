import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

const API_BASE_URL = import.meta.env.VITE_AWS_API_GATEWAY || import.meta.env.VITE_API_URL || 'https://x30m765rv6.execute-api.eu-west-1.amazonaws.com/Prod';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach Cognito JWT token
api.interceptors.request.use(async (config) => {
  try {
    const session = await fetchAuthSession();
    const token = session?.tokens?.idToken?.toString();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.error('Error fetching auth session for api request:', err);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
