import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../api/axiosinstance";
import RestaurantDetailInfo from "../../components/restaurant/RestaurantDetailInfo";
import TabMenu from "../../components/restaurant/TabMenu";
import OcrModal from "../../components/review/OcrModal";
import ReviewForm from "../review/ReviewForm";
import RestaurantReviewList from "../../components/restaurant/RestaurantReviewList";
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

  useEffect(() => {
    fetch(`/api/waiting/status/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setWaitingInfo({
          count: data.waitingCount,
          estimatedTime: data.expectedEntryTime,
        });
      })
      .catch(() => setWaitingInfo(null));
  }, [id]);

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
  }, [id]);

  if (loading) return <p>로딩 중...</p>;
  if (!restaurant) return <p>식당 정보를 표시할 수 없습니다.</p>;

  return (
    <div className="restaurant-detail-page">
      {restaurant.thumbnailImageUrl ? (
        <img
          src={restaurant.thumbnailImageUrl}
          alt={restaurant.restaurantName}
          className="restaurant-detail-image"
        />
      ) : (
        <div className="restaurant-detail-image placeholder">
          <span>식당 이미지</span>
        </div>
      )}

      <RestaurantDetailInfo data={restaurant} />

      {/* 버튼 영역을 TabMenu 위에 둘 경우 여기에 추가 */}

      <TabMenu activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="restaurant-tab-content">
        {activeTab === "home" && (
          <div className="waiting-section">
            <div className="waiting-header">
              <h2>실시간 식당 웨이팅 </h2>
              <button
                className="waiting-refresh-btn"
                onClick={() => window.location.reload()}
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
          </div>
        )}
        {activeTab === "menu" && (
          <div>
            <h2>메뉴</h2>
            <p>메뉴 리스트가 여기에 표시됩니다.</p>
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
        {activeTab === "localReview" && (
          <div>
            <h2>로컬 리뷰</h2>
            <p>로컬 리뷰가 여기에 표시됩니다.</p>
          </div>
        )}
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
