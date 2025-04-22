import TaskCard from './TaskCard/TaskCard.jsx';
import './TaskColumn.css';
import { SortableItem } from './SortableItem.jsx';
import { useDroppable } from '@dnd-kit/core';
import { Link } from 'react-router-dom';

function TaskColumn({ status, tasks }) {
  const { setNodeRef } = useDroppable({
    id: status, // Make the entire column droppable
  });

  return (
    <div ref={setNodeRef} className="task-column">
      <div className="column-header">
        <h2>{status}</h2>
        <button className="add-task-btn">+</button>
      </div>

      {tasks.map(task => (
        <SortableItem key={task.id} id={task.id.toString()}>
          <Link to={`/tasks/${task.id}`} className="task-card-link">
            <TaskCard task={task} />
          </Link>
        </SortableItem>
      ))}
    </div>
  );
}

export default TaskColumn;
