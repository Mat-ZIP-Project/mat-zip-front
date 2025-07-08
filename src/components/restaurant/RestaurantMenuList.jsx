const RestaurantMenuList = ({ menus = [] }) => {
  return (
    <div className="restaurant-menu-list">
      <h2 className="restaurant-menu-list_title">🍽️ 메뉴</h2>
      {menus.length === 0 ? (
        <p className="trestaurant-menu-list_empty">등록된 메뉴가 없습니다.</p>
      ) : (
        <ul className="restaurant-menu-list_items">
          {menus.map((menu, idx) => (
            <li key={idx} className="restaurant-menu-list_item">
              <span>{menu.name}</span>
              <span>{menu.price.toLocaleString()}원</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RestaurantMenuList;
