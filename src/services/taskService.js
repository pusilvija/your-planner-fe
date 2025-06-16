import { axiosInstance } from './';

export const updateTaskName = async (taskId, newName, setTasks) => {
  try {
    const response = await axiosInstance.patch(`/tasks/${taskId}/`, {
      name: newName,
    });
    console.log(`Task ${taskId} updated successfully.`, response.data);
    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };

      Object.keys(updatedTasks).forEach((status) => {
        const taskIndex = updatedTasks[status].findIndex(
          (task) => task.id === taskId
        );
        if (taskIndex !== -1) {
          updatedTasks[status][taskIndex] = {
            ...updatedTasks[status][taskIndex],
            name: newName,
          };
        }
      });

      return updatedTasks;
    });
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    await axiosInstance.delete(`/tasks/${taskId}/delete/`);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

export const fetchTaskDetails = async (taskId) => {
  return axiosInstance.get(`/tasks/${taskId}/`);
};

export const createTask = async (taskData) => {
  return axiosInstance.post('/tasks/add-new-task/', taskData);
};

export const updateTask = async (taskId, taskData) => {
  return axiosInstance.patch(`/tasks/${taskId}/`, taskData);
};

export const syncTasksToBackend = async (tasks) => {
  try {
    const response = await axiosInstance.post('/taskboard/', tasks);
    console.log('Synced:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error syncing tasks:',
      error.response?.data || error.message
    );
    throw error;
  }
};
