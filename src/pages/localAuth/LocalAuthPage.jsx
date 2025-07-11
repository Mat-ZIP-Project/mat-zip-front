import { useState, useEffect } from "react";
import LocationStatusCard from '../../components/localAuth/LocationStatusCard';
import BadgeList from '../../components/localAuth/BadgeList';
import AuthLogList from '../../components/localAuth/AuthLogList';
import InfoBanner from '../../components/localAuth/InfoBanner';
import axiosInstance from '../../api/axiosinstance';
import '../../assets/styles/pages/localAuth/localAuthPage.css';


export default function LocalAuthPage() {
  const [regionName, setRegionName] = useState("");
  const [badges, setBadges] = useState([]);
  const [authLogs, setAuthLogs] = useState([]);

  const fetchAll =  () => {
    axiosInstance.get("/local/badges")
      .then(res=>{
        setBadges(res.data);
      });
    
      axiosInstance.get("/local/auth")
      .then(res=>{
        setAuthLogs(res.data);
      });
  };
  

  useEffect(() => {
    fetchAll();
    getCurrentRegion()
    .then(region => {
      setRegionName(region);
    })
    .catch(e => {
      console.error("위치 정보 오류", e);
    });
    
  }, []);

  const getCurrentRegion = () => {
  return new Promise((resolve, reject) => {
    if (!window.kakao || !window.kakao.maps) {
      return reject(new Error("Kakao Map 로드 실패"));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const geocoder = new window.kakao.maps.services.Geocoder();

       geocoder.coord2RegionCode(longitude, latitude, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const regionObj = result.find((r) => r.region_type === "H"); // 행정동 기준
            if (regionObj) {
              const fullAddress = regionObj.address_name; 
              const parts = fullAddress.split(" ");
              const district = parts[0]==="서울특별시" ? `${parts[0]} ${parts[1]}` : `${parts[0]} ${parts[1]} ${parts[2]}`; 
              resolve(district);
            } else {
              reject(new Error("행정동 정보 없음"));
            }
          } else {
            reject(new Error("위치 변환 실패"));
          }
        });
      },
      () => reject(new Error("위치 정보 접근 실패"))
    );
  });
  };

  return (
    <div className="local-auth-page">
      <h1 className="page-title">📍 현지인 인증</h1>
      <LocationStatusCard
        regionName={regionName}
        badgeCount={badges.length}
        fetchAll={fetchAll}
      />
      <BadgeList badges={badges} badgeCount={badges.length} fetchAll={fetchAll} />
      <AuthLogList authLogs={authLogs} />
      <InfoBanner />
    </div>
  );
}