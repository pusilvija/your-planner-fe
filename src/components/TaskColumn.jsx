import { useDroppable } from '@dnd-kit/core';
import { useNavigate } from 'react-router-dom';

import { SortableTaskCard } from './';
import { deleteTask } from '../services';

import './TaskColumn.css';

function TaskColumn({ status, tasks, handleClick, setTasks, updateTaskName }) {
  const { setNodeRef } = useDroppable({ id: status });
  const navigate = useNavigate();

  const handleAddTask = () => {
    navigate(`/tasks/new?status=${status}`);
  };

  const handleDelete = async (taskId) => {
    try {
      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        updatedTasks[status] = updatedTasks[status].filter(
          (task) => task.id !== taskId
        );
        return updatedTasks;
      });

      await deleteTask(taskId);
      console.log(`Task ${taskId} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div ref={setNodeRef} className="task-column">
      <div className="column-header">
        <h2>{status}</h2>
        <button className="add-task-btn" onClick={handleAddTask}></button>
      </div>

      {tasks.map((task) => (
        <SortableTaskCard
          key={task.id}
          task={task}
          onClick={() => handleClick(task.id)}
          handleDelete={handleDelete}
          handleUpdate={(taskId, newName) =>
            updateTaskName(taskId, newName, setTasks)
          }
        />
      ))}
    </div>
  );
}

export default TaskColumn;
