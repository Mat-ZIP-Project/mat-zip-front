import axiosInstance from "../../../api/axiosinstance";

/**
 *  예약 신청 api
 */
export const createReservation = async (reservationData) => {
  try {
    const response = await axiosInstance.post(
      "/reservation/create",
      reservationData
    );
    return response.data;
  } catch (error) {
    console.error(
      "API Error: createReservation -",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 *  사장 승인 api
 */
export const approveReservation = async (adminApprovalData) => {
  try {
    const response = await axiosInstance.post(
      "/reservation/approve",
      adminApprovalData
    );
    return response.data;
  } catch (error) {
    console.error(
      "API Error: approveReservation -",
      error.response?.data || error.message
    );
    throw error;
  }
};
