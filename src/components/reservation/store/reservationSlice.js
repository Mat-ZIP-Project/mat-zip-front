import { createSlice } from "@reduxjs/toolkit";

const initalState = {
  reservationId: null,
  reservationDate: "",
  reservationTime: "18:00",
  numPeople: 1,
  amount: 0, // 최종 결제 금액

  // 할인 정보 상태
  originalAmount: 0, // 프론트에서 계산된 초기 금액 (할인 전)
  discountAmount: 0, // 백엔드에서 계산된 할인 금액
  finalPaymentAmount: 0, // 백엔드에서 계산된 최종 결제 금액

  feedbackMessage: "",
  isSuccess: null,
};

const reservationSlice = createSlice({
  name: "reservation",
  initalState,
  reducers: {
    setReservationInfo: (state, action) => {
      if (action.payload.date !== undefined)
        state.reservationDate = action.payload.date;
      if (action.payload.time !== undefined)
        state.reservationTime = action.payload.time;
      if (action.payload.numPeople !== undefined)
        state.numPeople = action.payload.numPeople;
    },
    setReservationId: (state, action) => {
      state.reservationId = action.payload;
    },
    setNumPeople: (state, action) => {
      state.numPeople = action.payload;
      state.originalAmount = action.payload * 10000;
      state.amount = action.payload * 10000;
      state.discountAmount = 0;
      state.finalPaymentAmount = 0;
    },
    setAmount: (state, action) => {
      state.amount = action.payload;
    },
    setPaymentDetails: (state, action) => {
      state.originalAmount = action.payload.originalAmount;
      state.discountAmount = action.payload.discountAmount;
      state.finalPaymentAmount = action.payload.finalPaymentAmount;
      state.amount = action.payload.finalPaymentAmount;
    },
    setFeedback: (state, action) => {
      state.feedbackMessage = action.payload.message;
      state.isSuccess = action.payload.isSuccess;
    },
    clearFeedback: (state) => {
      state.feedbackMessage = "";
      state.isSuccess = null;
    },
    resetReservationState: () => initalState,
  },
});

export const {
  setReservationInfo,
  setReservationId,
  setNumPeople,
  setAmount,
  setPaymentDetails,
  setFeedback,
  clearFeedback,
  resetReservationState,
} = reservationSlice.actions;

export default reservationSlice.reducer;
