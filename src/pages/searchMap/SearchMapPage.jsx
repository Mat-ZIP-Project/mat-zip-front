import { useState } from 'react';
import RegionSelector from '../../components/mapSearch/RegionSelector';
import SearchHeader from '../../components/mapSearch/SearchHeader';
import MapContainer from '../../components/mapSearch/MapContainer';
import CategoryFilterBar from '../../components/mapSearch/CategoryFilterBar';
import RadiusSelector from '../../components/mapSearch/RadiusSelector';
import ResultList from '../../components/mapSearch/ResultList';

import '../../assets/styles/pages/searchMap/searchMapPage.css';

const SearchMapPage = () => {
  const [category, setCategory] = useState('전체');
  const [radius, setRadius] = useState(300);
  const [mapMoved, setMapMoved] = useState(false);
  const [searchMode, setSearchMode] = useState('map'); // 'map' or 'region'
  const [markers, setMarkers] = useState([]); // 지도에 표시할 마커 목록

  return (
    <div className="search-map-page">
      <h2 className="page-title">맛집 검색</h2>
      <SearchHeader />
      <div className="search-mode-tab">
        <button className={searchMode === 'map' ? 'active' : ''} onClick={() => setSearchMode('map')}>지도 기반 검색</button>
        <button className={searchMode === 'region' ? 'active' : ''} onClick={() => setSearchMode('region')}>지역명 검색</button>
      </div>
      {searchMode === 'region' && <RegionSelector setMarkers={setMarkers} />}
      {searchMode === 'map' && <RadiusSelector radius={radius} setRadius={setRadius} />}
      
      <MapContainer category={category} mapMoved={mapMoved} setMapMoved={setMapMoved} markers={markers} setMarkers={setMarkers}/>
      <div className="filter-container">
        <CategoryFilterBar category={category} setCategory={setCategory} />
      </div>
      <ResultList restaurants={markers} setMarkers={setMarkers} />
    </div>
  );
};

export default SearchMapPage;
