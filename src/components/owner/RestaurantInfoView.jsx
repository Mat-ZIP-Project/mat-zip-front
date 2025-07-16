import React from 'react';
import styles from '../../assets/styles/owner/RestaurantInfoView.module.css';
import BlackButton from './BlackButton';


// 12시간 포맷 변환 함수
function formatTime(timeStr) {
  if (!timeStr) return '';
  // 배열([19, 0]) 또는 문자열("19:00", "19,0") 모두 처리
  if (Array.isArray(timeStr)) {
    const [h, m] = timeStr;
    const hour = parseInt(h, 10);
    const minute = String(m).padStart(2, '0');
    const isAM = hour < 12;
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${isAM ? '오전' : '오후'} ${displayHour.toString().padStart(2, '0')}:${minute}`;
  }
  if (typeof timeStr === 'string') {
    const parts = timeStr.includes(':') ? timeStr.split(':') : timeStr.split(',');
    if (parts.length < 2) return timeStr;
    const [h, m] = parts;
    const hour = parseInt(h, 10);
    const minute = String(m).padStart(2, '0');
    const isAM = hour < 12;
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${isAM ? '오전' : '오후'} ${displayHour.toString().padStart(2, '0')}:${minute}`;
  }
  return String(timeStr);
}

const RestaurantInfoView = ({ info, onEdit }) => (
  <div className={styles.infoViewContainer}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
      <div className={styles.descTitle}>{info.restaurantName} 소개글</div>
      <BlackButton onClick={onEdit}>수정</BlackButton>
    </div>
    <div className={styles.descText}>{info.descript}</div>
    <table className={styles.infoTable}>
      <tbody>
        <tr>
          <th>사업자 등록 번호</th>
          <td>{info.businessNumber}</td>
        </tr>
        <tr>
          <th>주소</th>
          <td>{info.address}</td>
        </tr>
        <tr>
          <th>연락처</th>
          <td>{info.phone}</td>
        </tr>
        <tr>
          <th>식당 카테고리</th>
          <td>{info.category}</td>
        </tr>
        <tr>
          <th>오픈 시간</th>
          <td>{formatTime(info.openTime ?? '')}</td>
        </tr>
        <tr>
          <th>마감 시간</th>
          <td>{formatTime(info.closeTime ?? '')}</td>
        </tr>
        <tr>
          <th>최대 웨이팅 수</th>
          <td>{info.maxWaitingLimit} 팀</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default RestaurantInfoView;