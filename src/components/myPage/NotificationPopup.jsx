import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosinstance";

const NotificationPopup = ({ onClose, onMarkAllAsRead }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const notificationAll = async () => {
      try {
        // 알림 데이터 가져오기
        const response = await axiosInstance.get("/mypage/notifications");
        setNotifications(response.data);

        // 서버에 모든 알림을 읽음 처리 요청
        await axiosInstance.post("/mypage/notifications/markAllAsRead");

        // 부모에게 알림 카운터 0으로 업데이트 요청
        onMarkAllAsRead();
      } catch (err) {
        console.error("알림 처리 중 오류 발생: ", err);
      }
    };
    notificationAll();
  }, [onMarkAllAsRead]); // onMarkAllAsRead 함수가 변경될 때 재실행될 수 있도록 함

  return (
    <div className="notification-popup-overlay">
      <div className="notification-popup-content">
        <div className="notification-header">
          <h2>알림</h2>
          <button onClick={onClose} className="close-button">
            X
          </button>
        </div>
        <div className="notification-body">
          {notifications.length === 0 ? (
            <p>새로운 알림이 없습니다.</p>
          ) : (
            <ul className="notification-list">
              {notifications.map((notification) => (
                <li
                  key={notification.notificationId}
                  className={`notification-item ${
                    notification.isRead ? "read" : "unread"
                  }`}
                >
                  <p className="notification-title">{notification.title}</p>
                  <p className="notification-body-text">{notification.body}</p>
                  <span className="notification-time">
                    {new Date(notification.createdAt).toLocaleString("ko-KR")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;
