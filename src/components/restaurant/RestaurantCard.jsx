import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosinstance";
import { useSelector } from "react-redux";
import "../../assets/styles/restaurant/RestaurantCard.css";
import { useNavigate, useLocation } from "react-router-dom";
import { addTempCourse } from "../../hooks/addTempCourse";

const RestaurantCard = ({ data }) => {
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();
  

  const {
    restaurantId,
    restaurantName,
    address,
    thumbnailImageUrl,
    likeCount,
    reviewCount,
    reservationCount,
    liked,
    avgRating,
    avgRatingLocal,
  } = data;

  const [isLiked, setIsLiked] = useState(liked);
  const [likes, setLikes] = useState(likeCount);

  // 추가: 부모에서 liked 값이 바뀌면 isLiked도 바꿔줌
  useEffect(() => {
    setIsLiked(liked);
    setLikes(likeCount);
  }, [liked, likeCount]);

  const handleLikeClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

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

  const handleAddToCourse = async (e) => {
    e.preventDefault(); // 링크 이동 방지
    e.stopPropagation();
    
    await addTempCourse({ restaurantId, restaurantName }); // 객체로 전달!
  
  };

  return (
    // <Link to={`/restaurants/${restaurantId}`} className="restaurant-card-link">
    <div
      className="restaurant-card"
      onClick={() =>
        navigate(`/restaurants/${restaurantId}`, {
          state: {
            from: location.pathname + location.search,
          },
        })
      }
    >
      <div className="restaurant-card_image">
        <img src={data.imageUrl || "/default.png"} alt={"이미지"} />
      </div>

      <div className="restaurant-card_info">
        <div className="restaurant-card_name">{data.restaurantName}</div>
        <div className="restaurant-card_address">{data.address}</div>

        {/* ✅ 평점 추가 */}
        <div className="restaurant-card_ratings">
          <span>⭐ 평점 : {avgRating?.toFixed(1) ?? "-"}점</span>
          <span> 🏠 로컬 평점 : {avgRatingLocal?.toFixed(1) ?? "-"}점</span>
        </div>

        <div className="restaurant-card_meta">
          <span className="icon comment">💬 {data.reviewCount}</span>
          <span className="icon calendar">📅 {data.reservationCount}</span>
          <div className="restaurant-card_like-group">
            <button
              onClick={handleLikeClick}
              className={`restaurant-card_like-button ${
                isLiked ? "liked" : ""
              }`}
              aria-label={isLiked ? "찜 취소" : "찜하기"}
            >
              {isLiked ? "❤️" : "🤍"}
            </button>
            <span className="restaurant-card_like-count">{likes}</span>
          </div>
          {/* ✅ 코스 추가 버튼 */}
          <button
            onClick={handleAddToCourse}
            className="restaurant-card_course-button"
          >
            ➕ 코스에 추가
          </button>
        </div>
      </div>
    </div>
    // </Link>
  );
};

export default RestaurantCard;
