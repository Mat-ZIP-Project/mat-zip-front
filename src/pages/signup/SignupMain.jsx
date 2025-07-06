import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from '../../assets/styles/pages/signup/Signup.module.css';
import ProgressBar from "../../components/signup/ProgressBar";
import UserTypeSelection from "./UserTypeSelection";
import TermsAgreement from "./TermsAgreement";
import UserSignupForm from "./UserSignupForm";
import OwnerSignupForm from "./OwnerSignupForm";
import RestaurantInfo from "./RestaurantInfo";



const SignupMain = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [userType, setUserType] = useState('');
    const [signupData, setSignupData] = useState({
        userInfo: { userId: '', name: '', phone: '', },
        businessInfo: {},
        restaurantInfo: {}
    });

    // 민감정보 별도 관리 (세션 종료 시 자동 삭제)
    const [sensitiveData, setSensitiveData] = useState({
        password: '',
        confirmPassword: ''
    });

    const totalSteps = {
        user: 3, // 유형선택 → 약관동의 → 회원가입폼
        owner: 4  // 유형선택 → 약관동의 → 기본정보입력폼 → 사업자검증 → 식당정보
    };

    const stepTitles = {
        user: ['사용자 유형 선택', '약관 동의', '회원 정보 입력'],
        owner: ['사용자 유형 선택', '약관 동의', '회원 정보 입력', '식당 정보 입력']
    };

    const handleNext = useCallback((data = {}) => {
        // 일반 데이터 저장
        if (data.userInfo) {
            const { password, confirmPassword, ...safeUserInfo } = data.userInfo;
            
            setSignupData(prev => ({
                ...prev,
                userInfo: {
                    ...prev.userInfo,
                    ...safeUserInfo
                }
            }));
            
            // 민감 데이터 별도 저장 (임시)
            if (password || confirmPassword) {
                setSensitiveData({
                    password: password || '',
                    confirmPassword: confirmPassword || ''
                });
            }
        }
        
        // 기타 데이터 저장
        setSignupData(prev => ({
            ...prev,
            ...Object.fromEntries(
                Object.entries(data).filter(([key]) => key !== 'userInfo')
            )
        }));
        
        setCurrentStep(prev => prev + 1);
    }, []);

    const handleBack = useCallback(() => {
        // 수정: 뒤로가기 시 민감정보 제거 (선택사항)
        if (currentStep === 4) { // 식당정보 -> 기본정보로 돌아갈 때
            setSensitiveData({ password: '', confirmPassword: '' });
        }
        
        setCurrentStep(prev => prev - 1);
    }, [currentStep]);

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
                    // 수정: 안전한 데이터만 전달, 민감정보 병합
                    const combinedData = {
                        ...signupData.userInfo,
                        ...sensitiveData
                    };
                    return (
                        <OwnerSignupForm 
                            onNext={handleNext} 
                            onBack={handleBack}
                            initialData={combinedData} // 추가: 초기값 전달
                        />
                    );
                }
            case 4:
                // 수정: 최종 제출 시 모든 데이터 병합
                const finalSignupData = {
                    ...signupData,
                    userInfo: {
                        ...signupData.userInfo,
                        ...sensitiveData
                    }
                };
                return (
                    <RestaurantInfo 
                        onNext={handleNext} 
                        onBack={handleBack} 
                        signupData={finalSignupData}
                    />
                );
            default:
                return <UserTypeSelection onSelect={handleUserTypeSelect} />;
        }
    };

    // 추가: 컴포넌트 언마운트 시 민감정보 정리
    useEffect(() => {
        return () => {
            setSensitiveData({ password: '', confirmPassword: '' });
        };
    }, []);

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