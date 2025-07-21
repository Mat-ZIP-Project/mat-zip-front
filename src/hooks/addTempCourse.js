

import axiosInstance from "../api/axiosinstance"
import { showInfoAlert, showErrorAlert, showSuccessAlert } from "../utils/sweetAlert";


export const addTempCourse = ({ restaurantId, restaurantName }) => {
   
    const auth = JSON.parse(localStorage.getItem("persist:auth"));
   
    if (!JSON.parse(auth.isAuthenticated)) {
        
        showInfoAlert("로그인 필요", "로그인 후 이용가능합니다.");
        return;
    }
     
    const saved = JSON.parse(localStorage.getItem("myCourseSpots")) || []; //localstorage 에 이미 저장된 리스트 가져오기
    
    if(saved.length===3) {
        showErrorAlert("코스 제한", "코스에 추가 가능한 식당은 최대 3곳 입니다.");
        return;
    }
    const isAlreadyExist = saved.filter(s=>s.restaurantId===restaurantId);


    if (isAlreadyExist.length===1) {
        showInfoAlert("중복 추가", "이미 코스에 추가된 식당입니다.");
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
        showSuccessAlert("코스 추가 완료", res.data);

    }).catch(((err)=> {
        showErrorAlert("코스 추가 실패", "오류가 발생했습니다.");
        console.error(err);
    }))
}