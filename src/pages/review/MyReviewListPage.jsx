import React, { useState } from "react";
import { useSelector } from "react-redux";
import ReviewList from "../../components/review/ReviewList";
import "../../assets/styles/review.css";

const MyReviewListPage = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  if (!isAuthenticated) {
    return (
      <div className="app-wrapper">
        <div
          className="app-container"
          style={{ textAlign: "center", marginTop: "40px" }}
        >
          <h2>로그인이 필요합니다</h2>
          <p>내 리뷰를 확인하려면 먼저 로그인 해주세요.</p>
        </div>
      </div>
    );
  }

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
        <h2>내가 쓴 리뷰</h2>
        <ReviewList key={refreshKey} search={search} />
      </div>
    </div>
  );
};

export default MyReviewListPage;
