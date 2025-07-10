import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosinstance";

const MeetingList = () => {
  const [createMeetings, setCreateMeetings] = useState([]);

  useEffect(() => {
    const createMeetingAll = async () => {
      try {
        const response = await axiosInstance.get("/mypage/meetings/created");
        setCreateMeetings(response.data);
      } catch (error) {
        console.error("모임 내역 가져오기 실패: ", error);
      }
    };
    createMeetingAll();
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
    <div className="created-meeting-list-container">
      {createMeetings.length === 0 ? (
        <p className="no-items-message">생성한 모임 내역이 없습니다.</p>
      ) : (
        <ul>
          {createMeetings.map((meeting) => (
            <li key={meeting.meetingId} className="meeting-item">
              <strong>모임명: {meeting.title}</strong> {/* DTO의 title 사용 */}
              {meeting.restaurantName && ` (식당: ${meeting.restaurantName})`}
              <br />
              모임 일시: {formatDateTimeDisplay(meeting.meetingTime)} | 생성일:{" "}
              {formatDateTimeDisplay(meeting.createdAt)}
              <br />
              현재 인원: {meeting.currentParticipants}/{meeting.maxParticipants}
              명
              {meeting.description && (
                <p className="meeting-description">
                  설명: {meeting.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MeetingList;
