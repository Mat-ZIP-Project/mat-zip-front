import axiosInstance from "../../api/axiosinstance";
import '../../assets/styles/localAuth/locationStatusCard.css';

export default function LocationStatusCard({ regionName, badgeCount, fetchAll }) {
 console.log(regionName)
  const handleAuth =  () => {
    axiosInstance.post("/local", { regionName})
    .then(res=>{
      alert(res.data+" 인증되었습니다.");
      fetchAll();
    })
    .catch(e=>{
      console.log(e.response.data.detail)
      alert("인증 실패: " + e.response.data.detail);
    });
  };

  return (
    <div className="location-card">
      <p className="location-title">내 현재 위치</p>
      <p>{regionName || "위치 확인 필요"}</p>
      <p>현재 보유 뱃지: {badgeCount}개 / 최대 2개</p>
      <button onClick={handleAuth} className="auth-button" >현지인 인증하기</button>
      {badgeCount >= 2 && <p className="notice-text">추가 뱃지 발급 불가</p>}
    </div>
  );
}