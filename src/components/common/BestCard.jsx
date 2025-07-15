import React from "react";
import { Link } from "react-router-dom";
import styles from "../../assets/styles/common/BestSection.module.css";

const BestCard = ({
  id,
  name,
  img,
  rating,
  localRating,
  categories = [],
  isLiked = false,
  benefit
}) => (
  <Link
    to={`/restaurants/${id}`}
    className={styles.bestItem}
  >
    {/* 이미지 */}
    <div className={styles.bestImgWrapper}>
      <img src={img} alt={name} className={styles.bestImg} />
      {benefit && <div className={styles.bestBenefit}>{benefit}</div>}
    </div>

    <div className={styles.bestContent}>
      {/* 이름 | 카테고리 */}
      <div className={styles.bestLine}>
        <span className={styles.bestName}>{name}</span>
        <span className={styles.bestDivider}>|</span>
        <span className={styles.bestCategories}>
          {categories.join(", ")}
        </span>
      </div>

      {/* 평점 | 로컬평점 */}
      <div className={styles.bestLine}>
        <span className={styles.bestStar}>★</span>
        <span className={styles.bestRating}>{rating}</span>
        {localRating !== undefined && (
          <>
            <span className={styles.bestDivider}>|</span>
            <span className={styles.bestStar}>🏠</span>
            <span className={styles.bestRating}>{localRating}</span>
          </>
        )}
      </div>
    </div>

    {/* 좋아요 버튼 */}
    <button className={styles.bestHeart} type="button">
      <span className={isLiked ? styles.heartActive : styles.heart}>❤</span>
    </button>
  </Link>
);

export default BestCard;
