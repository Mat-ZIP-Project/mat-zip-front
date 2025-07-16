import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../../assets/styles/common/BestSection.module.css";
import BestCard from "./BestCard";

const VISIBLE_COUNT = 3;
const ITEM_WIDTH    = 220; // px
const GAP           = 16;  // px

const BestSection = ({ title, subtitle, link, items = [], className, loadMore, hasMore }) => {
  const total   = items.length;
  if (total === 0) return null; // 빈 데이터시 랜더링 없음

  // 무한루프용 클론 배열
  const carouselItems = [
    items[total - 1],
    ...items,
    items[0]
  ];

  const trackRef = useRef(null);
  const [idx, setIdx] = useState(1);
  const [inTransition, setInTransition] = useState(true);

  const next = () => {
    if (!inTransition) return;
    if (hasMore && idx === total) loadMore();
    setIdx(i => i + 1);
  };
  const prev = () => {
    if (!inTransition) return;
    setIdx(i => i - 1);
  };

  // 트랜지션 끝나면 클론 보정
  const onTransitionEnd = () => {
    if (idx === total + 1) {
      setInTransition(false);
      setIdx(1);
    }
    if (idx === 0) {
      setInTransition(false);
      setIdx(total);
    }
  };

  // 보정 후 트랜지션 복구
  useEffect(() => {
    if (!inTransition && trackRef.current) {
      const track = trackRef.current;
      track.style.transition = "none";
      requestAnimationFrame(() => {
        track.style.transition = "transform 0.5s ease";
        setInTransition(true);
      });
    }
  }, [inTransition]);

  // 보이는 카드 수 (최대 3)
  const visible = Math.min(VISIBLE_COUNT, total);
  // 뷰포트 너비 동적 조정
  const viewportWidth = visible * ITEM_WIDTH + (visible - 1) * GAP;
  // 슬라이드 offset (첫 카드가 0에 붙도록)
  const offset = (idx - 1) * (ITEM_WIDTH + GAP);

  return (
    <section className={`${styles.section} ${className || ""}`}>
      <div className={styles.sectionHeader}>
        <div>
          <div className={styles.sectionTitleStrong}>{title}</div>
          <div className={styles.sectionTitleSub}>{subtitle}</div>
        </div>
        <Link to={link} className={styles.sectionLink}>전체보기 &gt;</Link>
      </div>

      <div className={styles.carouselContainer}>
        <button className={styles.arrowLeft} onClick={prev}>&lt;</button>
        <div className={styles.carouselViewport} style={{ width: `${viewportWidth}px` }}>
          <div
            ref={trackRef}
            className={styles.bestTrack}
            style={{
              transform: `translateX(-${offset}px)`,
              transition: inTransition ? "transform 0.5s ease" : "none"
            }}
            onTransitionEnd={onTransitionEnd}
          >
            {carouselItems.map((item, i) => (
              <BestCard
                key={`slide-${i}-${item.id}`}
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
