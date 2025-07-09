import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ReservationList from "../../components/myPage/ReservationList";
import ReviewList from "../../components/myPage/ReviewList";
import MeetupParticipantList from "../../components/myPage/MeetupParticipantList";
import MeetingList from "../../components/myPage/MeetingList";
import MeetupReviewList from "../../components/myPage/MeetingReviewList";
import "../../assets/styles/pages/myPage/myPage.css";
import axiosInstance from "../../api/axiosinstance";
import NotificationPopup from "../../components/myPage/NotificationPopup";

const MyPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("reservations");
  const [activeMeetingTab, setActiveMeetingTab] = useState("attended");

  // 알림 관련 상태
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  useEffect(() => {
    const unReadNotification = async () => {
      try {
        const response = await axiosInstance.get("/mypage/notifications");
        const notifications = response.data;

        const unreadCount = notifications.filter(
          (notif) => !notif.isRead
        ).length;
        setUnreadNotificationCount(0);
      } catch (error) {
        console.error("읽지 않은 알림 수를 가져오지 못했습니다: ", error);
        setUnreadNotificationCount(0);
      }
    };
    unReadNotification();
  }, []);

  const handleLocalAuth = () => {
    navigate("/local-auth");
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleMeetingSubTabClick = (subTabName) => {
    setActiveMeetingTab(subTabName);
  };

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

  // 내역들
  const renderActiveTabComponent = () => {
    switch (activeTab) {
      case "reservations":
        return <ReservationList />;
      case "reviews":
        return <ReviewList />;
      case "meetings":
        return (
          <div>
            <div className="sub-tabs">
              <span
                onClick={() => handleMeetingSubTabClick("attended")}
                className={`sub-tab-item ${
                  activeMeetingTab === "attended" ? "active" : ""
                }`}
              >
                참석한 모임
              </span>
              <span
                onClick={() => handleMeetingSubTabClick("created")}
                className={`sub-tab-item ${
                  activeMeetingTab === "created" ? "active" : ""
                }`}
              >
                내가 만든 모임
              </span>
              <span
                onClick={() => handleMeetingSubTabClick("reviews")}
                className={`sub-tab-item ${
                  activeMeetingTab === "reviews" ? "active" : ""
                }`}
              >
                모임 리뷰
              </span>
            </div>
            {activeMeetingTab === "attended" && <MeetupParticipantList />}
            {activeMeetingTab === "created" && <MeetingList />}
            {activeMeetingTab === "reviews" && <MeetupReviewList />}
          </div>
        );
      default:
        return <ReservationList />;
    }
  };

  return (
    <div className="my-page-container">
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

      <div className="user-info-section">
        <div className="user-id-display">{userInfo?.userId}님</div>
        <button
          // onClick={() => navigate("/profile-edit")}
          className="profile-edit-button"
        >
          프로필 수정
        </button>
      </div>

      <div className="main-tabs">
        <span
          onClick={() => handleTabClick("reservations")}
          className={`tab-item ${activeTab === "reservations" ? "active" : ""}`}
        >
          예약 내역
        </span>
        <span
          onClick={() => handleTabClick("reviews")}
          className={`tab-item ${activeTab === "reviews" ? "active" : ""}`}
        >
          리뷰 내역
        </span>
        <span
          onClick={() => handleTabClick("meetings")}
          className={`tab-item ${activeTab === "meetings" ? "active" : ""}`}
        >
          모임 내역
        </span>
      </div>

      <div className="tab-content">{renderActiveTabComponent()}</div>

      {showNotificationPopup && (
        <NotificationPopup
          onClose={handleCloseNotificationPopup}
          onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        />
      )}
    </div>
  );
};

export default MyPage;
