const RestaurantDetailInfo = ({ data }) => {
  const { restaurantName, address, thumbnailImageUrl } = data;

  return (
    <div className="restaurant-detail-info">
      <img
        src={thumbnailImageUrl || '/images/default-thumbnail.jpg'}
        alt={restaurantName}
        className="restaurant-detail-info__image"
      />
      <h1 className="restaurant-detail-info__title">
        {restaurantName}
      </h1>
      <p className="restaurant-detail-info__address">
        {address}
      </p>
    </div>
  );
};

export default RestaurantDetailInfo;