import { configureStore } from "@reduxjs/toolkit";
import reservationReducer from "../components/reservation/store/reservationSlice";

export const store = configureStore({
  reducer: {
    reservation: reservationReducer,
  },
});
