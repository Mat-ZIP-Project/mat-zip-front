import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import BestSection from "../components/common/BestSection";
import styles from "../assets/styles/common/Home.module.css";
import axiosInstance from "../api/axiosinstance";
import mainBannerList from "../data/mainBannerList";
import Carousel from "../components/common/Carousel";
import CategoryList from "../components/common/CategoryList";

const Home = () => {
  const [top3, setTop3] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const navigate = useNavigate();
  
  // userInfo에서 preferences 안전하게 꺼내기
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
  // const preferences = userInfo.preferenceCategory
  // ? userInfo.preferenceCategory.split(",")
  // : [];
  const [popularBest, setPopularBest] = useState([]);
  const [localBest, setLocalBest] = useState([]);

  // 디버깅용 콘솔
   console.log('isAuthenticated:', isAuthenticated);
   console.log('preferences:', preferences);


   // 1. 선호 카테고리 top3
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

  useEffect(() => {
  if (isAuthenticated && preferences.length > 0) {
    axiosInstance
      .get("/api/restaurants", {
        params: {
          category: preferences,
          size: 20,  //가져올 식당수
        },
      })
      .then((res) => {
        const mapped = res.data.slice(0, 3).map((item) => ({
          id: item.restaurantId,
          name: item.restaurantName,
          rating: item.avgRating,
          localRating: item.avgRatingLocal,
          categories: [item.category],
          img: item.thumbnailImageUrl || "/default.jpg",
        }));
        setTop3(mapped);
      })
      .catch(() => {
        setTop3([]);
      });
  } else {
    setTop3([]);
  }
}, [isAuthenticated, preferences.join(",")]);

// 2. 로컬 맛집 top (로컬 평점 순)
  useEffect(() => {
  axiosInstance
    .get("/api/restaurants", {
      params: { sortBy: "avgRatingLocal", size: 20 },
    })
    .then((res) => {
      const mapped = res.data.slice(0, 3).map((item) => ({
        id: item.restaurantId,
        name: item.restaurantName,
        rating: item.avgRatingLocal, 
        localRating: item.avgRatingLocal,
        categories: [item.category],
        img: item.thumbnailImageUrl || "/default.jpg",
        isLiked: item.isLiked,
      }));
      setLocalBest(mapped);
    })
    .catch(() => {
      setLocalBest([]);
    });
}, []);

  // 3. 실시간 인기 맛집 top3 (예약 많은 순)
  useEffect(() => {
    axiosInstance
      .get("/api/restaurants", {
        params: { sortBy: "reservationCount", size: 20 },
      })
      .then((res) => {
        const mapped = res.data.slice(0, 3).map((item) => ({
          id: item.restaurantId,
          name: item.restaurantName,
          rating: item.avgRating,
          localRating: item.avgRatingLocal,
          categories: [item.category],
          img: item.thumbnailImageUrl || "/default.jpg",
        }));
        setPopularBest(mapped);
      })
      .catch(() => {
        setPopularBest([]);
      });
  }, []);

  return (
    <div className={styles.mainContainer}>
      {/* 배너 */}
        <Carousel
          items={mainBannerList}
          width={580} height={280}
          showText={true}
          autoSlide={true}
          showIndex={true}
          />

      {/* 카테고리 */}
      <CategoryList />

      
{isAuthenticated && preferences.length > 0 && (
  <section className={styles.preferenceSection}>
    <BestSection
      className={styles.sectionSpacing}
      title={`${userInfo.name}님이 좋아할 ${preferences.join(", ")} 맛집`}
      subtitle={`"${preferences.join(", ")}"를 좋아하는 ${userInfo.name}님을 위한 추천`}
      link={`/restaurants?${preferences
        .map((cat) => `category=${encodeURIComponent(cat)}`)
        .join("&")}`}
      items={top3}
    />
  </section>
)}

     <BestSection className = {styles.sectionSpacing}
        title="우리 동네 로컬 맛집"
        subtitle="지역 주민의 생생한 리뷰로 검증된 믿을 수 있는 맛집만 모았어요"
        link="/restaurants?sortBy=avgRatingLocal"
        items={localBest}
      />

     <BestSection className = {styles.sectionSpacing}
        title="실시간 인기 맛집 BEST"
        subtitle="실시간 인기 폭발! 모두가 사랑하는 맛집을 만나보세요."
        link="/restaurants?sortBy=reservationCount"
        items={popularBest}
      />
    </div>
  );
};

export default Home;