import React from "react";
import ReactDOM from "react-dom";
import styles from "../../assets/styles/restaurant/WaitingStatusModal.module.css";

const WaitingStatusModal = ({ waitingList, onClose }) => {
  return ReactDOM.createPortal(
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>실시간 웨이팅 현황</h2>
        <button className={styles.closeBtn} onClick={onClose}>닫기</button>
        {waitingList.length === 0 ? (
          <p>현재 웨이팅 중인 식당이 없습니다.</p>
        ) : (
          <ul>
            {waitingList.map((item) => (
              <li key={item.restaurantId}>
                <strong>{item.restaurantName}</strong> - 대기번호 {item.waitingNumber}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>,
    document.body
  );
};

export default WaitingStatusModal;