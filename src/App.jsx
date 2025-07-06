import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";

import MainLayout from "./components/layout/MainLayout";
import AuthLayout from "./components/layout/AuthLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Owner from "./pages/Owner";
import NotFound from "./pages/NotFound";
import MyPageTest from "./pages/MyPageTest";
import Signup from "./pages/signup/SignupMain";

// 리뷰 전용 페이지 컴포넌트 import (신규)
import ReservationReviewPage from "./pages/review/ReservationReviewPage";
import OcrReviewPage from "./pages/review/OcrReviewPage";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* 메인 레이아웃 그룹 - 로그인 불필요 */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
        </Route>

        {/* 로그인관련 레이아웃 그룹 - 로그인 불필요 */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/find-id" element={<FindId />} />
                <Route path="/auth/find-password" element={<FindPassword />} /> */}
        </Route>

        {/* ⭐️ 예약자 리뷰 Route (로그인 불필요, 테스트용) */}
        <Route element={<MainLayout />}>
          <Route
            path="/reservation-reviews"
            element={<ReservationReviewPage />}
          />
          <Route path="/ocr-reviews" element={<OcrReviewPage />} />
        </Route>

        {/* 🛡️ 일반 사용자 라우트 - 로그인 필요 */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/mypage" element={<MyPageTest />} />
          </Route>
        </Route>

        {/* 🏪 식당 업주 전용 라우트 - ROLE_OWNER */}
        <Route element={<ProtectedRoute requiredRole="ROLE_OWNER" />}>
          <Route path="/owner" element={<MainLayout />}>
            <Route index element={<Owner />} />
          </Route>
        </Route>

        {/* 👑 관리자 전용 라우트 - ROLE_ADMIN */}
        <Route element={<ProtectedRoute requiredRole="ROLE_ADMIN" />}>
          {/* ...관리자용 Route 추가 */}
        </Route>

        {/* 404 페이지 */}
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
