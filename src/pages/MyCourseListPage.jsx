// import { useState, useEffect } from "react";
// import axiosInstance from "../api/axiosinstance";

// import { useNavigate } from "react-router-dom";
// import CourseCard from '../components/customCourse/CourseCard';

// const MyCourseListPage = () => {
//   const [courses, setCourses] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     axiosInstance.get("/course/custom/list")
//       .then(res => setCourses(res.data))
//       .catch(err => console.error(err));
//   }, []);

//   return (
//     <div>
//       <h2>코스 보관함</h2>
//       {courses.map(course => (
//         <CourseCard
//           key={course.courseId}
//           course={course}
//           onClick={() => navigate(`/course/custom/details/${course.courseId}`)}
//         />
//       ))}
//     </div>
//   );
// };

// export default MyCourseListPage;
