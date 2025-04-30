import { useState } from 'react';
import './TaskCard.css';

function TaskCard({ task, isDragging, handleDelete, handleUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(task.name);

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    setEditedName(e.target.value); // Update the edited name
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    if (editedName !== task.name) {
      if (typeof handleUpdate === 'function') {
        handleUpdate(task.id, editedName)
          .then(() => {
            console.log('Task name updated successfully.');
          })
          .catch((error) => {
            console.error('Error updating task:', error);
          });
      } 
      else {
        console.error('handleUpdate is not a function');
      }
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      console.log('Enter key pressed');
      e.stopPropagation();
      handleInputBlur();
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
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          autoFocus
        />
      ) : (
        <span className="task-name">{task.name}</span>
      )}
      <div className="button-group">
        <button
          className="edit-button"
          onClick={handleEditClick}
        ></button>
        <button
          className="delete-button"
          onClick={(e) => {
            e.stopPropagation();
            const confirmDelete = window.confirm('Are you sure you want to delete this task?');
            if (confirmDelete) {
              handleDelete(task.id);
            }
          }}
        ></button>
      </div>
    </div>
  );
}

export default TaskCard;