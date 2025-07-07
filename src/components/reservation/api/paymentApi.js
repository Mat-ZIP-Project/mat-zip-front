import { axiosInstance, adminAxiosInstance } from "../../../api/axiosinstance";

/**
 *  사전 검증 api
 */
export const preparePayment = async (paymentPrepareData) => {
  try {
    const response = await axiosInstance.post(
      "/payment/prepare",
      paymentPrepareData
    );
    return response.data;
  } catch (error) {
    console.error(
      "API Error: preparePayment -",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 *  결제 완료 api
 */
export const completePayment = async (paymentCompleteData) => {
  try {
    const response = await axiosInstance.post(
      "/payment/complete",
      paymentCompleteData
    );
    return response.data;
  } catch (error) {
    console.error(
      "API Error: completePayment -",
      error.response?.data || error.message
    );
    throw error;
  }
};
