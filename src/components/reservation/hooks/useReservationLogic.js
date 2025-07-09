import { createReservation, approveReservation } from "../api/reservationApi";
import { preparePayment, completePayment } from "../api/paymentApi";
import { handleNotification } from "../../../api/notificationHandle";
import { useState, useEffect } from "react";
import { RESTAURANT_NAME } from "../../../constants";

const IMP_UID = import.meta.env.VITE_IMP_UID;

export const useReservationLogic = () => {
  // 예약 정보 상태
  const [reservationId, setReservationId] = useState(null);
  const [reservationDate, setReservationDate] = useState("");
  const [reservationTime, setReservationTime] = useState("18:00");
  const [numPeople, setNumPeople] = useState(1);

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  // 결제 상태
  const [originalAmount, setOriginalAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalPaymentAmount, setFinalPaymentAmount] = useState(0);
  const [currentMerchantUid, setCurrentMerchantUid] = useState("");

  // UI 피드백 상태
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);

  const restaurantName = RESTAURANT_NAME;

  // 관리자 기능용 상태
  const [adminReservationId, setAdminReservationId] = useState("");
  const [ownerNote, setOwnerNotes] = useState("");

  // 알림 권한 상태
  const [notificationPermission, setNotificationPermission] = useState(
    Notification.permission
  );

  useEffect(() => {
    setNotificationPermission(Notification.permission);
    if (window.IMP) {
      window.IMP.init(IMP_UID);
      console.log("PortOne SDK 초기화 완료:", IMP_UID);
    } else {
      console.warn("PortOne SDK가 로드되지 않았습니다.");
    }
  }, []);

  const onNotificationsClick = async () => {
    setIsLoading(true);
    setFeedbackMessage("");
    setIsSuccess(null);
    try {
      await handleNotification();
      setNotificationPermission(Notification.permission);
      setFeedbackMessage("알림 권한이 성공적으로 허용되었습니다.");
      setIsSuccess(true);
    } catch (error) {
      setFeedbackMessage(`알림 설정 실패: ${error.message}`);
      setIsSuccess(false);
      console.error("알림 설정 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 1단계: 예약 정보를 백엔드로 보내고, 생성된 reservationId를 받아옵니다.
   */
  const handleReservationSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setFeedbackMessage("");
    setIsSuccess(null);

    // 유효성 검사
    if (!reservationDate) {
      setFeedbackMessage("예약 날짜를 선택해주세요.");
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }
    if (!reservationTime) {
      setFeedbackMessage("예약 시간을 선택해주세요.");
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }

    const NumPeople = Number(numPeople);
    if (isNaN(NumPeople) || NumPeople <= 0) {
      setFeedbackMessage("인원 수는 1명 이상은 하셔야됩니다.");
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }
    // if (numPeople <= 0) {
    //   setFeedbackMessage("인원 수는 1명 이상이어야 합니다.");
    //   setIsSuccess(false);
    //   setIsLoading(false);
    //   return;
    // }

    try {
      setFeedbackMessage("예약 신청 중...");
      const createReservationResponse = await createReservation({
        date: reservationDate,
        time: reservationTime,
        numPeople: numPeople,
        restaurantName: restaurantName,
      });

      if (createReservationResponse.success) {
        const actualReservationId = createReservationResponse.reservationId;
        setReservationId(actualReservationId);
        setFeedbackMessage(
          `예약 ID ${actualReservationId} 생성 성공. 이제 결제 준비를 시작합니다.`
        );
        setIsSuccess(true);
        console.log("예약 생성 응답:", createReservationResponse);

        // 예약 생성 성공 후, 결제 사전 검증 요청
        // `numPeople`을 `amount`로 사용하는 대신, 사전 검증 API가 금액을 계산할 것을 기대합니다.
        await onPreparePayment(actualReservationId, numPeople * 10000);
      } else {
        setFeedbackMessage(
          `예약 신청 실패: ${createReservationResponse.message}`
        );
        setIsSuccess(false);
        console.error("예약 생성 실패 응답:", createReservationResponse);
      }
    } catch (error) {
      setFeedbackMessage(
        `예약 신청 중 오류 발생: ${
          error.response ? error.response.data.message : error.message
        }`
      );
      setIsSuccess(false);
      console.error("예약 신청 오류:", error.response || error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 2단계: 백엔드에 결제 사전 검증 요청을 보냅니다.
   * originalAmount를 매개변수로 받아 서버에 전송합니다.
   */
  const onPreparePayment = async (
    actualReservationId,
    requestOriginalAmount
  ) => {
    setIsLoading(true);
    setFeedbackMessage("");
    setIsSuccess(null);
    try {
      setFeedbackMessage("결제 사전 검증 중...");
      const response = await preparePayment({
        reservationId: actualReservationId,
        originalAmount: requestOriginalAmount,
      });

      // response.data가 유효한지 먼저 확인합니다.
      console.log(response);
      console.log(response.data);
      if (response && typeof response.success !== "undefined") {
        // response.success가 명확히 있는지 확인
        if (response.success) {
          // response.success가 true인 경우
          const {
            merchantUid,
            originalAmount,
            discountAmount,
            finalPaymentAmount,
            // message,       // 필요하다면 추가
            // reservationId  // 필요하다면 추가
          } = response; // <-- response 객체에서 직접 구조 분해 할당

          setCurrentMerchantUid(merchantUid);
          setOriginalAmount(originalAmount);
          setDiscountAmount(discountAmount);
          setFinalPaymentAmount(finalPaymentAmount);

          setFeedbackMessage("결제 사전 검증 성공. 결제창을 준비합니다.");
          setIsSuccess(true);
          console.log("사전 검증 응답 (전체 response 객체):", response);

          //   handleProceedToPayment();
        } else {
          // response.success가 false인 경우 (서버에서 에러 메시지를 보냄)
          setFeedbackMessage(
            `결제 사전 검증 실패: ${response.message || "알 수 없는 오류"}`
          );
          setIsSuccess(false);
          console.error("사전 검증 실패 응답:", response);
        }
      } else {
        // response가 null/undefined이거나, response.success 속성이 없는 경우
        setFeedbackMessage("서버 응답이 올바르지 않습니다. 다시 시도해주세요.");
        setIsSuccess(false);
        console.error(
          "비정상적인 사전 검증 응답 (response 또는 success 속성 없음):",
          response
        );
      }
      // --- 수정 완료 ---
    } catch (error) {
      // 네트워크 오류, 서버에서 4xx/5xx 상태 코드 반환 등
      setFeedbackMessage(
        `결제 사전 검증 중 오류 발생: ${
          error.response
            ? error.response.data?.message || error.message
            : error.message
        }`
      );
      setIsSuccess(false);
      console.error("사전 검증 오류:", error.response || error);
    } finally {
      // setIsLoading(false)는 handleProceedToPayment 또는 결제창 콜백에서 처리
    }
  };

  /**
   * 3단계: PortOne 결제창을 띄우는 함수 (사용자 결제 진행 버튼 클릭 시 호출)
   */
  const handleProceedToPayment = () => {
    setIsLoading(true);
    setFeedbackMessage("");
    setIsSuccess(null);

    if (!window.IMP) {
      setFeedbackMessage("결제 모듈을 로드할 수 없습니다.");
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }
    // `currentMerchantUid`와 `finalPaymentAmount`가 설정되었는지 확인
    if (!currentMerchantUid || finalPaymentAmount <= 0) {
      setFeedbackMessage("결제 정보를 먼저 확인해주세요.");
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }

    window.IMP.request_pay(
      {
        pg: "kakaopay.TC0ONETIME",
        pay_method: "card",
        merchant_uid: currentMerchantUid,
        name: `${restaurantName} 예약 (${finalPaymentAmount}원)`,
        amount: finalPaymentAmount, // *** finalPaymentAmount 사용 ***
        buyer_email: "test@example.com",
      },
      (rsp) => {
        setIsLoading(false);
        if (rsp.success) {
          setFeedbackMessage("결제 성공! 최종 처리를 진행합니다.");
          setIsSuccess(true);
          console.log("PortOne 결제 성공:", rsp);
          sendCompletePayment(rsp.imp_uid, rsp.merchant_uid);
        } else {
          console.error("아임포트 결제 실패 콜백:", rsp);
          console.error("아임포트 결제 실패 메시지:", rsp.error_msg);
          setFeedbackMessage(`결제 실패: ${rsp.error_msg}`);
          setIsSuccess(false);
        }
      }
    );
  };

  /**
   * 4단계: 결제 완료 후 백엔드에 최종 결제 정보를 전송하는 함수
   */
  const sendCompletePayment = async (impUid, merchantUid) => {
    setIsLoading(true);
    setFeedbackMessage("");
    setIsSuccess(null);
    try {
      setFeedbackMessage("결제 완료 정보 서버 전송 중...");
      const response = await completePayment({
        impUid: impUid,
        merchantUid: merchantUid,
      });

      if (response.success) {
        setFeedbackMessage(
          "예약 및 결제 최종 완료! 사장님 승인을 기다려주세요."
        );
        setIsSuccess(true);
        console.log("결제 최종 완료 응답:", response);
      } else {
        setFeedbackMessage(`결제 최종 처리 실패: ${response.message}`);
        setIsSuccess(false);
        console.error("결제 최종 처리 실패 응답:", response);
      }
    } catch (error) {
      setFeedbackMessage(
        `결제 최종 처리 중 오류 발생: ${
          error.response ? error.response.data.message : error.message
        }`
      );
      setIsSuccess(false);
      console.error("결제 최종 처리 오류:", error.response || error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 관리자가 예약 상태를 승인 또는 거절하는 함수
   */
  const handleAdminApproval = async (status) => {
    setIsLoading(true);
    setFeedbackMessage("");
    setIsSuccess(null);

    if (!adminReservationId) {
      setFeedbackMessage("승인/거절할 예약 ID를 입력하세요.");
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }

    try {
      const requestBody = {
        reservationId: Number(adminReservationId),
        reservationStatus: status,
        ownerNotes: ownerNote,
      };

      console.log(`[handleAdminApproval] 백엔드에 보낼 요청:`, requestBody);

      const response = await approveReservation(requestBody);

      if (response) {
        setFeedbackMessage(
          `예약 ID ${adminReservationId} ${status} 성공: ${response.message}`
        );
        setIsSuccess(true);
        console.log("관리자 승인/거절 성공:", response);
      } else {
        setFeedbackMessage(
          `예약 ID ${adminReservationId} ${status} 실패: ${response.message}`
        );
        setIsSuccess(false);
        console.error("관리자 승인/거절 실패 응답:", response);
      }
    } catch (error) {
      setFeedbackMessage(
        `예약 ${status} 중 오류 발생: ${
          error.response ? error.response.data : error.message
        }`
      );
      setIsSuccess(false);
      console.error("관리자 승인/거절 오류:", error.response || error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // 상태
    reservationDate,
    setReservationDate,
    reservationTime,
    setReservationTime,
    numPeople,
    setNumPeople,
    reservationId,
    isLoading,
    originalAmount,
    discountAmount,
    finalPaymentAmount,
    currentMerchantUid,
    feedbackMessage,
    isSuccess,
    adminReservationId,
    setAdminReservationId,
    ownerNote,
    setOwnerNotes,
    notificationPermission,
    // 함수
    onNotificationsClick,
    handleReservationSubmit,
    handleProceedToPayment,
    handleAdminApproval,
    // 기타
    restaurantName,
  };
};
