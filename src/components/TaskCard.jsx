import { useState } from 'react';

import './TaskCard.css';

function TaskCard({ task, isDragging, handleDelete, handleUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(task.name);

  const startEditing = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const stopEditing = () => {
    setIsEditing(false);
    if (editedName !== task.name && typeof handleUpdate === 'function') {
      handleUpdate(task.id, editedName)
        .then(() => console.log('Task name updated successfully.'))
        .catch((error) => console.error('Error updating task:', error));
    }
  };

  const handleInputChange = (e) => {
    setEditedName(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.stopPropagation();
      stopEditing();
    }
  };

  const confirmAndDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      handleDelete(task.id);
    }
  };

  return (
    <div className={`task-card ${isDragging ? 'dragging' : ''}`}>
      {isEditing ? (
        <input
          type="text"
          className="task-name-input"
          value={editedName}
          onChange={handleInputChange}
          onBlur={stopEditing}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <span className="task-name">{task.name}</span>
      )}
      <div className="button-group">
        <button className="edit-button" onClick={startEditing}></button>
        <button className="delete-button" onClick={confirmAndDelete}></button>
      </div>
    </div>
  );
}

export default TaskCard;
