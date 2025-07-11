import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import RestaurantCard from "../../components/restaurant/RestaurantCard";
import RestaurantFilterPanel from "../../components/restaurant/RestaurantFilterPanel";
import axiosInstance from "../../api/axiosinstance";
import "../../assets/styles/restaurant/RestaurantListPage.css";

const RestaurantSearchResultPage = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");
  const [results, setResults] = useState([]);
  const [sort, setSort] = useState("");

  useEffect(() => {
    if (keyword) {
      axiosInstance
        .get("/api/restaurants/search", {
          params: {
            keyword,
            ...(sort && { sortBy: sort }),
          },
        })
        .then((res) => setResults(res.data));
    }
  }, [keyword, sort]);

  return (
    <div className="restaurant-list-page">
      <div className="restaurant-list-page_header">
        <span className="restaurant-list-page_count">
          🔍 "{keyword}" 검색 결과 총 {results.length}개
        </span>
        <div className="restaurant-list-page_filter-wrap">
          <RestaurantFilterPanel sort={sort} onSortChange={setSort} />
        </div>
      </div>

      {results.length === 0 ? (
        <p>결과가 없습니다.</p>
      ) : (
        <div className="restaurant-list-page_list">
          {results.map((restaurant) => (
            <RestaurantCard key={restaurant.restaurantId} data={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantSearchResultPage;
