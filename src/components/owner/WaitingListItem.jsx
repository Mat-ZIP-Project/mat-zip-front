import React from 'react';
import styles from '../../assets/styles/pages/owner/WaitingManagePage.module.css';

const WaitingListItem = ({
  item,
  showPhone = false,
  onEnter,
  onNoShow,
  showEnterBtn = false,
  showNoShowBtn = false,
}) => (
  <div className={styles.waitingItemBox}>
    <span className={styles.fieldName}>{item.userName}({item.userId})</span>
    <span className={styles.fieldPeople}>{item.numPeople}명</span>
    <span className={styles.fieldNumber}>{item.waitingNumber}</span>
    {showPhone && <span className={styles.fieldPhone}>{item.phone}</span>}
    <span className={styles.fieldBtn}>
      <div className={styles.btnGroup}>
        {showEnterBtn && (
          <button className={styles.callBtn} onClick={() => onEnter(item.waitingId)}>
            입장완료
          </button>
        )}
        {showNoShowBtn && (
          <button className={styles.noShowBtn} onClick={() => onNoShow(item.waitingId)}>
            노쇼
          </button>
        )}
      </div>
    </span>
  </div>
);

export default WaitingListItem;