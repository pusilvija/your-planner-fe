import { useState, useCallback } from 'react';
import { debounce } from 'lodash';

import { STATUSES } from '../utils/constants.js';


export default function useTaskDragHandlers(tasks, setTasks, setActiveTask, setDraggingTaskId, syncWithBackend) {
  const findTaskStatus = (id) => {
    return STATUSES.find((status) =>
      Array.isArray(tasks[status]) && tasks[status].some((task) => task.id.toString() === id)
    );
  };

  const [originalPosition, setOriginalPosition] = useState(null);

  const handleDragStart = ({ active }) => {
    setTasks((prev) => {
      const updatedTasks = { ...prev };
  
      // Ensure all statuses have an array, even if empty
      STATUSES.forEach((status) => {
        if (!Array.isArray(updatedTasks[status])) {
          updatedTasks[status] = [];
        }
      });
  
      return updatedTasks;
    });

    const activeId = active.id.toString();
    const status = findTaskStatus(activeId);

    if (status) {
      const task = tasks[status].find((task) => task.id.toString() === activeId);
      setActiveTask(task);

      // Track the original position of the task
      const originalIndex = tasks[status].findIndex((t) => t.id.toString() === activeId);
      setOriginalPosition({ status, index: originalIndex });
    }

    setDraggingTaskId(activeId);
  };

  const handleDragOver = useCallback(
    debounce(({ active, over }) => {
      if (!over) return;
      const activeId = active.id.toString();
      const overId = over.id.toString();
  
      if (activeId === overId) {
        console.log('Active item is hovering over itself, skipping sync.');
        return;
      }
  
      const activeStatus = findTaskStatus(activeId);
      let overStatus;
  
      if (STATUSES.includes(overId)) {
        overStatus = overId;
      } else {
        overStatus = findTaskStatus(overId);
      }
  
      if (!activeStatus || !overStatus) return;
  
      // If the task is being moved between columns.
      if (activeStatus !== overStatus) {
        const movedTask = tasks[activeStatus].find((task) => task.id.toString() === activeId);
  
        setTasks((prev) => {
          const newActive = prev[activeStatus].filter((task) => task.id.toString() !== activeId);
          const newOver = [...prev[overStatus]];
          const overIndex = newOver.findIndex((task) => task.id.toString() === overId);
          newOver.splice(overIndex, 0, movedTask);
  
          return {
            ...prev,
            [activeStatus]: newActive,
            [overStatus]: newOver,
          };
        });
      } else {
        // If the task is just reordered within the same column.
        setTasks((prev) => {
          const updated = [...prev[activeStatus]];
          const from = updated.findIndex((t) => t.id.toString() === activeId);
          const to = updated.findIndex((t) => t.id.toString() === overId);
  
          // Move the task within the same status.
          if (from !== to) {
            const reordered = [...updated];
            const [moved] = reordered.splice(from, 1);
            reordered.splice(to, 0, moved);
  
            // Update the order of all tasks based on their new positions
            const updatedTasks = reordered.map((task, index) => ({
              ...task,
              order: index, // Set the new order based on position
            }));
  
            return {
              ...prev,
              [activeStatus]: updatedTasks,
            };
          }
  
          return prev;
        });
      }
    }, 100),
    [tasks, setTasks, findTaskStatus]
  );

  const handleDragEnd = ({ active, over }) => {
    setActiveTask(null);
    setDraggingTaskId(null);

    const activeId = active.id.toString();

    // If there's no valid drop target, do nothing.
    if (!over && !originalPosition) {
      console.log('No valid drop target, skipping sync.');
      return;
    }

    const activeStatus = findTaskStatus(activeId);

    // Check if the task has returned to its original position
    if (
      originalPosition &&
      originalPosition.status === activeStatus &&
      tasks[activeStatus].findIndex((t) => t.id.toString() === activeId) === originalPosition.index
    ) {
      console.log('Task returned to its original position, skipping sync.');
      return;
    }

    try {
      syncWithBackend(tasks);
    } catch (error) {
      console.error('Failed to sync with backend:', error);
    }
  };

  return { handleDragStart, handleDragOver, handleDragEnd };
}
