import React from 'react';

const sortOptions = [
  { value: '', label: '-- 선택 --' },
  { value: 'likes', label: '찜순' },
  { value: 'reservationCount', label: '예약순' },
  { value: 'reviewCount', label: '리뷰순' },
];

const RestaurantFilterPanel = ({ sort, onSortChange }) => {
  return (
    <div className="restaurant-filter-panel">
      <label className="restaurant-filter-panel_label">정렬: </label>
      <select
        className="restaurant-filter-panel_select"
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
};

export default RestaurantFilterPanel;
