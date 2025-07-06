import React, { useEffect, useState, useCallback } from "react";
import ReviewCard from "./ReviewCard";

const ReviewList = ({ fetchReviews, search }) => {
  const [reviews, setReviews] = useState([]);

  const loadReviews = useCallback(() => {
    fetchReviews(search).then((data) => {
      setReviews(Array.isArray(data) ? data : data?.reviews || []);
    });
  }, [search, fetchReviews]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  if (!reviews || reviews.length === 0)
    return (
      <div style={{ marginTop: 40, color: "#999" }}>
        작성한 리뷰가 없습니다.
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

export default ReviewList;
