import React, { useEffect, useState, useCallback } from "react";
import { fetchReservationReviews } from "../../api/reviewApi";
import ReviewCard from "./ReviewCard";

const ReservationReviewList = ({ search }) => {
  const [reviews, setReviews] = useState([]);

  const loadReviews = useCallback(() => {
    fetchReservationReviews(search).then((data) => {
      setReviews(Array.isArray(data) ? data : data?.reviews || []);
    });
  }, [search]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  if (!reviews || reviews.length === 0)
    return (
      <div style={{ marginTop: 40, color: "#999" }}>
        예약자 리뷰가 없습니다.
      </div>
    );

  return (
    <div className="review-list-grid">
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          onReviewChanged={loadReviews}
        />
      ))}
    </div>
  );
};

export default ReservationReviewList;
