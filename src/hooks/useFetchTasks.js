import { useEffect } from 'react';

import { fetchTasks } from '../axiosConfig.js';


const useFetchTasks = (setTasks) => {
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasks();

        setTasks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load tasks:', error);
        setTasks([]);
      }
    };

    loadTasks();
  }, [setTasks]);
};

export default useFetchTasks;
