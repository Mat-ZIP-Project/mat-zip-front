import React from "react";
import styles from "../../assets/styles/owner/TodayReservationList.module.css";
import { formatTime } from "../../utils/time";

const TodayReservationList = ({ items }) => (
  <section className={styles.todaySection}>
    <h3 className={styles.todayTitle}>당일 예약 일정</h3>
    <div className={styles.todayList}>
      {items.length === 0 ? (
        <div className={styles.empty}>오늘 예약이 없습니다.</div>
      ) : (
        [...items]
          .sort((a, b) => {
            // time이 문자열이 아닌 경우를 대비
            const timeA = typeof a.time === "string" ? a.time : String(a.time ?? "");
            const timeB = typeof b.time === "string" ? b.time : String(b.time ?? "");
            return timeA.localeCompare(timeB);
          })
          .map(item => (
            <div className={styles.todayItem} key={item.id}>
              <span className={styles.nameArea}>
                {item.userName}({item.userId})
              </span>
              <span className={styles.peopleArea}>
                {item.numPeople}명
              </span>
              <span className={styles.timeArea}>
                {formatTime(item.time)}
              </span>
            </div>
          ))
      )}
    </div>
  </section>
);

export default TodayReservationList;