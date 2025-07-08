import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosinstance';
// 예시: 로그인 상태 Context (없으면 구현 필요)
//import { AuthContext } from '../context/AuthContext';
import RestaurantMenuList from '../../components/restaurant/RestaurantMenuList';
import RestaurantReviewList from '../../components/restaurant/RestaurantReviewList';
import RestaurantMap from '../../components/restaurant/RestaurantMap';
import RestaurantDetailInfo from '../../components/restaurant/RestaurantDetailInfo';

const RestaurantDetailPage = () => {
  const { id } = useParams();
//  const { user } = useContext(AuthContext);  // 로그인 정보 가져오기

  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axiosInstance.get('/restaurant/${id}');
        setRestaurant(data);
      } catch (error) {
        console.error('식당 상세 조회 실패:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleRegisterWaiting = async () => {
    if (!user) {
      alert('로그인 후 이용 가능합니다.');
      return;
    }

    try {
      await registerWaiting(id);
      alert('웨이팅 등록 완료!');
    } catch (err) {
      alert('웨이팅 등록 실패: ' + (err.response?.data?.message || '오류'));
    }
  };

  if (!restaurant) return <div>❗ 로딩 중...</div>;

  return (
    <div className="restaurant-detail-page">
      <RestaurantDetailInfo data={restaurant} />
      <RestaurantMenuList menus={restaurant.menus} />
      <RestaurantReviewList reviews={restaurant.reviews} />
      <RestaurantMap location={restaurant.address} />

      {/* 웨이팅 등록 버튼 */}
      <button
        onClick={handleRegisterWaiting}
        className="restaurant-detail-page_waiting-btn"
      >
        📋 웨이팅 등록
      </button>
    </div>
  );
};

export default RestaurantDetailPage;
