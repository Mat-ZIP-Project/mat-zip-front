import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ requiredRole = null }) => {
    const { isAuthenticated, userInfo } = useSelector(state => state.auth);
    const location = useLocation();
    
    // 로그인하지 않은 경우
    if (!isAuthenticated) {
        // 현재 경로를 state로 전달해서 로그인 후 원래 페이지로 돌아갈 수 있게 함
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    // 특정 권한이 필요한 경우
    if (requiredRole && userInfo?.role !== requiredRole) {
        return <Navigate to="/" replace />; // 권한 없으면 홈으로
    }
    
    // 자식 컴포넌트 렌더링
    return <Outlet />;
};

export default ProtectedRoute;
