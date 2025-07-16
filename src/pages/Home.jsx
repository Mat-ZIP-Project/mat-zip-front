import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosinstance";
import BestSection from "../components/common/BestSection";
import Carousel from "../components/common/Carousel";
import CategoryList from "../components/common/CategoryList";
import mainBannerList from "../data/mainBannerList";
import styles from "../assets/styles/common/Home.module.css";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);

  const [preferences, setPreferences] = useState([]);
  const [top3, setTop3] = useState([]);
  const [localBest, setLocalBest] = useState([]);
  const [popularBest, setPopularBest] = useState([]);

  /** 🟡 유저 선호 카테고리 가져오기 */
  useEffect(() => {
    if (isAuthenticated) {
      axiosInstance
        .get("/mypage/preference")
        .then((res) => {
          const prefStr = res.data.preferenceCategory || "";
          setPreferences(prefStr ? prefStr.split(",") : []);
        })
        .catch(() => setPreferences([]));
    } else {
      setPreferences([]);
    }
  }, [isAuthenticated]);

  /** 🔵 선호 카테고리 기반 추천 (3개만) */
  useEffect(() => {
    if (isAuthenticated && preferences.length > 0) {
      axiosInstance
        .get("/api/restaurants/recommend/category")
        .then((res) => {
          const mapped = res.data.slice(0, 3).map((item) => ({
            id: item.restaurantId,
            name: item.restaurantName,
            rating: item.avgRating,
            localRating: item.avgRatingLocal,
            categories: [item.category],
            img: item.imageUrl || "/default.jpg",
          }));
          setTop3(mapped);
        })
        .catch(() => setTop3([]));
    } else {
      setTop3([]);
    }
  }, [isAuthenticated, preferences.join(",")]);

  /** 🔴 로컬 평점 기반 추천 */
  useEffect(() => {
    axiosInstance
      .get("/api/restaurants/recommend/local")
      .then((res) => {
        const mapped = res.data.slice(0, 3).map((item) => ({
          id: item.restaurantId,
          name: item.restaurantName,
          rating: item.avgRatingLocal,
          localRating: item.avgRatingLocal,
          categories: [item.category],
          img: item.imageUrl || "/default.jpg",
        }));
        setLocalBest(mapped);
      })
      .catch(() => setLocalBest([]));
  }, []);

  /** 🟠 예약 기반 인기 추천 */
  useEffect(() => {
    axiosInstance
      .get("/api/restaurants/recommend/popular")
      .then((res) => {
        const mapped = res.data.slice(0, 3).map((item) => ({
          id: item.restaurantId,
          name: item.restaurantName,
          rating: item.avgRating,
          localRating: item.avgRatingLocal,
          categories: [item.category],
          img: item.imageUrl || "/default.jpg",
        }));
        setPopularBest(mapped);
      })
      .catch(() => setPopularBest([]));
  }, []);

  return (
    <div className={styles.mainContainer}>
      {/* 📌 메인 배너 */}
      <Carousel
        items={mainBannerList}
        width={580}
        height={280}
        showText={true}
        autoSlide={true}
        showIndex={true}
      />

      {/* 📌 카테고리 */}
      <CategoryList />

      {/* 🟡 사용자 맞춤 추천 */}
      {isAuthenticated && preferences.length > 0 && (
        <section className={styles.preferenceSection}>
          <BestSection
            className={styles.sectionSpacing}
            title={`${userInfo.name}님이 좋아할 ${preferences.join(", ")} 맛집`}
            subtitle={`"${preferences.join(", ")}"를 좋아하는 ${userInfo.name}님을 위한 추천`}
            link={`/restaurants?${preferences
              .map((cat) => `category=${encodeURIComponent(cat)}`)
              .join("&")}&size=20`}
            items={top3}
          />
        </section>
      )}

      {/* 🔴 로컬 베스트 */}
      <BestSection
        className={styles.sectionSpacing}
        title="우리 동네 로컬 맛집"
        subtitle="지역 주민이 인정한 진짜 맛집만 모았어요"
        link="/restaurants?sortBy=avgRatingLocal&size=20"
        items={localBest}
      />

      {/* 🟠 실시간 인기 맛집 */}
      <BestSection
        className={styles.sectionSpacing}
        title="실시간 인기 맛집"
        subtitle="지금 가장 핫한 매장을 만나보세요"
        link="/restaurants?sortBy=reservationCount&size=20"
        items={popularBest}
      />
    </div>
  );
};

export default Home;
