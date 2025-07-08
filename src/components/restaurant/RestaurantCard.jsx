import React, { useState } from 'react';
import axiosInstance from '../../api/axiosinstance';

const RestaurantCard = ({ data, isLoggedIn }) => {
  const {
    restaurantId,
    restaurantName,
    address,
    thumbnailImageUrl,
    likeCount,
    reviewCount,
    reservationCount,
    liked, // 서버에서 받은 찜 상태 (boolean)
  } = data;

  const [isLiked, setIsLiked] = useState(liked);
  const [likes, setLikes] = useState(likeCount);

  // ✅ 여기서 바로 처리
  const handleLikeClick = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      // Optimistic UI
      setIsLiked(!isLiked);
      setLikes(isLiked ? likes - 1 : likes + 1);

      if (isLiked) {
        await axiosInstance.delete(`/user-likes/${restaurantId}`);
      } else {
        await axiosInstance.post('/user-likes', { restaurantId });
      }
    } catch (error) {
      // 롤백
      setIsLiked(isLiked);
      setLikes(likes);
      alert('찜 기능에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="restaurant-card">
  <img
    src={thumbnailImageUrl || '/images/default-thumbnail.jpg'}
    alt={restaurantName}
    className="restaurant-card__thumbnail"
  />

  <div className="restaurant-card__info">
    <h2 className="restaurant-card__name">
      <a href={`/restaurants/${restaurantId}`}>{restaurantName}</a>
    </h2>
    <p className="restaurant-card__address">{address}</p>
  </div>

  <div className="restaurant-card__meta">
    <span className="restaurant-card__reviews">💬 {reviewCount}</span>
    <span className="restaurant-card__reservations">📅 {reservationCount}</span>

    <div className="restaurant-card__like-group">
      <button
        onClick={handleLikeClick}
        className={`restaurant-card__like-button ${isLiked ? 'liked' : ''}`}
        aria-label={isLiked ? '찜 취소' : '찜하기'}
      >
        {isLiked ? '❤️' : '🤍'}
      </button>
      <span className="restaurant-card__like-count">{likes}</span>
    </div>
  </div>
</div>
  );
};

export default RestaurantCard;
