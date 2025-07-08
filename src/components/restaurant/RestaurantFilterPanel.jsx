import React from 'react';

const categories = ['-- 선택 --', '한식', '양식', '중식', '일식', '카페'];

const regions = ["-- 선택 -- " , "전체", "강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구",
    "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구",
    "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구", "성남시", "수원시", "용인시"];  // 서울 구 25개 가나다순 + 성남, 수원, 용인

const sortOptions = [
  { value: '', label: '-- 선택 --' },
  { value: 'likes', label: '찜순' },
  { value: 'reservationCount', label: '예약순' },
  { value: 'reviewCount', label: '리뷰순' },
];

const RestaurantFilterPanel = ({ category, region, sort, onCategoryChange, onRegionChange, onSortChange }) => {
  return (
    <div className="restaurant-filter-panel">
      {/* 카테고리 */}
      <div className="restaurant-filter-panel_group">
        <label className="restaurant-filter-panel_label">카테고리: </label>
        <select value={category} onChange={(e) => onCategoryChange(e.target.value)}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* 지역 */}
      <div className="restaurant-filter-panel_group">
        <label className="restaurant-filter-panel_label">지역: </label>
        <select value={region} onChange={(e) => onRegionChange(e.target.value)}>
          {regions.map((reg) => (
            <option key={reg} value={reg}>{reg}</option>
          ))}
        </select>
      </div>

      {/* 정렬 */}
     <div className="restaurant-filter-panel_group">
        <label className="restaurant-filter-panel_label">정렬: </label>
        <select value={sort} onChange={(e) => onSortChange(e.target.value)}>
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default RestaurantFilterPanel;
