import React from "react";
import { Link } from "react-router-dom";
import styles from "../../assets/styles/common/BestSection.module.css";
import BestCard from "./BestCard";

const BestSection = ({ title, subtitle, link, items, className }) => (
  <section className={className ? `${styles.section} ${className}` : styles.section}>
    <div className={styles.sectionHeader}>
      <div>
        <div className={styles.sectionTitleStrong}>{title}</div>
        <div className={styles.sectionTitleSub}>{subtitle}</div>
      </div>
      <Link to={link} className={styles.sectionLink}>전체보기 &gt;</Link>
    </div>
    <div className={styles.bestList}>
      {items.slice(0, 3).map((item, idx) => (
        <BestCard
          key={item.id || item.name || idx}
<<<<<<< HEAD
          id={item.id}
          name={item.name}
          img={item.img}
          rating={item.rating}
          categories={item.categories}
          isLiked={item.isLiked}
          benefit={item.benefit}
        />
=======
          className={styles.bestItem}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className={styles.bestImgWrapper}>
            <img src={item.img} alt={item.name} className={styles.bestImg} />
          </div> 
          <div className={styles.bestName}>{item.name}</div>
          <div className={styles.bestInfo}>
  <span className={styles.bestStar}>★</span>
  <span className={styles.bestRating}>{item.rating}</span>
  {item.localRating !== undefined && (
    <>
      <span className={styles.bestDivider}> | </span>
      <span className={styles.bestStar}>🏠</span>
      <span className={styles.bestRating}>{item.localRating}</span>
    </>
  )}
  <span className={styles.bestCategories}>
    {item.categories ? item.categories.join(", ") : ""}
  </span>
</div>
        </Link>
>>>>>>> 3173fb7a36f15702654fb7beaeaa1a06d8910f76
      ))}
    </div>
  </section>
);

export default BestSection;