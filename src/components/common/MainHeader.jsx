import React, { useState } from "react";
import styles from "../../assets/styles/common/MainHeader.module.css";
import { useNavigate, useLocation, matchPath } from "react-router-dom";
import WaitingStatusModal from "../restaurant/WaitingStatusModal";
import axiosInstance from '../../api/axiosinstance';

const MainHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [keyword, setKeyword] = useState("");
  const [isWaitingModalOpen, setIsWaitingModalOpen] = useState(false);
  const [waitingList, setWaitingList] = useState([]);

  // 어떤 경로인지 확인
  const isRestaurantDetail = !!matchPath("/restaurants/:id", location.pathname);
  const isLocalAuthPage = location.pathname === "/local-auth";
  const isSearchPage = location.pathname === "/restaurants/search";
  
  const showBackButton = (isRestaurantDetail || isLocalAuthPage) && !isSearchPage;
  const hideSearchBar = isRestaurantDetail || isLocalAuthPage;

  // 종(알림) 아이콘 클릭 시
  const handleNotificationClick = async () => {
  setIsWaitingModalOpen(true);

  try {
    const res = await axiosInstance.get("/api/waiting/me");
    setWaitingList(Array.isArray(res.data) ? res.data : [res.data]);
  } catch (e) {
    setWaitingList([]);
  }
};

  // 뒤로가기 버튼 클릭
  const handleBackClick = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else if (isLocalAuthPage) {
      navigate("/mypage");
    } else {
      navigate("/restaurants");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = keyword.trim();
    if (trimmed.length > 0) {
      navigate(`/restaurants/search?keyword=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleLogoClick = () => {
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
    <div className={styles.logoPlaceholder}></div>
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
          <button className={styles.iconButton}>
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
          waitingList={waitingList}
          onClose={() => setIsWaitingModalOpen(false)}
        />
      )}
    </header>
  );
};

export default MainHeader;