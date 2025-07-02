import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosinstance";
import CourseHeader from '../components/customCourse/CourseHeader';
import CourseMap from '../components/customCourse/CourseMap';
import CourseSpotList from '../components/customCourse/CourseSpotList';
import ActionButtons from '../components/common/ActionButtons';
import '../assets/styles/pages/courseDetailPage.css';



const CourseDetailPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [editable, setEditable] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get(`/course/custom/details/${courseId}`)
      .then(res => setCourse(res.data))
      .catch(err => console.error(err));
  }, [courseId]);

  if (!course) return <div>로딩중...</div>;

  return (
    <div>
      <CourseHeader title={course.title} setTitle={() => {}} editable={editable} />
      <CourseMap spots={course.resTempDTOList} editable={editable} />
      <CourseSpotList spots={course.resTempDTOList} setSpots={() => {}} editable={editable} />
      <ActionButtons
        buttons={[
          { text: editable ? "저장" : "수정", onClick: () => setEditable(!editable) },
          { text: "코스 보관함", onClick: () => navigate("/my-courses") },
        ]}
      />
    </div>
  );
};

export default CourseDetailPage;