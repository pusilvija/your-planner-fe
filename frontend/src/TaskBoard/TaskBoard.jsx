import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

import TaskColumn from './TaskColumn/TaskColumn.jsx';
import TaskCard from './TaskColumn/TaskCard/TaskCard.jsx';
import useTaskDragHandlers from './useTaskDragHandlers';
import { syncTasksToBackend } from '../api.js';
import './TaskBoard.css';

const statuses = ['to do', 'in progress', 'done'];

function TaskBoard() {
  const [tasks, setTasks] = useState({
    'to do': [],
    'in progress': [],
    'done': [],
  });
  const [activeTask, setActiveTask] = useState(null);
  const [draggingTaskId, setDraggingTaskId] = useState(null);
  const navigate = useNavigate();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetch('/api/taskboard/')
      .then(res => res.json())
      .then(setTasks)
      .catch(console.error);
  }, []);

  const { handleDragStart, handleDragOver, handleDragEnd } = useTaskDragHandlers(
    tasks,
    setTasks,
    setActiveTask,
    setDraggingTaskId,
    (t) => syncTasksToBackend(t, statuses)
  );

  const handleClick = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };

  const updateTaskName = (taskId, newName) => {
    fetch(`/api/tasks/${taskId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newName }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update task name');
        }
        return response.json();
      })
      .then((updatedTask) => {
        console.log(`Task ${taskId} updated successfully.`, updatedTask);
      })
      .catch((error) => {
        console.error('Error updating task:', error);
      });
    return new Promise((resolve) => {
      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
  
        // Iterate through each status to find the task
        Object.keys(updatedTasks).forEach((status) => {
          const taskIndex = updatedTasks[status].findIndex((task) => task.id === taskId);
          if (taskIndex !== -1) {
            // Update the task name
            updatedTasks[status][taskIndex] = {
              ...updatedTasks[status][taskIndex],
              name: newName,
            };
          }
        });
  
        resolve(updatedTasks); // Resolve the Promise with the updated tasks
        return updatedTasks;
      });
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <h1 className="task-board-title">Planner</h1>
      <div className="task-board">

        {statuses.map((status) => (
          <SortableContext
            key={status}
            id={status}
            items={tasks[status].map((task) => task.id.toString())}
            strategy={verticalListSortingStrategy}
          >
            <TaskColumn
              status={status}
              tasks={tasks[status]}
              handleClick={handleClick}
              setTasks={setTasks}
              updateTaskName={updateTaskName}
            />
          </SortableContext>
        ))}
      </div>

      <DragOverlay>
        {activeTask && <TaskCard task={activeTask} isDragging />}
      </DragOverlay>
    </DndContext>
  );
}

export default TaskBoard;
