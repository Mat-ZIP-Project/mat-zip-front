import React, { useState } from "react";
import { createReservationReview } from "../../api/reviewApi";

const ReservationReviewForm = ({ onReviewSubmit }) => {
  const [restaurantId, setRestaurantId] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!restaurantId || !content.trim()) {
      alert("식당과 리뷰 내용을 입력하세요.");
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
      alert("로그인 필요 또는 오류가 발생했습니다.");
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <input
        placeholder="식당 ID"
        value={restaurantId}
        onChange={(e) => setRestaurantId(e.target.value)}
        style={{ marginBottom: "7px", width: 120 }}
      />
      <textarea
        placeholder="리뷰를 남겨보세요."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        maxLength={200}
      />
      <div className="form-bottom">
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          {[5, 4, 3, 2, 1].map((star) => (
            <option key={star} value={star}>
              {star}점
            </option>
          ))}
        </select>
        <button type="submit">리뷰 등록</button>
      </div>
    </form>
  );
};

export default ReservationReviewForm;
