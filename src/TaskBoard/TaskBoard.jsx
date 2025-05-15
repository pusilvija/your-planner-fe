import { useEffect, useState } from 'react';
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

import TaskColumn from './TaskColumn/TaskColumn.jsx';
import TaskCard from './TaskColumn/TaskCard/TaskCard.jsx';
import useTaskDragHandlers from './useTaskDragHandlers.js';
import { syncTasksToBackend } from '../api.js'; // Updated import
import './TaskBoard.css';
import { fetchTaskBoard } from '../axiosConfig.js'; // Import the reusable fetch function
import axiosInstance from '../axiosConfig.js';

import React from 'react';
import WeatherApp from '../WeatherApp.js';

const statuses = ['to do', 'in progress', 'done'];

function TaskBoard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      console.log('Logging out...'); // Add a console message for logging out
  
      // Call the backend logout endpoint
      await axiosInstance.post('/logout/'); // Use POST for logout
  
      // Clear the token from localStorage
      localStorage.removeItem('token');
  
      console.log('Logout successful. Redirecting to login page.'); // Add a success message
  
      // Redirect to the login page
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error.response?.data || error.message);
      // Optionally, show an error message to the user
    }
  };

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

  // Fetch tasks from the backend
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTaskBoard(); // Fetch tasks using the reusable function
        setTasks(data || { 'to do': [], 'in progress': [], 'done': [] }); // Handle empty response
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
    (t) => syncTasksToBackend(t) // Use the updated syncTasksToBackend function
  );

  // Update task name
  const updateTaskName = (taskId, newName) => {
    return axiosInstance.patch(`/tasks/${taskId}/`, { name: newName })
      .then(response => {
        console.log(`Task ${taskId} updated successfully.`, response.data);
        setTasks(prevTasks => {
          const updatedTasks = { ...prevTasks };

          // Iterate through each status to find the task
          Object.keys(updatedTasks).forEach(status => {
            const taskIndex = updatedTasks[status].findIndex(task => task.id === taskId);
            if (taskIndex !== -1) {
              // Update the task name
              updatedTasks[status][taskIndex] = {
                ...updatedTasks[status][taskIndex],
                name: newName,
              };
            }
          });

          return updatedTasks;
        });
      })
      .catch(error => {
        console.error('Error updating task:', error);
        throw error; // Re-throw the error so the caller can handle it
      });
  };

  const handleClick = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };

  return (
    <div className="taskboard-container">
      <WeatherApp />
      <header className="taskboard-header">
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>
      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
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