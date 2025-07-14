import React from 'react';
import NoShowItem from './NoShowItem';
import styles from '../../assets/styles/owner/ReservationListSection.module.css';

const NoShowList = ({ items, onMark }) => (
  <>
    <div className={styles.listHeader}>
      <span className={styles.fieldName}>성함(아이디)</span>
      <span className={styles.fieldDate}>예약일</span>
      <span className={styles.fieldStatus}></span>
    </div>
    <div className={styles.listTopAlign}>
      {items.length === 0 ? (
        <div className={styles.emptyMessageCenter}>만료된 예약이 없습니다.</div>
      ) : (
        items.map(item => (
          <NoShowItem
            key={item.reservationId}
            item={item}
            onMark={() => onMark(item.reservationId)}
          />
        ))
      )}
    </div>
  </>
);

export default NoShowList;