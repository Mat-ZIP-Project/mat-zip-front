import React, { useState } from "react";
import styles from "../../assets/styles/common/MainHeader.module.css";
import { useNavigate, useLocation, matchPath } from "react-router-dom";

const MainHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [keyword, setKeyword] = useState("");

  // 어떤 경로인지 확인
  const isRestaurantDetail = !!matchPath("/restaurants/:id", location.pathname);
  const isLocalAuthPage = location.pathname === "/local-auth";
  const isSearchPage = location.pathname === "/restaurants/search";

  const showBackButton = (isRestaurantDetail || isLocalAuthPage) && !isSearchPage;
  const hideSearchBar = isRestaurantDetail || isLocalAuthPage;


  // 뒤로가기 버튼 클릭
  const handleBackClick = () => {
    if (location.state?.from) {
      navigate(location.state.from); // 정확한 이전 경로로 복귀
    } else if (isLocalAuthPage) {
      navigate("/mypage"); // 고정된 fallback
    } else {
      navigate("/restaurants"); // 기본 fallback
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
          {/* ✅ 로고 or 뒤로가기 조건 렌더링 */}
          {showBackButton ? (
            <div className={styles.backButton} onClick={handleBackClick}>
              ⬅ 
            </div>
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
          <button className={styles.iconButton}>
            <div className={styles.iconNotification}></div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
