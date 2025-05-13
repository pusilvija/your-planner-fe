import axios from 'axios';


// Determine the base URL based on the environment
const baseURL =
  process.env.NODE_ENV === 'production'
    ? `${process.env.REACT_APP_RAILWAY_PUBLIC_DOMAIN}/api` // production URL
    : '/api'; // local development URL

console.log('Base URL:', baseURL); // Log the base URL to verify

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL, // Dynamically set the base URL
});


// Add a request interceptor to attach the token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
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


// Add a reusable function to fetch the task board
export const fetchTaskBoard = async () => {
  try {
    const response = await axiosInstance.get('/taskboard/'); // Use axiosInstance to fetch tasks
    console.log('TaskBoard data:', response.data);
    return response.data; // Return the data for further use
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error; // Re-throw the error for the caller to handle
  }
};

export default axiosInstance;