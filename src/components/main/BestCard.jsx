import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../../assets/styles/common/BestSection.module.css";
import axiosInstance from "../../api/axiosinstance";
import { useSelector } from "react-redux";
import { showErrorAlert, showSuccessAlert, showErrorConfirmAlert } from "../../utils/sweetAlert";

const BestCard = ({
  id,
  name,
  img,
  rating,
  localRating,
  categories = [],
  isLiked = false,
  benefit
}) => {
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);
  const [liked, setLiked] = useState(isLiked);

  // 새로고침/페이지 이동 후에도 찜 상태 반영
  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

  const handleLikeClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      showErrorAlert("로그인이 필요합니다.", "");
      return;
    }

    const prevLiked = liked;
    try {
      const nextLiked = !prevLiked;
      setLiked(nextLiked);

      if (nextLiked) {
        await axiosInstance.post(`/api/restaurants/like/${id}`);
        showSuccessAlert("찜 목록에 등록되었습니다!", "");
      } else {
        await axiosInstance.delete(`/api/restaurants/like/${id}`);
        showSuccessAlert("찜 목록에서 삭제했습니다!", "");
      }
    } catch (error) {
      showErrorConfirmAlert("다시 시도해주세요.", "");
      setLiked(prevLiked);
    }
  };

  return (
    <Link
      to={`/restaurants/${id}`}
      className={styles.bestItem}
    >
      {/* 이미지 */}
      <div className={styles.bestImgWrapper}>
        <img src={img} alt={name} className={styles.bestImg} />
        {benefit && <div className={styles.bestBenefit}>{benefit}</div>}
      </div>

      {/* 식당명 */}
      <div className={styles.bestName}>{name}</div>

      {/* 카테고리, 하트 */}
      <div className={styles.bestInfoRow}>
        <div className={styles.bestCategories}>{categories.join(", ")}</div>
        
      </div>

      {/* 평점, 지역평점 */}
      <div className={styles.bestInfoRatingRow}>
        <span className={styles.bestStar}>⭐</span>
        <span className={styles.bestRating}>{rating}</span>
        <span className={styles.bestDivider}>|</span>
        <span className={styles.bestStar}>🏠</span>
        <span className={styles.bestRating}>{localRating}</span>
        <button
          className={styles.bestHeart}
          type="button"
          onClick={handleLikeClick}
          aria-label={liked ? "찜 취소" : "찜하기"}
        >
          <span className={liked ? styles.heartActive : styles.heart}>❤</span>
        </button>
      </div>
    </Link>
  );
};

export default BestCard;
