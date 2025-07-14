import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../assets/styles/common/MainFooter.module.css';
import { logout } from '../../store/authSlice';
import axiosInstance from '../../api/axiosinstance';
import  { useEffect, useState } from 'react';

const MainFooter = () => {
    const { isAuthenticated } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [spotCount, setSpotCount] = useState(0);

    useEffect(() => {
        const updateCount = () => {
            const saved = JSON.parse(localStorage.getItem("myCourseSpots")) || [];
            setSpotCount(saved.length);
        };

        // 최초 렌더링 시
        updateCount();

        // storage 이벤트 리스너 (다른 탭에서 변경 시에도 반영되도록)
        window.addEventListener("storage", updateCount);

        return () => window.removeEventListener("storage", updateCount);
        }, []);

    const handleMyPageClick = () => {
        if (isAuthenticated) {
            navigate('/mypage');
        } else {
            navigate('/login');
        }
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleLogout = async () => {
        try {
            await axiosInstance.post('/auth/logout', {}, {
                withCredentials: true
            });
        } catch (error) {
            console.error('로그아웃 API 호출 실패:', error);
        } finally {
            const rememberedUserId = localStorage.getItem('rememberedUserId');
            if (!rememberedUserId) {
                dispatch(logout({ forceComplete: true }));
            } else {
                dispatch(logout());
            }
            navigate('/');
        }
    };

    const handleAuthButtonClick = () => {
        if (isAuthenticated) {
            handleLogout();
        } else {
            handleLoginClick();
        }
    };

    return (
        <footer className={styles.footer}>
            <nav className={styles.footerNav}>
                <div className={styles.navItem}>
                    <Link to="/" className={styles.navLink}>
                        <div className={styles.iconHome}></div>
                        <span>홈</span>
                    </Link>
                </div>
                
                <div className={styles.navItem}>
                    <Link to="/courses" className={styles.navLink}>
                         <div className={styles.iconCourse}>
                         {spotCount > 0 && <span className={styles.badge}>{spotCount}</span>}
                         </div>
                        <span>나만의 코스</span>
                    </Link>
                </div>
                
                <div className={styles.navItem}>
                    <Link to="/nearby" className={styles.navLink}>
                        <div className={styles.iconLocation}></div>
                        <span>내 주변</span>
                    </Link>
                </div>
                
                <div className={styles.navItem}>
                    <div className={styles.navLink} onClick={handleAuthButtonClick}>
                        <div className={styles.iconLogin}></div>
                        <span>{isAuthenticated ? '로그아웃' : '로그인'}</span>
                    </div>
                </div>
                
                <div className={styles.navItem}>
                    <div className={styles.navLink} onClick={handleMyPageClick}>
                        <div className={styles.iconUser}></div>
                        <span>MY</span>
                    </div>
                </div>
            </nav>
        </footer>
    );
};

export default MainFooter;