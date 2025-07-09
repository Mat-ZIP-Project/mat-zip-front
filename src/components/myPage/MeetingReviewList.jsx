import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosinstance";

const MeetupReviewList = () => {
  const [meetupReviews, setMeetupReviews] = useState([]);

  useEffect(() => {
    const meetupReviewAll = async () => {
      try {
        const response = await axiosInstance.get("/mypage/meetings/reviews");
        setMeetupReviews(response.data);
      } catch (error) {
        console.error("모임 리뷰 내역 가져오기 실패:", error);
      }
    };
    meetupReviewAll();
  }, []);

  // 날짜/시간 포맷팅 헬퍼 함수
  const formatDateTimeDisplay = (isoDateTimeString) => {
    if (!isoDateTimeString) return "날짜/시간 미정";
    const date = new Date(isoDateTimeString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="meetup-review-list-container">
      {meetupReviews.length === 0 ? (
        <p className="no-items-message">작성한 모임 리뷰 내역이 없습니다.</p>
      ) : (
        <ul>
          {meetupReviews.map((review) => (
            <li key={review.meetupReviewId} className="meeting-item">
              <strong>모임: {review.meetingTitle || "제목 없음"}</strong>
              {review.restaurantName && ` (${review.restaurantName})`}
              {/* DTO에 rating 필드가 없다면 이 부분은 계속 주석 처리하거나 DTO를 수정해야 합니다. */}
              {/* `- ${review.rating}점:` */}
              <br />
              리뷰 내용: {review.reviewContent}
              <br />
              작성일: {formatDateTimeDisplay(review.createdAt)}
              {review.imageUrl && (
                <div>
                  <img
                    src={review.imageUrl}
                    alt="리뷰 이미지"
                    style={{
                      maxWidth: "100px",
                      maxHeight: "100px",
                      marginTop: "10px",
                    }}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MeetupReviewList;
