
import axiosInstance from "../api/axiosinstance"



export const addTempCourse = ({ restaurantId, restaurantName }) => {
    const saved = JSON.parse(localStorage.getItem("myCourseSpots")) || []; //localstorage 에 이미 저장된 리스트 가져오기
    
    if(saved.length===3) {
        alert("코스에 추가 가능한 식당은 최대 3곳 입니다.");
        return;
    }
    const isAlreadyExist = saved.filter(s=>s.restaurantId===restaurantId);


    if (isAlreadyExist.length===1) {
        alert("이미 코스에 추가된 식당입니다.");
        return;
    }
    
    const visitOrder = saved.length + 1;
    const spot = { restaurantId, restaurantName,  visitOrder };

    // ✅ localStorage에 추가
    localStorage.setItem("myCourseSpots", JSON.stringify([...saved, spot]));
    dispatchEvent(new Event("storage")); // 푸터에 숫자 반영되게!
    
    //DB에 추가
    axiosInstance({
        method: "post",
        url: "/course/temp",
        data: {
            restaurantId,
            restaurantName,
            visitOrder
        }
    }).then((res) => {
        alert(res.data);

    }).catch(((err)=> {
        console.error(err);
    }))
}