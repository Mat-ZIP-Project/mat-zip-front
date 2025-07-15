import React from "react";
import { Link } from "react-router-dom";
import styles from "../../assets/styles/common/BestSection.module.css";

const BestCard = ({ id, name, img, rating, categories, isLiked, benefit }) => (
  <Link to={`/restaurants/${id}`} className={styles.bestItem} style={{ textDecoration: "none", color: "inherit" }}>
    <div className={styles.bestImgWrapper}>
      <img src={img} alt={name} className={styles.bestImg} />
      {benefit && <div className={styles.bestBenefit}>{benefit}</div>}
    </div>
    <div className={styles.bestName}>{name}</div>
    <div className={styles.bestInfo}>
      <span className={styles.bestStar}>★</span>
      <span className={styles.bestRating}>{rating}</span>
      <span className={styles.bestCategories}>{categories?.join(", ")}</span>
    </div>
    <div className={styles.bestLike}>
      <span className={isLiked ? styles.heartActive : styles.heart}>❤</span>
    </div>
  </Link>
);

export default BestCard;