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
          id={item.id}
          name={item.name}
          img={item.img}
          rating={item.rating}
          categories={item.categories}
          isLiked={item.isLiked}
          benefit={item.benefit}
        />
      ))}
    </div>
  </section>
);

export default BestSection;