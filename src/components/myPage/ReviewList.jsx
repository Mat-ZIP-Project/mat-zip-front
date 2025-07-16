import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosinstance";
import "../../assets/styles/pages/myPage/ReviewList.css";
import { deleteReview } from "../../hooks/deleteReview";

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const reviewAll = async () => {
      try {
        const response = await axiosInstance.get("/mypage/reviews");
        setReviews(response.data);
      } catch (error) {
        console.error("리뷰 내역 가져오기 실패: ", error);
      }
    };
    reviewAll();
  }, []);

  const formatDateDisplay = (dateTimeArray) => {
    if (!dateTimeArray) return "날짜 미정";

    const year = dateTimeArray[0];
    const month = dateTimeArray[1] - 1; // 월은 0부터 시작 (0=1월, 11=12월)
    const day = dateTimeArray[2];
    const hours = dateTimeArray[3] || 0; // 시 정보가 없을 수 있으니 기본값 0
    const minutes = dateTimeArray[4] || 0; // 분 정보가 없을 수 있으니 기본값 0

    const date = new Date(year, month, day, hours, minutes);

    const formatData = date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const formatTime = date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${formatData} ${formatTime}`;
  };

  // 별점을 시각적으로 표시하는 헬퍼 함수 (예: ⭐⭐⭐⭐⭐)
  const renderStars = (rating) => {
    const fullStar = "⭐";
    const emptyStar = "☆"; // 또는 다른 빈 별 모양
    const maxRating = 5;
    let stars = "";
    for (let i = 0; i < maxRating; i++) {
      stars += i < rating ? fullStar : emptyStar;
    }
    return stars;
  };

  return (
    <div className="review-list-container">
      {reviews.length === 0 ? (
        <p className="no-reviews-message">아직 작성한 리뷰가 없습니다.</p>
      ) : (
        <div className="review-cards-grid">
          {reviews.map((review) => (
            <div key={review.reviewId} className="review-card">
              <div className="card-header">
                <h4 className="restaurant-name">{review.restaurantName}</h4>
                <div className="review-rating">
                  <span className="stars">{renderStars(review.rating)}</span>
                  <span className="rating-text">({review.rating}점)</span>
                </div>
              </div>
              <div className="card-body">
                <p className="review-content">{review.content}</p>
              </div>
              <div className="card-footer">
                <span className="myPage-review-date">
                  <span className="icon">📝</span> 작성일:{" "}
                  {formatDateDisplay(review.reviewedAt)}
                </span>
                <span className="visit-date">
                  <span className="icon">🗓️</span> 방문일:{" "}
                  {formatDateDisplay(review.visitDate)}
                </span>
              </div>
              <button
                className="delete-button"
                onClick={() => deleteReview(review.reviewId)}
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
