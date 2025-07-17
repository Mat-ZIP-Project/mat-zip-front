import React from 'react';
import styles from '../../assets/styles/pages/owner/ReviewManagePage.module.css';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  // 배열([2025, 7, 16, ...]) 또는 객체(Date) 처리
  if (Array.isArray(dateStr)) {
    // [YYYY, MM, DD, ...] → 'YYYY.MM.DD'
    const [yyyy, mm, dd] = dateStr;
    return `${yyyy}.${String(mm).padStart(2, '0')}.${String(dd).padStart(2, '0')}`;
  }
  if (typeof dateStr === 'object' && dateStr !== null && 'year' in dateStr && 'month' in dateStr && 'day' in dateStr) {
    // {year, month, day} 형태 처리
    return `${dateStr.year}.${String(dateStr.month).padStart(2, '0')}.${String(dateStr.day).padStart(2, '0')}`;
  }
  // 문자열 처리
  return dateStr.slice(0, 10).replace(/-/g, '.');
};

const ReviewCard = ({ review }) => (
  <div className={styles.reviewCard}>
    <div className={styles.reviewHeader}>
      <span className={styles.reviewRestaurant}>{review.restaurantName}</span>
      <span className={styles.reviewRating}>⭐ {review.rating}</span>
      <span className={styles.reviewDate}>{formatDate(review.reviewedAt)}</span>
      <span className={styles.reviewVisitDate}>방문일: {formatDate(review.visitDate)}</span>
    </div>
    <div className={styles.reviewContent}>{review.content}</div>
    {review.imageNames && review.imageNames.length > 0 && (
      <div className={styles.reviewImages}>
        {review.imageNames.map((img, idx) => (
          <img key={idx} src={img} alt="리뷰 이미지" className={styles.reviewImage} />
        ))}
      </div>
    )}
  </div>
);

export default ReviewCard;