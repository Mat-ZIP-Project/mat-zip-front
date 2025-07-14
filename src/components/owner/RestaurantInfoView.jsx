import React from 'react';
import styles from '../../assets/styles/owner/RestaurantInfoView.module.css';
import BlackButton from './BlackButton';


// 12시간 포맷 변환 함수
function formatTime12(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h, 10);
  const minute = m;
  const isAM = hour < 12;
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${isAM ? '오전' : '오후'} ${displayHour.toString().padStart(2, '0')}:${minute}`;
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
          <td>{formatTime12(info.openTime)}</td>
        </tr>
        <tr>
          <th>마감 시간</th>
          <td>{formatTime12(info.closeTime)}</td>
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