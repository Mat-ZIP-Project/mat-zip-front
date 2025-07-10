import React, { useState } from "react";
import axiosInstance from "../../api/axiosinstance";
import { useSelector } from "react-redux";

const RestaurantCard = ({ data }) => {
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);
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

  const handleLikeClick = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }

    const prevLiked = isLiked;
    const prevLikes = likes;

    try {
      const nextLiked = !prevLiked;
      setIsLiked(nextLiked);
      setLikes(nextLiked ? prevLikes + 1 : prevLikes - 1);

      if (nextLiked) {
        await axiosInstance.post(`/api/restaurants/like/${restaurantId}`);
      } else {
        await axiosInstance.delete(`/api/restaurants/like/${restaurantId}`);
      }
    } catch (error) {
      alert("다시 시도해주세요.");
      setIsLiked(prevLiked);
      setLikes(prevLikes);
    }
  };

  return (
    <div className="restaurant-card">
      <img
        src={thumbnailImageUrl || "/images/default-thumbnail.jpg"}
        alt={restaurantName}
        className="restaurant-card_thumbnail"
      />

      <div className="restaurant-card_info">
        <h2 className="restaurant-card_name">
          <a href={`/restaurants/${restaurantId}`}>{restaurantName}</a>
        </h2>
        <p className="restaurant-card_address">{address}</p>
      </div>

      <div className="restaurant-card_meta">
        <span className="restaurant-card_reviews">💬 {reviewCount}</span>
        <span className="restaurant-card_reservations">
          📅 {reservationCount}
        </span>

        <div className="restaurant-card_like-group">
          <button
            onClick={handleLikeClick}
            className={`restaurant-card_like-button ${isLiked ? "liked" : ""}`}
            aria-label={isLiked ? "찜 취소" : "찜하기"}
          >
            {isLiked ? "❤️" : "🤍"}
          </button>
          <span className="restaurant-card_like-count">{likes}</span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
