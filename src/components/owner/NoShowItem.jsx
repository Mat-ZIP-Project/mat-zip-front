import React from 'react';
import styles from '../../assets/styles/owner/ReservationItem.module.css';

const NoShowItem = ({ item, onMark }) => (
  <div className={styles.itemBox}>
    <span className={styles.noShowFieldName}>{item.userName}({item.userId})</span>
    <span className={styles.noShowFieldDate}>{item.reservationDate} {item.reservationTime}</span>
    <span className={styles.noShowFieldBtn}>
      <button className={styles.noShowBtn} onClick={onMark}>예약 만료</button>
    </span>
  </div>
);

export default NoShowItem;