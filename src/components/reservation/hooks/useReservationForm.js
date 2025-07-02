import { useState } from "react";

export const useReservationForm = () => {
  // 예약 정보 상태
  const [reservationId, setReservationId] = useState(null);
  const [reservationDate, setReservationDate] = useState("");
  const [reservationTime, setReservationTime] = useState("18:00");
  const [numPeople, setNumPeople] = useState(1);
  const [amount, setAmount] = useState(0);

  // 사용자에게 보여줄 피드백 메시지 상태
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);

  return {
    reservationId,
    setReservationId,
    reservationDate,
    setReservationDate,
    reservationTime,
    setReservationTime,
    numPeople,
    setNumPeople,
    amount,
    setAmount,
    feedbackMessage,
    setFeedbackMessage,
    isSuccess,
    setIsSuccess,
  };
};
