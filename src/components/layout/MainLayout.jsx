import React from 'react';
import { Outlet } from 'react-router-dom';
import MainHeader from '../common/MainHeader';
import MainFooter from '../common/MainFooter';
import '../../assets/styles/common/DefaultLayout.css';

const MainLayout = () => {
    return (
        <div className="default-layout">
            <MainHeader />
            <main className="AppMain">
                <Outlet /> {/* 자식 라우트 렌더링 */}
            </main>
            <MainFooter />
        </div>
    );
};

export default MainLayout;