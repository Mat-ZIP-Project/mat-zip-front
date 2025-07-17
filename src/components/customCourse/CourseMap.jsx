import { useEffect, useRef } from "react";
import "../../assets/styles/customCourse/courseMap.css";

const CourseMap = ({ spots }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const overlaysRef = useRef([]);
  const polylineRef = useRef(null);

  // ✅ 1. 맵 최초 1회 생성
  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) return;

    const mapContainer = mapContainerRef.current;
    const mapOption = {
      center: new window.kakao.maps.LatLng(37.5665, 126.9780),
      level: 5,
    };
    const map = new window.kakao.maps.Map(mapContainer, mapOption);
    mapRef.current = map;
  }, []);

  // ✅ 2. spots가 변경될 때마다 마커/오버레이/선 업데이트
  useEffect(() => {
    if (!mapRef.current) return;

    // 기존 요소 제거
    markersRef.current.forEach(marker => marker.setMap(null));
    overlaysRef.current.forEach(overlay => overlay.setMap(null));
    if (polylineRef.current) polylineRef.current.setMap(null);

    markersRef.current = [];
    overlaysRef.current = [];

    if (spots.length === 0) return;

    const bounds = new window.kakao.maps.LatLngBounds();
    const path = [];

    spots.forEach(spot => {
      const position = new window.kakao.maps.LatLng(spot.latitude, spot.longitude);

      const marker = new window.kakao.maps.Marker({ map: mapRef.current, position });
      markersRef.current.push(marker);

      const overlayContent = `
        <div class="custom-overlay">
          <div class="order-badge">${spot.visitOrder}</div>
          <div class="restaurant-name">${spot.restaurantName}</div>
        </div>
      `;
      const overlay = new window.kakao.maps.CustomOverlay({
        map: mapRef.current,
        position,
        content: overlayContent,
        yAnchor: 1.8,
      });
      overlaysRef.current.push(overlay);

      bounds.extend(position);
      path.push(position);
    });

    if (path.length > 1) {
      const polyline = new window.kakao.maps.Polyline({
        map: mapRef.current,
        path,
        strokeWeight: 3,
        strokeColor: "#FF5A5A",
        strokeOpacity: 0.8,
        strokeStyle: "solid",
      });
      polylineRef.current = polyline;
    }

    mapRef.current.setBounds(bounds);
  }, [spots]);

  return (
    <div className="course-map">
      <div
        ref={mapContainerRef}
        id="map"
        style={{ width: "100%", height: "400px", borderRadius: "8px" }}
      />
    </div>
  );
};

export default CourseMap;
