import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosinstance";

import { useNavigate } from "react-router-dom";
import CourseMap from '../components/customCourse/CourseMap';
import CourseSpotList from '../components/customCourse/CourseSpotList';
import ActionButtons from '../components/common/ActionButtons';
import '../assets/styles/pages/tempCoursePage.css';



const TempCoursePage = () => {
  const [spots, setSpots] = useState([]);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance({
      method: "get",
      url: "/course/temp",
      headers: {
        Authorization : "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMSIsInJvbGUiOiJST0xFX1VTRVIiLCJpYXQiOjE3NTE0NDcwMTQsImV4cCI6MTc1MTQ0ODgxNH0.JUrYvnFGhF8qTvQfio6pR767oZvNXGvNBxkqdZ5CmLw"
      }
    })
      .then(res => {
        console.log(res.data);
        res.data.sort((a, b) => a.visitOrder > b.visitOrder ? 1 : -1); //visitOrder 로 오름차순정렬
        setSpots(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  const saveCourse = () => {
    const titleWithCourse =  spots.map(spot => ({...spot,title}));
    axiosInstance({
      method: "post",
      url: "/course/custom",
      headers: {
        Authorization : "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMSIsInJvbGUiOiJST0xFX1VTRVIiLCJpYXQiOjE3NTE0NDcwMTQsImV4cCI6MTc1MTQ0ODgxNH0.JUrYvnFGhF8qTvQfio6pR767oZvNXGvNBxkqdZ5CmLw"
      },
      data: titleWithCourse
      
    }).then(res => {
      console.log(res.data)
    })
  }

  return (
    <div>
      <input value={title} onChange={(e)=>{setTitle(e.target.value)}} placeholder="코스 제목을 입력하세요" />
      <CourseMap spots={spots} editable={true} />
      <CourseSpotList spots={spots} setSpots={setSpots} editable={true} />
      <ActionButtons
        buttons={[
          { text: "코스 저장", onClick: saveCourse },
          { text: "코스 보관함", onClick: () => navigate("/my-courses") },
        ]}
      />
    </div>
  );
};

export default TempCoursePage;