import React, { useState } from "react";
import ReservationReviewForm from "../../components/review/ReservationReviewForm";
import ReservationReviewList from "../../components/review/ReservationReviewList";
import "../../assets/styles/review/review.css";

const ReservationReviewPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleReviewSubmit = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="full-screen-form">
      <div className="review-content-wrapper">
        {/* 검색 인풋/헤더 영역 전체 삭제 */}
        {/* <header className="review-list-header">
          <input
            className="review-list-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="식당 또는 메뉴 검색"
          />
        </header> */}
        <h2>예약자 리뷰</h2>
        <ReservationReviewForm onReviewSubmit={handleReviewSubmit} />
        <ReservationReviewList key={refreshKey} />
      </div>
    </div>
  );
};

export default ReservationReviewPage;
