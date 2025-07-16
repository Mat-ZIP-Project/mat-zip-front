import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosinstance";
import "../../assets/styles/pages/myPage/RestaurantLike.css";
import { formatDateDisplay } from "../../hooks/formatDateTime";

const RestaurantLike = () => {
  const [restaurantLikes, setRestaurantLikes] = useState([]);

  useEffect(() => {
    const restaurantLikeAll = async () => {
      try {
        const response = await axiosInstance.get("/mypage/restaurant/likes");
        setRestaurantLikes(response.data);
        console.log(response.data);
        console.log(response.data.likedAt);
      } catch (error) {
        console.error("리뷰 내역 가져오기 실패: ", error);
      }
    };
    restaurantLikeAll();
  }, []);
  
  return (
    <div className="restaurant-like-container">
      {/* <h3 className="restaurant-like-title">찜한 식당 내역</h3> */}
      {restaurantLikes.length === 0 ? (
        <p className="no-likes-message">아직 찜한 식당이 없습니다.</p>
      ) : (
        <ul className="restaurant-list">
          {restaurantLikes.map((like) => (
            <li key={like.likeId} className="restaurant-item">
              <div className="restaurant-info">
                <h4 className="restaurant-name">{like.restaurantName}</h4>
                <p className="restaurant-category">{like.category}</p>
                <p className="restaurant-address">{like.address}</p>
                <p className="restaurant-phone">📞 {like.phone}</p>
                <p className="restaurant-rating">
                  ⭐ {like.avgRating ? like.avgRating.toFixed(1) : "0.0"}
                </p>
                {like.descript && (
                  <p className="restaurant-descript">{like.descript}</p>
                )}
              </div>
              <div className="like-details">
                <span className="liked-at">
                  찜한 날짜: {formatDateDisplay(like.likedAt)}
                </span>
                {like.openTime && like.closeTime && (
                  <span className="restaurant-hours">
                    영업 시간: {like.openTime.substring(0, 5)} ~{" "}
                    {like.closeTime.substring(0, 5)}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RestaurantLike;
