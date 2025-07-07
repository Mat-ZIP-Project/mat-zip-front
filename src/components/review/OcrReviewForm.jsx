import React, { useState } from "react";
import { createOcrReview } from "../../api/reviewApi";

// ⭐ 별점 클릭 UI(내부 선언)
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

const OcrReviewForm = ({ onReviewSubmit }) => {
  const [restaurantName, setRestaurantName] = useState("");
  const [receiptImage, setReceiptImage] = useState(null);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!restaurantName || !content.trim()) {
      alert("식당명과 리뷰 내용을 입력하세요.");
      return;
    }
    if (content.length < 15) {
      alert("리뷰는 15자 이상 작성해야 합니다.");
      return;
    }
    if (!receiptImage) {
      alert("영수증 이미지를 첨부하세요.");
      return;
    }
    try {
      await createOcrReview({ restaurantName, receiptImage, content, rating });
      setContent("");
      setRating(5);
      setReceiptImage(null);
      setRestaurantName("");
      if (onReviewSubmit) onReviewSubmit();
    } catch (e) {
      alert("로그인 필요 또는 오류가 발생했습니다.");
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <input
        placeholder="식당명"
        value={restaurantName}
        onChange={(e) => setRestaurantName(e.target.value)}
        style={{ marginBottom: "7px", width: 140 }}
      />
      <input
        type="file"
        accept="image/*"
        style={{ marginBottom: 10 }}
        onChange={(e) => setReceiptImage(e.target.files[0])}
      />
      {/* ⭐⭐⭐⭐⭐ 별점 UI */}
      <StarRating rating={rating} setRating={setRating} />
      <textarea
        placeholder="리뷰를 남겨보세요."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        maxLength={200}
      />
      <div className="form-bottom">
        <button type="submit">OCR 리뷰 등록</button>
      </div>
    </form>
  );
};

export default OcrReviewForm;
