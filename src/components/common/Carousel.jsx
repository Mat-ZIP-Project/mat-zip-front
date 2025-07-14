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

  // 캐러셀 이동 함수
  const goPrev = () => {
    setIsDragging(false); // 드래그 상태 해제
    setCurrent((prev) => (prev - 1 + itemCount) % itemCount);
  };
  const goNext = () => {
    setIsDragging(false); // 드래그 상태 해제
    setCurrent((prev) => (prev + 1) % itemCount);
  };

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
        {/* 이전/현재/다음 아이템 분기 렌더링 */}
        {[prevIdx, current, nextIdx].map(idx => {
          const item = items[idx];
          if (item.type === "image" || item.imgUrl) {
            // 완성형 이미지 배너
            return (
              <img
                key={idx}
                src={item.imgUrl}
                alt=""
                className="carousel-img"
                style={{ width: `${width}px`, height: "100%" }}
                draggable={false}
              />
            );
          } else if (item.type === "dynamic") {
            // 동적 배너
            return (
              <div
                key={idx}
                className="carousel-img"
                style={{
                  width: `${width}px`,
                  height: "100%",
                  background: item.bgColor || "#eee",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative"
                }}
              >
                <img
                  src={item.iconUrl}
                  alt=""
                  style={{
                    width: "120px",
                    height: "120px",
                    marginRight: "32px"
                  }}
                />
                <div style={{ color: "#222", textAlign: "left" }}>
                  <div style={{ fontSize: "22px", fontWeight: "bold" }}>{item.title}</div>
                  <div style={{ fontSize: "32px", fontWeight: "bold" }}>{item.desc}</div>
                  <div style={{ fontSize: "18px", marginTop: "8px" }}>{item.sub}</div>
                </div>
              </div>
            );
          }
          return null;
        })}
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
          <button
            className="carousel-arrow left"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="이전"
          >
            &#60;
          </button>
          <button
            className="carousel-arrow right"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="다음"
          >
            &#62;
          </button>
        </>
      )}
    </div>
  );
};

export default Carousel;
