import React, { useState, useEffect } from "react";
import styles from "../../assets/styles/common/MainHeader.module.css";
import { useNavigate, useLocation, matchPath } from "react-router-dom";
import WaitingStatusModal from "../restaurant/WaitingStatusModal";
import axiosInstance from '../../api/axiosinstance';

const MainHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [keyword, setKeyword] = useState("");
  const [isWaitingModalOpen, setIsWaitingModalOpen] = useState(false);
  const [waitingInfo, setWaitingInfo] = useState(null);

useEffect(() => {
  let accessToken = null;
  const persistedAuth = localStorage.getItem('persist:auth');
  if (persistedAuth) {
    const parsed = JSON.parse(persistedAuth);
    accessToken = JSON.parse(parsed.accessToken);
  }
  if (!accessToken) {
    console.warn("SSE 연결 불가: accessToken 없음");
    return;
  }
  const sse = new EventSource(`/api/waiting/subscribe?token=${accessToken}`, { withCredentials: true });

  sse.addEventListener("waiting-update", (e) => {
  try {
    console.log('SSE waiting-update 이벤트 받음:', e.data);
    const updated = JSON.parse(e.data);
    setWaitingInfo(updated);
  } catch (err) {
    console.error("SSE 데이터 파싱 오류:", err, e.data);
  }
});

  sse.onerror = (e) => {
    console.error('SSE 오류:', e);
  };
  return () => sse.close();
}, []);

  // 어떤 경로인지 확인
  const isRestaurantDetail = !!matchPath("/restaurants/:id", location.pathname);
  const isLocalAuthPage = location.pathname === "/local-auth";
  const isSearchPage = location.pathname === "/restaurants/search";
  const isMyCoursePage = location.pathname === "/my-courses";
  
  const showBackButton = (isRestaurantDetail || isLocalAuthPage || isMyCoursePage) && !isSearchPage;
const hideSearchBar = !isSearchPage && (isRestaurantDetail || isLocalAuthPage || isMyCoursePage);
  // 종(알림) 아이콘 클릭 시
  const handleNotificationClick = async () => {
  setIsWaitingModalOpen(true);
  try {
    const res = await axiosInstance.get("/api/waiting/me");
    setWaitingInfo(res.data); // 객체 1개만 저장
  } catch (e) {
    setWaitingInfo(null);
  }
};

  // 뒤로가기 버튼 클릭
  const handleBackClick = () => {
  if (location.state?.from) {
    navigate(location.state.from);
  } else if (isLocalAuthPage) {
    navigate("/mypage");
  } else if (isRestaurantDetail) {
    navigate("/"); // 리스트가 아닌 홈으로 이동
  } else {
    navigate("/courses");
  }
};

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = keyword.trim();
    if (trimmed.length > 0) {
    navigate(`/restaurants/search?keyword=${encodeURIComponent(trimmed)}`);
    setKeyword(""); // 검색 후 검색어 초기화
  }
  };

  const handleLogoClick = () => {
    setKeyword("");
    navigate("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles.searchSection}>
        <div className={styles.logoArea}>
          {showBackButton ? (
  <button className={styles.backButton} onClick={handleBackClick}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M15 18l-6-6 6-6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <span className={styles.backText}>뒤로가기</span>
  </button>
) : (
  <div className={styles.logo} onClick={handleLogoClick}>
    <img src="https://matzip-kosta295.s3.ap-northeast-2.amazonaws.com/assets/icon/%EB%A1%9C%EA%B3%A0_2.png" className={styles.logotest}/>
  </div>
)}
        </div>

        {!hideSearchBar && (
          <form onSubmit={handleSearchSubmit} className={styles.searchBar}>
            <div className={styles.searchIcon}></div>
            <input
              type="text"
              placeholder="맛집을 검색해 보세요"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className={styles.searchInput}
            />
          </form>
        )}

        <div className={styles.actionIcons}>
          <button
            className={styles.iconButton}
            onClick={() => navigate("/mypage")}
          >
            <div className={styles.iconHeart}></div>
          </button>
          <button className={styles.iconButton} onClick={handleNotificationClick}>
            <div className={styles.iconNotification}></div>
          </button>
        </div>
      </div>
      {/* 웨이팅 현황 모달 */}
      {isWaitingModalOpen && (
  <WaitingStatusModal
    waitingInfo={waitingInfo}
    onClose={() => setIsWaitingModalOpen(false)}
  />
)}
    </header>
  );
};

export default MainHeader;