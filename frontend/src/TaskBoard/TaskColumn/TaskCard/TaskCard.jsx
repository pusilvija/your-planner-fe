import './TaskCard.css';


function TaskCard({ task, isDragging }) {
  return (
    <div className={`task-card ${isDragging ? 'dragging' : ''}`}>
      {task.name}
    </div>
  );
}

export default TaskCard;
