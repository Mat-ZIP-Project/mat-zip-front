// src/components/reservation/ReservationPopup.jsx
import React from "react";
import { useReservationLogic } from "./hooks/useReservationLogic";
import "../../assets/styles/reservation/reservation.css";

function ReservationPopup() {
  const {
    // useReservationLogic 훅에서 필요한 상태와 함수들을 가져옵니다.
    reservationDate,
    setReservationDate,
    reservationTime,
    setReservationTime,
    numPeople,
    setNumPeople,
    isLoading,
    originalAmount, // 새로운 금액 상태
    discountAmount, // 새로운 금액 상태
    finalPaymentAmount, // 새로운 금액 상태
    currentMerchantUid,
    feedbackMessage,
    isSuccess,
    adminReservationId,
    setAdminReservationId,
    ownerNote,
    setOwnerNotes,
    notificationPermission,
    // 함수들
    onNotificationsClick,
    handleReservationSubmit,
    handleProceedToPayment,
    handleAdminApproval,
    restaurantName,
  } = useReservationLogic();

  const handleNumPeopleChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]+$/.test(value)) {
      setNumPeople(value);
    }
  };

  return (
    <div className="reservation-popup-container">
      <h2 className="section-title">식당 예약 및 관리</h2>

      {/* 사용자 예약 섹션 */}
      <section className="reservation-section">
        <h3>예약하기</h3>
        <form onSubmit={handleReservationSubmit} className="reservation-form">
          <div className="form-group">
            <label htmlFor="reservationDate">예약 날짜:</label>
            <input
              type="date"
              id="reservationDate"
              value={reservationDate}
              onChange={(e) => setReservationDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="reservationTime">예약 시간:</label>
            <select
              id="reservationTime"
              value={reservationTime}
              onChange={(e) => setReservationTime(e.target.value)}
            >
              <option value="18:00">18:00</option>
              <option value="19:00">19:00</option>
              <option value="20:00">20:00</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="numPeople">인원 수:</label>
            <input
              type="number"
              id="numPeople"
              min="1"
              value={numPeople}
              // onChange={(e) => setNumPeople(Number(e.target.value))}
              onChange={handleNumPeopleChange}
              inputMode="numeric"
              pattern="[0-9]*"
            />
          </div>
          <button type="submit" disabled={isLoading} className="submit-button">
            {isLoading ? "처리 중..." : "예약 정보 확인"}
          </button>
        </form>
      </section>

      {/* 결제 금액 상세 정보 표시 및 결제 진행 버튼 */}
      {/* finalPaymentAmount가 0보다 클 때만 섹션 표시 */}
      {finalPaymentAmount > 0 && (
        <section className="payment-details-section">
          <h3>결제 상세 정보</h3>
          <div className="payment-summary">
            <p>
              초기 결제 금액:{" "}
              <span className="amount-value">{originalAmount}원</span>
            </p>
            {/* discountAmount가 0이 아닐 때만 할인 금액 표시 */}
            {discountAmount !== 0 && (
              <p>
                할인 금액:{" "}
                <span className="amount-value discount">
                  {discountAmount}원
                </span>
              </p>
            )}
            <p>
              최종 결제 금액:{" "}
              <span className="amount-value final">{finalPaymentAmount}원</span>
            </p>
          </div>
          <button
            onClick={handleProceedToPayment}
            disabled={
              isLoading || !currentMerchantUid || finalPaymentAmount <= 0
            }
            className="payment-button"
          >
            {isLoading ? "처리 중..." : "결제 진행하기"}
          </button>
        </section>
      )}

      <hr className="divider" />

      {/* 알림 설정 섹션 */}
      <section className="notification-section">
        <h3>알림 설정</h3>
        <p>
          현재 알림 권한:{" "}
          <span className="permission-status">{notificationPermission}</span>
        </p>
        {notificationPermission !== "granted" && (
          <button
            onClick={onNotificationsClick}
            disabled={isLoading}
            className="notification-button"
          >
            알림 받기
          </button>
        )}
      </section>

      <hr className="divider" />

      {/* 관리자 기능 섹션 */}
      <section className="admin-section">
        <h3>관리자 예약 승인/거절</h3>
        <div className="form-group">
          <label htmlFor="adminReservationId">예약 ID:</label>
          <input
            type="text"
            id="adminReservationId"
            value={adminReservationId}
            onChange={(e) => setAdminReservationId(e.target.value)}
            placeholder="예약 ID 입력"
            className="admin-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="ownerNote">사장님 메모 (선택 사항):</label>
          <textarea
            id="ownerNote"
            value={ownerNote}
            onChange={(e) => setOwnerNotes(e.target.value)}
            placeholder="예약에 대한 메모"
            className="admin-textarea"
          ></textarea>
        </div>
        <div className="admin-buttons">
          <button
            onClick={() => handleAdminApproval("APPROVED")}
            disabled={isLoading}
            className="approve-button"
          >
            예약 승인
          </button>
          <button
            onClick={() => handleAdminApproval("REJECTED")}
            disabled={isLoading}
            className="reject-button"
          >
            예약 거절
          </button>
        </div>
      </section>

      {/* 피드백 메시지 */}
      {feedbackMessage && (
        <p className={isSuccess ? "success-message" : "error-message"}>
          {feedbackMessage}
        </p>
      )}
    </div>
  );
}

export default ReservationPopup;
