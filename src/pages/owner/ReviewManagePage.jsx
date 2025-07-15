import React, { useEffect, useState } from 'react';
import ReviewCard from '../../components/owner/ReviewCard';
import styles from '../../assets/styles/pages/owner/ReviewManagePage.module.css';
import { ownerApi } from '../../api/ownerApi';
import { showErrorAlert } from '../../utils/sweetAlert';

const ReviewManagePage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ownerApi.getRestaurantReviews()
      .then(res => {
      console.log('리뷰 응답:', res.data);
      setReviews(Array.isArray(res.data) ? res.data : res.data.reviews || []);
    })
      .catch(() => showErrorAlert('리뷰 조회 실패', '리뷰 목록을 불러올 수 없습니다.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.reviewPageContainer}>
      <h2 className={styles.title}>[ 리뷰 관리 ]</h2>
      <div className={styles.reviewCountBar}>
        전체 리뷰 <span className={styles.count}>{reviews.length}</span>건
      </div>
      {loading ? (
        <div className={styles.loading}>리뷰를 불러오는 중...</div>
      ) : reviews.length === 0 ? (
        <div className={styles.emptyMessage}>등록된 리뷰가 없습니다.</div>
      ) : (
        <div className={styles.reviewList}>
          {reviews.map(review => (
            <ReviewCard key={review.reviewId} review={review} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewManagePage;