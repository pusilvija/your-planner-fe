import axiosInstance from './axiosConfig.js';
export {
  updateTaskName,
  deleteTask,
  fetchTaskDetails,
  createTask,
  updateTask,
  syncTasksToBackend,
} from './taskService.js';
export { axiosInstance };
export { fetchTasks, fetchTaskBoard } from './axiosConfig.js';
