import React, { useState } from "react";
import OcrReviewForm from "../../components/review/OcrReviewForm";
import OcrReviewList from "../../components/review/OcrReviewList";
import "../../assets/styles/review/review.css";

const OcrReviewPage = () => {
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleReviewSubmit = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="app-wrapper">
      <div className="app-container">
        <header className="review-list-header">
          <input
            className="review-list-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="식당 또는 메뉴 검색"
          />
        </header>
        <h2>영수증 리뷰</h2>
        <OcrReviewForm onReviewSubmit={handleReviewSubmit} />
        <OcrReviewList key={refreshKey} search={search} />
      </div>
    </div>
  );
};

export default OcrReviewPage;
