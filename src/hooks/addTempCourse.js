
import axiosInstance from "../api/axiosinstance"



export const addTempCourse = ({ restaurantId, restaurantName }) => {
    const saved = JSON.parse(localStorage.getItem("myCourseSpots")) || []; //localstorage 에 이미 저장된 리스트 가져오기
    
    const isAlreadyExist = saved.some(s => {
        s.restaurantId === restaurantId;
        // console.log(typeof (restaurantId), typeof (s.restaurantId));
    });
    console.log(isAlreadyExist);
    if (isAlreadyExist) {
        alert("이미 코스에 추가된 식당입니다.");
        return;
    }
    
    const visitOrder = saved.length + 1;
    const spot = { restaurantId, restaurantName,  visitOrder };

    // ✅ localStorage에 추가
    localStorage.setItem("myCourseSpots", JSON.stringify([...saved, spot]));
    
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