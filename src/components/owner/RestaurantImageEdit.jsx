import React, { useRef, useState } from 'react';
import { ownerApi } from '../../api/ownerApi';
import BlackButton from './BlackButton';
import { showConfirmAlert, showSuccessAlert, showErrorAlert } from '../../utils/sweetAlert';
import styles from '../../assets/styles/owner/RestaurantImageEdit.module.css';

const MAX_IMAGES = 9;

const RestaurantImageEdit = ({ images, mainImageId, onComplete, onCancel }) => {
  // 업로드/삭제/대표 상태 관리
  const fileInputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [deleteIds, setDeleteIds] = useState([]);
  const [selectedMainId, setSelectedMainId] = useState(mainImageId);
  
  // 이미지 업로드 (여러장 첨부 가능)
  const handleUploadClick = (idx) => {
    if (fileInputRefs.current[idx]) fileInputRefs.current[idx].value = null;
    if (fileInputRefs.current[idx]) fileInputRefs.current[idx].click();
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setUploadFiles(prev => {
      const allFiles = [...prev, ...newFiles];
      // 파일명+크기 기준 중복 제거
      const uniqueFiles = [];
      const fileMap = {};
      allFiles.forEach(file => {
        const key = file.name + file.size;
        if (!fileMap[key]) {
          fileMap[key] = true;
          uniqueFiles.push(file);
        }
      });
      return uniqueFiles.slice(0, MAX_IMAGES - displayImages.length); // 9개 제한
    });
  };

  // 이미지 삭제 대기 추가/제거
  const handleDeleteToggle = (imageId) => {
    setDeleteIds(prev =>
      prev.includes(imageId)
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
    // 대표이미지 삭제 대기 시 대표 후보 초기화
    if (selectedMainId === imageId) {
      setSelectedMainId(null);
    }
  };

  // 대표이미지 후보 선택
  const handleMainSelect = (imageId) => {
    setSelectedMainId(imageId);
  };


  // 삭제 대기 제외한 실제 표시 이미지
  const displayImages = images.filter(img => !deleteIds.includes(img.imageId));

  // 빈 박스 개수: 기존+업로드 대기 이미지 합산 후 9개 미만일 때 부족한 만큼 생성
  const emptyBoxCount = Math.max(0, MAX_IMAGES - (displayImages.length + uploadFiles.length));


  // 수정완료 - 업로드/삭제/대표이미지선택 한 번에 반영
  const handleEditSubmit = async () => {
    setLoading(true);
    try {
      // 1. 삭제
      for (const id of deleteIds) {
        await ownerApi.deleteRestaurantImage(id);
      }
      // 2. 업로드
      if (uploadFiles.length > 0) {
        const formData = new FormData();
        uploadFiles.forEach(file => formData.append('images', file));
        await ownerApi.uploadRestaurantImage(formData);
      }
      // 3. 대표이미지 변경
      // 대표이미지 후보가 없으면(모두 삭제) 대표이미지 변경하지 않음
      if (selectedMainId && selectedMainId !== mainImageId) {
        await ownerApi.setMainImage(selectedMainId);
      }
      showSuccessAlert('수정 완료', '이미지 변경이 반영되었습니다.');
      //showSuccessAlert('수정이 완료되었습니다!');
      if (onComplete) onComplete();
    } catch (err) {
      showErrorAlert('이미지 변경 실패', err.message);
    }
    setLoading(false);
  };

  return (
    <div className={styles.imageEditContainer}>
      <div className={styles.imageEditTopRow}>
        <span className={styles.imageEditNotice}>이미지를 클릭하여 대표이미지를 선택할 수 있습니다.<br/>이미지는 최대 9개까지 등록가능합니다.</span>
        <div className={styles.imageEditBtnGroup}>
          <BlackButton type="button" onClick={handleEditSubmit} disabled={loading}>수정완료</BlackButton>
          <BlackButton type="button" onClick={onCancel} disabled={loading}>취소</BlackButton>
        </div>
      </div>
      <div className={styles.imagesGrid}>
        {/* 기존 이미지(삭제 대기 제외) */}
        {displayImages.map(img => (
          <div
            key={img.imageId}
            className={`${styles.imageBox} ${img.imageId === selectedMainId ? styles.mainImage : ''}`}
            onClick={() => handleMainSelect(img.imageId)}
          >
            <img src={img.imageUrl} alt="식당이미지" className={styles.image} />
            {/* 대표라벨 */}
            {img.imageId === selectedMainId && (
              <div className={styles.mainLabel}>대표</div>
            )}
            {/* 삭제버튼 */}
            <BlackButton
              type="button"
              className={styles.imageDeleteBtn}
              onClick={e => { e.stopPropagation(); handleDeleteToggle(img.imageId); }}
              disabled={loading}
            >
              {deleteIds.includes(img.imageId) ? '삭제취소' : '삭제'}
            </BlackButton>
          </div>
        ))}
        {/* 업로드 대기 이미지 미리보기 */}
        {uploadFiles.map((file, idx) => (
          <div key={`upload-${idx}`} className={styles.imageBox}>
            <img src={URL.createObjectURL(file)} alt="업로드미리보기" className={styles.image} />
          </div>
        ))}
        {/* 빈공간 박스: 부족한 만큼 동적으로 생성 */}
        {Array.from({ length: emptyBoxCount }).map((_, idx) => (
          <div
            key={`empty-${idx}`}
            className={styles.imageUploadBox}
            onClick={() => handleUploadClick(idx)}
          >
            <span className={styles.plusIcon}>+</span>
            <input
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              ref={el => fileInputRefs.current[idx] = el}
              onChange={handleFileChange}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantImageEdit;