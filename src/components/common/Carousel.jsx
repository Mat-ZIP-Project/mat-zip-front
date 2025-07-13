import React, { useState, useEffect, useRef } from "react";
import style from "../../assets/styles/common/Carousel.module.css";

/** 공통 캐러셀 */
const Carousel = ({
  items,
  width = 600,
  height = 280,
  showText = true,
  autoSlide = true,
  showIndex = true,
  interval = 5000
}) => {
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState(false);
  const timerRef = useRef(null);
  const itemCount = items.length;

  useEffect(() => {
    if (!autoSlide || hovered) return;
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % itemCount);
    }, interval);
    return () => clearInterval(timerRef.current);
  }, [hovered, autoSlide, itemCount, interval]);

  const goPrev = () => setCurrent((current - 1 + itemCount) % itemCount);
  const goNext = () => setCurrent((current + 1) % itemCount);

  return (
    <div
      className="carousel-container"
      style={{ width: `${width}px`, height: `${height}px` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={items[current].imgUrl}
        alt=""
        className="carousel-img"
        style={{ filter: showText ? "brightness(0.88)" : "none" }}
      />
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
      {hovered && (
        <>
          <button className="carousel-arrow left" onClick={goPrev} aria-label="이전">&#60;</button>
          <button className="carousel-arrow right" onClick={goNext} aria-label="다음">&#62;</button>
        </>
      )}
    </div>
  );
};

export default Carousel;
