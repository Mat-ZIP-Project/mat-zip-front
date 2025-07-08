import React, { useState } from 'react';
import RestaurantCard from '../../components/restaurant/RestaurantCard';
import RestaurantFilterPanel from '../../components/restaurant/RestaurantFilterPanel';
import RestaurantMapView from '../../components/restaurant/RestaurantMapView';
import axiosInstance from '../../api/axiosinstance';

const RestaurantListPage = () => {
  
  const [category, setCategory] = useState('-- 선택 --');
  const [region, setRegion] = useState('-- 선택 --');
  const [sort, setSort] = useState('');
  const [restaurantList, setRestaurantList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false); // 검색 여부

  const handleSearch = async () => {
  const isCategoryValid = category && category !== '-- 선택 --';
  const isRegionValid = region && region !== '-- 선택 --';
  const isSortValid = sort && sort !== '';

  if (!isCategoryValid && !isRegionValid && !isSortValid) {
    alert('검색 조건을 하나 이상 선택해주세요.');
    return;
  }

  setLoading(true);
  setSearched(true);
  try {
    const response = await axiosInstance.get('/restaurants', {
      params: {
        ...(isCategoryValid && { category }),
        ...(isRegionValid && { regionSigungu: region }),
        ...(isSortValid && { sortBy: sort }),
      },
    });
    setRestaurantList(response.data); 
  } catch (err) {
    console.error('식당 목록 불러오기 실패:', err);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="restaurant-list-page">
      <h1 className="restaurant-list-page_title">카테고리별 식당 List</h1>

      <RestaurantFilterPanel
        category={category}
        region={region}
        sort={sort}
        onCategoryChange={setCategory}
        onRegionChange={setRegion}
        onSortChange={setSort}
      />

      <div className="restaurant-list-page_search-button">
        <button
          onClick={handleSearch}
          className="restaurant-list-page_search-btn"
        >
          🔍 검색
        </button>
      </div>

      {loading ? (
        <p>❗ 로딩 중...</p>
      ) : !searched ? (
        <p>⚠️ 검색 조건을 선택하고 버튼을 눌러주세요.</p>
      ) : restaurantList.length === 0 ? (
        <p>😥 조건에 맞는 식당이 없습니다.</p>
      ) : (
        <>
          {/* ✅ 지도 표시 */}
          <RestaurantMapView restaurants={restaurantList} />

          {/* ✅ 식당 목록 표시 */}
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
