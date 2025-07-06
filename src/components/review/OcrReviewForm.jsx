import React, { useState } from "react";
import { createOcrReview } from "../../api/reviewApi";

const OcrReviewForm = ({ onReviewSubmit }) => {
  const [restaurantName, setRestaurantName] = useState("");
  const [receiptImage, setReceiptImage] = useState(null);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);

  const handleImageChange = (e) => {
    setReceiptImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!restaurantName || !receiptImage || !content.trim()) {
      alert("식당명, 영수증, 리뷰 내용을 입력하세요.");
      return;
    }
    if (content.length < 15) {
      alert("리뷰는 15자 이상 작성해야 합니다.");
      return;
    }
    try {
      await createOcrReview({ restaurantName, receiptImage, content, rating });
      setRestaurantName("");
      setReceiptImage(null);
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
        placeholder="식당명"
        value={restaurantName}
        onChange={(e) => setRestaurantName(e.target.value)}
        style={{ marginBottom: "7px", width: 120 }}
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ marginBottom: "7px" }}
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
        <button type="submit">OCR 리뷰 등록</button>
      </div>
    </form>
  );
};

export default OcrReviewForm;
