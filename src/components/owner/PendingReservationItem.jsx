import React from 'react';
import styles from '../../assets/styles/owner/ReservationItem.module.css';

const PendingReservationItem = ({ item, onApprove, onReject }) => (
  <div className={styles.itemBox}>
    <span className={styles.pendingFieldName}>{item.userName}({item.userId})</span>
    <span className={styles.pendingFieldPeople}>{item.numPeople}명</span>
    <span className={styles.pendingFieldDate}>{item.date} {item.time}</span>
    <span className={styles.pendingFieldBtn}>
      <div className={styles.btnGroup}>
        <button className={styles.approveBtn} onClick={onApprove}>승인</button>
        <button className={styles.rejectBtn} onClick={onReject}>거절</button>
      </div>
    </span>
  </div>
);

export default PendingReservationItem;