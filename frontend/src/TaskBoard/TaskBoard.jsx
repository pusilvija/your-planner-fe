import { useEffect, useState } from 'react';
import TaskColumn from './TaskColumn/TaskColumn.jsx';
import TaskCard from './TaskColumn/TaskCard/TaskCard.jsx';
import './TaskBoard.css';
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
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetch('/api/taskboard/')
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
      })
      .catch(console.error);
  }, []);

  const handleDragStart = (event) => {

    const { active } = event;
    const activeId = active.id.toString();

    let activeStatus = null;
    for (const status of statuses) {
      if (tasks[status].some((task) => task.id.toString() === activeId)) {
        activeStatus = status;
        break;
      }
    }

    if (activeStatus) {
      const task = tasks[activeStatus].find((task) => task.id.toString() === activeId);
      setActiveTask(task);
    }

    setDraggingTaskId(activeId);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    let activeContainer, overContainer;
    statuses.forEach((status) => {
      if (tasks[status].some((task) => task.id.toString() === activeId)) {
        activeContainer = status;
      }
      if (tasks[status].some((task) => task.id.toString() === overId)) {
        overContainer = status;
      }
    });

    if (!activeContainer || !overContainer) return;

    if (activeContainer !== overContainer) {
      const activeTask = tasks[activeContainer].find(
        (task) => task.id.toString() === activeId
      );

      setTasks((prev) => {
        const activeTasks = prev[activeContainer].filter(
          (task) => task.id.toString() !== activeId
        );
        const overTasks = [...prev[overContainer]];

        const overIndex = overTasks.findIndex(
          (task) => task.id.toString() === overId
        );
        overTasks.splice(overIndex, 0, activeTask);

        return {
          ...prev,
          [activeContainer]: activeTasks,
          [overContainer]: overTasks,
        };
      });
    } else {
      setTasks((prev) => {
        const columnTasks = [...prev[activeContainer]];
        const oldIndex = columnTasks.findIndex(
          (task) => task.id.toString() === activeId
        );
        const newIndex = columnTasks.findIndex(
          (task) => task.id.toString() === overId
        );

        if (oldIndex !== newIndex) {
          const movedTask = columnTasks.splice(oldIndex, 1)[0];
          columnTasks.splice(newIndex, 0, movedTask);
        }

        return {
          ...prev,
          [activeContainer]: columnTasks,
        };
      });
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);
    setDraggingTaskId(null);

    if (!over || active.id === over.id) return;

    syncWithBackend(tasks);
  };

  const syncWithBackend = (taskState) => {
    const payload = {};
    for (const status of statuses) {
      payload[status] = taskState[status].map((task, index) => ({
        id: task.id,
        order: index,
      }));
    }

    fetch('/api/taskboard/', {
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

  const handleClick = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
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
            <TaskColumn
              key={status}
              status={status}
              tasks={tasks[status]}
              draggingTaskId={draggingTaskId}
              handleClick={handleClick}
            />
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
