import './TaskCard.css';


function TaskCard({ task }) {
  return (
    <div className="task-card">
      <h4>{task.name}</h4>
    </div>
  );
}

export default TaskCard;
