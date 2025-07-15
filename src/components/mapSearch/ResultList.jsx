
import { useState } from 'react';
import '../../assets/styles/mapSearch/resultList.css';

import RestaurantCard from '../restaurant/RestaurantCard';

const ResultList = ({ filteredList }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`result-list-slide ${isExpanded ? 'expanded' : ''}`}>
      <div className="handle" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="handle-bar"></div>
      </div>
      <div className="restaurant-list">
        {filteredList.length === 0 ? (
          <p className="empty-text">검색된 맛집이 없습니다.</p>
        ) : (
          filteredList.map((r) => (
            <RestaurantCard key={r.restaurantId} data={r}  />
          ))
        )}
      </div>
    </div>
  );
};

export default ResultList;