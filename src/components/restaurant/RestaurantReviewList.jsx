import React from "react";
import "../../assets/styles/restaurant/RestaurantReviewList.css";
import badgeImage from "../../assets/images/로컬뱃지.png";

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
              <div className="review-main-row">
                <div className="review-main-col">
                  <div className="review-header">
                    <span className="review-writer">
                      {review.writerName}
                      {review.localReview && (
                        <img
                          src={badgeImage}
                          alt="로컬 뱃지"
                          className="review-local-badge"
                          style={{
                            marginLeft: 6,
                            width: 20,
                            height: 20,
                            verticalAlign: "middle",
                          }}
                        />
                      )}
                    </span>
                    <span className="review-date">{review.createdAt}</span>
                    <span className="review-rating">
                      {[1, 2, 3, 4, 5].map((n) =>
                        n <= Math.round(review.rating) ? (
                          <span key={n} role="img" aria-label="별">
                            ★
                          </span>
                        ) : (
                          <span
                            key={n}
                            role="img"
                            aria-label="빈별"
                            style={{ color: "#eee" }}
                          >
                            ★
                          </span>
                        )
                      )}
                    </span>
                    {onDelete && (
                      <button
                        className="review-delete-btn"
                        onClick={() => onDelete(review.id)}
                      >
                        삭제
                      </button>
                    )}
                  </div>
                  <div className="review-content">{review.content}</div>
                </div>
                <div className="review-image-col">
                  {review.imageUrls && review.imageUrls.length > 0 ? (
                    <img
                      src={review.imageUrls[0]}
                      alt="리뷰 이미지"
                      className="review-image"
                    />
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
