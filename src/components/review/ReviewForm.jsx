import React, { useState } from "react";
import { createReservationReview, createOcrReview } from "../../api/reviewApi";

const ReviewForm = ({ type = "reservation", onReviewSubmit }) => {
  const [restaurantId, setRestaurantId] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [receiptImage, setReceiptImage] = useState(null);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type === "reservation" && !restaurantId) {
      alert("예약 리뷰는 식당ID 입력 필요");
      return;
    }
    if (content.length < 15) {
      alert("리뷰는 15자 이상 작성");
      return;
    }
    try {
      if (type === "reservation") {
        await createReservationReview({ restaurantId, content, rating });
        setRestaurantId("");
      } else {
        if (!restaurantName || !receiptImage) {
          alert("식당명/영수증 이미지 필요");
          return;
        }
        await createOcrReview({
          restaurantName,
          receiptImage,
          content,
          rating,
        });
        setRestaurantName("");
        setReceiptImage(null);
      }
      setContent("");
      setRating(5);
      if (onReviewSubmit) onReviewSubmit();
    } catch (e) {
      alert("로그인 필요/오류 발생");
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      {type === "reservation" ? (
        <input
          placeholder="식당 ID"
          value={restaurantId}
          onChange={(e) => setRestaurantId(e.target.value)}
          style={{ marginBottom: "7px", width: 120 }}
        />
      ) : (
        <>
          <input
            placeholder="식당명"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            style={{ marginBottom: "7px", width: 120 }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setReceiptImage(e.target.files[0])}
            style={{ marginBottom: "7px", width: 160 }}
          />
        </>
      )}
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

export default ReviewForm;
