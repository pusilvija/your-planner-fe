import './TaskCard.css';


function TaskCard({ task, isDragging, handleDelete }) {
  return (
    <div className={`task-card ${isDragging ? 'dragging' : ''}`}>
      <span>{task.name}</span>
      <button className="delete-button"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(task.id);
              }}
      ></button>
    </div>
  );
}

export default TaskCard;
