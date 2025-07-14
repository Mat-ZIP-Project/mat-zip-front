import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosinstance";
import { useReservationLogic } from "../reservation/hooks/useReservationLogic";

const MyPageHeader = () => {
  const navigate = useNavigate();

  const {onNotificationsClick} = useReservationLogic();
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  // 읽지 않은 알림 개수만 관리
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  // 컴포넌트 마운트 시 읽지 않은 알림 개수를 가져온다.
  useEffect(() => {
    const UnreadNotificationCount = async () => {
      try {
        const response = await axiosInstance.get("/mypage/notifications/count");
        setUnreadNotificationCount(response.data);
      } catch (error) {
        console.error("알림 개수 가져오기 실패:", error);
        setUnreadNotificationCount(0);
      }
    };

    UnreadNotificationCount();

    // 1분마다 업데이트 3600000 86400000
    const intervalId = setInterval(UnreadNotificationCount, 3600000);
    return () => clearInterval(intervalId);
  }, []);

  // 알림 페이지로 이동
  const handleNotificationIconClick = () => {
    navigate("/mypage/notifications");
  };

  return (
    <div className="mypage-container">
      <div className="my-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0"}}>
        <h1>마이페이지</h1>
        <div className="header-icons">
          <span
            className="notification-icon-wrapper"
            onClick={handleNotificationIconClick}
          >
            🔔
            {unreadNotificationCount > 0 && (
              <span className="notification-count">
                {unreadNotificationCount}
              </span>
            )}
          </span>
          <span onClick={onNotificationsClick} style={{ cursor:"pointer" }}>⚙️</span>
          {showNotificationPopup && (
            <NotificationSettingsPopup
              isOpen={showNotificationPopup}
              onClose={() => setShowNotificationPopup(false)} // 팝업 닫기 함수
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPageHeader;
