import React from "react";
import styles from "../../assets/styles/owner/ReservationListSection.module.css";
import { formatTime } from "../../utils/time";

// const formatTime = (timeStr) => {
//   if (!timeStr) return "";
//   const [hh, mm] = timeStr.split(":");
//   return `${hh}:${mm}`;
// };

const AllReservationList = ({ items }) => (
  <>
    <div className={styles.listHeader}>
      <span className={styles.fieldName}>성함(아이디)</span>
      <span className={styles.fieldPeople}>예약인원</span>
      <span className={styles.fieldDate}>예약일,시간</span>
      <span className={styles.fieldStatus}>상태</span>
    </div>
    <div className={styles.listTopAlign}>
      {items.length === 0 ? (
        <div className={styles.emptyMessageCenter}>전체 예약 내역이 없습니다.</div>
      ) : (
        items.map(item => (
          <div className={styles.itemBox} key={item.reservationId}>
            <span className={styles.fieldName}>
              {item.noShow ? "😈" : ""}
              {item.userName}({item.userId})
            </span>
            <span className={styles.fieldPeople}>{item.numPeople}명</span>
            <span className={styles.fieldDate}>
              {item.date} {formatTime(item.time)}
            </span>
            <span className={styles.fieldStatus}>{item.status}</span>
          </div>
        ))
      )}
    </div>
  </>
);

export default AllReservationList;