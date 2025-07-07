import axiosInstance from "../../api/axiosinstance";
import "../../assets/styles/localAuth/badgeList.css";

export default function BadgeList({ badges, fetchAll }) {
  const handleDelete =  (badgeId) => {
    console.log(badgeId)
    if (!window.confirm("정말 삭제하시겠습니까?\n삭제 시 해당 지역 인증 기록도 함께 삭제됩니다.")) return;
    axiosInstance.delete(`/local/badges/${badgeId}`)
      .then(()=> fetchAll())
      .catch ((e)=>{ 
      alert("삭제 실패: " + e.message);
    })
  };


  return (
    <div className="badge-list">
      <h2 className="badge-list-title">내 뱃지</h2>
      {badges.map((badge) => (
        <div key={badge.badgeId} className="badge-item">
          <span>{badge.regionName} (유효기간: {badge.validUntil})</span>
          <button onClick={() => handleDelete(badge.badgeId)} className="badge-delete">삭제</button>
        </div>
      ))}
    </div>
  );
}