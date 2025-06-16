import axios from 'axios';


// Determine the base URL based on the environment
const baseURL =
  process.env.NODE_ENV === 'production'
    ? `${process.env.REACT_APP_RAILWAY_PUBLIC_DOMAIN}/api`
    : '/api';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL,
});


// Add a request interceptor to attach the token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Check the endpoint and set the appropriate token format
      if (config.url.includes('/taskboard/') || config.url.includes('/tasks/') || config.url.includes('/logout/')) {
        config.headers.Authorization = `Token ${token}`; // Use 'Token' format for taskboard-related endpoints
      } else if (config.url.includes('/login/') || config.url.includes('/register/')) {
        config.headers.Authorization = `Bearer ${token}`; // Use 'Bearer' format for logout, login, and registration
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export const fetchTaskBoard = async () => {
  try {
    const response = await axiosInstance.get('/taskboard/');
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};


export const fetchTasks = async () => {
  try {
    const response = await axiosInstance.get('/tasks/');
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};


export default axiosInstance;
