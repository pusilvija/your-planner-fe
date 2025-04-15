import { useEffect, useState } from 'react';
import TaskColumn from './TaskColumn/TaskColumn.jsx';
import TaskCard from './TaskColumn/TaskCard/TaskCard.jsx'; 
import './TaskBoard.css';

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
} from '@dnd-kit/sortable';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

const statuses = ['to do', 'in progress', 'done'];

function TaskBoard() {
  const [tasks, setTasks] = useState({
    'to do': [],
    'in progress': [],
    'done': [],
  });

  const [activeTask, setActiveTask] = useState(null); // Track the dragged task

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetch('http://localhost:8000/api/taskboard/')
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
      })
      .catch(console.error);
  }, []);

  const handleDragStart = (event) => {
    const { active } = event;
    const taskId = active.id;

    for (const status of statuses) {
      const task = tasks[status].find((t) => t.id.toString() === taskId);
      if (task) {
        setActiveTask(task);
        break;
      }
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null); // Clear overlay after drag

    if (!over || active.id === over.id) return;

    let sourceStatus, destinationStatus;
    let draggedTask = null;

    for (const status of statuses) {
      const taskIndex = tasks[status].findIndex((task) => task.id.toString() === active.id);
      if (taskIndex !== -1) {
        sourceStatus = status;
        draggedTask = tasks[status][taskIndex];
        break;
      }
    }

    for (const status of statuses) {
      const targetIndex = tasks[status].findIndex((task) => task.id.toString() === over.id);
      if (targetIndex !== -1) {
        destinationStatus = status;

        const updatedSource = tasks[sourceStatus].filter((task) => task.id.toString() !== active.id);
        const updatedDest = tasks[destinationStatus].filter((task) => task.id !== draggedTask.id);
        updatedDest.splice(targetIndex, 0, { ...draggedTask, status: destinationStatus });

        const updatedTasks = {
          ...tasks,
          [sourceStatus]: updatedSource,
          [destinationStatus]: updatedDest,
        };

        setTasks(updatedTasks);
        syncWithBackend(updatedTasks);
        return;
      }
    }

    if (draggedTask && sourceStatus !== over.id) {
      const updatedSource = tasks[sourceStatus].filter((task) => task.id.toString() !== active.id);
      const updatedDest = [...tasks[over.id], { ...draggedTask, status: over.id }];

      const updatedTasks = {
        ...tasks,
        [sourceStatus]: updatedSource,
        [over.id]: updatedDest,
      };

      setTasks(updatedTasks);
      syncWithBackend(updatedTasks);
    }
  };

  const syncWithBackend = (taskState) => {
    const payload = {};

    for (const status of statuses) {
      payload[status] = taskState[status].map((task, index) => ({
        id: task.id,
        order: index,
      }));
    }

    fetch('http://localhost:8000/api/taskboard/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Backend response:', data);
      })
      .catch((error) => {
        console.error('Error syncing with backend:', error);
      });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="task-board">
        {statuses.map((status) => (
          <SortableContext
            key={status}
            id={status}
            items={tasks[status].map((task) => task.id.toString())}
            strategy={verticalListSortingStrategy}
          >
            <TaskColumn status={status} tasks={tasks[status]} />
          </SortableContext>
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <TaskCard task={activeTask} isDragging={true} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default TaskBoard;
