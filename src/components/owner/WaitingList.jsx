import React from 'react';
import WaitingListItem from './WaitingListItem';
import styles from '../../assets/styles/pages/owner/WaitingManagePage.module.css';

const WaitingList = ({
  loading,
  waitingList,
  title,
  showPhone = false,
  onEnter,
  onNoShow,
  showEnterBtn = false,
  showNoShowBtn = false,
}) => (
  <div className={styles.waitingListSection}>
    {/* 명단 타이틀을 먼저 표시 */}
    <div style={{ fontWeight: 700, margin: '8px 0 4px 8px', color: '#FF6B35' }}>{title}</div>
    {/* 표 헤더를 그 아래에 표시 */}
    <div className={styles.waitingListHeader}>
      <span className={styles.fieldName}>성함(아이디)</span>
      <span className={styles.fieldPeople}>인원</span>
      <span className={styles.fieldNumber}>대기번호</span>
      {showPhone && <span className={styles.fieldPhone}>전화번호</span>}
      <span className={styles.fieldBtn}></span>
    </div>
    {loading ? (
      <div className={styles.emptyMessage}>웨이팅 정보를 불러오는 중...</div>
    ) : waitingList.length === 0 ? (
      <div className={styles.emptyMessage}>명단이 없습니다.</div>
    ) : (
      waitingList.map(item => (
        <WaitingListItem
          key={item.waitingId}
          item={item}
          showPhone={showPhone}
          onEnter={onEnter}
          onNoShow={onNoShow}
          showEnterBtn={showEnterBtn}
          showNoShowBtn={showNoShowBtn}
        />
      ))
    )}
  </div>
);

export default WaitingList;