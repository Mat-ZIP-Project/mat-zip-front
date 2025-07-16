import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosinstance";
import { useNavigate } from "react-router-dom";
import CourseMap from '../../components/customCourse/CourseMap';
import CourseSpotList from '../../components/customCourse/CourseSpotList';
import ActionButtons from '../../components/common/ActionButtons';
import CourseHeader from "../../components/customCourse/CourseHeader";
import '../../assets/styles/pages/customCourse/tempCoursePage.css';
import { showErrorAlert, showErrorConfirmAlert, showSuccessConfirmAlert } from "../../utils/sweetAlert";



const TempCoursePage = () => {
  const navigate = useNavigate();
  
  const [spots, setSpots] = useState([]);
  const [title, setTitle] = useState("");
  

  useEffect(() => {
    
    axiosInstance({
      method: "get",
      url: "/course/temp",
    })
      .then(res => {
        console.log(res.data);
        res.data.sort((a, b) => a.visitOrder > b.visitOrder ? 1 : -1); //visitOrder 로 오름차순정렬
        setSpots(res.data);
        localStorage.setItem("myCourseSpots", JSON.stringify(res.data));  //로컬스토리지 코스 추가
      })
      .catch(err => console.error(err));
  }, []);

  const saveCourse = () => {
    if(title==="") {
     showErrorConfirmAlert("코스명을 입력해주세요", "");
     return; 
    }
    if(spots.length===0){
      showErrorConfirmAlert("코스를 1개 이상 담아주세요", "");
      return;
    }
    const titleWithCourse =  spots.map(spot => ({...spot,title}));
    axiosInstance({
      method: "post",
      url: "/course/custom",
      data: titleWithCourse
      
    }).then(res => {
      console.log(res.data)
      alert(res.data);
      localStorage.setItem("myCourseSpots", JSON.stringify([]));  //로컬스토리지 코스 삭제
      setSpots([]);
      setTitle("");
    })
  }

  return (
    <div className="temp-course-page">
      <CourseHeader title={title} setTitle={setTitle} editable={true}/>
      <CourseMap spots={spots} editable={true} />
      {spots.length!==0 ? <CourseSpotList spots={spots} setSpots={setSpots} editable={true} />
        : (
        <div className="empty-message">
          <p>저장된 식당이 없습니다.</p>
          <p>식당을 추가해 나만의 코스를 만들어보세요!</p>
        </div>
        )}
      <ActionButtons
        buttons={[
          { text: "코스 저장", onClick: saveCourse , spots },
          { text: "코스 보관함", onClick: () => navigate("/my-courses") },
        ]}
      />
    </div>
  );
};

export default TempCoursePage;