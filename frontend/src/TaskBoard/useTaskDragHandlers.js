import { useState, useCallback } from 'react';
import { debounce } from 'lodash';

const statuses = ['to do', 'in progress', 'done'];

export default function useTaskDragHandlers(tasks, setTasks, setActiveTask, setDraggingTaskId, syncWithBackend) {
  const findTaskStatus = (id) => {
    return statuses.find((status) =>
      tasks[status].some((task) => task.id.toString() === id)
    );
  };

  const [originalPosition, setOriginalPosition] = useState(null);

  const handleDragStart = ({ active }) => {
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
      if (!over) return; // If there's no target, do nothing.

      const activeId = active.id.toString();
      const overId = over.id.toString();

      // If the active item is hovering over itself, do nothing.
      if (activeId === overId) {
        console.log('Active item is hovering over itself, skipping sync.');
        return;
      }

      const activeStatus = findTaskStatus(activeId);
      const overStatus = findTaskStatus(overId);

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

            return {
              ...prev,
              [activeStatus]: reordered,
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
    const overId = over?.id.toString();
    const overStatus = over ? findTaskStatus(overId) : null;

    console.log('Drag End:', { activeId, overId, originalPosition });

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

    console.log('Task moved:', { activeId, activeStatus, overId, overStatus });

    try {
      syncWithBackend(tasks);
    } catch (error) {
      console.error('Failed to sync with backend:', error);
    }
  };

  return { handleDragStart, handleDragOver, handleDragEnd };
}
