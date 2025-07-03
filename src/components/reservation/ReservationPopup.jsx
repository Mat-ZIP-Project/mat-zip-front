/**
 * 식당 예약 버튼을 누르면 띄어지는 팝업 예약창
 *  - 식당 이름을 받아와야 됨
 *  - 날짜, 시간, 인원 수 보여짐
 */

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import {
  setReservationInfo,
  setNumPeople,
  // setFeedback,
} from "../store/reservationSlice";
import { useReservation } from "../hooks/useReservation";
import { useAdminActions } from "../hooks/useAdminActions";
import { useNotification } from "../hooks/useNotification";

const ReservationPopup = () => {
  const dispatch = useDispatch();
  const {
    reservationDate,
    reservationTime,
    numPeople,
    amount,
    feedbackMessage,
    isSuccess,
    originalAmount,
    discountAmount,
    finalPaymentAmount,
  } = useSelector((state) => state.reservation);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      reservationDate: reservationDate,
      reservationTime: reservationTime,
      numPeople: numPeople,
    },
  });

  // useEffect를 사용하여 Redux 상태가 변경될 때 React Hook Form의 값도 업데이트
  useEffect(() => {
    setValue("reservationDate", reservationDate);
  }, [reservationDate, setValue]);

  useEffect(() => {
    setValue("reservationTime", reservationTime);
  }, [reservationTime, setValue]);

  useEffect(() => {
    setValue("numPeople", numPeople);
  }, [numPeople, setValue]);

  const { handleReservation } = useReservation();
  const {
    adminReservationId,
    setAdminReservationId,
    ownerNote,
    setOwnerNotes,
    handleAdminApproval,
  } = useAdminActions();
  const { notificationPermission, handleNotificationRequest } =
    useNotification();

  const onSubmitReservation = async (data) => {
    dispatch(
      setReservationInfo({
        date: data.reservationDate,
        time: data.reservationTime,
        numPeople: data.numPeople,
      })
    );
    await handleReservation();
  };

  const handleNumPeopleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    dispatch(setNumPeople(isNaN(value) ? 1 : value)); // NaN 방지 및 기본값 설정
  };

  return (
    <div className="reservation-popup">
      <h2>식당 예약 및 관리</h2>

      {/* 사용자 예약 섹션 */}
      <section>
        <h3>예약하기</h3>
        <form onSubmit={handleSubmit(onSubmitReservation)}>
          <div>
            <label htmlFor="reservationDate">예약 날짜:</label>
            <input
              type="date"
              id="reservationDate"
              {...register("reservationDate", {
                required: "예약 날짜를 입력해주세요.",
              })}
              onChange={(e) =>
                dispatch(setReservationInfo({ date: e.target.value }))
              }
            />
            {errors.reservationDate && (
              <p className="error">{errors.reservationDate.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="reservationTime">예약 시간:</label>
            <select
              id="reservationTime"
              {...register("reservationTime", {
                required: "예약 시간을 선택해주세요.",
              })}
              onChange={(e) =>
                dispatch(setReservationInfo({ time: e.target.value }))
              }
            >
              <option value="18:00">18:00</option>
              <option value="19:00">19:00</option>
              <option value="20:00">20:00</option>
            </select>
            {errors.reservationTime && (
              <p className="error">{errors.reservationTime.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="numPeople">인원 수:</label>
            <input
              type="number"
              id="numPeople"
              {...register("numPeople", {
                required: "인원 수를 입력해주세요.",
                min: { value: 1, message: "최소 1명 이상이어야 합니다." },
              })}
              onChange={handleNumPeopleChange}
            />
            {errors.numPeople && (
              <p className="error">{errors.numPeople.message}</p>
            )}

            {originalAmount > 0 && (
              <div className="payment-summary">
                <h4>결제 상세</h4>
                <p>초기 결제 금액 : ${originalAmount}</p>
                {discountAmount !== 0 && discountAmount !== null && (
                  <p>할인 금액 : -${discountAmount}</p>
                )}
                <p>최종 결제 금액: ${finalPaymentAmount}</p>
              </div>
            )}
          </div>
          <p>예상 결제 금액: ${amount}</p>
          <button type="submit">예약 및 결제하기</button>
        </form>
      </section>

      {/* 알림 권한 섹션 */}
      <hr />
      <section>
        <h3>알림 설정</h3>
        <p>현재 알림 권한: {notificationPermission}</p>
        {notificationPermission !== "granted" && (
          <button onClick={handleNotificationRequest}>알림 받기</button>
        )}
      </section>

      {/* 관리자 기능 섹션 */}
      <hr />
      <section>
        <h3>관리자 예약 승인/거절</h3>
        <div>
          <label htmlFor="adminReservationId">예약 ID:</label>
          <input
            type="text"
            id="adminReservationId"
            value={adminReservationId}
            onChange={(e) => setAdminReservationId(e.target.value)}
            placeholder="예약 ID 입력"
          />
        </div>
        <div>
          <label htmlFor="ownerNote">사장님 메모 (선택 사항):</label>
          <textarea
            id="ownerNote"
            value={ownerNote}
            onChange={(e) => setOwnerNotes(e.target.value)}
            placeholder="예약에 대한 메모"
          ></textarea>
        </div>
        <button onClick={() => handleAdminApproval("APPROVED")}>
          예약 승인
        </button>
        <button onClick={() => handleAdminApproval("REJECTED")}>
          예약 거절
        </button>
      </section>

      {/* 피드백 메시지 */}
      {feedbackMessage && (
        <p className={isSuccess ? "success-message" : "error-message"}>
          {feedbackMessage}
        </p>
      )}
    </div>
  );
};

export default ReservationPopup;
