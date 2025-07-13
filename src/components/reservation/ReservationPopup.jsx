// src/components/reservation/ReservationPopup.jsx
import React from "react";
import { useReservationLogic } from "./hooks/useReservationLogic";
import "../../assets/styles/reservation/reservation.css";
import { useNavigate, useParams } from "react-router-dom";

function ReservationPopup() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  const goToRestaurantDetail = () => {
    navigate(`/restaurants/${restaurantId}`);
  }
  
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
    // 함수들
    handleReservationSubmit,
    handleProceedToPayment,
  } = useReservationLogic(restaurantId, goToRestaurantDetail);

  const handleNumPeopleChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]+$/.test(value)) {
      setNumPeople(value);
    }
  };
  const getFormattedDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDate = getFormattedDate(today);

  const oneMonthLater = new Date(today);
  oneMonthLater.setMonth(today.getMonth() + 1);
  const maxDate = getFormattedDate(oneMonthLater);

  return (
    // 모달 오버레이: 화면 전체를 덮고 모달을 중앙에 배치
    <div className="modal-overlay">
      {/* 모달 내용 컨테이너 */}
      <div className="modal-content-reservation">
        {/* 모달 닫기 버튼 */}
        <button className="modal-close-button"
        onClick={goToRestaurantDetail}
        >
          &times; {/* 'X' 문자 */}
        </button>

        <h2 className="section-title">식당 예약</h2>

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
                className="form-input" // 새로운 클래스 추가
                min={minDate}
                max={maxDate}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="reservationTime">예약 시간:</label>
              <select
                id="reservationTime"
                value={reservationTime}
                onChange={(e) => setReservationTime(e.target.value)}
                className="form-select" // 새로운 클래스 추가
              >
                <option value="">시간 선택</option> {/* 기본 옵션 추가 */}
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
                onChange={handleNumPeopleChange}
                inputMode="numeric"
                pattern="[0-9]*"
                className="form-input" // 새로운 클래스 추가
              />
            </div>
            <button type="submit" disabled={isLoading} className="submit-button">
              {isLoading ? "처리 중..." : "예약 정보 확인"}
            </button>
          </form>
        </section>

        {/* 결제 금액 상세 정보 표시 및 결제 진행 버튼 */}
        {finalPaymentAmount > 0 && (
          <section className="payment-details-section">
            <h3>결제 상세 정보</h3>
            <div className="payment-summary">
              <p>
                초기 결제 금액:{" "}
                <span className="amount-value">{originalAmount.toLocaleString()}원</span> {/* 금액 포맷팅 */}
              </p>
              {discountAmount !== 0 && (
                <p>
                  할인 금액:{" "}
                  <span className="amount-value discount">
                    {discountAmount.toLocaleString()}원
                  </span>
                </p>
              )}
              <p className="final-amount-row"> {/* 최종 금액 행에 클래스 추가 */}
                최종 결제 금액:{" "}
                <span className="amount-value final">{finalPaymentAmount.toLocaleString()}원</span>
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
      </div>
    </div>
  );
}

export default ReservationPopup;
