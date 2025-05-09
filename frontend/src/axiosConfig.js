import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api', // Set your base API URL
});

// Add a request interceptor to attach the token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    if (token) {
      // config.headers.Authorization = `Bearer ${token}`; // Attach the token to the Authorization header
      config.headers.Authorization = `Token ${token}`;
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