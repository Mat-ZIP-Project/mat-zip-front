import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosinstance';
import '../../assets/styles/pages/review/reviewForm.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { showErrorAlert, showErrorConfirmAlert, showSuccessConfirmAlert } from '../../utils/sweetAlert';

const ReviewForm = () => {
  
  const location = useLocation();
  const { restaurantId, restaurantName, visitDate } = location.state || {};
  console.log(restaurantId,restaurantName,visitDate);
  const [content, setContent] = useState('');
  const [userId , setUserId] = useState('');
  const [isLocal, setLocal] = useState(false);
  const [rating, setRating] = useState(0);
  const [images, setImages] = useState([]);
  const nav = useNavigate();

  

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  useEffect(()=>{
    axiosInstance({
        method:"get",
        url:`/reviews/${restaurantId}/${visitDate}`,
    }).then(
        (res)=>{
            console.log(res.data);
            setUserId(res.data.userId);
            console.log(userId);
            setLocal(res.data.localReview);
        }
    ).catch(err=>{
        console.error(err.response.data);
        showErrorAlert("리뷰 작성 불가", err.response.data.detail);
        nav(-1);
    })
  },[]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content  || rating === 0) {
      showErrorConfirmAlert("모든 필드를 입력해주세요.", "");
      return;
    }

    const dto = {
      restaurantId,
      content,
      rating,
      visitDate,
      local:isLocal,
    };

    const formData = new FormData();
    formData.append("review", new Blob([JSON.stringify(dto)], { type: "application/json" }));
    images.forEach((file) => formData.append("images", file));

    axiosInstance.post("/reviews", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then(()=>{
        showSuccessConfirmAlert("리뷰 등록 완료!", "포인트가 100p 적립되었습니다.");
        // 초기화
      setContent('');
      setRating(0);
      setImages([]);
      nav(-1);
      }).catch((err)=>{
        console.error(err);
        showErrorAlert("리뷰 등록 실패", err.response.data.detail);
      });

  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3>리뷰 작성</h3>
      {!isLocal && <h4 className="local-review">{userId} 님의 동네 인증 지역입니다.</h4>}
       <div className="form-group">
        
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} onClick={() => setRating(star)} className={star <= rating ? "filled" : ""}>
              ★
            </span>
          ))}
        </div>
      </div>
      <div className="form-group">
        <label>리뷰 내용</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="리뷰 내용을 입력해주세요"
          required
        />
      </div>

      <div className="form-group">
        <label>방문 일자</label>
        <input type="date" value={visitDate} readOnly />
      </div>

      <div className="form-group">
        <label>사진 첨부</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />
        <div className="preview-area">
          {images.map((img, idx) => (
            <img key={idx} src={URL.createObjectURL(img)} alt={`preview-${idx}`} width="80" />
          ))}
        </div>
      </div>

      <button type="submit" className="submit-button">리뷰 등록</button>
    </form>
  );
};

export default ReviewForm;
