import React from 'react';
import styles from '../../assets/styles/pages/owner/WaitingManagePage.module.css';

const WaitingItem = ({ item, onCall, onNoShow }) => (
  <div className={styles.waitingItemBox}>
    <span className={styles.fieldName}>{item.userName}({item.userId})</span>
    <span className={styles.fieldPeople}>{item.people}명</span>
    <span className={styles.fieldTime}>{item.registeredAt}</span>
    <span className={styles.fieldNumber}>{item.waitingNumber}</span>
    <span className={styles.fieldBtn}>
      <div className={styles.btnGroup}>
        <button className={styles.callBtn} onClick={onCall}>호출</button>
        <button className={styles.noShowBtn} onClick={onNoShow}>노쇼</button>
      </div>
    </span>
  </div>
);

export default WaitingItem;