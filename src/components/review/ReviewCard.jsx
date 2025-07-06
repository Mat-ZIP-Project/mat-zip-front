import React, { useState } from "react";
import { toggleLike, reportReview } from "../../api/reviewApi";

const ReviewCard = ({ review, onReviewChanged }) => {
  const [liked, setLiked] = useState(review.liked);
  const [likeCount, setLikeCount] = useState(review.likeCount);
  const [reported, setReported] = useState(review.reported);

  const handleLike = async () => {
    try {
      const res = await toggleLike(review.id);
      setLiked(res.liked);
      setLikeCount(res.likeCount);
      if (onReviewChanged) onReviewChanged();
    } catch {
      alert("로그인 후 이용해주세요.");
    }
  };

  const handleReport = async () => {
    if (window.confirm("정말 신고하시겠습니까?")) {
      await reportReview(review.id);
      setReported(true);
      alert("신고가 접수되었습니다.");
      if (onReviewChanged) onReviewChanged();
    }
  };

  return (
    <div className="review-card">
      <div className="review-card-body">
        <div className="review-card-title">
          {review.restaurantName || review.restaurantId}
        </div>
        <div className="review-card-stars">
          {"★".repeat(review.rating)}
          {"☆".repeat(5 - review.rating)}
        </div>
        <div className="review-card-content">
          {review.content.length > 35
            ? review.content.slice(0, 35) + "..."
            : review.content}
        </div>
        <div className="review-card-actions">
          <button
            className={`like-btn${liked ? " active" : ""}`}
            onClick={handleLike}
          >
            👍 {likeCount}
          </button>
          <button
            className={`report-btn${reported ? " active" : ""}`}
            onClick={handleReport}
            disabled={reported}
          >
            🚩 신고
          </button>
        </div>
        {/* OCR 리뷰라면 영수증 썸네일 표시 (옵션) */}
        {review.receiptImageUrl && (
          <img
            src={review.receiptImageUrl}
            alt="영수증"
            className="ocr-receipt-thumb"
            style={{ width: 80, marginTop: 7, borderRadius: 6 }}
          />
        )}
      </div>
    </div>
  );
};
export default ReviewCard;
