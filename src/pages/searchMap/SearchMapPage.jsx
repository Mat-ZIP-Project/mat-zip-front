import { useCallback, useEffect, useState } from 'react';
import RegionSelector from '../../components/mapSearch/RegionSelector';
import SearchHeader from '../../components/mapSearch/SearchHeader';
import MapContainer from '../../components/mapSearch/MapContainer';
import CategoryFilterBar from '../../components/mapSearch/CategoryFilterBar';
import ResultList from '../../components/mapSearch/ResultList';

import '../../assets/styles/pages/searchMap/searchMapPage.css';
import axiosInstance from '../../api/axiosinstance';

const SearchMapPage = () => {
  const [category, setCategory] = useState('전체');
  const [mapMoved, setMapMoved] = useState(false);
  const [searchMode, setSearchMode] = useState('map'); // 'map' or 'region'
  const [markers, setMarkers] = useState([]); // 지도에 표시할 마커 목록
  const [restaurants,setRestaurants] = useState([]);
  const [filteredList,setFilteredList] = useState([]);
  const [selectedSido,setSelectedSido] = useState("");
  const [selectedSigungu,setSelectedSigungu] = useState("");
  const [centerPosition, setCenterPosition] = useState(() => () => {});

  useEffect(()=>{
    category==="전체"?
    setFilteredList(restaurants) 
    : setFilteredList(restaurants.filter(r=>r.category===category))
  },[category,restaurants]);
  useEffect(()=>{
    setMarkers(filteredList);
  },[filteredList]);
  useEffect(()=>{
    setRestaurants([]);
  },[searchMode])

 const searchByRegionName = useCallback(()=>{
      axiosInstance({
        method:"get",
        url:"/map/region",
        params:{
          regionSido:selectedSido,
          regionSigungu:selectedSigungu
        }
      })
      .then(res=>{
        setRestaurants(res.data);
        
        if (res.data.length > 0) {
        const { latitude, longitude } = res.data[0];
        centerPosition(latitude, longitude);
      }
      })
      .catch(err=>{
        console.error(err);
      });
 },[selectedSido,selectedSigungu,centerPosition]);

  return (
    <div className="search-map-page">
      <h2 className="page-title">맛집 검색</h2>
      <SearchHeader />
      <div className="search-mode-tab">
        <button className={searchMode === 'map' ? 'active' : ''} onClick={() => setSearchMode('map')}>지도 기반 검색</button>
        <button className={searchMode === 'region' ? 'active' : ''} onClick={() => setSearchMode('region')}>지역명 검색</button>
      </div>
      {searchMode === 'region' && 
      <RegionSelector selectedSigungu={selectedSigungu} setSelectedSido={setSelectedSido} 
      setSelectedSigungu={setSelectedSigungu} onSearch={searchByRegionName}/>}
      
      <MapContainer  mapMoved={mapMoved} setCenterPosition={setCenterPosition}
      setMapMoved={setMapMoved} markers={markers} setMarkers={setMarkers} setRestaurants={setRestaurants}/>
     
      <div className="filter-container">
        <CategoryFilterBar category={category} setCategory={setCategory} />
      </div>
      <ResultList filteredList={filteredList}/>
    </div>
  );
};

export default SearchMapPage;
