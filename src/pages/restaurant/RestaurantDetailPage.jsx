import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../api/axiosinstance";
import RestaurantDetailInfo from "../../components/restaurant/RestaurantDetailInfo";
import TabMenu from "../../components/restaurant/TabMenu";
import OcrModal from "../../components/review/OcrModal";
import ReviewForm from "../review/ReviewForm";
import RestaurantReviewList from "../../components/restaurant/RestaurantReviewList";
import MenuListView from "../../components/owner/MenuListView";
import Carousel from "../../components/common/Carousel";
import "../../assets/styles/restaurant/RestaurantDetailPage.css";

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [waitingInfo, setWaitingInfo] = useState(null);
  const [showOcrModal, setShowOcrModal] = useState(false);
  const [reviewFormData, setReviewFormData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [localReviews, setLocalReviews] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasLocalBadge, setHasLocalBadge] = useState(false);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await axiosInstance.get(`/api/restaurants/${id}`);
        setRestaurant(res.data);
      } catch (error) {
        console.error("식당 정보를 불러오지 못했습니다.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  // 웨이팅 정보 fetch 함수 분리
  const fetchWaitingInfo = () => {
    fetch(`/api/waiting/status/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`웨이팅 정보 조회 실패: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setWaitingInfo({
          count: data.waitingCount,
          estimatedTime: data.expectedEntryTime,
        });
      })
      .catch((error) => {
        console.warn("웨이팅 정보 에러", error.message);
        setWaitingInfo(null);
      });
  };

useEffect(() => {
    fetchWaitingInfo();
  }, [id]);

  useEffect(() => {
    fetchWaitingInfo();
  }, [id]);


  useEffect(() => {
    // 로그인 여부 확인
    axiosInstance.get('/auth/user-info')
      .then(res => {
        setIsLoggedIn(true);
        // 뱃지 정보 요청
        return axiosInstance.get('/local/badges');
      })
      .then(res => {
        // 뱃지 1개 이상 있으면 true
        setHasLocalBadge(res.data && res.data.length > 0);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setHasLocalBadge(false);
      });
  }, []);

  const handleOcrModalClose = () => setShowOcrModal(false);
  const handleOcrToReview = (ocrResult) => {
    setReviewFormData({
      restaurantId: ocrResult.restaurantId,
      visitDate: ocrResult.visitDate,
      restaurantName: ocrResult.restaurantName,
    });
    setShowOcrModal(false);
    setActiveTab("reviewForm");
  };

  useEffect(() => {
    if (!id) return;

    // 기존 일반 리뷰
    axiosInstance
      .get(`/api/restaurants/${id}/reviews`)
      .then((res) => {
        const mapped = res.data.map((r) => ({
          id: r.reviewId,
          writerName: r.userNickname,
          createdAt: r.reviewedAt?.slice(0, 10),
          content: r.content,
          images: r.imageUrls,
          rating: r.rating,
        }));
        setReviews(mapped);
      })
      .catch(() => setReviews([]));

    // 👉 로컬 리뷰 추가 fetch
    axiosInstance
      .get(`/api/restaurants/${id}/reviews?localOnly=true`)
      .then((res) => {
        console.log("로컬 리뷰 데이터:", res.data);
        const mapped = res.data.map((r) => ({
          id: r.reviewId,
          writerName: r.userNickname,
          createdAt: r.reviewedAt?.slice(0, 10),
          content: r.content,
          images: r.imageUrls,
          rating: r.rating,
          localReview: true,
        }));
        setLocalReviews(mapped);
      })
      .catch(() => setLocalReviews([]));
  }, [id]);


  if (loading) return <p>로딩 중...</p>;
  if (!restaurant) return <p>식당 정보를 표시할 수 없습니다.</p>;

  // 캐러셀
  const carouselItems =
    restaurant.imageUrls && restaurant.imageUrls.length > 0
      ? restaurant.imageUrls.map((url) => ({ imgUrl: url }))
      : [];

  return (
    <div className="restaurant-detail-page">
      {carouselItems.length > 0 ? (
        <Carousel
          items={carouselItems}
          width={570}
          height={320}
          showText={false}
        />
      ) : (
        <div className="restaurant-detail-image placeholder">
          <span>식당 이미지 준비중</span>
        </div>
      )}

      <RestaurantDetailInfo data={restaurant} />

      <TabMenu
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showLocalReviewTab={isLoggedIn && hasLocalBadge}
      />


      <div className="restaurant-tab-content">
        {activeTab === "home" && (
          <div className="waiting-section">
            <div className="waiting-header">
              <h2>실시간 식당 웨이팅 </h2>
              <button
                className="waiting-refresh-btn"
                onClick={fetchWaitingInfo} // 전체 새로고침 대신 이 함수만 실행!
              >
                새로고침 <span className="refresh-icon">⟳</span>
              </button>
            </div>
            {waitingInfo ? (
              waitingInfo.count > 0 ? (
                <div className="waiting-status-card">
                  <span className="waiting-badge">매장</span>
                  <span className="waiting-title">매장 식사</span>
                  <span className="waiting-count">{waitingInfo.count}팀</span>
                </div>
              ) : (
                <div className="waiting-status-card">
                  <span className="waiting-badge">매장</span>
                  <span className="waiting-title">현재 웨이팅이 없습니다.</span>
                </div>
              )
            ) : (
              <div className="waiting-status-card">
                <span className="waiting-title">웨이팅 정보가 없습니다.</span>
              </div>
            )}
            {/* 상세 설명 박스는 홈 탭에 계속 노출 */}
            {restaurant.descript && (
              <div className="restaurant-descript-box">
                <h3>식당 상세 정보</h3>
                <p>{restaurant.descript}</p>
              </div>
            )}
          </div>
        )}
        {activeTab === "menu" && (
          <div className="menu-section">
            <MenuListView menus={restaurant.menus || []} showButtons={false} />
          </div>
        )}
        {activeTab === "review" && (
          <div>
            <RestaurantReviewList reviews={reviews} />
          </div>
        )}
        {activeTab === "reviewForm" && reviewFormData && (
          <ReviewForm
            restaurantId={reviewFormData.restaurantId}
            visitDate={reviewFormData.visitDate}
            restaurantName={reviewFormData.restaurantName}
          />
        )}
        {activeTab === "localReview" && !hasLocalBadge ? (
          <div className="local-review-blocked">
            {/* 첫 번째 리뷰만 보여줌 */}
            {localReviews.length > 0 && (
              <RestaurantReviewList reviews={[localReviews[0]]} />
            )}
            <div className="local-review-block-message">
              <p>더 많은 로컬 리뷰가 보고 싶다면 인증 뱃지를 획득하세요 ~</p>
            </div>
          </div>
        ) : activeTab === "localReview" && hasLocalBadge ? (
          <div>
            <RestaurantReviewList reviews={localReviews} />
          </div>
        ) : null}
      </div>

      {showOcrModal && (
        <OcrModal
          onClose={handleOcrModalClose}
          onOcrComplete={handleOcrToReview}
        />
      )}
    </div>
  );
};

export default RestaurantDetailPage;