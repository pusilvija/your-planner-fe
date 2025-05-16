import axiosInstance from './axiosConfig';


export const syncTasksToBackend = async (tasks) => {
  try {
    const response = await axiosInstance.post('/taskboard/', tasks);
    console.log('Synced:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error syncing tasks:', error.response?.data || error.message);
    throw error;
  }
};
