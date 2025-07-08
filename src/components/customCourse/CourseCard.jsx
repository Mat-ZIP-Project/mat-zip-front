import '../../assets/styles/customCourse/courseCard.css';

const CourseCard = ({ course, onClick, onDelete }) => {
  return (
    <div className="course-card" onClick={onClick}>
      <div className="course-content" >
        <div className="course-title">{course.title}</div>
        <div className="course-info">{course.resTempDTOList?.length || 0}곳</div>
      </div>
      <button className="delete-btn" onClick={(e) => {
          e.stopPropagation();  // 부모 onClick 전파 방지
          onDelete();
        }}>삭제</button>
    </div>
  );
};

export default CourseCard;
