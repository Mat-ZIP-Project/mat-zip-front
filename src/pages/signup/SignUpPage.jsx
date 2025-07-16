import { useState, useCallback, useEffect } from "react";
import styles from "../../assets/styles/pages/signup/SignupPage.module.css";
import ProgressBar from "../../components/signup/ProgressBar";
import TypeSelectionPage from "./TypeSelectionPage";
import TermsAgreementPage from "./TermsAgreementPage";
import UserSignupPage from "./UserSignupPage";
import OwnerSignupPage from "./OwnerSignupPage";
import ResiterRestaurantPage from "./ResiterRestaurantPage";

const SignUpPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userType, setUserType] = useState("");
  const [signupData, setSignupData] = useState({
    userInfo: { userId: "", name: "", phone: "" },
    businessInfo: {},
    restaurantInfo: {},
  });

  // 민감정보 별도 관리 (세션 종료 시 자동 삭제)
  const [sensitiveData, setSensitiveData] = useState({
    password: "",
    confirmPassword: "",
  });

  const totalSteps = {
    user: 3, // 유형선택 → 약관동의 → 회원가입폼
    owner: 4, // 유형선택 → 약관동의 → 기본정보입력폼 → 사업자검증 → 식당정보
  };

  const stepTitles = {
    user: ["사용자 유형 선택", "약관 동의", "회원 정보 입력"],
    owner: [
      "사용자 유형 선택",
      "약관 동의",
      "회원 정보 입력",
      "식당 정보 입력",
    ],
  };

  const handleNext = useCallback((data = {}) => {
    // 일반 데이터 저장
    if (data.userInfo) {
      const { password, confirmPassword, ...safeUserInfo } = data.userInfo;

      setSignupData((prev) => ({
        ...prev,
        userInfo: {
          ...prev.userInfo,
          ...safeUserInfo,
        },
      }));

      // 비밀번호 데이터 별도 저장 (임시)
      if (password || confirmPassword) {
        setSensitiveData({
          password: password || "",
          confirmPassword: confirmPassword || "",
        });
      }
    }

    // 기타 데이터 저장
    setSignupData((prev) => ({
      ...prev,
      ...Object.fromEntries(
        Object.entries(data).filter(([key]) => key !== "userInfo")
      ),
    }));

    setCurrentStep((prev) => prev + 1);
  }, []);

  const handleBack = useCallback(() => {
    // 뒤로가기 시 입력한 비밀번호 제거
    if (currentStep === 4) {
      // 식당정보 -> 기본정보로 돌아갈 때
      setSensitiveData({ password: "", confirmPassword: "" });
    }

    setCurrentStep((prev) => prev - 1);
  }, [currentStep]);

  const handleUserTypeSelect = useCallback((type) => {
    setUserType(type);
    setCurrentStep(2);
  }, []);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <TypeSelectionPage onSelect={handleUserTypeSelect} />;
      case 2:
        return <TermsAgreementPage onNext={handleNext} onBack={handleBack} />;
      case 3:
        if (userType === "user") {
          return <UserSignupPage onNext={handleNext} onBack={handleBack} />;
        } else {
          const combinedData = {
            ...signupData.userInfo,
            ...sensitiveData,
          };
          return (
            <OwnerSignupPage
              onNext={handleNext}
              onBack={handleBack}
              initialData={combinedData}
            />
          );
        }
      case 4: {
        // 최종 제출 시 모든 데이터 병합
        const finalSignupData = {
          ...signupData,
          userInfo: {
            ...signupData.userInfo,
            ...sensitiveData,
          },
        };
        return (
          <ResiterRestaurantPage
            onNext={handleNext}
            onBack={handleBack}
            signupData={finalSignupData}
          />
        );
      }
      default:
        return <TypeSelectionPage onSelect={handleUserTypeSelect} />;
    }
  };

  // 컴포넌트 언마운트 시 민감정보 정리(비밀번호)
  useEffect(() => {
    return () => {
      setSensitiveData({ password: "", confirmPassword: "" });
    };
  }, []);

  return (
    <div className={styles.page}>
      <ProgressBar
        currentStep={currentStep}
        totalSteps={totalSteps[userType] || 3}
        stepTitles={stepTitles[userType] || stepTitles.user}
      />
      <div className={styles.container}>
        <div className={styles["step-content"]}>{renderCurrentStep()}</div>
      </div>
    </div>
  );
};

export default SignUpPage;
