import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";

import MainLayout from "./components/layout/MainLayout";
import AuthLayout from "./components/layout/AuthLayout";

import Home from "./pages/Home";
import Login from "./pages/login/Login";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Owner from "./pages/owner/Owner";
import NotFound from "./pages/NotFound";
import MyPageTest from "./pages/MyPageTest";
import SearchMapPage from "./pages/searchMap/SearchMapPage";
import TempCoursePage from "./pages/customCourse/TempCoursePage";
import MyCourseListPage from "./pages/customCourse/MyCourseListPage";
import CourseDetailPage from "./pages/customCourse/CourseDetailPage";
import LocalAuthPage from "./pages/localAuth/LocalAuthPage";
import ReservationPopup from "./components/reservation/ReservationPopup";


function App() {
  // <Link
  //         to="/reservation"
  //         style={{
  //           textDecoration: "none",
  //           color: "blue",
  //           border: "1px solid black",
  //         }}
  //       >
  //         예약하기
  //       </Link>

  return (
    <div className="App">
      <Routes>
        {/* 메인 레이아웃 그룹(메인푸터/헤더 사용) - 로그인 불필요 */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
        </Route>

        {/* 로그인관련 레이아웃 그룹(로그인용 푸터/헤더 사용) - 로그인 불필요 */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          {/*   <Route path="/find-id" element={<FindId />} />
                <Route path="/auth/find-password" element={<FindPassword />} /> */}
          <Route path="/nearby" element={<SearchMapPage />} />
        </Route>

        {/* 🛡️ 일반 사용자 라우트 - 로그인 필요 */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/mypage" element={<MyPageTest />} />
            <Route path="/courses" element={<TempCoursePage />} />
            <Route path="/my-courses" element={<MyCourseListPage />} />
            <Route
              path="/course/custom/details/:courseId"
              element={<CourseDetailPage />}
            />
            <Route path="/local-auth" element={<LocalAuthPage />} />
            <Route path="/reservation" element={<ReservationPopup />} />
          </Route>
        </Route>

        {/* 🏪 식당 업주 전용 라우트 - ROLE_OWNER */}
        <Route element={<ProtectedRoute requiredRole="ROLE_OWNER" />}>
          <Route path="/owner" element={<MainLayout />}>
            <Route index element={<Owner />} />
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
