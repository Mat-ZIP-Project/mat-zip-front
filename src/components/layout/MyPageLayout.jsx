import React from "react";
import { Outlet } from "react-router-dom";
import MainFooter from "../common/MainFooter";
import "../../assets/styles/common/DefaultLayout.css";
import MyPageHeader from "../common/MyPageHeader";

const MyPageLayout = () => {
  return (
    <div className="default-layout">
      <MyPageHeader />
      <main className="AppMain">
        <Outlet /> {/* 자식 라우트 렌더링 */}
      </main>
      <MainFooter />
    </div>
  );
};

export default MyPageLayout;
