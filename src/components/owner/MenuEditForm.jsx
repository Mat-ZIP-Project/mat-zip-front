import React, { useState } from 'react';
import BlackButton from './BlackButton';
import { ownerApi } from '../../api/ownerApi';
import { showSuccessAlert, showErrorAlert } from '../../utils/sweetAlert';
import FormInput from '../common/FormInput';
import styles from '../../assets/styles/pages/owner/MenuManagePage.module.css';

const MenuEditForm = ({ mode, menu, onComplete, onCancel }) => {
  const [form, setForm] = useState({
    menuName: menu?.menuName || '',
    price: menu?.price || '',
    description: menu?.description || '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      // JSON 부분을 Blob으로 감싸서 application/json 으로 보내기
      const payload = {
        menuName: form.menuName,
        price: Number(form.price),
        description: form.description,
      };
      const jsonBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      formData.append('data', jsonBlob);

      // 이미지가 있으면 그대로 추가
      if (form.image) {
        formData.append('image', form.image);
      }
      if (mode === 'create') {
        await ownerApi.createMenu(formData);
        showSuccessAlert('등록 완료', '메뉴가 등록되었습니다.');
      } else {
        await ownerApi.updateMenu(menu.menuId, formData);
        showSuccessAlert('수정 완료', '메뉴가 수정되었습니다.');
      }
      if (onComplete) onComplete();
    } catch (err) {
      showErrorAlert(`메뉴 ${mode === 'create' ? '등록' : '수정'}에 실패했습니다.`, '입력한 값을 확인해주세요.');
    }
  };

  return (
    <form className={styles.menuEditForm} onSubmit={handleSubmit}>
      <div className={styles.menuEditHeader}>
        <span>{mode === 'create' ? '메뉴 등록' : '메뉴 수정'}</span>
      </div>
      <div className={styles.menuEditRow}>
        <label>메뉴명</label>
        <FormInput
          name="menuName"
          value={form.menuName}
          onChange={handleChange}
          maxLength={50}
          required
          placeholder="메뉴명을 입력하세요"
        />
      </div>
      <div className={styles.menuEditRow}>
        <label>가격</label>
        <FormInput
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          min={100}
          step={100}
          required
          placeholder="가격을 입력하세요 (원 단위)"
        />
      </div>
      <div className={styles.menuEditRow}>
        <label>설명</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className={styles.menuEditTextarea}
          rows={3}
          placeholder="메뉴 설명을 입력하세요"
        />
      </div>
      <div className={styles.menuEditRow}>
        <label>이미지</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={styles.menuEditInput}
        />
      </div>
      <div className={styles.menuEditBtnRow}>
        <BlackButton type="submit">{mode === 'create' ? '메뉴 등록' : '수정 완료'}</BlackButton>
        <BlackButton type="button" onClick={onCancel}>취소</BlackButton>
      </div>
    </form>
  );
};

export default MenuEditForm;