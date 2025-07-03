import axiosInstance from "./axiosinstance";

/**
 *  예약 신청 했을 때 결제 전에 예약 정보를 서버에게 보내주고 예약 Id를 받아온다.
 */
export const createReservationApi = async (reservationData) => {
  const response = await axiosInstance.post(
    "/reservation/create",
    reservationData
  );
  return response.data;
};

/**
 *
 */
export const preparePaymentApi = async (paymentData) => {
  const response = await axiosInstance.post("/payment/prepare", paymentData);
  return response.data;
};

/**
 *  결제 완료 후 사장
 */
export const completePaymentApi = async (paymentData) => {
  const response = await axiosInstance.post("/payment/complete", paymentData);
  return response.data;
};

/**
 *
 */
export const approveReservationApi = async (adminActionData) => {
  const response = await axiosInstance.post(
    "/reservation/approve",
    adminActionData
  );
  return response.data;
};
