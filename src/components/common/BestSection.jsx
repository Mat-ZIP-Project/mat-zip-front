import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../../assets/styles/common/BestSection.module.css";
import BestCard from "./BestCard";

const VISIBLE_COUNT = 3;
const ITEM_WIDTH    = 220; // px
const GAP           = 16;  // px

const BestSection = ({ title, subtitle, link, items = [], className }) => {
  const total   = items.length;
  if (total === 0) return null; // 빈 데이터시 랜더링 없음

  // 배열 무한루프
  const carouselItems = [
    items[total - 1],
    ...items,
    items[0]
  ];

  const trackRef = useRef(null);
  const [idx, setIdx] = useState(1);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  const next = () => {
    if (!transitionEnabled) return;
    setIdx(i => i + 1);
  };
  const prev = () => {
    if (!transitionEnabled) return;
    setIdx(i => i - 1);
  };

  // 트랜지션 끝나면 클론 보정
  const onTransitionEnd = () => {
    if (idx === total + 1) {
      setTransitionEnabled(false);
      setIdx(1);
    }
    if (idx === 0) {
      setTransitionEnabled(false);
      setIdx(total);
    }
  };

  // 보정 후 트랜지션 복구
  useEffect(() => {
    if (!transitionEnabled && trackRef.current) {
      const track = trackRef.current;
      track.style.transition = "none";
      requestAnimationFrame(() => {
        track.style.transition = "transform 0.5s ease";
        setTransitionEnabled(true);
      });
    }
  }, [transitionEnabled]);

  // 계산: 보이는 카드 수 (최대 3)
  const visibleCount = Math.min(VISIBLE_COUNT, total);
  // 슬라이드 offset
  const offset = idx * (ITEM_WIDTH + GAP);

  // 뷰포트 너비 동적 조정 /* modified */
  const viewportWidth = visibleCount * ITEM_WIDTH + (visibleCount - 1) * GAP;

  return (
    <section className={`${styles.section} ${className || ""}`}>
      {/* 헤더 */}
      <div className={styles.sectionHeader}>
        <div>
          <div className={styles.sectionTitleStrong}>{title}</div>
          <div className={styles.sectionTitleSub}>{subtitle}</div>
        </div>
        <Link to={link} className={styles.sectionLink}>전체보기 &gt;</Link>
      </div>

      {/* 캐러셀 */}
      <div className={styles.carouselContainer}>
        <button className={styles.arrowLeft} onClick={prev}>&lt;</button>
        <div
          className={styles.carouselViewport}
          style={{ width: `${viewportWidth}px` }}  /* modified */
        >
          <div
            ref={trackRef}
            className={styles.bestTrack}
            style={{
              transform: `translateX(-${offset}px)`,
              transition: transitionEnabled ? "transform 0.5s ease" : "none"
            }}
            onTransitionEnd={onTransitionEnd}
          >
            {carouselItems.map((item, i) => (
              <BestCard
                key={item.id ?? i}
                id={item.id}
                name={item.name}
                img={item.img}
                rating={item.rating}
                localRating={item.localRating}
                categories={item.categories}
                isLiked={item.isLiked}
                benefit={item.benefit}
              />
            ))}
          </div>
        </div>
        <button className={styles.arrowRight} onClick={next}>&gt;</button>
      </div>
    </section>
  );
};

export default BestSection;
