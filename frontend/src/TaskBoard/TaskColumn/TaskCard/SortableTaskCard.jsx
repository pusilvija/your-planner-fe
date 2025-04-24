import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskCard from './TaskCard';


function SortableTaskCard({ task, onClick, draggingTaskId }) {
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
    <div style={style}>
      <div onClick={onClick}>
        <div
          ref={setNodeRef}
          {...attributes}
          {...listeners}
        >
          <TaskCard task={task} isDragging={task.id.toString() === draggingTaskId} />
        </div>
      </div>
    </div>
  );
}

export default SortableTaskCard;
