import { useState } from "react";
import axiosInstance from "../../api/axiosinstance";
import "../../assets/styles/localAuth/locationStatusCard.css";




export default function LocationStatusCard({ regionName, badgeCount, fetchAll }) {
  


  const handleAuth = () => {
    axiosInstance
      .post("/local", { regionName })
      .then((res) => {
        alert(res.data + " 인증되었습니다.");
        fetchAll();
      })
      .catch((e) => {
        alert("인증 실패: " + (e.response?.data?.detail || e.message));
      });
  };
  
  return (
    <div className="location-card">
      <div className="location-info">
        <div>
          <p className="location-title">내 현재 위치</p>
          <p className="location-region">{regionName || "위치 확인 필요"}</p>
        </div>
      </div>

      <button
        onClick={handleAuth}
        className="auth-button"
        disabled={!regionName || badgeCount >= 2}
      >
        동네 인증하기
      </button>
      

      {badgeCount >= 2 && (
        <p className="notice-text">⚠️ 인증 뱃지는 최대 2개까지만 발급됩니다.</p>
      )}

    </div>
  );
}
