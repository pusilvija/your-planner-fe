import TaskCard from './TaskCard/TaskCard.jsx';
import './TaskColumn.css';


function TaskColumn({ status, tasks }) {
  return (
    <div className="task-column">
      <h2>{status}</h2>
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

export default TaskColumn;
