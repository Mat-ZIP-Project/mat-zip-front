import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosinstance";

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

  // 날짜 포맷팅 헬퍼 함수 (LocalDateTime/LocalDate 문자열 처리)
  const formatDateDisplay = (isoDateTimeString) => {
    if (!isoDateTimeString) return "날짜 미정";
    // LocalDateTime (2023-01-01T10:30:00) 또는 LocalDate (2023-01-01) 모두 Date 객체로 파싱 가능
    const date = new Date(isoDateTimeString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div>
      <h3>리뷰 내역</h3>
      {reviews.length === 0 ? (
        <p>작성한 리뷰 내역이 없습니다.</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            // 백엔드에서 Review 객체의 고유 ID가 'id' 또는 'reviewId'로 내려온다고 가정
            // 실제 Review 엔티티/DTO 필드명에 맞춰 수정하세요.
            <li key={review.reviewId}>
              <strong>식당: {review.restaurantName}</strong> | 별점:{" "}
              {review.rating}점 | 작성일: {formatDateDisplay(review.reviewedAt)}{" "}
              | 방문일: {formatDateDisplay(review.visitDate)}
              <p>내용: {review.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewList;
