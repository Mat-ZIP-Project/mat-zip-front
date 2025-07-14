import React from 'react';
import WaitingItem from './WaitingItem';
import styles from '../../assets/styles/pages/owner/WaitingManagePage.module.css';

const WaitingList = ({ loading, waitingList, onCall, onNoShow }) => (
  <div className={styles.waitingListSection}>
    <div className={styles.waitingListHeader}>
      <span className={styles.fieldName}>성함(아이디)</span>
      <span className={styles.fieldPeople}>인원</span>
      <span className={styles.fieldTime}>등록시간</span>
      <span className={styles.fieldNumber}>대기번호</span>
      <span className={styles.fieldBtn}></span>
    </div>
    {loading ? (
      <div className={styles.emptyMessage}>웨이팅 정보를 불러오는 중...</div>
    ) : waitingList.length === 0 ? (
      <div className={styles.emptyMessage}>현재 웨이팅 팀이 없습니다.</div>
    ) : (
      waitingList.map(item => (
        <WaitingItem
          key={item.waitingId}
          item={item}
          onCall={() => onCall(item.waitingId)}
          onNoShow={() => onNoShow(item.waitingId)}
        />
      ))
    )}
  </div>
);

export default WaitingList;