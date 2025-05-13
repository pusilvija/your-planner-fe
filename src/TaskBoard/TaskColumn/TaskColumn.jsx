import { useDroppable } from '@dnd-kit/core';
import { useNavigate } from 'react-router-dom';

import './TaskColumn.css';
import SortableTaskCard from './TaskCard/SortableTaskCard.jsx';
import axiosInstance from '../../axiosConfig.js'; // Import axiosInstance

function TaskColumn({ status, tasks, handleClick, setTasks, updateTaskName }) {
  const { setNodeRef } = useDroppable({ id: status });
  const navigate = useNavigate();

  const handleAddTask = () => {
    navigate(`/tasks/new?status=${status}`);
  };

  const handleDelete = (taskId) => {
    // Remove the task from the frontend state
    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };
      updatedTasks[status] = updatedTasks[status].filter((task) => task.id !== taskId);
      return updatedTasks;
    });

    // Send a DELETE request to the backend using axiosInstance
    axiosInstance
      .delete(`/tasks/${taskId}/delete/`)
      .then(() => {
        console.log(`Task ${taskId} deleted successfully.`);
      })
      .catch((error) => {
        console.error('Error deleting task:', error);
      });
  };

  return (
    <div ref={setNodeRef} className="task-column">
      <div className="column-header">
        <h2>{status}</h2>
        <button className="add-task-btn" onClick={handleAddTask}>+</button>
      </div>

      {tasks.map((task) => (
        <SortableTaskCard
          key={task.id}
          task={task}
          onClick={() => handleClick(task.id)}
          handleDelete={handleDelete}
          handleUpdate={(taskId, newName) => updateTaskName(taskId, newName)}
        />
      ))}
    </div>
  );
}

export default TaskColumn;