import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosinstance";

import { useNavigate } from "react-router-dom";
import CourseCard from '../../components/customCourse/CourseCard';
import '../../assets/styles/pages/customCourse/myCourseListPage.css';


const MyCourseListPage = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get("/course/custom/list")
      .then(res => {
        console.log(res.data)
        setCourses(res.data)})
      .catch(err => console.error(err));
  }, []);

  const handleDelete=(courseId)=>{
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    axiosInstance({
      method : "delete",
      url:`/course/custom/${courseId}`,

    }).then(()=>{
      alert("코스가 삭제되었습니다.");
      setCourses(courses.filter(course=>course.courseId!==courseId))
    }).catch(err=>console.log(err))
  }

  return (
  <div className="my-course-list-page">
    <h2 className="my-course-list-title">코스 보관함</h2>

    <div className="course-card-grid">
      {courses.map(course => (
        <CourseCard
          key={course.courseId}
          course={course}
          onClick={() => navigate(`/course/custom/details/${course.courseId}`)} 
          onDelete={() => handleDelete(course.courseId)}
        />
      ))}
    </div>
  </div>
);
};

export default MyCourseListPage;