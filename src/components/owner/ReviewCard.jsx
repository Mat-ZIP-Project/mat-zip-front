import React from 'react';
import styles from '../../assets/styles/pages/owner/ReviewManagePage.module.css';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
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