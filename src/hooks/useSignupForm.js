import { useState, useCallback, useRef } from 'react';

export const useSignupForm = (initialFormData = {}) => {
    // 기본 필드 + 추가 필드 (initialFormData)
    const defaultFormData = {
        userId: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: '',
        ...initialFormData
    };

    const inputRefs = {
        userId: useRef(null),
        password: useRef(null),
        confirmPassword: useRef(null),
        name: useRef(null),
        phone: useRef(null),
    };

    const [formData, setFormData] = useState(defaultFormData);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState({
        userIdChecked: false,
        userIdAvailable: false,
        phoneVerified: false
    });

    // 아이디 검증용
    const [userIdMessage, setUserIdMessage] = useState({
        type: '',
        text: ''
    });

    // 비밀번호 검증용
    const [passwordMatch, setPasswordMatch] = useState({
        isValid: false,
        message: ''
    });

    // 에러 제거 함수
    const handleErrorClear = useCallback((fieldName) => {
        setErrors(prev => ({
            ...prev,
            [fieldName]: ''
        }));
    }, []);

    // 포커스 함수 (상단 부터 포커싱)
    const focusFirstErrorField = useCallback((errors, fieldOrder = ['userId', 'password', 'confirmPassword', 'name', 'phone']) => {
        for (const field of fieldOrder) {
            if (errors[field] && inputRefs[field]?.current) {
                inputRefs[field].current.focus();
                break;
            }
        }
    }, []);

    // 기본 입력값 변경 핸들러
    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // 에러 제거
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // 아이디 변경 시 검증 상태 초기화
        if (name === 'userId') {
            setVerificationStatus(prev => ({
                ...prev,
                userIdChecked: false,
                userIdAvailable: false
            }));
            setUserIdMessage({ type: '', text: '' });
        }

        // 비밀번호 확인 실시간 검증
        if (name === 'confirmPassword' || name === 'password') {
            const currentPassword = name === 'password' ? value : formData.password;
            const currentConfirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword;
            
            if (name === 'confirmPassword' && errors.confirmPassword) {
                setErrors(prev => ({
                    ...prev,
                    confirmPassword: ''
                }));
            }

            if (currentConfirmPassword) {
                if (currentPassword === currentConfirmPassword) {
                    setPasswordMatch({
                        isValid: true,
                        message: '비밀번호가 일치합니다'
                    });
                } else {
                    setPasswordMatch({
                        isValid: false,
                        message: '비밀번호가 일치하지 않습니다'
                    });
                }
            } else {
                setPasswordMatch({
                    isValid: false,
                    message: ''
                });
            }
        }
    }, [errors, formData.password, formData.confirmPassword]);

    return {
        //상태값
        formData, setFormData,
        errors, setErrors,
        isLoading, setIsLoading,
        verificationStatus, setVerificationStatus,
        userIdMessage, setUserIdMessage,
        passwordMatch, inputRefs,
        // 함수
        handleErrorClear,
        handleInputChange,
        focusFirstErrorField
    };
};