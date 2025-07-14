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

  const [sort, setSort] = useState("");
  const [restaurantList, setRestaurantList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRestaurants = async () => {
    if (!category || category.length === 0) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/restaurants", {
        params: {
          category,
          ...(sort && { sortBy: sort }),
        },
      });
      setRestaurantList(response.data);
    } catch (err) {
      console.error("식당 목록 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // category가 배열이므로 join해서 의존성 배열에 넣어 무한루프 방지
    fetchRestaurants();
    // eslint-disable-next-line
  }, [category.join(','), sort]); 

  useEffect(() => {
    axiosInstance.get("/api/restaurants", {
      params: {
        ...(category.length > 0 && { category }),
        ...(sortBy && { sortBy }),
      }
    }).then(res => {
      setRestaurantList(res.data);
    });
  }, [category.join(","), sortBy]);
  
  
  return (
    <div className="restaurant-list-page">
      {/* <h1 className="restaurant-list-page_title">{category} 식당 목록</h1> */}

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
              <RestaurantFilterPanel sort={sort} onSortChange={setSort} />
            </div>
          </div>

          {/* 여기에 식당 목록 렌더링 */}
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
