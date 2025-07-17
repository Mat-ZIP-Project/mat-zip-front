import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosinstance";

const MeetupParticipantList = () => {
  const [meetupParticipants, setMeetupParticipants] = useState([]);

  useEffect(() => {
    const participantAll = async () => {
      try {
        const response = await axiosInstance.get(
          "/mypage/meetings/participants"
        );
        setMeetupParticipants(response.data);
      } catch (error) {
        console.error("모임 내역 가져오기 실패: ", error);
      }
    };
    participantAll();
  }, []);

  const formatDateTimeDisplay = (isoDateTimeString) => {
    if (!isoDateTimeString) return "날짜 미정";
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
    <div className="participated-meeting-list-container">
      <h3>참여한 모임 내역</h3>
      {meetupParticipants.length === 0 ? (
        <p className="no-meetings-message">참여한 모임 내역이 없습니다.</p>
      ) : (
        <ul>
          {meetupParticipants.map((participant) => (
            <li key={participant.joinId}>
              <strong>모임명: {participant.title}</strong>
              {participant.restaurantName &&
                ` (식당: ${participant.restaurantName})`}
              <br />
              참여 상태: {participant.joinStatus} | 참여일:{" "}
              {formatDateTimeDisplay(participant.joinedAt)}
              <br />
              모임 일시: {formatDateTimeDisplay(participant.meetingTime)}
              <br />
              현재 인원: {participant.currentParticipants}/
              {participant.maxParticipants}명<br />
              {participant.description && (
                <p>설명: {participant.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MeetupParticipantList;
