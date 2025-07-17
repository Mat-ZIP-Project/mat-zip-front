const RestaurantMap = ({ location }) => {
  return (
    <div className="restaurant-map">
      <h2 className="restaurant-map_title">📍 위치</h2>
      <p className="restaurant-map_address" >{location}</p>
      {/* 카카오 / 네이버 지도 연동은 나중에 추가 */}
      <div className="restaurant-map_placeholder">
        지도 위치 표시 예정
      </div>
    </div>
  );
};

export default RestaurantMap;
