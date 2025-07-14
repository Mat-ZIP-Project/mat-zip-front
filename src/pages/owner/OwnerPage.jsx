import React, { useEffect, useState } from 'react';
import { ownerApi } from '../../api/ownerApi';
import styles from '../../assets/styles/pages/owner/OwnerPage.module.css';

import MenuManagePage from './MenuManagePage';
import RestaurantManagePage from './RestaurantManagePage';
import Dashboard from './Dashboard';
import ReservationManagePage from './ReservationManagePage';
import ReviewManagePage from './ReviewManagePage';
import WaitingManagePage from './WaitingManagePage';

const TABS = [
  { key: 'dashboard', label: '대시보드 홈' },
  { key: 'restaurant', label: '식당 관리' },
  { key: 'menu', label: '메뉴 관리' },
  { key: 'reservation', label: '예약 관리' },
  { key: 'waiting', label: '웨이팅 관리' },
  { key: 'review', label: '리뷰 관리' },
];

/** 식당 마이페이지 메인 */
const OwnerPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [todayReservationCount, setTodayReservationCount] = useState(0);

  useEffect(() => {
    // 식당 정보 호출
    const fetchRestaurantInfo = async () => {
      try {
        const res = await ownerApi.getRestaurantInfo();
        setRestaurantInfo(res.data);
      } catch (err) {
        setRestaurantInfo(null);
      }
    };
    fetchRestaurantInfo();

    // 오늘 예약건수 호출
    const fetchTodayReservationCount = async () => {
      try {
        const res = await ownerApi.getTodayReservations();
        setTodayReservationCount(Array.isArray(res.data) ? res.data.length : 0);
      } catch {
        setTodayReservationCount(0);
      }
    };
    fetchTodayReservationCount();
  }, []);

  // 예시: 오늘 예약 일정은 restaurantInfo.todayReservationCount로 받아온다고 가정
  // 실제 예약건수 필드는 백엔드에서 추가 필요 (현재는 없음, 임시로 0)
  const restaurantName = restaurantInfo?.restaurantName || '';
  //const todayReservationCount = restaurantInfo?.todayReservationCount ?? 0;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return restaurantInfo? <Dashboard restaurantId={restaurantInfo.restaurantId} /> : <div>⌛ 식당 정보를 불러오는 중...</div>;
      case 'restaurant':
        return <RestaurantManagePage />;
      case 'menu':
        return <MenuManagePage />;
      case 'reservation':
        return <ReservationManagePage />;
      case 'waiting':
        return <WaitingManagePage />;
      case 'review':
        return <ReviewManagePage />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.ownerPageContainer}>
      <div className={styles.ownerGreetingBar}>
        <span>
          안녕하세요. <span className={styles.restaurantName}>{restaurantName}</span> 사장님 🙌
        </span>
        <span className={styles.todayReservation}>
          <span style={{ fontSize: '13px', color: '#ccc' }}>오늘 예약 일정</span><br />
          <span style={{ fontSize: '28px', fontWeight: 700 }}>{todayReservationCount}</span>
          <span style={{ fontSize: '15px', marginLeft: 2 }}>건</span>
        </span>
      </div>
      <nav className={styles.ownerTabs}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`${styles.ownerTabItem} ${activeTab === tab.key ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <section className={styles.ownerTabContent}>
        {renderTabContent()}
      </section>
    </div>
  );
};

export default OwnerPage;