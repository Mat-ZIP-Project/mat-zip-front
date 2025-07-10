import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosinstance';
import RestaurantDetailInfo from '../../components/restaurant/RestaurantDetailInfo';
import TabMenu from '../../components/restaurant/TabMenu';
import '../../assets/styles/restaurant/RestaurantDetailPage.css';

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await axiosInstance.get(`/api/restaurants/${id}`);
        setRestaurant(res.data);
      } catch (error) {
        console.error('식당 정보를 불러오지 못했습니다.', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, []);

  if (loading) return <p>로딩 중...</p>;
  if (!restaurant) return <p>식당 정보를 표시할 수 없습니다.</p>;

  return (
    <div className="restaurant-detail-page">
  {restaurant.thumbnailImageUrl ? (
    <img
      src={restaurant.thumbnailImageUrl}
      alt={restaurant.restaurantName}
      className="restaurant-detail-image"
    />
  ) : (
    <div className="restaurant-detail-image placeholder">
      <span>식당 이미지</span>
    </div>
  )}

  <RestaurantDetailInfo data={restaurant} />
  <TabMenu activeTab={activeTab} setActiveTab={setActiveTab} />

  <div className="restaurant-tab-content">
    {activeTab === 'home' && <p>홈 콘텐츠 영역</p>}
    {activeTab === 'menu' && <p>메뉴 콘텐츠 영역</p>}
    {activeTab === 'review' && <p>리뷰 콘텐츠 영역</p>}
    {activeTab === 'info' && <p>식당 추가 정보 영역</p>}
  </div>
</div>
  );
};

export default RestaurantDetailPage;
