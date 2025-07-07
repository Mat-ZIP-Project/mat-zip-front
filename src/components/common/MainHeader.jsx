import React from 'react';
import styles from '../../assets/styles/common/MainHeader.module.css';
import { useNavigate } from 'react-router-dom';

const MainHeader = () => {
    const navigate = useNavigate();

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // 추후 검색 기능 구현
    };

    const handleLogoClick = () => {
        navigate('/');
    };

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
                        className={styles.searchInput}
                    />
                </form>
                
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