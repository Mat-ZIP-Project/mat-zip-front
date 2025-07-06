import React, { useState, useCallback } from 'react';
import styles from '../../assets/styles/pages/signup/UserSignupForm.module.css';
import FormInput from '../../components/login/FormInput';
import FormButton from '../../components/login/FormButton';
import PhoneVerification from '../../components/signup/PhoneVerification';
import axiosInstance from '../../api/axiosinstance';

const UserSignupForm = ({ onNext, onBack }) => {
    const [formData, setFormData] = useState({
        userId: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: '',
        preferenceCategory: ''
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState({
        userIdChecked: false,
        userIdAvailable: false,
        phoneVerified: false
    });

    // 비밀번호 일치 여부
    const [passwordMatch, setPasswordMatch] = useState({
        isValid: false,
        message: ''
    });

    const categories = ['한식', '중식', '일식', '양식', '카페'];

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        if (name === 'userId') {
            setVerificationStatus(prev => ({
                ...prev,
                userIdChecked: false,
                userIdAvailable: false
            }));
        }

        // 비밀번호 확인 실시간 검증
        if (name === 'confirmPassword' || name === 'password') {
            const currentPassword = name === 'password' ? value : formData.password;
            const currentConfirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword;
            
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

    const handleCategoryChange = useCallback((category) => {
        setFormData(prev => {
            const currentCategories = prev.preferenceCategory ? prev.preferenceCategory.split(',') : [];
            let newCategories;

            if (currentCategories.includes(category)) {
                newCategories = currentCategories.filter(c => c !== category);
            } else if (currentCategories.length < 2) {
                newCategories = [...currentCategories, category];
            } else {
                return prev;
            }

            return {
                ...prev,
                preferenceCategory: newCategories.join(',')
            };
        });
    }, []);

    const validateForm = useCallback(() => {
        const newErrors = {};

        if (!formData.userId.trim()) {
            newErrors.userId = '아이디를 입력해주세요';
        } else if (!/^[a-zA-Z0-9]{4,20}$/.test(formData.userId)) {
            newErrors.userId = '아이디는 4-20자의 영문, 숫자만 사용 가능합니다';
        }

        if (!formData.password) {
            newErrors.password = '비밀번호를 입력해주세요';
        } else if (!/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) {
            newErrors.password = '비밀번호는 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
        }

        if (!formData.name.trim()) {
            newErrors.name = '이름을 입력해주세요';
        } else if (!/^[가-힣a-zA-Z\s]{2,20}$/.test(formData.name)) {
            newErrors.name = '이름은 2-20자의 한글, 영문만 사용 가능합니다';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = '휴대폰번호를 입력해주세요';
        } else if (!/^01[0-9]{8,9}$/.test(formData.phone.replace(/-/g, ''))) {
            newErrors.phone = '올바른 휴대폰번호를 입력해주세요';
        }

        if (!verificationStatus.userIdChecked || !verificationStatus.userIdAvailable) {
            newErrors.userId = '아이디 중복확인을 해주세요';
        }

        if (!verificationStatus.phoneVerified) {
            newErrors.phone = '휴대폰 인증을 완료해주세요';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData, verificationStatus]);

    const handleUserIdCheck = useCallback(async () => {
        if (!formData.userId.trim()) {
            setErrors(prev => ({ ...prev, userId: '아이디를 입력해주세요' }));
            return;
        }

        if (!/^[a-zA-Z0-9]{4,20}$/.test(formData.userId)) {
            setErrors(prev => ({ ...prev, userId: '아이디는 4-20자의 영문, 숫자만 사용 가능합니다' }));
            return;
        }

        try {
            await axiosInstance.post('/signup/check/userid', { userId: formData.userId });
            setVerificationStatus(prev => ({ 
                ...prev, 
                userIdChecked: true,
                userIdAvailable: true
            }));
            setErrors(prev => ({ ...prev, userId: '' }));
        } catch (error) {
            const errorMessage = error.response?.data?.errMsg || '이미 사용 중인 아이디입니다';
            setErrors(prev => ({ ...prev, userId: errorMessage }));
            setVerificationStatus(prev => ({ 
                ...prev, 
                userIdChecked: false,
                userIdAvailable: false
            }));
        }
    }, [formData.userId]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const signupData = {
                ...formData,
                phone: formData.phone.replace(/-/g, ''),
                termsAgreed: true,
                privacyAgreed: true,
                role: 'ROLE_USER'
            };

            await axiosInstance.post('/signup/user', signupData);
            alert('회원가입이 완료되었습니다!');
            onNext({ success: true });
        } catch (error) {
            const errorMessage = error.response?.data?.errMsg || '회원가입에 실패했습니다';
            setErrors({ general: errorMessage });
        } finally {
            setIsLoading(false);
        }
    }, [formData, validateForm, onNext]);

    const selectedCategories = formData.preferenceCategory ? formData.preferenceCategory.split(',') : [];

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>회원 정보 입력</h1>
            <p className={styles.subtitle}>서비스 이용을 위한 기본 정보를 입력해주세요</p>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>아이디</label>
                    <div className={styles.inputGroup}>
                        <FormInput
                            name="userId"
                            type="text"
                            placeholder="아이디를 입력해주세요"
                            value={formData.userId}
                            onChange={handleInputChange}
                            error={errors.userId}
                        />
                        <FormButton
                            type="button"
                            variant="secondary"
                            size="small"
                            onClick={handleUserIdCheck}
                            className={styles.checkButton}
                        >
                            중복확인
                        </FormButton>
                    </div>

                    {verificationStatus.userIdAvailable && (
                        <div className={styles.successMessage}>
                            <span className={styles.checkIcon}>✓</span>
                            사용 가능한 아이디입니다
                        </div>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>비밀번호</label>
                    <FormInput
                        name="password"
                        type="password"
                        placeholder="비밀번호를 입력해주세요"
                        value={formData.password}
                        onChange={handleInputChange}
                        error={errors.password}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>비밀번호 확인</label>
                    <FormInput
                        name="confirmPassword"
                        type="password"
                        placeholder="비밀번호를 다시 입력해주세요"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        error={errors.confirmPassword}
                    />
                    {passwordMatch.message && (
                        <div className={`${styles.passwordMatchMessage} ${
                            passwordMatch.isValid ? styles.valid : styles.invalid
                        }`}>
                            {passwordMatch.message}
                        </div>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>이름</label>
                    <FormInput
                        name="name"
                        type="text"
                        placeholder="이름을 입력해주세요"
                        value={formData.name}
                        onChange={handleInputChange}
                        error={errors.name}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>휴대폰번호</label>
                    <PhoneVerification
                        phone={formData.phone}
                        onChange={handleInputChange}
                        onVerified={(verified) => setVerificationStatus(prev => ({ ...prev, phoneVerified: verified }))}
                        error={errors.phone}
                    />
                </div>

                <div className={styles.categorySection}>
                    <label className={styles.categoryLabel}>
                        선호 음식 카테고리 <span className={styles.optional}>(선택, 최대 2개)</span>
                    </label>
                    <div className={styles.categoryGrid}>
                        {categories.map(category => (
                            <button
                                key={category}
                                type="button"
                                className={`${styles.categoryButton} ${
                                    selectedCategories.includes(category) ? styles.selected : ''
                                }`}
                                onClick={() => handleCategoryChange(category)}
                                disabled={!selectedCategories.includes(category) && selectedCategories.length >= 2}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {errors.general && (
                    <div className={styles.errorAlert}>
                        {errors.general}
                    </div>
                )}

                <div className={styles.buttonContainer}>
                    <FormButton
                        type="button"
                        variant="secondary"
                        onClick={onBack}
                    >
                        이전
                    </FormButton>
                    <FormButton
                        type="submit"
                        variant="primary"
                        loading={isLoading}
                    >
                        회원가입
                    </FormButton>
                </div>
            </form>
        </div>
    );
};

export default UserSignupForm;