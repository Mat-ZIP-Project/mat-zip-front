import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setReservationId,
  setFeedback,
  setAmount,
  setPaymentDetails,
  clearFeedback,
} from "../store/reservationSlice";
import {
  createReservationApi,
  preparePaymentApi,
  completePaymentApi,
} from "../api/reservationService";
import { IMP_UID, RESTAURANT_NAME } from "../constants";

export const useReservation = () => {
  const dispatch = useDispatch();
  const {
    reservationDate,
    reservationTime,
    numPeople,
    reservationId,
    amount,
    originalAmount,
  } = useSelector((state) => state.reservation);

  // 인원 수 변경 시 결제 금액 자동 계산
  useEffect(() => {
    dispatch(setAmount(numPeople * 10000));
  }, [numPeople, dispatch]);

  // PortOne SDK 초기화
  useEffect(() => {
    if (window.IMP) {
      window.IMP.init(IMP_UID);
      console.log("PortOne SDK 초기화 완료 : ", IMP_UID);
    } else {
      console.warn("PortOne SDK가 로드되지 않았습니다.");
    }
  }, []);

  /**
   * 1단계: 백엔드에 예약 정보를 먼저 보내고 생성된 reservationId를 받아온다.
   */
  const handleReservation = async () => {
    dispatch(clearFeedback());

    if (!reservationDate || !reservationTime || numPeople <= 0) {
      dispatch(
        setFeedback({
          message: "모든 예약 정보를 입력해주세요.",
          isSuccess: false,
        })
      );
      return;
    }

    try {
      dispatch(setFeedback({ message: "예약 신청 중...", isSuccess: null }));

      const createReservationResponse = await createReservationApi({
        date: reservationDate,
        time: reservationTime,
        numPeople: numPeople,
        restaurantName: RESTAURANT_NAME,
      });

      if (createReservationResponse.success) {
        const actualReservationId = createReservationResponse.reservationId;
        dispatch(setReservationId(actualReservationId));
        dispatch(
          setFeedback({
            message: `예약 ID ${actualReservationId} 생성 성공. 이제 결제 준비를 시작합니다.`,
            isSuccess: true,
          })
        );
        console.log("예약 생성 응답:", createReservationResponse);
        await onPreparePayment(actualReservationId, amount);
      } else {
        dispatch(
          setFeedback({
            message: "예약 신청 실패: " + createReservationResponse.message,
            isSuccess: false,
          })
        );
        console.error("예약 생성 실패 응답:", createReservationResponse);
      }
    } catch (error) {
      dispatch(
        setFeedback({
          message: `예약 신청 중 오류 발생: ${
            error.response ? error.response.data.message : error.message
          }`,
          isSuccess: false,
        })
      );
      console.error("예약 신청 오류:", error.response || error);
    }
  };

  /**
   * 2단계: 백엔드에 결제 사전 검증 요청을 보내는 함수
   * amount = originalAmount 금액을 보내는 상황
   */
  const onPreparePayment = async (actualReservationId, initialAmount) => {
    try {
      const response = await preparePaymentApi({
        reservationId: actualReservationId,
        originalAmount: initialAmount,
      });

      if (response.success) {
        dispatch(
          setFeedback({
            message: "결제 사전 검증 성공. 결제창을 준비합니다.",
            isSuccess: true,
          })
        );
        console.log("사전 검증 응답:", response);
        const {
          merchantUid,
          originalAmount,
          discountAmount,
          finalPaymentAmount,
        } = response.data;

        // 백엔드에서 계산된 최종 금액으로 Redux 스토어의 amount를 업데이트
        dispatch(
          setPaymentDetails({
            originalAmount: originalAmount,
            discountAmount: discountAmount,
            finalPaymentAmount: finalPaymentAmount,
          })
        );

        // 결제창 띄우기 함수 호출
        requestPay(merchantUid);
      } else {
        dispatch(
          setFeedback({
            message: "결제 사전 검증 실패: " + response.message,
            isSuccess: false,
          })
        );
        console.error("사전 검증 실패 응답:", response);
      }
    } catch (error) {
      dispatch(
        setFeedback({
          message: `결제 사전 검증 중 오류 발생: ${
            error.response ? error.response.data.message : error.message
          }`,
          isSuccess: false,
        })
      );
      console.error("사전 검증 오류:", error.response || error);
    }
  };

  /**
   * 3단계: PortOne 결제창을 띄우는 함수
   */
  const requestPay = (merchantUid) => {
    if (!window.IMP) {
      dispatch(
        setFeedback({
          message: "결제 모듈을 로드할 수 없습니다....",
          isSuccess: false,
        })
      );
      return;
    }

    window.IMP.request_pay(
      {
        pg: "kakaopay.TC0ONETIME",
        pay_method: "card",
        merchant_uid: merchantUid,
        name: `${RESTAURANT_NAME} 예약 (${numPeople}인)`,
        amount: amount,
        buyer_email: "test@example.com", // 실제 사용자 이메일로 변경 필요
      },
      (rsp) => {
        if (rsp.success) {
          dispatch(
            setFeedback({
              message: "결제 성공! 최종 처리를 진행합니다.",
              isSuccess: true,
            })
          );
          console.log("결제 성공: ", rsp);
          sendCompletePayment(rsp.imp_uid, rsp.merchant_uid);
        } else {
          console.error("아임포트 결제 실패 콜백: ", rsp);
          console.error("아임포트 결제 실패 메시지: ", rsp.error_msg);
          dispatch(
            setFeedback({
              message: `결제 실패: ${rsp.error_msg}`,
              isSuccess: false,
            })
          );
        }
      }
    );
  };

  /**
   * 4단계: 결제 완료 후 백엔드에 최종 결제 정보를 전송하는 함수
   */
  const sendCompletePayment = async (impUid, merchantUid) => {
    dispatch(
      setFeedback({
        message: "결제 완료 정보 서버 전송 중...",
        isSuccess: null,
      })
    );

    try {
      const response = await completePaymentApi({
        impUid: impUid,
        merchantUid: merchantUid,
      });

      if (response.success) {
        dispatch(
          setFeedback({
            message: "예약 및 결제 최종 완료! 사장님 승인을 기다려주세요.",
            isSuccess: true,
          })
        );
        console.log("결제 최종 완료 응답:", response);
      } else {
        dispatch(
          setFeedback({
            message: "결제 최종 처리 실패: " + response.message,
            isSuccess: false,
          })
        );
        console.error("결제 최종 처리 실패 응답:", response);
      }
    } catch (error) {
      dispatch(
        setFeedback({
          message: `결제 최종 처리 중 오류 발생: ${
            error.response ? error.response.data.message : error.message
          }`,
          isSuccess: false,
        })
      );
      console.error("결제 최종 처리 오류:", error.response || error);
    }
  };

  return {
    handleReservation,
    reservationId,
    reservationDate,
    reservationTime,
    numPeople,
    amount,
    originalAmount,
  };
};
