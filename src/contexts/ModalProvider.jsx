import React, { useState } from "react";
import { ModalContext } from "./ModalContext";

// Context Provider 컴포넌트 생성
export const ModalProvider = ({ children }) => {
    const [showReservationModal, setShowReservationModal] = useState(false);

    // 모달을 여는 함수
    const openReservationModal = () => {
        console.log("모달 열기 요청됨");
        setShowReservationModal(true);
    }

    // 모달을 닫는 함수
    const closeReservationModal = () => {
        console.log("모달 닫기 요청됨");
        setShowReservationModal(false);
    };

    const contextValue = {
        showReservationModal,
        openReservationModal,
        closeReservationModal,
    };

    return (
        <ModalContext.Provider value={contextValue}>
            {children}
        </ModalContext.Provider>
    )
}

