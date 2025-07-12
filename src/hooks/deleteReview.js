import axiosInstance from "../api/axiosinstance"

export const deleteReview = (reviewId) =>{
    if( confirm("리뷰를 정말 삭제하시겠습니까?")){
    axiosInstance({
        method : "delete",
        url:"/reviews/"+reviewId,
    }).then(()=>{
        alert("리뷰가 삭제되었습니다.");
    }).catch(err=>{
        alert(err.response.data);
    })
}
}