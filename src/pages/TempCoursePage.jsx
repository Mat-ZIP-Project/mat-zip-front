import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosinstance";

import { useNavigate } from "react-router-dom";
import CourseMap from '../components/customCourse/CourseMap';
import CourseSpotList from '../components/customCourse/CourseSpotList';
import ActionButtons from '../components/common/ActionButtons';

const TempCoursePage = () => {
  const [spots, setSpots] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get("/course/temp")
      .then(res => setSpots(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <CourseMap spots={spots} editable={true} />
      <CourseSpotList spots={spots} setSpots={setSpots} editable={true} />
      <ActionButtons
        buttons={[
          { text: "코스 저장", onClick: () => navigate("/course/save") },
          { text: "코스 보관함", onClick: () => navigate("/my-courses") },
        ]}
      />
    </div>
  );
};

export default TempCoursePage;