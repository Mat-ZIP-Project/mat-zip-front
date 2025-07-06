// src/components/review/ReviewForm.jsx
import React, { useState } from "react";
import { createReview } from "../../api/reviewApi";

const ReviewForm = ({ onReviewSubmit, mode }) => {
  const [restaurantId, setRestaurantId] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);

  // OCR 이미지 파일 상태
  const [ocrFile, setOcrFile] = useState(null);

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
      if (mode === "ocr") {
        if (!ocrFile) {
          alert("OCR 리뷰는 영수증 이미지를 첨부해야 합니다.");
          return;
        }
        // FormData로 OCR 이미지 전송 (구현 필요)
        const formData = new FormData();
        formData.append("restaurantId", restaurantId);
        formData.append("content", content);
        formData.append("rating", rating);
        formData.append("receiptImage", ocrFile);
        await createReview(formData, mode);
      } else {
        await createReview({ restaurantId, content, rating }, mode);
      }
      setContent("");
      setRating(5);
      setOcrFile(null);
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
        {mode === "ocr" && (
          <input
            type="file"
            accept="image/*"
            style={{ marginRight: 8 }}
            onChange={(e) => setOcrFile(e.target.files[0])}
          />
        )}
        <button type="submit">
          {mode === "ocr" ? "OCR 리뷰 등록" : "리뷰 등록"}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
