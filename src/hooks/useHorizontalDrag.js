import { useRef } from "react";

/**
 * Horizontal drag/swipe hook
 * - onDragMove: 드래그 중 이동값 전달
 * - onLeft/onRight : 드래그 종료 시 threshold 넘으면 좌/우 이동 판단
 * - onDragEnd: 마지막 이동값을 전달하여 컴포넌트에서 판단
 */
export default function useHorizontalDrag({ onDragMove, onDragEnd }) {
  const startX = useRef(null);
  const dragging = useRef(false);

  // 공통 이동 로직
  const move = x => {
    const diff = x - startX.current;
    onDragMove?.(diff);
  };

  // 마우스 핸들러
  const handleMouseDown = e => {
    startX.current = e.clientX;
    dragging.current = true;
    onDragMove?.(0);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = e => {
    if (!dragging.current) return;
    move(e.clientX);
  };

  const handleMouseUp = e => {
    if (!dragging.current) return;
    onDragEnd?.(e.clientX - startX.current);
    dragging.current = false;
    startX.current = null;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  // 터치 핸들러
  const handleTouchStart = e => {
    startX.current = e.touches[0].clientX;
    dragging.current = true;
    onDragMove?.(0);
  };

  const handleTouchMove = e => {
    if (!dragging.current) return;
    move(e.touches[0].clientX);
  };

  const handleTouchEnd = e => {
    if (!dragging.current) return;
    onDragEnd?.(e.changedTouches[0].clientX - startX.current);
    dragging.current = false;
    startX.current = null;
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
