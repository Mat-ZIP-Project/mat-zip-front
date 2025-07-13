import React, { useState, useEffect, useRef } from "react";
import "../../assets/styles/common/Carousel.css";
import useHorizontalDrag from "../../hooks/useHorizontalDrag";

/** 공통 캐러셀 */
const Carousel = ({
  items,
  width = 580,
  height = 280,
  showText = true,
  autoSlide = true,
  showIndex = true,
  interval = 5000
}) => {
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const timerRef = useRef(null);
  const itemCount = items.length;

  useEffect(() => {
    if (!autoSlide || hovered || isDragging) return;
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % itemCount);
    }, interval);
    return () => clearInterval(timerRef.current);
  }, [hovered, autoSlide, itemCount, interval, isDragging]);

  const goPrev = () => setCurrent((current - 1 + itemCount) % itemCount);
  const goNext = () => setCurrent((current + 1) % itemCount);

  // useHorizontalDrag 훅 사용
  const drag = useHorizontalDrag({
    onLeft: goPrev,
    onRight: goNext,
    threshold: width / 3,
    onDragMove: (x) => {
      setDragX(x);
      setIsDragging(true);
    },
    onDragEnd: (lastDragX) => {
      // 드래그 종료 시, 1/3 이상 넘겼을 경우 인덱스 변경
      if (lastDragX > width / 3) {
        goPrev();
      } else if (lastDragX < -width / 3) {
        goNext();
      }
      setDragX(0);
      setIsDragging(false);
    },
  });

  // 이전/현재/다음 인덱스 계산
  const prevIdx = (current - 1 + itemCount) % itemCount;
  const nextIdx = (current + 1) % itemCount;

  return (
    <div
      className="carousel-container"
      style={{ width: `${width}px`, height: `${height}px`, overflow: "hidden" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={drag.handleMouseDown}
      onMouseMove={drag.handleMouseMove}
      onMouseUp={drag.handleMouseUp}
      onTouchStart={drag.handleTouchStart}
      onTouchMove={drag.handleTouchMove}
      onTouchEnd={drag.handleTouchEnd}
    >
      <div
        className="carousel-track"
        style={{
          display: "flex",
          width: `${width * 3}px`,
          height: "100%",
          transform: `translateX(${-width + dragX}px)`,
          transition: isDragging ? "none" : "transform 0.3s"
        }}
      >
        <img
          src={items[prevIdx].imgUrl}
          alt=""
          className="carousel-img"
          style={{ width: `${width}px`, height: "100%" }}
          draggable={false}
        />
        <img
          src={items[current].imgUrl}
          alt=""
          className="carousel-img"
          style={{
            width: `${width}px`,
            height: "100%",
            filter: showText ? "brightness(0.88)" : "none"
          }}
          draggable={false}
        />
        <img
          src={items[nextIdx].imgUrl}
          alt=""
          className="carousel-img"
          style={{ width: `${width}px`, height: "100%" }}
          draggable={false}
        />
      </div>
      {showText && (
        <div className="carousel-text-box">
          <span className="carousel-title">{items[current].title}</span>
          <span className="carousel-desc">{items[current].desc}</span>
          <span className="carousel-sub">{items[current].sub}</span>
        </div>
      )}
      {showIndex && (
        <div className="carousel-index">
          {current + 1} / {itemCount}
        </div>
      )}
      {hovered && !isDragging && (
        <>
          <button className="carousel-arrow left" onClick={goPrev} aria-label="이전">&#60;</button>
          <button className="carousel-arrow right" onClick={goNext} aria-label="다음">&#62;</button>
        </>
      )}
    </div>
  );
};

export default Carousel;
