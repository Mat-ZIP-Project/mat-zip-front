import axiosInstance from "../../api/axiosinstance";
import React, { useEffect, useState } from "react";

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const reservationAll = async () => {
      try {
        const response = await axiosInstance.get("/mypage/reservations");
        setReservations(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("예약 내역 가져오기 실패: ", error);
      }
    };
    reservationAll();
  }, []);

  // 날짜와 시간을 포맷하는 헬퍼 함수
  const formatDate = (isoDateTime) => {
    if (!isoDateTime) return "날짜 미정";
    const date = new Date(isoDateTime);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "시간 미정";
    const parts = timeString.split(":");
    return `${parts[0]}:${parts[1]}`;
  };

  return (
    <div>
      <h3>예약 내역</h3>
      {reservations.length === 0 ? (
        <p>예약 내역이 없습니다.</p>
      ) : (
        <ul>
          {reservations.map((r) => (
            // 백엔드에서 ReservationDetailDto 객체의 고유 ID가 'id' 또는 'reservationId'로 내려온다고 가정
            // 실제 DTO 필드명에 맞춰 수정하세요.
            <li key={r.reservationId}>
              <strong>{r.restaurantName}</strong> | {/* restaurantName 사용 */}
              날짜: {formatDate(r.date)} | {/* date 포맷 */}
              시간: {formatTime(r.time)} | {/* time 포맷 */}
              인원: {r.numPeople}명 | 결제: {r.paymentStatus}
              {r.ownerNotes && ` | 사장님 메모: ${r.ownerNotes}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReservationList;
