import React, { useCallback } from 'react';
import styles from '../../assets/styles/pages/signup/UserSignupForm.module.css'; // 수정: 기존 스타일 재사용
import FormInput from '../../components/common/FormInput';
import FormButton from '../../components/common/FormButton';
import PhoneVerification from '../../components/signup/PhoneVerification';
import { useSignupForm } from '../../hooks/useSignupForm';
import { useSignupValidation } from '../../hooks/useSignupValidation';

const OwnerSignupForm = ({ onNext, onBack, initialData = {} }) => {
    
    // 초기값으로 Hook 초기화
    const {
        formData, errors, setErrors,
        verificationStatus,
        setVerificationStatus,
        userIdMessage,
        setUserIdMessage,
        passwordMatch, inputRefs,
        handleErrorClear,
        handleInputChange,
        focusFirstErrorField
    } = useSignupForm(initialData);

    // 검증 Hook
    const { validateForm, handleUserIdCheck } = useSignupValidation(
        formData,
        verificationStatus,
        setErrors,
        setUserIdMessage,
        setVerificationStatus,
        focusFirstErrorField
    );

    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
        }
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        // 폼 데이터 다음 단계로 전달
        onNext({ 
            userInfo: {
                ...formData,
                phone: formData.phone.replace(/-/g, ''),
                role: 'ROLE_OWNER'
            }
        });
    }, [formData, validateForm, onNext]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>기본 정보 입력</h1>
            <p className={styles.subtitle}>사업자 인증을 위한 기본 정보를 입력해주세요</p>

            <form onSubmit={handleSubmit} className={styles.form} onKeyPress={handleKeyPress}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>아이디 *</label>
                    <div className={styles.inputGroup}>
                        <FormInput
                            ref={inputRefs.userId}
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

                    {userIdMessage.text && (
                        <div className={`${styles.idMessage} ${
                            userIdMessage.type === 'success' ? styles.success : styles.error
                        }`}>
                            {userIdMessage.type === 'success' && <span className={styles.checkIcon}>✓</span>}
                            {userIdMessage.text}
                        </div>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>비밀번호 *</label>
                    <FormInput
                        ref={inputRefs.password}
                        name="password" 
                        type="password"
                        placeholder="비밀번호를 입력해주세요"
                        value={formData.password}
                        onChange={handleInputChange}
                        error={errors.password}
                         autoComplete="new-password" 
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>비밀번호 확인 *</label>
                    <FormInput
                        ref={inputRefs.confirmPassword}
                        name="confirmPassword" 
                        type="password"
                        placeholder="비밀번호를 다시 입력해주세요"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        error={errors.confirmPassword}
                         autoComplete="new-password" 
                    />
                    {passwordMatch.message && !errors.confirmPassword && (
                        <div className={`${styles.passwordMatchMessage} ${
                            passwordMatch.isValid ? styles.valid : styles.invalid
                        }`}>
                            {passwordMatch.message}
                        </div>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>이름 *</label>
                    <FormInput
                        ref={inputRefs.name}
                        name="name" 
                        type="text"
                        placeholder="이름을 입력해주세요"
                        value={formData.name}
                        onChange={handleInputChange}
                        error={errors.name}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>휴대폰번호 *</label>
                    <PhoneVerification
                        ref={inputRefs.phone} 
                        phone={formData.phone}
                        onChange={handleInputChange}
                        onVerified={(verified) => setVerificationStatus(prev => ({ ...prev, phoneVerified: verified }))}
                        error={errors.phone}
                        onErrorClear={handleErrorClear}
                    />
                </div>

                {errors.general && (
                          <div className={styles.errorAlert}>{errors.general}</div>)}

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
                    >
                        다음 단계
                    </FormButton>
                </div>
            </form>
        </div>
    );
};

export default OwnerSignupForm;