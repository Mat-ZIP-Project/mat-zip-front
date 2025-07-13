import '../../assets/styles/customCourse/courseSpotList.css';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableItem from './SortableItem';
import axiosInstance from '../../api/axiosinstance';

const CourseSpotList = ({ spots, setSpots, editable }) => {

  const handleDelete = (index) => {
    console.log(editable)
    if (!editable) return;
    const newSpots = spots.filter((_, i) => i !== index);
    const newOrderedSpots = newSpots.map((spot, idx) => ({ 
      ...spot,
      visitOrder : idx + 1
    }));

    setSpots(newOrderedSpots);
    console.log(newOrderedSpots);
    changeTempCourse(newOrderedSpots); //DB 적용하기
  };

  const handleDragEnd = (event) => {
     if (!editable) return;  // 수정 불가 상태면 바로 리턴
    const { active, over } = event;

    if (!over||active.id === over.id) return;  // Drop 위치 없을 경우 예외 처리

    
      const oldIndex = spots.findIndex((spot) => spot.restaurantId === active.id);
      const newIndex = spots.findIndex((spot) => spot.restaurantId === over.id);

      const reorderedSpots = arrayMove(spots, oldIndex, newIndex);
      

      const updatedSpots = reorderedSpots.map((spot, idx) => ({
          ...spot,
        visitOrder : idx + 1
      }));   //visitOrder 바꾸기
      
      setSpots(updatedSpots);
      
      changeTempCourse(updatedSpots); //DB 적용하기
    

  };

  
  const changeTempCourse = (spots) => {
    console.log(spots);
    axiosInstance({
      method : "put",
      url: "/course/temp",
      data : spots
    })
      .then((res) => {
        localStorage.setItem("myCourseSpots", JSON.stringify([...spots]));  //로컬스토리지 코스 업데이트
        dispatchEvent(new Event("storage")); // 푸터에 숫자 반영되게!
        console.log(res)
    }).catch((err)=>{console.log(err)})
  }

  return (
    <div className="course-spot-list">
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
    </div>
  );
};

export default CourseSpotList;
