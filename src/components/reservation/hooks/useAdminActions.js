import { useState } from "react";
import { useDispatch } from "react-redux";
import { setFeedback } from "../store/reservationSlice";
import { approveReservationApi } from "../api/reservationService";

export const useAdminActions = () => {
  const [adminReservationId, setAdminReservationId] = useState("");
  const [ownerNote, setOwnerNotes] = useState("");
  const dispatch = useDispatch();

  /**
   * 관리자가 예약 상태를 승인 또는 거절하는 함수
   */
  const handleAdminApproval = async (status) => {
    dispatch(setFeedback({ message: "", isSuccess: null }));

    if (!adminReservationId) {
      dispatch(
        setFeedback({
          message: "승인/거절할 예약 ID를 입력하세요.",
          isSuccess: false,
        })
      );
      return;
    }

    try {
      const requestBody = {
        reservationId: Number(adminReservationId),
        reservationStatus: status,
        ownerNotes: ownerNote,
      };

      console.log(`[handleAdminApproval] 백엔드에 보낼 요청:`, requestBody);

      const response = await approveReservationApi(requestBody);

      // 백엔드의 응답 구조에 따라 success 필드나 특정 HTTP 상태 코드를 확인
      if (response.success) {
        dispatch(
          setFeedback({
            message: `예약 ID ${adminReservationId} ${status} 성공: ${response.message}`,
            isSuccess: true,
          })
        );
        console.log("관리자 승인/거절 성공:", response);
        // setAdminReservationId(""); // 선택 사항: 처리 후 ID 초기화
        // setOwnerNotes(""); // 선택 사항: 처리 후 노트 초기화
      } else {
        dispatch(
          setFeedback({
            message: `예약 ID ${adminReservationId} ${status} 실패: ${response.message}`,
            isSuccess: false,
          })
        );
        console.error("관리자 승인/거절 실패 응답:", response);
      }
    } catch (error) {
      dispatch(
        setFeedback({
          message: `예약 ${status} 중 오류 발생: ${
            error.response ? error.response.data.message : error.message
          }`,
          isSuccess: false,
        })
      );
      console.error("관리자 승인/거절 오류:", error.response || error);
    }
  };

  return {
    adminReservationId,
    setAdminReservationId,
    ownerNote,
    setOwnerNotes,
    handleAdminApproval,
  };
};
