import React from 'react';
import styles from '../../assets/styles/pages/owner/WaitingManagePage.module.css';

const WaitingSummaryBox = ({ teamCount, expectedTime }) => (
  <div className={styles.summaryBox}>
    <div>
      <span className={styles.summaryLabel}>현재 대기팀 수</span>
      <span className={styles.summaryValue}>{teamCount}팀</span>
    </div>
    <div>
      <span className={styles.summaryLabel}>예상 입장시간</span>
      <span className={styles.summaryValue}>{expectedTime}</span>
    </div>
  </div>
);

export default WaitingSummaryBox;