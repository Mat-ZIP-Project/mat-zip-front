import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from '../../assets/styles/pages/signup/Signup.module.css';
import ProgressBar from "../../components/signup/ProgressBar";
import UserTypeSelection from "./UserTypeSelection";
import TermsAgreement from "./TermsAgreement";
import UserSignupForm from "./UserSignupForm";
import OwnerSignupForm from "./OwnerSignupForm";
import BusinessVerification from "./BusinessVerification";
import RestaurantInfo from "./RestaurantInfo";



const SignupMain = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [userType, setUserType] = useState('');
    const [signupData, setSignupData] = useState({
        userInfo: {},
        businessInfo: {},
        restaurantInfo: {}
    });

    const totalSteps = {
        user: 3, // 유형선택 → 약관동의 → 회원가입폼
        owner: 5  // 유형선택 → 약관동의 → 기본정보 → 사업자검증 → 식당정보
    };

    const stepTitles = {
        user: ['사용자 유형 선택', '약관 동의', '회원 정보 입력'],
        owner: ['사용자 유형 선택', '약관 동의', '기본 정보 입력', '사업자 검증', '식당 정보 입력']
    };

    const handleNext = useCallback((data = {}) => {
        setSignupData(prev => ({
            ...prev,
            ...data
        }));
        setCurrentStep(prev => prev + 1);
    }, []);

    const handleBack = useCallback(() => {
        setCurrentStep(prev => prev - 1);
    }, []);

    const handleUserTypeSelect = useCallback((type) => {
        setUserType(type);
        setCurrentStep(2);
    }, []);

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return <UserTypeSelection onSelect={handleUserTypeSelect} />;
            case 2:
                return <TermsAgreement onNext={handleNext} onBack={handleBack} />;
            case 3:
                if (userType === 'user') {
                    return <UserSignupForm onNext={handleNext} onBack={handleBack} />;
                } else {
                    return <OwnerSignupForm onNext={handleNext} onBack={handleBack} />;
                }
            case 4:
                return <BusinessVerification onNext={handleNext} onBack={handleBack} signupData={signupData} />;
            case 5:
                return <RestaurantInfo onNext={handleNext} onBack={handleBack} signupData={signupData} />;
            default:
                return <UserTypeSelection onSelect={handleUserTypeSelect} />;
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <ProgressBar
                    currentStep={currentStep} 
                    totalSteps={totalSteps[userType] || 3}
                    stepTitles={stepTitles[userType] || stepTitles.user}
                />
                {renderCurrentStep()}
            </div>
        </div>
    );
};

export default SignupMain;