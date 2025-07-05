import '../../assets/styles/mapSearch/restaurantCard.css';

const RestaurantCard = ({ restaurant, onClick }) => {
  const { restaurantName, category, averageRating, reviewCount, imageUrl } = restaurant;

  return (
    <div className="restaurant-card" onClick={() => onClick(restaurant)}>
      <div className="image-container">
        <img src={imageUrl} alt={`${restaurantName} 대표이미지`} className="restaurant-image" />
      </div>
      <div className="info-container">
        <h3 className="restaurant-name">{restaurantName}</h3>
        <p className="restaurant-category">{category}</p>
        <div className="rating-review">
          <span className="average-rating">⭐ {averageRating?.toFixed(1) ?? '0.0'}</span>
          <span className="review-count">리뷰 {reviewCount ?? 0}개</span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;