import { useEffect, useRef, useState } from 'react';
import '../../assets/styles/mapSearch/mapContainer.css';
import axiosInstance from '../../api/axiosinstance';
import haversine from 'haversine-distance';
import { addTempCourse } from '../../hooks/addTempCourse';
import gpsIcon from '../../assets/images/gps-icon.png';


const MapContainer = ({ mapMoved, setMapMoved, markers ,setMarkers,setRestaurants,setCenterPosition,setCategory ,setFitToMarkers}) => {
  
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const markerObjects = useRef([]);  // 지도에 실제 표시된 마커 객체들
  const openInfowindow = useRef(null);  
 
  
 useEffect(() => {
    if (!window.kakao || !mapRef.current) return;

   

  
     navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCurrentPosition(new window.kakao.maps.LatLng(lat, lng));


    const mapOption = {
      center: new window.kakao.maps.LatLng(lat, lng), // 초기 위치 (현위치)
      level: 4,
    };
    mapInstance.current = new window.kakao.maps.Map(mapRef.current, mapOption);

     // 지도 클릭 시 정보창 닫기
  window.kakao.maps.event.addListener(mapInstance.current, 'click', () => {
    if (openInfowindow.current) {
      openInfowindow.current.close();
      openInfowindow.current = null;
    }
  });

    window.kakao.maps.event.addListener(mapInstance.current, 'dragend', () => {
      setMapMoved(true);
    });

    setCenterPosition(() => (lat, lng) => {
      if (mapInstance.current) {
        mapInstance.current.setCenter(new window.kakao.maps.LatLng(lat, lng));
      }
    });
  if (!mapInstance.current) return;

  // fitToMarkers 함수 외부에서 접근 가능하도록 설정
  setFitToMarkers(() => (markerData) => {
    if (!mapInstance.current || markerData.length === 0) return;

    const bounds = new window.kakao.maps.LatLngBounds();
    markerData.forEach(({ latitude, longitude }) => {
      bounds.extend(new window.kakao.maps.LatLng(latitude, longitude));
    });

    mapInstance.current.setBounds(bounds);
  });
     
    searchByMapBounds();
  },
   (error) => {
        console.error(error);
      }
    );

}, []);





  useEffect(() => {
    if (!mapInstance.current) return;
     // 기존 마커 제거
  markerObjects.current.forEach(marker => marker.setMap(null));
  markerObjects.current = [];


    // 새 마커 생성
  const newMarkerObjects = markers.map(({ latitude, longitude, restaurantName,restaurantId }) => {
    const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
    const marker = new window.kakao.maps.Marker({
      position: markerPosition,
      map: mapInstance.current,
    });

 // 정보창 생성
 const infowindowContent = document.createElement("div");
 infowindowContent.className = "info-window-wrapper";
infowindowContent.innerHTML = `
  <div class="info-window">
    <div class="restaurant-name">${restaurantName}</div>
    <button class="add-course-btn">➕ 나만의 코스</button>
  </div>
`;
 
 const infowindow = new window.kakao.maps.InfoWindow({
   content: infowindowContent,
 });
 infowindowContent.querySelector(".add-course-btn").addEventListener("click", () => {
 
  addTempCourse({ restaurantId, restaurantName });
});
 

    // 마커 클릭 시 정보창 열기
    window.kakao.maps.event.addListener(marker, 'click', () => {
      // 기존 열려있는 정보창 닫기
      if (openInfowindow.current) {
        openInfowindow.current.close();
        openInfowindow.current = null;
      }
      infowindow.open(mapInstance.current, marker);
      openInfowindow.current = infowindow;

       // 2초 후 자동으로 닫기
       setTimeout(() => {
        if (openInfowindow.current === infowindow) {
          infowindow.close();
          openInfowindow.current = null;
        }
      }, 2000);
    });

    return marker;
  });

  markerObjects.current = newMarkerObjects;

  }, [markers]);

 
 
  

  const moveToCurrentLocation = () => {
    if (mapInstance.current && currentPosition) {
      mapInstance.current.setCenter(currentPosition);
      setMapMoved(false);
    }
  };

   const getVisibleRadius = () => {
  if (!mapInstance.current || !window.kakao) return 0;

  const bounds = mapInstance.current.getBounds();
  const center = mapInstance.current.getCenter();

  const northEast = bounds.getNorthEast();

  const point1 = {lat:center.getLat(),lng:center.getLng()};
  const point2 = {lat:northEast.getLat(),lng:center.getLng()}
  
  
    return haversine(point1,point2);
};
    //현 위치에서 검색
   const searchByMapBounds = () => {
    if (!mapInstance.current) return;

    const center = mapInstance.current.getCenter();
    const radius = getVisibleRadius();

    axiosInstance.get('/map/position', {
      params: {
      latitude: center.getLat(),
      longitude: center.getLng(),
      radius:radius
      }
    })
    .then(res => {
      setRestaurants(res.data);
      setMarkers(res.data);
      setMapMoved(false);
      setCategory('전체');
    })
    .catch(err => {
      console.error(err);
    });
  };

  
  return (
    <div className="map-container">
      <div ref={mapRef} className="map-placeholder"></div>
      {mapMoved && (<img src={gpsIcon} alt="현 위치로" className="location-icon" onClick={moveToCurrentLocation} />)}
      {mapMoved && <button className="location-search-btn" onClick={searchByMapBounds}>현 위치에서 검색</button>}
    </div>
  );
};

export default MapContainer;

