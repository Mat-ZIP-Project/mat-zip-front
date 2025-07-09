import React from "react";
import { Outlet } from "react-router-dom";
import AuthFooter from "../common/MainFooter";
import "../../assets/styles/common/DefaultLayout.css";
import MyPageHeader from "../common/MyPageHeader";

const MyPageLayout = () => {
  return (
    <div className="default-layout">
      <MyPageHeader />
      <main className="AppMain auth-main">
        <Outlet /> {/* 자식 라우트 렌더링 */}
      </main>
      <AuthFooter />
    </div>
  );
};

export default MyPageLayout;
