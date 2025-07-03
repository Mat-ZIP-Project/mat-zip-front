import { Routes, Route, useNavigate } from "react-router-dom";


import './AppCourse.css';
import TempCoursePage from './pages/course/TempCoursePage';
import MyCourseListPage from './pages/course/MyCourseListPage';
import CourseDetailPage from './pages/course/CourseDetailPage';



function AppCourse() {
  const navigate = useNavigate();

  return (
    <div className="app-wrapper">
      <div className="app-container">
        <h1>맛ZIP</h1>

        <div className="main-buttons">
          <button onClick={() => navigate("/course/temp")}>나만의 코스</button>
          <button onClick={() => navigate("/my-courses")}>코스 보관함</button>
        </div>

        <Routes>
          <Route path="/course/temp" element={<TempCoursePage />} />
          <Route path="/my-courses" element={<MyCourseListPage />} />
          <Route path="/course/custom/details/:courseId" element={<CourseDetailPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default AppCourse;