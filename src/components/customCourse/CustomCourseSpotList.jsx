import '../../assets/styles/customCourse/courseSpotList.css';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableItem from './SortableItem';

const CustomCourseSpotList = ({ spots, setSpots, editable }) => {

  const handleDelete = (index) => {
    if (!editable) return;
    const newSpots = spots.filter((_, i) => i !== index);
    const newOrderedSpots = newSpots.map((spot, idx) => ({ 
      ...spot,
      visitOrder: idx + 1
    }));
    setSpots(newOrderedSpots);
  };

  const handleDragEnd = (event) => {
    if (!editable) return;
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = spots.findIndex((spot) => spot.restaurantId === active.id);
      const newIndex = spots.findIndex((spot) => spot.restaurantId === over.id);

      const reorderedSpots = arrayMove(spots, oldIndex, newIndex);
      const updatedSpots = reorderedSpots.map((spot, idx) => ({
        ...spot,
        visitOrder: idx + 1
      }));

      setSpots(updatedSpots);
    }
  };

  return (
    <div className="course-spot-list">
      {editable ? (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={spots.map(spot => spot.restaurantId)}
            strategy={verticalListSortingStrategy}
          >
            {spots.map((spot, idx) => (
              <SortableItem
                key={spot.restaurantId}
                id={spot.restaurantId}
                index={idx}
                restaurantName={spot.restaurantName}
                onDelete={() => handleDelete(idx)}
                editable={editable}
              />
            ))}
          </SortableContext>
        </DndContext>
      ) : (
        spots.map((spot, idx) => (
          <div key={spot.restaurantId} className="spot-item">
            {idx + 1}. {spot.restaurantName}
          </div>
        ))
      )}
    </div>
  );
};

export default CustomCourseSpotList;