import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import BestSection from "../components/main/BestSection";
import styles from "../assets/styles/common/Home.module.css";
import axiosInstance from "../api/axiosinstance";
import mainBannerList from "../data/mainBannerList";
import Carousel from "../components/common/Carousel";
import CategoryList from "../components/main/CategoryList";
import AdCarousel from "../components/main/AdCarousel";

const PAGE_CHUNK = 3;    // 한 번에 불러올 갯수
const TOTAL_ITEMS = 20;  // 전체 갯수

const Home = () => {
  const [top3, setTop3] = useState([]);
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState([]);

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


   // 1. 선호 카테고리 top3 - 초기 3 + prefetch 17
  useEffect(() => {
    if (isAuthenticated) {
      axiosInstance.get("/mypage/preference")
        .then(res => {
          const arr = res.data.preferenceCategory?.split(",") || [];
          setPreferences(arr.slice(0, PAGE_CHUNK));
        })
        .catch(() => setPreferences([]));
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

  // 2. 로컬 맛집 top (로컬 평점 순) - 초기 3 + prefetch 17
  const [localLoaded, setLocalLoaded]     = useState([]);
  const [localPrefetch, setLocalPrefetch] = useState([]);

  useEffect(() => {
    // 초기 3개 로드
    axiosInstance.get("/api/restaurants", { params: { sortBy: "avgRatingLocal", size: PAGE_CHUNK, offset: 0 } })
      .then(res => setLocalLoaded(res.data.map(item => ({
        id: item.restaurantId,
        name: item.restaurantName,
        rating: item.avgRatingLocal,
        localRating: item.avgRatingLocal,
        categories: [item.category],
        img: item.thumbnailImageUrl || "/default.jpg",
        isLiked: item.isLiked,
      }))));
    // 백그라운드로 나머지 17개
    axiosInstance.get("/api/restaurants", { params: { sortBy: "avgRatingLocal", size: TOTAL_ITEMS - PAGE_CHUNK, offset: PAGE_CHUNK } })
      .then(res => setLocalPrefetch(res.data.map(item => ({
        id: item.restaurantId,
        name: item.restaurantName,
        rating: item.avgRatingLocal,
        localRating: item.avgRatingLocal,
        categories: [item.category],
        img: item.thumbnailImageUrl || "/default.jpg",
        isLiked: item.isLiked,
      }))));
  }, []);

  const loadMoreLocal = () => {
    if (!localPrefetch.length) return;
    const next = localPrefetch.slice(0, PAGE_CHUNK);
    setLocalLoaded(prev => [...prev, ...next]);
    setLocalPrefetch(prev => prev.slice(PAGE_CHUNK));
  };

  

  // 3. 실시간 인기 맛집 top3 (예약 많은 순) - 초기 3 + prefetch 17
  const [popLoaded, setPopLoaded]     = useState([]);
  const [popPrefetch, setPopPrefetch] = useState([]);

  useEffect(() => {
    axiosInstance.get("/api/restaurants", { params: { sortBy: "reservationCount", size: PAGE_CHUNK, offset: 0 } })
      .then(res => setPopLoaded(res.data.map(item => ({
        id: item.restaurantId,
        name: item.restaurantName,
        rating: item.avgRating,
        localRating: item.avgRatingLocal,
        categories: [item.category],
        img: item.thumbnailImageUrl || "/default.jpg",
      }))));
    axiosInstance.get("/api/restaurants", { params: { sortBy: "reservationCount", size: TOTAL_ITEMS - PAGE_CHUNK, offset: PAGE_CHUNK } })
      .then(res => setPopPrefetch(res.data.map(item => ({
        id: item.restaurantId,
        name: item.restaurantName,
        rating: item.avgRating,
        localRating: item.avgRatingLocal,
        categories: [item.category],
        img: item.thumbnailImageUrl || "/default.jpg",
      }))));
  }, []);

  const loadMorePop = () => {
    if (!popPrefetch.length) return;
    const next = popPrefetch.slice(0, PAGE_CHUNK);
    setPopLoaded(prev => [...prev, ...next]);
    setPopPrefetch(prev => prev.slice(PAGE_CHUNK));
  };

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
          items={localLoaded}
          loadMore={loadMoreLocal}
          hasMore={localPrefetch.length > 0}
        />
      </section>
    )}

     <BestSection className = {styles.sectionSpacing}
        title="우리 동네 로컬 맛집"
        subtitle="지역 주민의 생생한 리뷰로 검증된 믿을 수 있는 맛집만 모았어요"
        link="/restaurants?sortBy=avgRatingLocal"
        items={localLoaded}
        loadMore={loadMoreLocal}
        hasMore={localPrefetch.length > 0}
      />

     <AdCarousel />
     
     <BestSection className = {styles.sectionSpacing}
        title="실시간 인기 맛집 BEST"
        subtitle="실시간 인기 폭발! 모두가 사랑하는 맛집을 만나보세요."
        link="/restaurants?sortBy=reservationCount"
        items={popLoaded}
        loadMore={loadMorePop}
        hasMore={popPrefetch.length > 0}
      />
    </div>
  );
};

export default Home;