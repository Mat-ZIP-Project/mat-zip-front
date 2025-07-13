import React from 'react';
import PendingReservationItem from './PendingReservationItem';
import styles from '../../assets/styles/owner/ReservationListSection.module.css';

const PendingReservationList = ({ items, onApprove, onReject }) => (
  <>
    <div className={styles.listHeader}>
      <span className={styles.fieldName}>성함(아이디)</span>
      <span className={styles.fieldPeople}>인원</span>
      <span className={styles.fieldDate}>예약일</span>
      <span className={styles.fieldStatus}></span>
    </div>
    <div className={styles.listTopAlign}>
      {items.length === 0 ? (
        <div className={styles.emptyMessageCenter}>현재 대기 중인 예약이 없습니다.</div>
      ) : (
        items.map(item => (
          <PendingReservationItem
            key={item.reservationId}
            item={item}
            onApprove={() => onApprove(item.reservationId)}
            onReject={() => onReject(item)}
          />
        ))
      )}
    </div>
  </>
);

export default PendingReservationList;