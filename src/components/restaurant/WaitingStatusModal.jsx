import React from "react";
import ReactDOM from "react-dom";
import styles from "../../assets/styles/restaurant/WaitingStatusModal.module.css";

const WaitingStatusModal = ({ waitingInfo, onClose }) => {
  console.log('waitingInfo:', waitingInfo);
  return ReactDOM.createPortal(
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="닫기">
          ×
        </button>
        <h2 className={styles.modalTitle}>실시간 웨이팅 현황</h2>
        {!waitingInfo ? (
          <p className={styles.modalEmpty}>현재 웨이팅 중인 식당이 없습니다.</p>
        ) : (
          <ul className={styles.modalList}>
            <li className={styles.modalItem}>
              <div>
                <strong className={styles.modalStrong}>고엔스시</strong>
              </div>
              <div>
                <span className={styles.modalLabel}>대기번호</span>
                {waitingInfo.waitingNumber}
                <span className={styles.myOrder}> (내 순번: {waitingInfo.waitingOrder}번째)</span>
              </div>
              {/* <div>
                <span className={styles.modalLabel}>상태</span>
                <span className={styles.status}>{waitingInfo.status}</span>
              </div> */}
              <div>
                <span className={styles.modalLabel}>현재 대기 팀 수</span>
                {waitingInfo.waitingCount}
              </div>
            </li>
          </ul>
        )}
      </div>
    </div>,
    document.body
  );
};

export default WaitingStatusModal;