import axios from 'axios';

// Create axios instances for each microservice
const createAxiosInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add token to every request
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle errors
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.error('Authentication error:', error.response.data);
        // Optionally redirect to login
        // window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Axios instances for each service
export const userServiceAxios = createAxiosInstance('http://localhost:8085');
export const productServiceAxios = createAxiosInstance('http://localhost:8081');
export const orderServiceAxios = createAxiosInstance('http://localhost:8082');
export const paymentServiceAxios = createAxiosInstance('http://localhost:8083');

// Default export is the user service instance
export default userServiceAxios;
