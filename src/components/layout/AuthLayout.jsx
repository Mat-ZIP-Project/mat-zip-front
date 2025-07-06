import React from 'react';
import { Outlet } from 'react-router-dom';
import AuthHeader from '../common/MainHeader';
import AuthFooter from '../common/MainFooter';

const AuthLayout = () => {
    return (
        <>
            <AuthHeader />
            <main className="AppMain auth-main">
                <Outlet /> {/* 자식 라우트 렌더링 */}
            </main>
            <AuthFooter />
        </>
    );
};

export default AuthLayout;