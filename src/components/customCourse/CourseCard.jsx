import '../../assets/styles/customCourse/courseCard.css';

const CourseCard = ({ course, onClick }) => {
    return (
      <div className="course-card" onClick={onClick}>
        <div className="course-title">{course.title}</div>
        <div className="course-info">{course.resTempDTOList.length}곳</div>
      </div>
    );
  };
  
  export default CourseCard;