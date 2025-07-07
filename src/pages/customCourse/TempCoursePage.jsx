import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosinstance";

import { useNavigate } from "react-router-dom";
import CourseMap from '../../components/customCourse/CourseMap';
import CourseSpotList from '../../components/customCourse/CourseSpotList';
import ActionButtons from '../../components/common/ActionButtons';

import CourseHeader from "../../components/customCourse/CourseHeader";
import '../../assets/styles/pages/customCourse/tempCoursePage.css';



const TempCoursePage = () => {
  const navigate = useNavigate();
  
  const [spots, setSpots] = useState([]);
  const [title, setTitle] = useState("");
  

  useEffect(() => {
    
    axiosInstance({
      method: "get",
      url: "/course/temp",
      // headers: {
      //   Authorization : "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMSIsInJvbGUiOiJST0xFX1VTRVIiLCJpYXQiOjE3NTE1MjIzNTksImV4cCI6MTc1MTUyNDE1OX0.gdJhzXrJ8guxQXkPtnolZRVUMAzdhLzlJv9KXL9zdJ0"
      // }
    })
      .then(res => {
        console.log(res.data);
        res.data.sort((a, b) => a.visitOrder > b.visitOrder ? 1 : -1); //visitOrder 로 오름차순정렬
        setSpots(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  const saveCourse = () => {
    if(title==="") {
     alert("코스명을 입력해주세요");
     return; 
    }
    if(spots.length===0){
      alert("코스를 1개 이상 담아주세요");
      return;
    }
    const titleWithCourse =  spots.map(spot => ({...spot,title}));
    axiosInstance({
      method: "post",
      url: "/course/custom",
      // headers: {
      //   Authorization : "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMSIsInJvbGUiOiJST0xFX1VTRVIiLCJpYXQiOjE3NTE1MjIzNTksImV4cCI6MTc1MTUyNDE1OX0.gdJhzXrJ8guxQXkPtnolZRVUMAzdhLzlJv9KXL9zdJ0"
      // },
      data: titleWithCourse
      
    }).then(res => {
      console.log(res.data)
      alert(res.data);
      setSpots([]);
      setTitle("");
    })
  }

  return (
    <div>
      <CourseHeader title={title} setTitle={setTitle} editable={true}/>
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