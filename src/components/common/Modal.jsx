import React, { useEffect, useRef } from 'react';
import styles from '../../assets/styles/common/Modal.module.css';

const Modal = ({
  open,
  onClose,
  title,
  children,
  width = 400,
  className = '',
}) => {
  const modalRef = useRef();

  // ESC 키로 닫기
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // 바깥 클릭으로 닫기
  const handleDimClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className={styles.modalDim}>
      <div
        className={`${styles.modalBox} ${className}`}
        ref={modalRef}
        style={{ width: typeof width === 'number' ? `${width}px` : width }}
        role="dialog"
        aria-modal="true"
        aria-label={title || '모달'}
        tabIndex={-1}
      >
        <button className={styles.closeBtn} onClick={onClose} aria-label="닫기">
          ×
        </button>
        {title && <div className={styles.modalTitle}>{title}</div>}
        <div className={styles.modalContent}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;