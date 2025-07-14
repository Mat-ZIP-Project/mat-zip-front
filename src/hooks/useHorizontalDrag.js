import { useRef } from "react";

/**
 * Horizontal drag/swipe hook
 * - 드래그 중 이동값을 onDragMove로 전달
 * - 드래그 종료 시 threshold 넘으면 onLeft/onRight 호출
 * - 드래그 종료 시 onDragEnd 호출
 */
export default function useHorizontalDrag({
  onLeft,
  onRight,
  threshold = 80,
  onDragMove,
  onDragEnd,
}) {
  const dragStartX = useRef(null);
  const dragging = useRef(false);

  // 마우스 이벤트
  const handleMouseDown = (e) => {
    dragStartX.current = e.clientX;
    dragging.current = true;
    onDragMove?.(0);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };
  const handleMouseMove = (e) => {
    if (!dragging.current || dragStartX.current === null) return;
    const diff = e.clientX - dragStartX.current;
    onDragMove?.(diff);
  };
  const handleMouseUp = (e) => {
    if (!dragging.current || dragStartX.current === null) return;
    const diff = e.clientX - dragStartX.current;
    if (Math.abs(diff) > threshold) {
        if (diff > 0) onLeft?.();
        else onRight?.();
    }
    onDragEnd?.(); 
    //onDragEnd?.(diff); // 마지막 이동값을 넘겨줌
    dragging.current = false;
    dragStartX.current = null;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  // 터치 이벤트
  const handleTouchStart = (e) => {
    dragStartX.current = e.touches[0].clientX;
    dragging.current = true;
    onDragMove?.(0);
  };
  const handleTouchMove = (e) => {
    if (!dragging.current || dragStartX.current === null) return;
    const diff = e.touches[0].clientX - dragStartX.current;
    onDragMove?.(diff);
  };
  const handleTouchEnd = (e) => {
    if (!dragging.current || dragStartX.current === null) return;
    const diff =
      e.changedTouches && e.changedTouches[0]
        ? e.changedTouches[0].clientX - dragStartX.current
        : 0;
    if (Math.abs(diff) > threshold) {
      if (diff > 0) onLeft?.();
      else onRight?.();
    }
    onDragEnd?.(diff); // 마지막 이동값을 넘겨줌
    dragging.current = false;
    dragStartX.current = null;
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}