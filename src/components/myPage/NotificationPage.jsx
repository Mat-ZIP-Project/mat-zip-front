import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosinstance";
import { useNavigate } from "react-router-dom";

import "../../assets/styles/pages/myPage/notification.css";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    notificationAll();
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  const notificationAll = async () => {
      try {
        // 알림 데이터 가져오기
        const response = await axiosInstance.get("/mypage/notifications");
        setNotifications(response.data);

      } catch (err) {
        console.error("알림 처리 중 오류 발생: ", err);
      }
    };

  // 모두 읽음 버튼을 위한 새로운 핸들러
  const handleMarkAllAsRead = async () => {
    try {
      await axiosInstance.post("/mypage/notifications/markAllAsRead");
      notificationAll(); // 알림 목록을 새로고침
    } catch (err) {
      console.error("모두 읽음 처리 중 오류 발생: ", err);
    }
  };

  return (
    <div className="notification-overlay"> {/* 클래스명 변경 */}
      <div className="notification-container"> {/* 클래스명 변경 */}
        <div className="notification-header-wrapper"> {/* 새로운 래퍼 추가 */}
          <button onClick={handleGoBack} className="notification-close-btn"> {/* 클래스명 변경 */}
            X
          </button>
          <h2 className="notification-title-text">알림</h2> {/* 클래스명 변경 */}
          {notifications.length > 0 && (
            <button onClick={handleMarkAllAsRead} className="notification-mark-all-read-btn"> {/* 클래스명 변경 */}
              모두 읽음
            </button>
          )}
        </div>
        <div className="notification-body-content"> {/* 클래스명 변경 */}
          {notifications.length === 0 ? (
            <p className="notification-empty-message">새로운 알림이 없습니다.</p>
          ) : (
            <ul className="notification-list">
              {notifications.map((notification) => (
                <li
                  key={notification.notificationId}
                  className={`notification-item ${
                    notification.isRead ? "read" : "unread"
                  }`}
                >
                  <p className="notification-item-title">{notification.title}</p> {/* 클래스명 변경 */}
                  <p className="notification-item-body">{notification.body}</p> {/* 클래스명 변경 */}
                  <span className="notification-item-time"> {/* 클래스명 변경 */}
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

export default NotificationPage;
