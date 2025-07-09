import { useCallback, useEffect, useState } from 'react';
import RegionSelector from '../../components/mapSearch/RegionSelector';
import SearchHeader from '../../components/mapSearch/SearchHeader';
import MapContainer from '../../components/mapSearch/MapContainer';
import CategoryFilterBar from '../../components/mapSearch/CategoryFilterBar';
import ResultList from '../../components/mapSearch/ResultList';
import '../../assets/styles/pages/mapSearch/searchMapPage.css';
import axiosInstance from '../../api/axiosinstance';

const SearchMapPage = () => {
  const [category, setCategory] = useState('전체');
  const [mapMoved, setMapMoved] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [selectedSido, setSelectedSido] = useState('');
  const [selectedSigungu, setSelectedSigungu] = useState('');
  const [centerPosition, setCenterPosition] = useState(() => () => {});
  const [fitToMarkers, setFitToMarkers] = useState(() => () => {});

  useEffect(() => {
    category === '전체'
      ? setFilteredList(restaurants)
      : setFilteredList(restaurants.filter(r => r.category === category));
  }, [category, restaurants]);

  useEffect(() => {
    setMarkers(filteredList);
  }, [filteredList]);

  const searchByRegionName = useCallback(() => {
    axiosInstance
      .get('/map/region', {
        params: {
          regionSido: selectedSido,
          regionSigungu: selectedSigungu,
        },
      })
      .then(res => {
        setRestaurants(res.data);
        if (res.data.length > 0) {
          // 중심좌표 계산: 마커들의 평균값
          const latSum = res.data.reduce((sum, item) => sum + item.latitude, 0);
          const lngSum = res.data.reduce((sum, item) => sum + item.longitude, 0);
          const centerLat = latSum / res.data.length;
          const centerLng = lngSum / res.data.length;
          centerPosition(centerLat, centerLng);
           fitToMarkers(res.data);
        }
      })
      .catch(err => {
        console.error(err);
      });
  }, [selectedSido, selectedSigungu, centerPosition]);

  return (
    <div className="search-map-page">
      <SearchHeader />
      <div className="region-selector-wrapper">
        <RegionSelector
          selectedSigungu={selectedSigungu}
          setSelectedSido={setSelectedSido}
          setSelectedSigungu={setSelectedSigungu}
          onSearch={searchByRegionName}
        />
      </div>
      <MapContainer
        mapMoved={mapMoved}
        setCenterPosition={setCenterPosition}
        setFitToMarkers={setFitToMarkers}
        setMapMoved={setMapMoved}
        markers={markers}
        setMarkers={setMarkers}
        setRestaurants={setRestaurants}
        setCategory={setCategory}
      />
      <div className="filter-container">
        <CategoryFilterBar category={category} setCategory={setCategory} />
      </div>
      <ResultList filteredList={filteredList} />
    </div>
  );
};

export default SearchMapPage;
