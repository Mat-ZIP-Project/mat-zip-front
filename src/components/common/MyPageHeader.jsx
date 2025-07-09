import React, { useState } from "react";
import { Link } from "react-router-dom";
import NotificationPopup from "../myPage/NotificationPopup";
// import axiosInstance from "../../api/axiosinstance";

const MyPageHeader = () => {
  // 알림 관련 상태
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  // 알림 팝업
  const handleNotificationIconClick = () => {
    setShowNotificationPopup(true);
    setUnreadNotificationCount(0);
  };
  const handleCloseNotificationPopup = () => {
    setShowNotificationPopup(false);
  };
  const handleMarkAllNotificationsAsRead = () => {
    setUnreadNotificationCount(0);
  };

  //   useEffect(() => {
  //     const unReadNotification = async () => {
  //       try {
  //         const response = await axiosInstance.get("/mypage/notifications");
  //         const notifications = response.data;

  //         const unreadCount = notifications.filter(
  //           (notif) => !notif.isRead
  //         ).length;
  //         setUnreadNotificationCount(0);
  //       } catch (error) {
  //         console.error("읽지 않은 알림 수를 가져오지 못했습니다: ", error);
  //         setUnreadNotificationCount(0);
  //       }
  //     };
  //     unReadNotification();
  //   }, []);

  return (
    <div className="mypage-container">
      <div className="my-page-header">
        <h1>마이페이지</h1>
        <Link
          to="/reservation"
          style={{
            textDecoration: "none",
            color: "blue",
            border: "1px solid black",
          }}
        >
          예약하기
        </Link>
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
          <span>⚙️</span>
        </div>
      </div>
      {showNotificationPopup && (
        <NotificationPopup
          onClose={handleCloseNotificationPopup}
          onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        />
      )}
    </div>
  );
};

export default MyPageHeader;
