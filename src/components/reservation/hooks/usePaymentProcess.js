import { useCallback } from "react";
import axiosInstance from "../../../api/axiosinstance";

export const usePaymentProcess = (
  reservationDate,
  reservationTime,
  numPeople,
  amount,
  restaurantName,
  currentUserId,
  setFeedbackMessage,
  setIsSuccess,
  IMP_UID // 아임포트(PortOne) UID
) => {
  /**
   * 4. 결제 완료 후 백엔드에 최종 결제 정보를 전송하는 함수
   */
  const sendCompletePayment = useCallback(
    async (IMP_UID, merchant_uid) => {
      try {
        const response = await axiosInstance.post("/api/payment/complete", {
          impUid: IMP_UID,
          merchantUid: merchant_uid,
        });
        if (response.data.success) {
          setFeedbackMessage(
            "예약 및 결제 최종 완료! 사장님 승인을 기다려주세요."
          );
          setIsSuccess(true);
          console.log("결제 완료! 사장님 승인 대기중..");
        } else {
          console.log("최종 결제 처리 실패");
        }
      } catch (error) {
        console.error(error);
      }
    },
    [setFeedbackMessage, setIsSuccess]
  );

  /**
   * 3. PortOne 결제창을 띄우는 함수
   */
};
