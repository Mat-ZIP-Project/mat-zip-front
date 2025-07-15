import React from "react";
import '../../assets/styles/restaurant/RestaurantReviewList.css';

const RestaurantReviewList = ({ reviews = [], onDelete }) => {
  console.log(reviews);
  return (
    <div className="restaurant-review-list">
      {reviews.length === 0 ? (
        <p className="restaurant-review-list_empty">리뷰가 아직 없습니다.</p>
      ) : (
        <ul className="restaurant-review-list_items">
          {reviews.map((review, idx) => (
            <li key={idx} className="restaurant-review-list_item">
              <div className="review-header">
                <span className="review-writer">{review.writerName}</span>
                <span className="review-date">{review.createdAt}</span>
                <span className="review-rating">
                  <span role="img" aria-label="별">⭐</span> {review.rating}
                </span>
                {onDelete && (
                  <button className="review-delete-btn" onClick={() => onDelete(review.id)}>
                    삭제
                  </button>
                )}
              </div>
              <div className="review-content-area">
                <div className="review-content">{review.content}</div>
                <div className="review-images-area">
                  {review.images && review.images.length > 0 ? (
                    <div className="review-images">
                      {review.images.map((img, i) => (
                        <img key={i} src={img} alt="리뷰 이미지" className="review-image" />
                      ))}
                    </div>
                  ) : (
                    <div className="review-image-placeholder">사진 없음</div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RestaurantReviewList;