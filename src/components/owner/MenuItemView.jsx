import React from 'react';
import BlackButton from './BlackButton';
import styles from '../../assets/styles/pages/owner/MenuManagePage.module.css';

const MenuItemView = ({ menu, onEdit, onDelete, disabled, showButtons = true }) => (
  <div className={styles.menuItemBox}>
    {/* 이미지 박스 (왼쪽) */}
    <div className={styles.menuImageBox}>
      {menu.imageUrl ? (
        <img src={menu.imageUrl} alt="메뉴이미지" className={styles.menuImage} />
      ) : (
        <div className={styles.menuImagePlaceholder}>이미지 없음</div>
      )}
    </div>

    {/* 텍스트 정보 */}
    <div className={styles.menuInfoBox}>
      <div className={styles.menuName}>{menu.menuName}</div>
      <div className={styles.menuDesc}>{menu.description}</div>
      <div className={styles.menuPrice}>{menu.price.toLocaleString()}원</div>
    </div>

    {/* 버튼 그룹 (우측 상단) */}
    {showButtons && (
      <div className={styles.menuBtnGroup}>
        <BlackButton type="button" onClick={onEdit} disabled={disabled}>수정</BlackButton>
        <BlackButton type="button" onClick={onDelete} disabled={disabled}>삭제</BlackButton>
      </div>
    )}
  </div>
);

export default MenuItemView;