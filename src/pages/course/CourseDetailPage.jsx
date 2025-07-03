import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosinstance";
import CourseHeader from '../../components/customCourse/CourseHeader';
import CourseMap from '../../components/customCourse/CourseMap';
import ActionButtons from '../../components/common/ActionButtons';
import '../../assets/styles/pages/courseDetailPage.css';
import CustomCourseSpotList from "../../components/customCourse/CustomCourseSpotList";

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [editable, setEditable] = useState(false);
  const [spots, setSpots] = useState([]);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get(`/course/details/${courseId}`)
      .then(res => {
        setCourse(res.data);
        setSpots(res.data.resTempDTOList);
        setTitle(res.data.title);
      })
      .catch(err => console.error(err));
  }, [courseId]);

  if (!course) return <div>로딩중...</div>;

  const handleSave = () => {
    axiosInstance({
      method : "put",
      url : `/course/custom/${courseId}`,
      data : spots.map(spot => ({
      ...spot,
      title
    }))
  }).then(()=>{
      alert("코스가 수정 되었습니다.");
      setEditable(false);}
    ).
    catch(err=>console.log(err))
    

  };

  return (
    <div>
      <CourseHeader title={title} setTitle={setTitle} editable={editable} />
      <CourseMap spots={spots} editable={editable} />
      <CustomCourseSpotList spots={spots} setSpots={setSpots} editable={editable} />
      
      <ActionButtons
        buttons={[
          { text: editable ? "저장" : "수정", onClick: () => editable ? handleSave() : setEditable(true) },
          { text: "코스 보관함", onClick: () => navigate("/my-courses") },
        ]}
      />
    </div>
  );
};

export default CourseDetailPage;