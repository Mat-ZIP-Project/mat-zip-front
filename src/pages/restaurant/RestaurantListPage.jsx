import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import RestaurantCard from '../../components/restaurant/RestaurantCard';
import axiosInstance from '../../api/axiosinstance';
import '../../assets/styles/restaurant/RestaurantListPage.css';

const RestaurantListPage = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category'); // 쿼리에서 category 값 읽기

  const [category, setCategory] = useState(initialCategory || '-- 선택 --');
  const [region, setRegion] = useState('-- 선택 --');
  const [sort, setSort] = useState('');
  const [restaurantList, setRestaurantList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

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
      const response = await axiosInstance.get('/api/restaurants', {
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

  // 🔍 최초 렌더링 시 쿼리스트링에서 category가 있으면 자동 검색 실행
  useEffect(() => {
    if (initialCategory) {
      handleSearch();
    }
  }, [initialCategory]);

  return (
  <div className="restaurant-list-page">

    {loading ? (
      <p>❗ 로딩 중...</p>
    ) : restaurantList.length === 0 ? (
      <p>😥 조건에 맞는 식당이 없습니다.</p>
    ) : (
      <div className="restaurant-list-page_list">
        {restaurantList.map((restaurant) => (
          <RestaurantCard key={restaurant.restaurantId} data={restaurant} />
        ))}
      </div>
    )}
    
  </div>
);
};

export default RestaurantListPage;
