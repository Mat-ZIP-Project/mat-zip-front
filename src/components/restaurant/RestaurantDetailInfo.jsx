import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addTempCourse } from "../../hooks/addTempCourse";
import axiosInstance from "../../api/axiosinstance";
import "../../assets/styles/restaurant/RestaurantDetailInfo.css";
import OcrModal from "../review/OcrModal";
import { showSuccessAlert, showErrorAlert } from "../../utils/sweetAlert";

const RestaurantDetailInfo = ({ data }) => {
  const {
    restaurantId,
    restaurantName,
    address,
    avgRating,
    avgRatingLocal,
    phone,
    category,
    openTime,
    closeTime,
  } = data;

  const [numPeople, setNumPeople] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showOcrModal, setShowOcrModal] = useState(false);

  const navigate = useNavigate();

  const handleNavigateToReservation = () => {
    navigate(`/restaurants/${restaurantId}/reservation`);
  };

  useEffect(() => {
    console.log("식당 데이터 확인:", data);
  }, [data]);

  // 웨이팅 등록 핸들러
  const handleWaiting = async () => {
    try {
      const requestDto = { restaurantId, numPeople };
      console.log("웨이팅 등록 요청 데이터:", requestDto);
      await axiosInstance.post("/api/waiting", requestDto);
      showSuccessAlert("웨이팅 등록이 완료되었습니다!", "");
      setShowModal(false);
      window.location.reload();
    } catch (err) {
      showErrorAlert("웨이팅 등록에 실패했습니다.", "");
      console.error("웨이팅 등록 에러:", err.response?.data);
    }
  };

  // 모달 열기
  const openWaitingModal = () => {
    setShowModal(true);
  };

  // 모달 닫기
  const closeWaitingModal = () => {
    setShowModal(false);
  };

  const handleAddToCourse = async () => {
    await addTempCourse({ restaurantId, restaurantName });
  };

  const handleReceiptReview = () => {
    showSuccessAlert("영수증 리뷰 기능은 준비 중입니다.", "");
  };

  return (
    <div className="restaurant-detail-info">
      <h1>{restaurantName}</h1>
      <p>📍 주소: {address}</p>
      <p>
        ⭐ 평점: {avgRating == null ? "정보 없음" : `${avgRating}점`} / 🏠 로컬
        평점: {avgRatingLocal == null ? "정보 없음" : `${avgRatingLocal}점`}
      </p>
      <p>🍽️ 카테고리: {category}</p>
      {phone && <p>📞 연락처: {phone}</p>}
      <div className="info-row">
        {typeof openTime === "string" && typeof closeTime === "string" ? (
          <p>
            🕒 영업시간: {openTime.slice(0, 5)} - {closeTime.slice(0, 5)}
          </p>
        ) : (
          <p>🕒 영업시간 정보 없음</p>
        )}
      </div>

      <div className="restaurant-detail-buttons">
        <button
          onClick={handleNavigateToReservation}
          className="restaurant-reservation-button"
        >
          예약하기
        </button>
        <button
          type="button"
          className="restaurant-waiting-button"
          onClick={openWaitingModal}
        >
          웨이팅하기
        </button>
        <button
          type="button"
          className="restaurant-course-button"
          onClick={handleAddToCourse}
        >
          ➕ 나만의 코스
        </button>
        <button
          type="button"
          className="restaurant-receipt-review-button"
          onClick={() => setShowOcrModal(true)}
        >
          영수증리뷰하기
        </button>
      </div>

      {/* 웨이팅 인원 선택 모달 */}
      {showModal && (
        <div className="waiting-modal">
          <div className="waiting-modal-content">
            <h3>웨이팅 인원 선택</h3>
            <input
              type="number"
              min="1"
              max="20"
              value={numPeople}
              onChange={(e) => setNumPeople(Number(e.target.value))}
              style={{ width: 60, marginRight: 8 }}
            />
            <button onClick={handleWaiting}>확인</button>
            <button onClick={closeWaitingModal} style={{ marginLeft: 8 }}>
              취소
            </button>
          </div>
        </div>
      )}
      {/* 영수증 ocr 모달 */}
      {showOcrModal && (
        <OcrModal onClose={() => setShowOcrModal(false)} restaurantId={restaurantId}/>
      )}

    </div>
  );
};

export default RestaurantDetailInfo;
