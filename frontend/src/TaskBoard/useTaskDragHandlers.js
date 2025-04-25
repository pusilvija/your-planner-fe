import { useState } from 'react';

const statuses = ['to do', 'in progress', 'done'];

export default function useTaskDragHandlers(tasks, setTasks, setActiveTask, setDraggingTaskId, syncWithBackend) {
  const findTaskStatus = (id) => {
    return statuses.find((status) =>
      tasks[status].some((task) => task.id.toString() === id)
    );
  };

  const handleDragStart = ({ active }) => {
    const activeId = active.id.toString();
    const status = findTaskStatus(activeId);

    if (status) {
      const task = tasks[status].find((task) => task.id.toString() === activeId);
      setActiveTask(task);
    }

    setDraggingTaskId(activeId);
  };

  const handleDragOver = ({ active, over }) => {
    if (!over) return;
    const activeId = active.id.toString();
    const overId = over.id.toString();
    if (activeId === overId) return;

    const activeStatus = findTaskStatus(activeId);
    const overStatus = findTaskStatus(overId);

    if (!activeStatus || !overStatus) return;

    if (activeStatus !== overStatus) {
      const movedTask = tasks[activeStatus].find(task => task.id.toString() === activeId);

      setTasks(prev => {
        const newActive = prev[activeStatus].filter(task => task.id.toString() !== activeId);
        const newOver = [...prev[overStatus]];
        const overIndex = newOver.findIndex(task => task.id.toString() === overId);
        newOver.splice(overIndex, 0, movedTask);

        return {
          ...prev,
          [activeStatus]: newActive,
          [overStatus]: newOver,
        };
      });
    } else {
      setTasks(prev => {
        const updated = [...prev[activeStatus]];
        const from = updated.findIndex(t => t.id.toString() === activeId);
        const to = updated.findIndex(t => t.id.toString() === overId);

        if (from !== to) {
          const [moved] = updated.splice(from, 1);
          updated.splice(to, 0, moved);
        }

        return {
          ...prev,
          [activeStatus]: updated,
        };
      });
    }
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveTask(null);
    setDraggingTaskId(null);

    if (!over || active.id === over.id) return;
    syncWithBackend(tasks);
  };

  return { handleDragStart, handleDragOver, handleDragEnd };
}
