import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosinstance";
import React, { useEffect, useState } from "react";
import "../../assets/styles/pages/myPage/ReservationList.css";
import {
  showErrorAlert,
  showSuccessAlert,
  showQuestionAlert,
  showErrorConfirmAlert,
} from "../../utils/sweetAlert";

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const reservationAll = async () => {
      try {
        const response = await axiosInstance.get("/mypage/reservations");
        setReservations(response.data);
        console.log("받아오는 예약 내역 : ", response.data);
      } catch (error) {
        console.error("예약 내역 가져오기 실패: ", error);
      }
    };
    reservationAll();
  }, []);

  // 날짜와 시간을 포맷하는 헬퍼 함수
  const formatDate = (isoDateTime) => {
    if (!isoDateTime) return "날짜 미정";

    const date = new Date(`${isoDateTime}T00:00:00`);

    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "시간 미정";

    return String(timeString).substring(0, 5);
  };

  const formattDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 리뷰 작성 버튼 클릭 핸들러
  const handleWriterReview = (restaurantId, restaurantName, visitDate) => {
    const formattedDate = formattDate(visitDate);
    console.log(restaurantId, restaurantName, formattedDate);
    navigate("/review", {
      state: { restaurantName, visitDate: formattedDate, restaurantId },
    });
  };

  // 예약 취소 버튼 클릭 핸들러
  const handleCancelReservation = async (
    reservationId,
    reservationDate,
    reservationTime
  ) => {
    const now = new Date();
    const reservationDateTime = new Date(
      `${reservationDate}T${reservationTime}:00`
    );

    const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
    const timeUntilReservation = reservationDateTime.getTime() - now.getTime();

    if (reservationDateTime < now) {
      showErrorConfirmAlert("이미 지난 예약은 취소할 수 없습니다.", "");
      return;
    }
    if (timeUntilReservation < ONE_DAY_IN_MS) {
      showErrorConfirmAlert("예약 취소는 예약일 하루 전까지만 가능합니다.", "");
      return;
    }

    const result = await showQuestionAlert("정말 예약을 취소하시겠습니까?", "");
    if (result.isConfirmed) {
      try {
        const response = await axiosInstance.delete(
          `/mypage/reservations/cancel/${reservationId}`
        );

        if (response.data === "성공") {
          showSuccessAlert("예약이 성공적으로 취소되었습니다.", "");
          setReservations(
            reservations.filter((r) => r.reservationId !== reservationId)
          );
        } else {
          showErrorAlert("예약 취소 실패", response.data);
        }
      } catch (error) {
        showErrorAlert("예약 취소 중 오류 발생", error.message);
      }
    }
  };

  return (
    <div className="reservation-list-container">
      {/* errorMessage 조건부 렌더링 제거 */}
      {reservations.length === 0 ? (
        <p className="no-reservations-message">아직 예약 내역이 없습니다.</p>
      ) : (
        <div className="reservation-cards-grid">
          {reservations.map((r) => {
            //const reservationDateTime = new Date(`${r.date}T${r.time}:00`);
            const reservationDateTime = new Date(`${r.date}`);
            const now = new Date();
            const isPastReservation = reservationDateTime < now;
            console.log(r.date, reservationDateTime, isPastReservation);

            // const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
            // const canCancel =
            //   r.paymentStatus  === "paid" &&
            //   !isPastReservation &&
            //   reservationDateTime.getTime() - now.getTime() >= ONE_DAY_IN_MS;

            return (
              <div
                key={`${r.reservationId}-${r.restaurantId}`}
                className="reservation-card"
              >
                <div className="card-header">
                  <h4 className="restaurant-name">{r.restaurantName}</h4>
                  <span
                    className={`payment-status ${
                      r.paymentStatus === "paid" ? "예약 완료" : "예약 거절"
                    }`}
                  >
                    {r.paymentStatus}
                  </span>
                </div>
                <div className="card-body">
                  <p className="reservation-info">
                    <span className="icon">📅</span>
                    <span className="info-label">날짜:</span>{" "}
                    {formatDate(r.date)}
                  </p>
                  <p className="reservation-info">
                    <span className="icon">⏰</span>
                    <span className="info-label">시간:</span>{" "}
                    {formatTime(r.time)}
                  </p>
                  <p className="reservation-info">
                    <span className="icon">👥</span>
                    <span className="info-label">인원:</span> {r.numPeople}명
                  </p>
                  {r.ownerNotes && (
                    <p className="owner-notes">
                      <span className="icon">📝</span>
                      <span className="info-label">사장님 메모:</span>{" "}
                      {r.ownerNotes}
                    </p>
                  )}
                </div>
                <div className="card-actions">
                  <button
                    onClick={() =>
                      handleCancelReservation(r.reservationId, r.date, r.time)
                    }
                    className="cancel-reservation-btn"
                  >
                    예약 취소
                  </button>
                  {isPastReservation && (
                    <button
                      onClick={() =>
                        handleWriterReview(
                          r.restaurantId,
                          r.restaurantName,
                          r.date
                        )
                      }
                      className="write-review-btn"
                    >
                      리뷰 작성
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReservationList;
