import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "../../assets/styles/common/Carousel.module.css";
import useHorizontalDrag from "../../hooks/useHorizontalDrag";

/**
 * 재사용 가능한 Carousel
 * - width: 가로 크기 (px)
 * - height: 세로 크기 (px)
 * - threshold: 드래그 임계치 (40% 이동 시 페이지 전환)
 */
const Carousel = ({
  items,
  width = 580,
  height = 280,
  showText = true,
  autoSlide = true,
  showIndex = true,
  interval = 5000,
}) => {
  const [current, setCurrent] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const itemCount = items.length;
  const timerRef = useRef(null);

  useEffect(() => {
    if (!autoSlide || hovered || isDragging) return;
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % itemCount);
    }, interval);
    return () => clearInterval(timerRef.current);
  }, [autoSlide, hovered, isDragging, itemCount, interval]);

  const updateIndex = useCallback(diff => {
    const threshold = width * 0.4;
    if (diff > threshold) {
      setCurrent(prev => (prev - 1 + itemCount) % itemCount);
    } else if (diff < -threshold) {
      setCurrent(prev => (prev + 1) % itemCount);
    }
  }, [itemCount, width]);

  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useHorizontalDrag({
    onDragMove: x => {
      setDragX(x);
      setIsDragging(true);
    },
    onDragEnd: diff => {
      updateIndex(diff);
      setDragX(0);
      setIsDragging(false);
    },
  });

  // 인덱스 계산 보장
  const getSafeIndex = idx => (idx + itemCount) % itemCount;
  const prevIdx = getSafeIndex(current - 1);
  const nextIdx = getSafeIndex(current + 1);

  // 버튼 클릭 핸들러
  const handlePrevClick = e => {
    e.stopPropagation();
    setDragX(0);
    setIsDragging(false);
    setCurrent(prev => getSafeIndex(prev - 1));
  };

  const handleNextClick = e => {
    e.stopPropagation();
    setDragX(0);
    setIsDragging(false);
    setCurrent(prev => getSafeIndex(prev + 1));
  };

  return (
    <div
      className={styles.carouselContainer}
      style={{ width: `${width}px`, height: `${height}px` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={styles.carouselTrack}
        style={{
          display: 'flex',
          width: `${width * 3}px`,
          transform: `translateX(${-width + dragX}px)`,
          // 애니메이션 속도 조정
          transition: isDragging ? 'none' : 'transform 0.9s cubic-bezier(0.4, 0.2, 0.2, 1)',
        }}
      >
        {[prevIdx, current, nextIdx].map(idx => {
          const item = items[getSafeIndex(idx)];
          const commonStyle = { width: `${width}px`, height: '100%' };
          if (item && item.imgUrl) {
            return (
              <div key={idx} className={styles.carouselImgWrapper} style={commonStyle}>
                <img
                  src={item.imgUrl}
                  alt=""
                  className={styles.carouselImg}
                  draggable={false}
                />
              </div>
            );
          }
          return (
            <div
              key={idx}
              className={styles.carouselImgWrapper}
              style={{ ...commonStyle, background: item?.bgColor || '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {item?.iconUrl && (
                <img src={item.iconUrl} alt="" className={styles.carouselImg} draggable={false} />
              )}
              <div style={{ color: '#222', textAlign: 'left' }}>
                <div style={{ fontSize: 22, fontWeight: 'bold' }}>{item?.title}</div>
                <div style={{ fontSize: 32, fontWeight: 'bold' }}>{item?.desc}</div>
                <div style={{ fontSize: 18, marginTop: 8 }}>{item?.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {showIndex && <div className={styles.carouselIndex}>{current + 1} / {itemCount}</div>}
      {showText && items[current] && (
        <div className={styles.carouselTextBox}>
          <span className={styles.carouselTitle}>{items[current].title}</span>
          <span className={styles.carouselDesc}>{items[current].desc}</span>
          <span className={styles.carouselSub}>{items[current].sub}</span>
        </div>
      )}
      {hovered && !isDragging && (
        <>
          <button
            className={`${styles.carouselArrow} ${styles.left}`}
            onClick={handlePrevClick}
            aria-label="이전"
            onMouseDown={e => e.stopPropagation()}
            onMouseUp={e => e.stopPropagation()}
            onMouseMove={e => e.stopPropagation()}
            onTouchStart={e => e.stopPropagation()}
            onTouchEnd={e => e.stopPropagation()}
            tabIndex={0}
          >
            <span className={styles.arrowIcon}>‹</span>
          </button>
          <button
            className={`${styles.carouselArrow} ${styles.right}`}
            onClick={handleNextClick}
            aria-label="다음"
            onMouseDown={e => e.stopPropagation()}
            onMouseUp={e => e.stopPropagation()}
            onMouseMove={e => e.stopPropagation()}
            onTouchStart={e => e.stopPropagation()}
            onTouchEnd={e => e.stopPropagation()}
            tabIndex={0}
          >
            <span className={styles.arrowIcon}>›</span>
          </button>
        </>
      )}
    </div>
  );
};

export default Carousel;

