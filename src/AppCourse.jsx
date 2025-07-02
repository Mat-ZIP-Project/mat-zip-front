import { Routes, Route, useNavigate } from "react-router-dom";
import TempCoursePage from './pages/TempCoursePage';
import MyCourseListPage from './pages/MyCourseListPage';
import CourseDetailPage from './pages/CourseDetailPage';


function AppCourse() {
  const navigate = useNavigate();

  return (
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
  );
}

export default AppCourse;