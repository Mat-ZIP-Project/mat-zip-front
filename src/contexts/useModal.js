import { useContext } from "react";
import { ModalContext } from "./ModalContext";

// Context를 쉽게 사용할 수 있도록 커스텀 훅 생성
export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
