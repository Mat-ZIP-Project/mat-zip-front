import React, { useState } from 'react';
import styles from '../../assets/styles/common/MainHeader.module.css';
import { useNavigate } from 'react-router-dom';

const MainHeader = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
         const trimmed = keyword.trim();
        if (trimmed.length > 0) {
            navigate(`/restaurants/search?keyword=${encodeURIComponent(trimmed)}`);
        }
    };

    const handleLogoClick = () => {
        navigate('/');
    };
    const handleHeartClick = () => {
        navigate('/mypage');
    }

    return (
        <header className={styles.header}>
            <div className={styles.searchSection}>
                <div className={styles.logoArea}>
                    <div className={styles.logo} onClick={handleLogoClick}>
                        <div className={styles.logoPlaceholder}></div>
                    </div>
                </div>
                
                <form onSubmit={handleSearchSubmit} className={styles.searchBar}>
                    <div className={styles.searchIcon}></div>
                    <input 
                        type="text" 
                        placeholder="맛집을 검색해 보세요"
                        value = {keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className={styles.searchInput}
                    />
                </form>
                
                <div className={styles.actionIcons}>
                    <button className={styles.iconButton}>
                        <div className={styles.iconHeart} onClick={handleHeartClick}></div>
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