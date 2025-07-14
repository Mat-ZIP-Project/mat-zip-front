import React from "react";
import ReactDOM from "react-dom";
import styles from "../../assets/styles/restaurant/WaitingStatusModal.module.css";

const WaitingStatusModal = ({ waitingInfo, onClose }) => {
  return ReactDOM.createPortal(
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>실시간 웨이팅 현황</h2>
        <button className={styles.closeBtn} onClick={onClose}>닫기</button>
        {!waitingInfo ? (
          <p>현재 웨이팅 중인 식당이 없습니다.</p>
        ) : (
          <ul>
            <li>
              <strong>{waitingInfo.restaurantName}</strong> - 대기번호 {waitingInfo.waitingNumber}
              <span className={styles.myOrder}> (내 순번: {waitingInfo.waitingOrder}번째)</span>
              {/* <br />
              상태: {waitingInfo.status}
              <br />
              예상 입장 시간: {waitingInfo.expectedEntryTime}
              <br />
              현재 대기 인원: {waitingInfo.waitingCount} */}
            </li>
          </ul>
        )}
      </div>
    </div>,
    document.body
  );
};

export default WaitingStatusModal;