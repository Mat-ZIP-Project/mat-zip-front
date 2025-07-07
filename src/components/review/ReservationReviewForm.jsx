import React, { useState } from "react";
import { createReservationReview } from "../../api/reviewApi";

// 별점 클릭 UI(내부에 직접 선언)
function StarRating({ rating, setRating }) {
  return (
    <div className="star-rating" style={{ margin: "12px 0 10px 0" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => setRating(star)}
          className={star <= rating ? "selected" : ""}
          style={{
            cursor: "pointer",
            fontSize: "2rem",
            color: star <= rating ? "#ffbc06" : "#ddd",
            marginRight: "5px",
            textShadow: star <= rating ? "0 1px 0 #f8e2b2" : undefined,
            userSelect: "none",
            transition: "color 0.18s",
          }}
          aria-label={`${star}점`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

/**
 * restaurantId는 반드시 부모 컴포넌트(상세/리뷰페이지)에서 props로 내려줌!
 * 예: <ReservationReviewForm restaurantId={선택한식당ID} ... />
 */
const ReservationReviewForm = ({ restaurantId, onReviewSubmit }) => {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      alert("리뷰 내용을 입력하세요.");
      return;
    }
    if (content.length < 15) {
      alert("리뷰는 15자 이상 작성해야 합니다.");
      return;
    }
    try {
      await createReservationReview({ restaurantId, content, rating });
      setContent("");
      setRating(5);
      if (onReviewSubmit) onReviewSubmit();
    } catch (e) {
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      {/* restaurantId 입력란 X */}
      <StarRating rating={rating} setRating={setRating} />
      <textarea
        placeholder="리뷰를 남겨보세요."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        maxLength={200}
      />
      <div className="form-bottom">
        <button type="submit">리뷰 등록</button>
      </div>
    </form>
  );
};

export default ReservationReviewForm;
