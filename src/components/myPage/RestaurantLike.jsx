import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosinstance";
import "../../assets/styles/pages/myPage/RestaurantLike.css";

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

  // 날짜 포맷팅 헬퍼 함수 (LocalDateTime/LocalDate 문자열 처리)
  const formatDateDisplay = (dateTimeArray) => {
    if (!dateTimeArray) return "날짜 미정";

    const year = dateTimeArray[0];
    const month = dateTimeArray[1] - 1; // 월은 0부터 시작 (0=1월, 11=12월)
    const day = dateTimeArray[2];
    const hours = dateTimeArray[3] || 0; // 시 정보가 없을 수 있으니 기본값 0
    const minutes = dateTimeArray[4] || 0; // 분 정보가 없을 수 있으니 기본값 0

    const date = new Date(year, month, day, hours, minutes);

    const formatData = date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const formatTime = date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${formatData} ${formatTime}`;
  };

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
