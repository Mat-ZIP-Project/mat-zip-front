import { useEffect, useRef } from "react";
import "../../assets/styles/customCourse/courseMap.css";

const CourseMap = ({ spots, editable }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if(spots.length===0) return;
    if (!window.kakao || !window.kakao.maps) {
      console.error("카카오맵이 로드되지 않았습니다.");
      return;
    }

    const container = mapRef.current;
    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.9780),
      level: 5,
    };
    const map = new window.kakao.maps.Map(container, options);

    if (spots.length > 0) {
      const bounds = new window.kakao.maps.LatLngBounds();
      const path = [];

      spots.forEach((spot) => {
        const position = new window.kakao.maps.LatLng(spot.latitude, spot.longitude);

        new window.kakao.maps.Marker({
          map,
          position,
        });

        const overlayContent = `
          <div class="custom-overlay">
            <div class="order-badge">${spot.visitOrder}</div>
            <div class="restaurant-name">${spot.restaurantName}</div>
          </div>
        `;

        new window.kakao.maps.CustomOverlay({
          map,
          position,
          content: overlayContent,
          yAnchor: 1.8,
        });

        bounds.extend(position);
        path.push(position);
      });

      new window.kakao.maps.Polyline({
        map,
        path,
        strokeWeight: 3,
        strokeColor: "#FF5A5A",
        strokeOpacity: 0.8,
        strokeStyle: "solid",
      });

      map.setBounds(bounds);
    }
  }, [spots]);

  return (
    <div className="course-map">
      <div
        ref={mapRef}
        id="map"
        style={{ width: "100%", height: "400px", borderRadius: "8px" }}
      />
      {editable && <div className="editable-guide">※ 편집 가능한 지도</div>}
    </div>
  );
};

export default CourseMap;
