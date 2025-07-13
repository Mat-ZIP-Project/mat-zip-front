import React from 'react';
import PendingReservationItem from './PendingReservationItem';
import styles from '../../assets/styles/pages/owner/ReservationManagePage.module.css';
import itemStyles from '../../assets/styles/owner/ReservationItem.module.css';

const PendingReservationList = ({ items, onApprove, onReject }) => (
  <div className={styles.listScroll}>
    <div className={itemStyles.pendingListHeader}>
      <span className={itemStyles.pendingFieldName}>성함(아이디)</span>
      <span className={itemStyles.pendingFieldPeople}>인원</span>
      <span className={itemStyles.pendingFieldDate}>예약일</span>
      <span className={itemStyles.pendingFieldBtn}></span>
    </div>
    {items.length === 0 ? (
      <div className={styles.emptyMessageCenter}>현재 대기 중인 예약이 없습니다.</div>
    ) : (
      <div className={styles.listTopAlign}>
        {items.map(item => (
          <PendingReservationItem
            key={item.reservationId}
            item={item}
            onApprove={() => onApprove(item.reservationId)}
            onReject={() => onReject(item)}
          />
        ))}
      </div>
    )}
  </div>
);

export default PendingReservationList;