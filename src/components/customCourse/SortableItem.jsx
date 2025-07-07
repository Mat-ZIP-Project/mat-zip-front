import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

const SortableItem = ({ id, index, restaurantName, onDelete, editable }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div className="spot-item" ref={setNodeRef} style={style} {...attributes}>
      <div className="drag-handle" {...listeners}>
        <GripVertical size={16} />
      </div>
      <div className="spot-content">
        {index + 1}. {restaurantName}
      </div>
      {editable && <button onClick={onDelete}>삭제</button>}
    </div>
  );
};

export default SortableItem;