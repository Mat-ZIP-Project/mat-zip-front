const CourseSpotList = ({ spots, setSpots, editable }) => {
  
    const handleDelete = (index) => {
      if (!editable) return;
      const newSpots = spots.filter((_, i) => i !== index);
      setSpots(newSpots);
    };
  
    return (
      <div className="course-spot-list">
        {spots.map((spot, idx) => (
          <div key={idx} className="spot-item">
            {idx + 1}. {spot.restaurantName}
            {editable && <button onClick={() => handleDelete(idx)}>삭제</button>}
          </div>
        ))}
      </div>
    );
  };
  
  export default CourseSpotList;