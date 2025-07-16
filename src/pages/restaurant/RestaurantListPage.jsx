import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import RestaurantCard from "../../components/restaurant/RestaurantCard";
import RestaurantFilterPanel from "../../components/restaurant/RestaurantFilterPanel";
import axiosInstance from "../../api/axiosinstance";
import "../../assets/styles/restaurant/RestaurantListPage.css";

const RestaurantListPage = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.getAll("category");
  const sortBy = searchParams.get("sortBy"); // 정렬 기준
  const size = searchParams.get("size");

  const [sort, setSort] = useState("");
  const [restaurantList, setRestaurantList] = useState([]);
  const [loading, setLoading] = useState(false);

   const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/restaurants", {
        params: {
          ...(category.length > 0 && { category }),
          // sort가 있으면 sortBy로, 없으면 sortBy 파라미터 사용
          ...(sort ? { sortBy: sort } : sortBy ? { sortBy } : {}),
          ...(size && { size }),
        },
      });
      setRestaurantList(response.data);
    } catch (err) {
      setRestaurantList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
    // eslint-disable-next-line
  }, [category.join(','), sort, sortBy, size]);

  // 어떤 리스트인지 안내 문구 생성
let listTitle = "";
if (sortBy === "preference") {
  const categoryText = category.join(", ");
  listTitle = `선호 카테고리(${categoryText}) 추천 맛집 Best ${size || 20}`;
} else if (category.length === 1) {
  listTitle = `${category[0]} 카테고리 식당 List`;
} else if (category.length > 1) {
  const categoryText = category.join(", ");
  listTitle = `선호 카테고리(${categoryText}) 추천 맛집 Best ${size || 20}`;
} else if (sortBy === "avgRatingLocal") {
  listTitle = `로컬맛집 Best ${size || 20}`;
} else if (sortBy === "reservationCount") {
  listTitle = `인기맛집 Best ${size || 20}`;
} else {
  listTitle = "전체 식당 리스트";
}
  
  
  return (
  <div className="restaurant-list-page">
    <h2 className="restaurant-list-page_title">{listTitle}</h2>

    {loading ? (
      <p>❗ 로딩 중...</p>
    ) : restaurantList.length === 0 ? (
      <p>😥 조건에 맞는 식당이 없습니다.</p>
    ) : (
      <>
        <div className="restaurant-list-page_header">
          <span className="restaurant-list-page_count">
            식당 개수 {restaurantList.length}개
          </span>
           <div className="restaurant-list-page_filter-wrap">
           {listTitle.includes("카테고리 식당 List") && (
            <RestaurantFilterPanel sort={sort} onSortChange={setSort} />
          )}
          </div>
        </div>

        <div className="restaurant-list-page_list">
          {restaurantList.map((restaurant) => (
            <RestaurantCard key={restaurant.restaurantId} data={restaurant} />
          ))}
        </div>
      </>
    )}
  </div>
);
};

export default RestaurantListPage;
