import React from 'react';
import { Outlet } from 'react-router-dom';
import MainHeader from '../common/MainHeader';
import MainFooter from '../common/MainFooter';

const MainLayout = () => {
    return (
        <>
            <MainHeader />
            <main className="AppMain">
                <Outlet /> {/* 자식 라우트 렌더링 */}
            </main>
            <MainFooter />
        </>
    );
};

export default MainLayout;