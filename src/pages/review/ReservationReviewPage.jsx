import React, { useState } from "react";
import ReservationReviewForm from "../../components/review/ReservationReviewForm";
import ReservationReviewList from "../../components/review/ReservationReviewList";
import "../../assets/styles/review/review.css";

const ReservationReviewPage = () => {
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleReviewSubmit = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="full-screen-form">
      <div className="review-content-wrapper">
        <header className="review-list-header">
          <input
            className="review-list-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="식당 또는 메뉴 검색"
          />
        </header>
        <h2>예약자 리뷰</h2>
        <ReservationReviewForm onReviewSubmit={handleReviewSubmit} />
        <ReservationReviewList key={refreshKey} search={search} />
      </div>
    </div>
  );
};

export default ReservationReviewPage;
