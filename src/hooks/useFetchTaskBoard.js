import { useEffect } from 'react';

import { fetchTaskBoard } from '../axiosConfig.js';
import { STATUSES } from '../constants.js';


const useFetchTaskBoard = (setTasks) => {
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTaskBoard();
        setTasks(
          data ||
            STATUSES.reduce((acc, status) => {
              acc[status] = [];
              return acc;
            }, {})
        );
      } catch (error) {
        console.error('Failed to load tasks:', error);
      }
    };

    loadTasks();
  }, [setTasks]);
};

export default useFetchTaskBoard;
