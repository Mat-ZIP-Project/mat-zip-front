import React, { useState } from "react";
import { useSelector } from "react-redux";
import ReservationReviewForm from "../../components/review/ReservationReviewForm";
import ReviewList from "../../components/review/ReviewList";
import "../../assets/styles/review.css";

const WriteReservationReviewPage = () => {
  // Redux의 인증상태 활용 (store/index.js, authSlice.js 참고)
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleReviewSubmit = () => setRefreshKey((prev) => prev + 1);

  if (!isAuthenticated) {
    return (
      <div className="app-wrapper">
        <div
          className="app-container"
          style={{ textAlign: "center", marginTop: "40px" }}
        >
          <h2>로그인이 필요합니다</h2>
          <p>예약자 리뷰를 작성하려면 먼저 로그인 해주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <div className="app-container">
        <h2>예약자 리뷰 작성</h2>
        <ReservationReviewForm onReviewSubmit={handleReviewSubmit} />
        <ReviewList key={refreshKey} />
      </div>
    </div>
  );
};

export default WriteReservationReviewPage;
