import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import TaskCard from './TaskCard';


function SortableTaskCard({ task, onClick, handleDelete, handleUpdate }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div
      ref={setNodeRef}
      {...(task.isEditing ? {} : attributes)} // Disable drag attributes if editing
      {...(task.isEditing ? {} : listeners)} // Disable drag listeners if editing
      style={style}
      onClick={onClick}
    >
      <TaskCard
        task={task}
        isDragging={isDragging}
        handleDelete={handleDelete}
        handleUpdate={handleUpdate}/>
    </div>
  );
}

export default SortableTaskCard;
