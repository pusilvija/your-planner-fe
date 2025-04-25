import { useDroppable } from '@dnd-kit/core';

import './TaskColumn.css';
import SortableTaskCard from './TaskCard/SortableTaskCard.jsx';


function TaskColumn({ status, tasks, draggingTaskId, handleClick }) {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div ref={setNodeRef} className="task-column">
      <div className="column-header">
        <h2>{status}</h2>
        <button className="add-task-btn">+</button>
      </div>

      {tasks.map((task) => (
        <SortableTaskCard
          key={task.id}
          task={task}
          onClick={() => handleClick(task.id)}
        />
      ))}
    </div>
  );
}

export default TaskColumn;
