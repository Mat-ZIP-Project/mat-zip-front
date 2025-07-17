import axiosInstance from "../../api/axiosinstance";
import "../../assets/styles/localAuth/badgeList.css";
import badgeImage from "../../assets/images/로컬뱃지.png";
import { showErrorAlert, showQuestionAlert } from "../../utils/sweetAlert"; // sweetAlert import 추가

export default function BadgeList({ badges, badgeCount, fetchAll }) {
  const handleDelete = async (badgeId) => {
    const result = await showQuestionAlert(
      "정말 삭제하시겠습니까?",
      "삭제 시 해당 지역 인증 기록도 함께 삭제됩니다."
    );
    if (!result.isConfirmed) return;
    axiosInstance
      .delete(`/local/badges/${badgeId}`)
      .then(() => fetchAll())
      .catch((e) => {
        showErrorAlert("삭제 실패", e.message);
      });
  };

  return (
    <div className="badge-list">
      <div className="badge-header">
        <h2 className="badge-list-title">🎖 내 뱃지</h2>
        <span className="badge-count">총 {badgeCount}개 / 최대 2개</span>
      </div>

      {badges.length === 0 ? (
        <p className="no-badge-text">아직 인증 뱃지가 없습니다.</p>
      ) : (
        badges.map((badge) => (
          <div key={badge.badgeId} className="badge-item">
            <div className="badge-info">
              <img src={badgeImage} alt="로컬 뱃지" className="badge-icon" />
              <div className="badge-text-block">
                <div className="badge-region">{badge.regionName}</div>
                <div className="badge-date">유효기간: {badge.validUntil}</div>
              </div>
            </div>
            <button
              onClick={() => handleDelete(badge.badgeId)}
              className="badge-delete"
            >
              삭제
            </button>
          </div>
        ))
      )}
    </div>
  );
}
