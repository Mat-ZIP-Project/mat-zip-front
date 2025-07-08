import '../../assets/styles/customCourse/courseCard.css';
import { X } from "lucide-react"; // 아이콘 라이브러리 사용 (선택)

const CourseCard = ({ course, onClick, onDelete }) => {
  return (
    <div className="course-card" onClick={onClick}>
      <button
        className="course-delete-button"
        onClick={(e) => {
          e.stopPropagation(); // 부모 클릭 방지
          onDelete();
        }}
      >
        <X size={16} />
      </button>
      <div className="course-title">{course.title}</div>
      <div className="course-info">{course.resTempDTOList?.length || 0}곳</div>
    </div>
  );
};

export default CourseCard;