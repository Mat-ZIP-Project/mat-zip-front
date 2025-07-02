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
  const requestPay = useCallback(
    (merchantUid) => {
      if (!window.IMP) {
        setFeedbackMessage("결제 모듈을 로드할 수 없습니다....");
        setIsSuccess(false);
        return;
      }

      window.IMP.request_pay(
        {
          // pg: "kakaopay",
          pg: "html5_inicis",
          pay_method: "card",
          merchant_uid: merchantUid,
          name: `${restaurantName} 예약 (${numPeople}인)`,
          amount: amount,
          buyer_email: "test@example.com", // 실제 사용자 이메일로 변경 필요
        },
        (rsp) => {
          if (rsp.success) {
            setFeedbackMessage("결제 성공! 최종 처리를 진행합니다.");
            setIsSuccess(true);
            console.log("결제 성공: ", rsp);
            sendCompletePayment(rsp.imp_uid, rsp.merchant_uid);
          } else {
            console.error("아임포트 결제 실패 콜백: ", rsp);
            console.error("아임포트 결제 실패 메시지: ", rsp.error_msg);
            setFeedbackMessage(`결제 실패: ${rsp.error_msg}`);
            setIsSuccess(false);
          }
        }
      );
    },
    [
      restaurantName,
      numPeople,
      amount,
      setFeedbackMessage,
      setIsSuccess,
      sendCompletePayment,
    ]
  );

  /**
   * 2단계 : 백엔드에 결제 사전 검증 요청을 보내는 함수
   */
  const onPreparePayment = useCallback(
    async (actualReservationId) => {
      try {
        // axiosInstance 사용
        const response = await axiosInstance.post("/api/payment/prepare", {
          reservationId: actualReservationId,
          amount: amount,
        });

        if (response.data.success) {
          setFeedbackMessage("결제 사전 검증 성공. 결제창을 준비합니다.");
          setIsSuccess(true);
          console.log("사전 검증 응답:", response.data);
          const { merchantUid } = response.data.data;
          requestPay(merchantUid); // 결제창 띄우기 함수 호출
        } else {
          setFeedbackMessage("결제 사전 검증 실패: " + response.data.message);
          setIsSuccess(false);
          console.error("사전 검증 실패 응답:", response.data);
        }
      } catch (error) {
        setFeedbackMessage(
          `결제 사전 검증 중 오류 발생: ${
            error.response ? error.response.data.message : error.message
          }`
        );
        setIsSuccess(false);
        console.error("사전 검증 오류:", error.response || error);
      }
    },
    [amount, setFeedbackMessage, setIsSuccess, requestPay] // axiosInstance는 더 이상 의존성 배열에 필요하지 않습니다.
  );

  /**
   * 전체 결제 프로세스를 시작하는 메인 핸들러 (1단계)
   * 1단계 : 백엔드에 예약 정보를 먼저 보내고 생성된 reservationId를 받아온다.
   * 이후 2단계 (결제 사전 검증) 호출
   */
  const handleReservationPayment = useCallback(async () => {
    setFeedbackMessage("");
    setIsSuccess(null);

    if (!reservationDate || !reservationTime || numPeople <= 0) {
      setFeedbackMessage("모든 예약 정보를 입력해주세요.");
      setIsSuccess(false);
      return;
    }

    try {
      setFeedbackMessage("예약 신청 중...");

      // axiosInstance 사용
      const createReservationResponse = await axiosInstance.post(
        "/api/reservation/create",
        {
          date: reservationDate,
          time: reservationTime,
          numPeople: numPeople,
          restaurantName: restaurantName,
          id: currentUserId,
        }
      );

      if (createReservationResponse.data.success) {
        const actualReservationId =
          createReservationResponse.data.reservationId;
        setFeedbackMessage(
          `예약 ID ${actualReservationId} 생성 성공. 이제 결제 준비를 시작합니다.`
        );
        setIsSuccess(true);
        console.log("예약 생성 응답:", createReservationResponse.data);

        await onPreparePayment(actualReservationId); // 2단계 호출
      } else {
        setFeedbackMessage(
          "예약 신청 실패: " + createReservationResponse.data.message
        );
        setIsSuccess(false);
        console.error("예약 생성 실패 응답:", createReservationResponse.data);
      }
    } catch (error) {
      setFeedbackMessage(
        `예약 신청 중 오류 발생: ${
          error.response ? error.response.data.message : error.message
        }`
      );
      setIsSuccess(false);
      console.error("예약 신청 오류:", error.response || error);
    }
  }, [
    reservationDate,
    reservationTime,
    numPeople,
    restaurantName,
    currentUserId,
    setFeedbackMessage,
    setIsSuccess,
    onPreparePayment,
  ]); // axiosInstance는 더 이상 의존성 배열에 필요하지 않습니다.

  return {
    handleReservationPayment,
  };
};
