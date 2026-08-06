import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

const API_BASE_URL = import.meta.env.VITE_AWS_API_URL || import.meta.env.VITE_AWS_API_GATEWAY || import.meta.env.VITE_API_URL || 'https://uhzosq0g0i.execute-api.eu-west-1.amazonaws.com/prod';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Token caching to prevent fetchAuthSession bottleneck during concurrent requests
let cachedToken = null;
let tokenExpiry = null;

api.interceptors.request.use(async (config) => {
  try {
    if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
      config.headers.Authorization = `Bearer ${cachedToken}`;
      return config;
    }
    
    const session = await fetchAuthSession();
    const token = session?.tokens?.idToken?.toString();
    if (token) {
      cachedToken = token;
      tokenExpiry = Date.now() + 5 * 60 * 1000; // Cache for 5 minutes
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
