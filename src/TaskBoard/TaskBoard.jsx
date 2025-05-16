import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  DndContext,
  rectIntersection,
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

import TaskColumn from './TaskColumn.jsx';
import TaskCard from './TaskCard.jsx';
import WeatherApp from '../WeatherApp/WeatherApp.js';

import useTaskDragHandlers from './useTaskDragHandlers.js';
import { syncTasksToBackend } from '../api.js';
import { fetchTaskBoard } from '../axiosConfig.js';
import axiosInstance from '../axiosConfig.js';

import './TaskBoard.css';


const statuses = ['to do', 'in progress', 'done'];

function TaskBoard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState({
    'to do': [],
    'in progress': [],
    'done': [],
  });
  const [activeTask, setActiveTask] = useState(null);
  const [draggingTaskId, setDraggingTaskId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Handle logout
  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      await axiosInstance.post('/logout/');
      localStorage.removeItem('token');
      console.log('Logout successful. Redirecting to login page.');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error.response?.data || error.message);
    }
  };

  // Fetch tasks from the backend
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTaskBoard();
        setTasks(data || { 'to do': [], 'in progress': [], 'done': [] });
      } catch (error) {
        console.error('Failed to load tasks:', error);
      }
    };

    loadTasks();
  }, []);

  const { handleDragStart, handleDragOver, handleDragEnd } = useTaskDragHandlers(
    tasks,
    setTasks,
    setActiveTask,
    setDraggingTaskId,
    (t) => syncTasksToBackend(t)
  );

  // Update task name
  const updateTaskName = (taskId, newName) => {
    return axiosInstance
      .patch(`/tasks/${taskId}/`, { name: newName })
      .then((response) => {
        console.log(`Task ${taskId} updated successfully.`, response.data);
        setTasks((prevTasks) => {
          const updatedTasks = { ...prevTasks };

          Object.keys(updatedTasks).forEach((status) => {
            const taskIndex = updatedTasks[status].findIndex((task) => task.id === taskId);
            if (taskIndex !== -1) {
              updatedTasks[status][taskIndex] = {
                ...updatedTasks[status][taskIndex],
                name: newName,
              };
            }
          });

          return updatedTasks;
        });
      })
      .catch((error) => {
        console.error('Error updating task:', error);
        throw error;
      });
  };

  const handleClick = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };

  return (
    <div className="taskboard-container">
      <WeatherApp />
      <header className="taskboard-header">
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>
      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <h1 className="task-board-title">Your Planner</h1>
        <div className="task-board">
          {statuses.map((status) => (
            <SortableContext
              key={status}
              id={status}
              items={(tasks[status] || []).map((task) => task.id.toString())}
              strategy={verticalListSortingStrategy}
            >
              <TaskColumn
                status={status}
                tasks={tasks[status] || []}
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
    </div>
  );
}

export default TaskBoard;