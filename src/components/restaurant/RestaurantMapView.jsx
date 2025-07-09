import React, { useEffect } from 'react';

const RestaurantMapView = ({ restaurants }) => {
  useEffect(() => {
    if (!window.kakao || !restaurants || restaurants.length === 0) return;

    const mapContainer = document.getElementById('map');
    const geocoder = new window.kakao.maps.services.Geocoder();

    // 주소 → 좌표 변환 Promise 래핑 함수
    const getCoords = (address) =>
      new Promise((resolve, reject) => {
        geocoder.addressSearch(address, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
            resolve(coords);
          } else {
            reject(new Error('주소 변환 실패'));
          }
        });
      });

    // 모든 좌표 변환 처리
    Promise.all(
      restaurants.map((r) => getCoords(r.address).catch(() => null)) // 실패 시 null 반환
    ).then((coordsArray) => {
      // 유효한 좌표만 필터링
      const validCoords = coordsArray.filter((c) => c !== null);
      if (validCoords.length === 0) return;

      // 위도, 경도 평균 계산하여 중심 좌표 결정
      const avgLat =
        validCoords.reduce((sum, coord) => sum + coord.getLat(), 0) / validCoords.length;
      const avgLng =
        validCoords.reduce((sum, coord) => sum + coord.getLng(), 0) / validCoords.length;

      // 지도 옵션에 중심 좌표 적용
      const mapOption = {
        center: new window.kakao.maps.LatLng(avgLat, avgLng),
        level: 5,
      };

      // 지도 생성
      const map = new window.kakao.maps.Map(mapContainer, mapOption);

      // 마커 및 인포윈도우 생성
      validCoords.forEach((coords, idx) => {
        const restaurant = restaurants[idx];
        if (!coords) return;

        const marker = new window.kakao.maps.Marker({
          map,
          position: coords,
        });

        const content = `<div style="padding:5px;"><a href="/restaurants/${restaurant.restaurantId}">${restaurant.restaurantName}</a></div>`;
        const infowindow = new window.kakao.maps.InfoWindow({ content });

        window.kakao.maps.event.addListener(marker, 'click', function () {
          infowindow.open(map, marker);
        });
      });
    });
  }, [restaurants]);

  return <div id="map" style={{ width: '100%', height: '500px' }} className="restaurant-map-view_map" />;
};

export default RestaurantMapView;
