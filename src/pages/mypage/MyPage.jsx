import React, { useCallback, useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ReservationList from "../../components/myPage/ReservationList";
import ReviewList from "../../components/myPage/ReviewList";
import "../../assets/styles/pages/myPage/myPage.css";
import axiosInstance from "../../api/axiosinstance";

import mukzzangImage from "../../assets/images/먹짱.png";
import silverImage from "../../assets/images/실버.png";
import bronzeImage from "../../assets/images/브론즈.png";
import sproutImage from "../../assets/images/새싹.png";
import defaultUserImage from "../../assets/images/새싹.png";
import RestaurantLike from "../../components/myPage/RestaurantLike";

import PreferenceCategorySelector from "../../components/signup/PreferenceCategorySelector";

// 등급별 이미지 맵 정의
const gradeImages = {
  먹짱: mukzzangImage,
  실버: silverImage,
  브론즈: bronzeImage,
  새싹: sproutImage,
};

const MyPage = () => {
  // const { userInfo } = useSelector((state) => state.auth);
  const [userForm, setUserForm] = useState([]);
  const [userImage, setUserImage] = useState(defaultUserImage);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("restaurantLikes");

  // 사용자 선호도 : 이 값이 true이면 선호도 선택 컴포넌트가 나타난다.
  // 선호도 편집 모달의 표시 여부
  const [showPreferenceModal, setShowPreferenceModal] = useState(false);
  // 모달에서 현재 선택 중인 선호 카테고리 (쉼표로 구분된 문자열)
  const [tempSelectedPreferences, setTempSelectedPreferences] = useState("");
  // 서버에서 불러온 원래 선호 카테고리 (수정 완료 후 업데이트, 취소 시 되돌리기용)
  const [userPreferences, setUserPreferences] = useState("");

  useEffect(() => {
    const userInfo = async () => {
      try {
        const response = await axiosInstance.get("/auth/user-info");
        setUserForm(response.data);
        console.log("사용자 정보: ", response.data);
        const imageToSet = gradeImages[response.data.userGrade] || defaultUserImage;
        setUserImage(imageToSet);

        // 사용자 선호도 정보 설정
        const userPreference = response.data.preferenceCategory || "";
        setUserPreferences(userPreference);
        setTempSelectedPreferences(userPreference);

      } catch (error) {
        console.error("사용자 정보를 가져오지 못했습니다: ", error);
        setUserImage(defaultUserImage);
        setUserPreferences("");
        setTempSelectedPreferences("");
      }
    };
    userInfo();
  }, []);

  // 현지인 인증 페이지로 이동
  const handleLocalAuth = () => {
    navigate("/local-auth");
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  // 내역들
  const renderActiveTabComponent = () => {
    switch (activeTab) {
      case "restaurantLikes":
        return <RestaurantLike />;
      case "reservations":
        return <ReservationList />;
      case "reviews":
        return <ReviewList />;
      default:
        return <RestaurantLike />;
    }
  };

  // 툴팁(팝업) 표시 상태를 관리하는 state
  const [showTooltip, setShowTooltip] = useState(false);
  // 툴팁(팝업) 표시 상태를 관리하는 state
  const [showPointTooltip, setShowPointTooltip] = useState(false);

  // 등급 설명을 저장할 객체
  const gradeDescriptions = {
    '새싹' : "기본 사용자 등급",
    "브론즈" : "동네 인증 3번 이상 시 부여",
    "실버" : "3000포인트 이상 보유 시 부여",
    "먹짱" : "10000포인트 이상 보유 시 부여",
  };

  const pointDescriptions = {
    "":"예약 시 150포인트 적립",
  };

  const openPreferenceModal = () => {
    setTempSelectedPreferences(userPreferences);
    setShowPreferenceModal(true);
  }

  const handleCategoryChangeInModal = useCallback((category) => {
    setTempSelectedPreferences(prevSelected => {
      const selectedArray = prevSelected ? prevSelected.split(',') : [];

      if (selectedArray.includes(category)) {
        return selectedArray.filter(c => c !== category).join(',');
      } else {
        if (selectedArray.length < 2) {
          return [...selectedArray, category].join(',');
        }
        return prevSelected; // 최대 2개까지만 선택 가능
      }
    });
  },[])

  const handleSavePreferences = async () => {
    try {
      if (tempSelectedPreferences === userPreferences) {
        setShowPreferenceModal(false);
        return;
      }

      // 서버로 보낼 데이터 준비: 쉼표로 구분된 문자열 또는 빈 문자열
      const preferencesToSend = tempSelectedPreferences.split(',').filter(p => p !== '').join(',');
      const payload = {
          preferenceCategory: preferencesToSend,
      };

      const response = await axiosInstance.post("/mypage/update/preference", payload);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("선호 카테고리 업데이트에 실패했습니다.");
      }
      console.log("선호 카테고리 업데이트 성공:", response.data);

      setUserPreferences(tempSelectedPreferences);
      setShowPreferenceModal(false);

    } catch (error) {
      console.error("선호 카테고리 업데이트 중 오류 발생:", error);
    }
  };

  const handleCancelEdit = () => {
    setShowPreferenceModal(false);
  };

  return (
    <div className="my-page-container">
      <div className="user-info-container">
        <img
          src={userImage}
          alt="사용자 등급 이미지"
          className="user-profile-image" /* 클래스명 변경 */
        />
        <div className="user-details-group">
          {" "}
          {/* 사용자 정보 텍스트 그룹 */}
          <div className="user-id-text">{userForm.userId}님</div>{" "}
          {/* 클래스명 변경 */}
          <div className="user-grade-text">
            <span 
              className="grade-display-info"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              ⓘ
              {showTooltip && (
              <div className="user-grade-tooltip">
                {Object.entries(gradeDescriptions).map(([grade, description]) => (
                  <p key={grade}>
                    <strong>{grade}</strong>: {description}
                  </p>
                ))}
              </div>
             )}
            </span>
            등급 : {userForm.userGrade}
          </div>
          {/* 클래스명 변경 */}
          <div className="user-point-balance">
            <span 
              className="grade-display-info"
              onMouseEnter={() => setShowPointTooltip(true)}
              onMouseLeave={() => setShowPointTooltip(false)}
            >
              ⓘ 
              {showPointTooltip && (
              <div className="user-grade-tooltip">
                {Object.entries(pointDescriptions).map(([point, description]) => (
                  <p key={point}>
                    <strong>{point}</strong>: {description}
                  </p>
                ))}
              </div>
             )}
            </span>
            포인트 잔액 : {userForm.pointBalance}
          </div>{" "}
          {/* 클래스명 변경 */}
        </div>
        <div className="user-actions-group">
          {/* '선호도 수정' 버튼은 항상 표시 */}
          <button
            onClick={openPreferenceModal} // 모달 열기 함수 호출
            className="profile-edit-btn" 
          >
            선호도 수정
          </button>
          <button onClick={handleLocalAuth} className="local-auth-btn">
            {" "}
            {/* 클래스명 변경 */}
            동네 인증
          </button>
        </div>
      </div>

      <div className="main-tabs">
        <span
          onClick={() => handleTabClick("restaurantLikes")}
          className={`tab-item ${activeTab === "restaurantLikes" ? "active" : ""}`}
        >
          식당 찜 내역
        </span>
        <span
          onClick={() => handleTabClick("reservations")}
          className={`tab-item ${activeTab === "reservations" ? "active" : ""}`}
        >
          예약 내역
        </span>
        <span
          onClick={() => handleTabClick("reviews")}
          className={`tab-item ${activeTab === "reviews" ? "active" : ""}`}
        >
          리뷰 내역
        </span>
      </div>

      <div className="tab-content">{renderActiveTabComponent()}</div>
      {/* --- 선호도 수정 모달 --- */}
      {showPreferenceModal && (
        <div className="modal-overlay">
          <div className="preference-modal-content">
            <h2>선호 카테고리 수정</h2>
            <PreferenceCategorySelector
              selectedCategories={tempSelectedPreferences} // 모달 내 임시 상태 사용
              onCategoryChange={handleCategoryChangeInModal} // 모달 내 변경 핸들러 사용
              maxSelection={2}
            />
            <div className="modal-actions">
              <button onClick={handleSavePreferences} className="modal-save-btn">
                수정 완료
              </button>
              <button onClick={handleCancelEdit} className="modal-cancel-btn">
                취소
              </button>
            </div>
          </div>
        </div>
      )}
      {/* --- 선호도 수정 모달 끝 --- */}
    </div>
  );
};

export default MyPage;
