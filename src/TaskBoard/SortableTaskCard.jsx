import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import TaskCard from './TaskCard';


function getSortableStyle(transform, transition, isDragging) {
  return {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
}

function SortableTaskCard({ task, onClick, handleDelete, handleUpdate }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id.toString() });

  const style = getSortableStyle(transform, transition, isDragging);
  const dragProps = task.isEditing ? {} : { ...attributes, ...listeners }; // Disable drag attributes & listeners if editing

  return (
    <div
      ref={setNodeRef}
      {...dragProps}
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
