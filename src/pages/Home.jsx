import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import BestSection from "../components/common/BestSection";
import styles from "../assets/styles/common/Home.module.css";
import axiosInstance from "../api/axiosinstance";
import mainBannerList from "../data/mainBannerList";
import Carousel from "../components/common/Carousel";
import CategoryList from "../components/common/CategoryList";

const categories = [
  { name: "한식", value: "한식" },
  { name: "중식", value: "중식" },
  { name: "일식", value: "일식" },
  { name: "양식", value: "양식" },
  { name: "카페", value: "카페" },
];

const localBest = [
  { id: 1, name: "로컬맛집A", category: "한식", img: "/img1.jpg" },
  { id: 2, name: "로컬맛집B", category: "중식", img: "/img2.jpg" },
  { id: 3, name: "로컬맛집C", category: "양식", img: "/img3.jpg" },
];
const popularBest = [
  { id: 4, name: "맛집A", img: "/img4.jpg" },
  { id: 5, name: "맛집B", img: "/img5.jpg" },
  { id: 6, name: "맛집C", img: "/img6.jpg" },
];

const Home = () => {
  const [top3, setTop3] = useState([]);
  const navigate = useNavigate();
  // userInfo에서 preferences 안전하게 꺼내기
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
  // const preferences = userInfo?.preferences || [];
  const [popularBest, setPopularBest] = useState([]);
  const [localBest, setLocalBest] = useState([]);

  // 디버깅용 콘솔
  //  console.log('isAuthenticated:', isAuthenticated);
  //  console.log('preferences:', preferences);

  // 임시 테스트용
  const preferences = ["한식", "중식"];

   // 1. 선호 카테고리 top3
  useEffect(() => {
    if (isAuthenticated && preferences.length > 0) {
      axiosInstance
        .get("/api/restaurants", {
          params: {
            category: preferences,
            size: 3,
          },
        })
        .then((res) => {
          const mapped = res.data.slice(0, 3).map((item) => ({
            id: item.restaurantId,
            name: item.restaurantName,
            rating: item.avgRating,
            categories: [item.category],
            img: item.thumbnailImageUrl || "/default.jpg",
          }));
          setTop3(mapped);
        })
        .catch(() => {
          setTop3([]);
        });
    }
  }, [isAuthenticated, preferences.join(",")]);

  useEffect(() => {
  axiosInstance
    .get("/api/restaurants", {
      params: { sortBy: "avgRatingLocal", size: 3 },
    })
    .then((res) => {
      const mapped = res.data.slice(0, 3).map((item) => ({
        id: item.restaurantId,
        name: item.restaurantName,
        rating: item.avgRatingLocal, 
        categories: [item.category],
        img: item.thumbnailImageUrl || "/default.jpg",
      }));
      setLocalBest(mapped);
    })
    .catch(() => {
      setLocalBest([]);
    });
}, []);

  // 2. 실시간 인기 맛집 top3 (예약 많은 순)
  useEffect(() => {
    axiosInstance
      .get("/api/restaurants", {
        params: { sortBy: "reservationCount", size: 3 },
      })
      .then((res) => {
        const mapped = res.data.slice(0, 3).map((item) => ({
          id: item.restaurantId,
          name: item.restaurantName,
          rating: item.avgRating,
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
          <BestSection className = {styles.sectionSpacing}
            title="고객님이 좋아할 매장"
            subtitle="마음에 들 만한 곳을 모아봤어요"
            link={`/restaurants?${preferences
              .map((cat) => `category=${encodeURIComponent(cat)}`)
              .join("&")}`}
            items={top3}
          />
        </section>
      )}

     <BestSection className = {styles.sectionSpacing}
        title="우리 동네 로컬 맛집"
        subtitle="지역 주민이 인정한 진짜 맛집만 모았어요"
        link="/restaurants?sortBy=avgRatingLocal"
        items={localBest}
      />

     <BestSection className = {styles.sectionSpacing}
        title="실시간 인기 맛집"
        subtitle="지금 가장 핫한 매장을 만나보세요"
        link="/restaurants?sortBy=reservationCount"
        items={popularBest}
      />
    </div>
  );
};

export default Home;