const RestaurantReviewList = ({ reviews = [] }) => {
  return (
    <div className="restaurant-review-list">
      <h2 className="restaurant-review-list_title">📝 리뷰</h2>
      {reviews.length === 0 ? (
        <p className="restaurant-review-list_empty">리뷰가 아직 없습니다.</p>
      ) : (
        <ul className="restaurant-review-list_items">
          {reviews.map((review, idx) => (
            <li key={idx} className="restaurant-review-list_item">
              <p className="restaurant-review-list_content">{review.content}</p>
              <div className="restaurant-review-list_writer">작성자: {review.writerName}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RestaurantReviewList;
