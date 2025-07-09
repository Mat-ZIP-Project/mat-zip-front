import { useCallback } from 'react';
import axiosInstance from '../api/axiosinstance';

export const useSignupValidation = (
    formData, 
    verificationStatus, 
    setErrors, 
    setUserIdMessage, 
    setVerificationStatus, 
    focusFirstErrorField = {}
) => {
    
    //  기본 검증 로직
    const validateForm = useCallback(() => {
        const newErrors = {};

        // 1. 아이디 검증
        if (!formData.userId.trim()) {
            newErrors.userId = '아이디를 입력해주세요';
        } else if (!/^[a-zA-Z0-9]{4,20}$/.test(formData.userId)) {
            newErrors.userId = '아이디는 4-20자의 영문, 숫자만 사용 가능합니다';
        } else if (!verificationStatus.userIdChecked || !verificationStatus.userIdAvailable) {
            newErrors.userId = '아이디 중복확인을 해주세요';
        }

        // 2. 비밀번호 검증
        if (!formData.password) {
            newErrors.password = '비밀번호를 입력해주세요';
        } else if (formData.password.length < 10) {
            newErrors.password = '비밀번호는 10자 이상이어야 합니다';
        } else {
            const hasUpperCase = /[A-Z]/.test(formData.password);
            const hasLowerCase = /[a-z]/.test(formData.password);
            const hasNumbers = /\d/.test(formData.password);
            const hasSpecialChar = /[@$!%*?&]/.test(formData.password);
            
            const typesCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
            
            if (typesCount < 2) {
                newErrors.password = '비밀번호는 영문 대문자, 소문자, 숫자, 특수문자 중 2종류 이상 조합해야 합니다';
            }
        }

        // 3. 비밀번호 확인 검증
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = '비밀번호 확인을 입력해주세요';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
        }

        // 4. 이름 검증
        if (!formData.name.trim()) {
            newErrors.name = '이름을 입력해주세요';
        } else if (!/^[가-힣a-zA-Z\s]{2,20}$/.test(formData.name)) {
            newErrors.name = '이름은 2-20자의 한글, 영문만 사용 가능합니다';
        }

        // 5. 휴대폰 검증
        if (!formData.phone.trim()) {
            newErrors.phone = '휴대폰번호를 입력해주세요';
        } else if (!/^01[0-9]{8,9}$/.test(formData.phone.replace(/-/g, ''))) {
            newErrors.phone = '올바른 휴대폰번호를 입력해주세요';
        } else if (!verificationStatus.phoneVerified) {
            newErrors.phone = '휴대폰 인증을 완료해주세요';
        }

        setErrors(newErrors);
        // 검증 실패 시 우선순위에 따라 포커싱
        if (Object.keys(newErrors).length > 0) {
            const focusOrder = ['userId', 'password', 'confirmPassword', 'name', 'phone'];
            setTimeout(() => focusFirstErrorField(newErrors, focusOrder), 100);
            return false;
        }
        
        return true;
    }, [formData, verificationStatus, setErrors, focusFirstErrorField]);

    // 아이디 중복 확인
    const handleUserIdCheck = useCallback(async () => {
        if (!formData.userId.trim()) {
            setUserIdMessage({ type: 'error', text: '아이디를 입력해주세요' });
            return;
        }

        if (!/^[a-zA-Z0-9]{4,20}$/.test(formData.userId)) {
            setUserIdMessage({ type: 'error', text: '아이디는 4-20자의 영문, 숫자만 사용 가능합니다' });
            return;
        }

        try {
            await axiosInstance.post('/signup/check/userid', { userId: formData.userId });
            setVerificationStatus(prev => ({ 
                ...prev, 
                userIdChecked: true,
                userIdAvailable: true
            }));
            setUserIdMessage({ type: 'success', text: '사용 가능한 아이디입니다' });
            setErrors(prev => ({ ...prev, userId: '' }));
        } catch (error) {
            const errorMessage = error.response?.data?.errMsg || '이미 사용 중인 아이디입니다';
            setUserIdMessage({ type: 'error', text: errorMessage });
            setVerificationStatus(prev => ({ 
                ...prev, 
                userIdChecked: false,
                userIdAvailable: false
            }));
        }
    }, [formData.userId, setUserIdMessage, setVerificationStatus, setErrors]);

    return {
        validateForm,
        handleUserIdCheck
    };
};