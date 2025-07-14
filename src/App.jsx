import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";

import MainLayout from "./components/layout/MainLayout";
import AuthLayout from "./components/layout/AuthLayout";

import Home from "./pages/Home";
import LoginPage from "./pages/login/LoginPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import OwnerPage from "./pages/owner/OwnerPage";
import NotFound from "./pages/NotFound";
import SearchMapPage from "./pages/mapSearch/SearchMapPage";
import TempCoursePage from "./pages/customCourse/TempCoursePage";
import MyCourseListPage from "./pages/customCourse/MyCourseListPage";
import CourseDetailPage from "./pages/customCourse/CourseDetailPage";
import LocalAuthPage from "./pages/localAuth/LocalAuthPage";
import ReservationPopup from "./components/reservation/ReservationPopup";
import RestaurantListPage from "./pages/restaurant/RestaurantListPage";
import RestaurantDetailPage from "./pages/restaurant/RestaurantDetailPage";
import MyPage from "./pages/mypage/MyPage";
import RestaurantSearchResultPage from "./pages/restaurant/RestaurantSearchResultPage";
import MyPageLayout from "./components/layout/MyPageLayout";
import NotificationPage from "./components/myPage/NotificationPage";

import ReviewForm from "./pages/review/ReviewForm";
import OcrModal from "./components/review/OcrModal";
import SignUpPage from "./pages/signup/SignUpPage";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* 메인 레이아웃 그룹(메인푸터/헤더 사용) - 로그인 불필요 */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/restaurants" element={<RestaurantListPage />} />
          <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
          <Route
            path="/restaurants/:restaurantId/reservation"
            element={<ReservationPopup />}
          />
          <Route
            path="/restaurants/search"
            element={<RestaurantSearchResultPage />}
          />
        </Route>

        {/* 로그인관련 레이아웃 그룹(로그인용 푸터/헤더 사용) - 로그인 불필요 */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          {/*   <Route path="/find-id" element={<FindId />} />
                <Route path="/auth/find-password" element={<FindPassword />} /> */}
          <Route path="/nearby" element={<SearchMapPage />} />
        </Route>

        {/* 🛡️ 일반 사용자 라우트 - 로그인 필요 */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/courses" element={<TempCoursePage />} />
            <Route path="/my-courses" element={<MyCourseListPage />} />
            <Route
              path="/course/custom/details/:courseId"
              element={<CourseDetailPage />}
            />
            <Route path="/local-auth" element={<LocalAuthPage />} />
            <Route
              path="/reservation/:restaurantId"
              element={<ReservationPopup />}
            />
            <Route path="/ocr" element={<OcrModal />} />
            <Route path="/review" element={<ReviewForm />} />
          </Route>

          <Route element={<MyPageLayout />}>
            <Route path="/mypage" element={<MyPage />} />
            <Route
              path="/mypage/notifications"
              element={<NotificationPage />}
            />
          </Route>
        </Route>

        {/* 🏪 식당 업주 전용 라우트 - ROLE_OWNER */}
        <Route element={<ProtectedRoute requiredRole="ROLE_OWNER" />}>
          <Route path="/ownerpage" element={<MainLayout />}>
            <Route index element={<OwnerPage />} />
          </Route>
        </Route>

        {/* 👑 관리자 전용 라우트 - ROLE_ADMIN */}
        <Route element={<ProtectedRoute requiredRole="ROLE_ADMIN" />}></Route>

        {/* 404 페이지 */}
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
