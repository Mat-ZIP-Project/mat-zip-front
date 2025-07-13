import React, { useEffect, useState } from 'react';
import { ownerApi } from '../../api/ownerApi';
import RestaurantInfoView from '../../components/owner/RestaurantInfoView';
import RestaurantInfoEdit from '../../components/owner/RestaurantInfoEdit';
import RestaurantImageEdit from '../../components/owner/RestaurantImageEdit';
import BlackButton from '../../components/owner/BlackButton';
import styles from '../../assets/styles/pages/owner/RestaurantManagePage.module.css';

/** 식당 상세 정보/이미지 관리 컴포넌트 */
const RestaurantManagePage = () => {
  const [info, setInfo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [images, setImages] = useState([]);
  const [mainImageId, setMainImageId] = useState(null);
  const [imageEditMode, setImageEditMode] = useState(false);

  // 식당 정보/이미지 불러오기
  const fetchData = async () => {
    try {
      const res = await ownerApi.getRestaurantInfo();
      setInfo(res.data);
      const imgRes = await ownerApi.getRestaurantImages();
      setImages(imgRes.data);
      setMainImageId(imgRes.data.find(img => img.isMain)?.imageId || null);
    } catch (err) {
      setInfo(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, [])

  // 상세정보 수정 완료 후 데이터 갱신
  const handleEditComplete = async () => {
    setEditMode(false);
    await fetchData();
  };

  // 이미지 수정 완료 후 목록 갱신
  const handleImageEditComplete = async () => {
    setImageEditMode(false);
    await fetchData();
  };

  // 이미지 수정 취소
  const handleImageEditCancel = () => {
    setImageEditMode(false);
  };

  if (!info) return <div>⌛ 로딩중...</div>;
  
  return (
    <div className={styles.restaurantManageContainer}>
      <h2 className={styles.sectionTitle}>[ 식당 상세 관리 ]</h2>
      {/* 이미지 영역 */}
      <div className={styles.imageSection}>
        <div className={styles.imageSectionHeader}>
          <span className={styles.imageSectionTitle}>식당 이미지</span>
          {/* 이미지 수정모드 진입 버튼 */}
          {!imageEditMode && (
            <BlackButton
              type="button"
              onClick={() => setImageEditMode(true)}
            >
              수정
            </BlackButton>
          )}
        </div>
        {/* 이미지 수정모드 */}
        {!imageEditMode ? (
          <div className={styles.imagesGrid}>
            {images.map(img => (
              <div
                key={img.imageId}
                className={`${styles.imageBox} ${img.imageId === mainImageId ? styles.mainImage : ''}`}
              >
                <img src={img.imageUrl} alt="식당이미지" className={styles.image} />
                {img.imageId === mainImageId && (
                  <div className={styles.mainLabel}>대표</div>
                )}
              </div>
            ))}
            {/* 빈공간 박스 없음 (일반 모드에서는 표시X) */}
          </div>
        ) : (
          <RestaurantImageEdit
            images={images}
            mainImageId={mainImageId}
            onComplete={handleImageEditComplete}
            onCancel={handleImageEditCancel}
          />
        )}
      </div>
      {/* 상세정보 영역 */}
      <div className={styles.infoSection}>
        <div className={styles.infoContent}>
          {!editMode ? (
            <RestaurantInfoView info={info} onEdit={() => setEditMode(true)} />
          ) : (
            <RestaurantInfoEdit info={info} onComplete={handleEditComplete} onCancel={() => setEditMode(false)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantManagePage;