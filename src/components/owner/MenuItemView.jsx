import React from 'react';
import BlackButton from './BlackButton';
import styles from '../../assets/styles/pages/owner/MenuManagePage.module.css';
import { showQuestionAlert, showSuccessAlert } from '../../utils/sweetAlert';

const MenuItemView = ({ menu, onEdit, onDelete, disabled, showButtons = true }) => {
  // 삭제 버튼 클릭 시 SweetAlert 확인창
  const handleDelete = async () => {
    const result = await showQuestionAlert("정말 삭제하시겠습니까?", "삭제 후 복구할 수 없습니다.");
    if (result.isConfirmed) {
      onDelete();
      showSuccessAlert("삭제 완료", "메뉴가 삭제되었습니다.");
    }
  };

  // 가격 100원 단위로만 표시
  const displayPrice = Math.floor(menu.price / 100) * 100;

  return (
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
        <div className={styles.menuPrice}>{displayPrice.toLocaleString()}원</div>
      </div>

      {/* 버튼 그룹 (우측 상단) */}
      {showButtons && (
        <div className={styles.menuBtnGroup}>
          <BlackButton type="button" onClick={onEdit} disabled={disabled}>수정</BlackButton>
          <BlackButton type="button" onClick={handleDelete} disabled={disabled}>삭제</BlackButton>
        </div>
      )}
    </div>
  );
};

export default MenuItemView;