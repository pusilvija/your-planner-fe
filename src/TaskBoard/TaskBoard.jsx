import React, { useState } from 'react';
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

import useTaskDragHandlers from '../hooks/useTaskDragHandlers.js';
import useFetchTasks from '../hooks/useFetchTasks.js';
import { updateTaskName } from '../services/taskService.js';
import Logout from '../Auth/Logout.js';
import { syncTasksToBackend } from '../api.js';
import { STATUSES } from '../constants.js';

import './TaskBoard.css';


function TaskBoard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState(
    STATUSES.reduce((acc, status) => {
      acc[status] = [];
      return acc;
    }, {})
  );
  const [activeTask, setActiveTask] = useState(null);
  const [draggingTaskId, setDraggingTaskId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const { handleLogout } = Logout();

  useFetchTasks(setTasks);

  const { handleDragStart, handleDragOver, handleDragEnd } = useTaskDragHandlers(
    tasks,
    setTasks,
    setActiveTask,
    setDraggingTaskId,
    (t) => syncTasksToBackend(t)
  );

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
          {STATUSES.map((status) => (
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