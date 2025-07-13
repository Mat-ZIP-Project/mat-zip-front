import React from 'react';
import NoShowItem from './NoShowItem';
import styles from '../../assets/styles/pages/owner/ReservationManagePage.module.css';
import itemStyles from '../../assets/styles/owner/ReservationItem.module.css';

const NoShowList = ({ items, onMark }) => (
  <div className={styles.listScroll}>
    <div className={itemStyles.noShowListHeader}>
      <span className={itemStyles.noShowFieldName}>성함(아이디)</span>
      <span className={itemStyles.noShowFieldDate}>예약일</span>
      <span className={itemStyles.noShowFieldBtn}></span>
    </div>
    {items.length === 0 ? (
      <div className={styles.emptyMessageCenter}>만료된 예약이 없습니다.</div>
    ) : (
      <div className={styles.listTopAlign}>
        {items.map(item => (
          <NoShowItem
            key={item.reservationId}
            item={item}
            onMark={() => onMark(item.reservationId)}
          />
        ))}
      </div>
    )}
  </div>
);

export default NoShowList;