import { useEffect, useRef, useState } from 'react';
import '../../assets/styles/mapSearch/mapContainer.css';
import gpsIcon from '../../assets/images/gps-icon.png';
import axiosInstance from '../../api/axiosinstance';
import haversine from 'haversine-distance';


const MapContainer = ({ category,  mapMoved, setMapMoved, markers ,setMarkers}) => {
  
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [currentPosition, setCurrentPosition] = useState(null);

 
  
 useEffect(() => {
    if (!window.kakao || !mapRef.current) return;

    console.log(window.kakao.maps.geometry);
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

    window.kakao.maps.event.addListener(mapInstance.current, 'dragend', () => {
      setMapMoved(true);
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

    markers.forEach(({ latitude, longitude, name }) => {
      const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
      });
      marker.setMap(mapInstance.current);
    });
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
      console.log(res);
      setMarkers(res.data);
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

