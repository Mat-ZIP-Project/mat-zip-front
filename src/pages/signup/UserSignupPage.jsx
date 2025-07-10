import React, { useCallback } from "react";
import styles from "../../assets/styles/pages/signup/UserSignupPage.module.css";
import FormInput from "../../components/common/FormInput";
import FormButton from "../../components/common/FormButton";
import PhoneVerification from "../../components/signup/PhoneVerification";
import PreferenceCategorySelector from "../../components/signup/PreferenceCategorySelector";
import { useSignupForm } from "../../hooks/useSignupForm";
import { useSignupValidation } from "../../hooks/useSignupValidation";
import { signupApi } from "../../api/signupApi";
import { useNavigate } from "react-router-dom";
import { showSuccessAlert } from "../../utils/sweetAlert";

/**
 * 일반 회원 회원가입 페이지
 */
const UserSignupPage = ({ onBack }) => {
  const navigate = useNavigate();

  // 회원가입 폼 상태 관리 훅
  const {
    formData, setFormData,
    errors, setErrors,
    isLoading, setIsLoading,
    verificationStatus, setVerificationStatus,
    userIdMessage, setUserIdMessage,
    messages, setMessages,
    passwordMatch, inputRefs,
    handleErrorClear,
    handleInputChange,
    focusFirstErrorField,
  } = useSignupForm({
    preferenceCategory: "",
  }, {
    userType: 'user',
    validationFields: ['userId', 'password', 'confirmPassword', 'name', 'phone'],
    enableVerification: true
  });

  // 검증 로직 훅
  const { validateForm, handleUserIdCheck } = useSignupValidation(
    formData,
    verificationStatus,
    setErrors,
    setUserIdMessage,
    setVerificationStatus,
    focusFirstErrorField
  );

  /** 선호 카테고리 변경 처리 (최대 2개 선택) */
  const handleCategoryChange = useCallback(
    (category) => {
      setFormData((prev) => {
        const currentCategories = prev.preferenceCategory
          ? prev.preferenceCategory.split(",")
          : [];
        let newCategories;

        if (currentCategories.includes(category)) {
          // 이미 선택된 카테고리면 제거
          newCategories = currentCategories.filter((c) => c !== category);
        } else if (currentCategories.length < 2) {
          // 최대 2개까지만 추가
          newCategories = [...currentCategories, category];
        } else {
          return prev;
        }
        return {
          ...prev,
          preferenceCategory: newCategories.join(","),
        };});
    }, [setFormData]);

  /** 엔터키 제출 방지 */
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  /** 회원가입 폼 제출 처리 */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // 폼 검증 실행
      if (!validateForm()) return;

      setIsLoading(true);
      try {
        // 회원가입 데이터 준비
        const signupData = {
          ...formData,
          phone: formData.phone.replace(/-/g, ''), // 하이픈 제거
          termsAgreed: true,
          privacyAgreed: true,
          role: "ROLE_USER",
        };

        await signupApi.signupUser(signupData);

        await showSuccessAlert( '회원가입 완료!', '회원가입이 성공적으로 완료되었습니다.' );

        navigate("/");

      } catch (error) {
        const errorMessage =
          error.response?.data?.errMsg || "회원가입에 실패했습니다";
        setErrors({ general: errorMessage });
      } finally {
        setIsLoading(false);
      }}, [formData, validateForm, setIsLoading, setErrors, navigate]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>회원 정보 입력</h1>
      <p className={styles.subtitle}>서비스 이용을 위한 기본 정보를 입력해주세요</p>

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

          {/* 아이디 중복확인 결과 메시지 */}
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
          />
          {/* 비밀번호 일치 여부 실시간 표시 */}
          {passwordMatch.message && !errors.confirmPassword && (
            <div className={`${styles.passwordMatchMessage} ${passwordMatch.isValid ? styles.valid : styles.invalid}`}>
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
                phoneMessage={messages.phone}
                setPhoneMessage={(message) => setMessages(prev => ({ ...prev, phone: message }))}
                verificationStatus={verificationStatus}
                setVerificationStatus={setVerificationStatus}
          />
          
          {messages.phone.text && (
            <div className={`${styles.idMessage} ${
              messages.phone.type === 'success' ? styles.success : styles.error
            }`}>
              {messages.phone.type === 'success' && <span className={styles.checkIcon}>✓</span>}
              {messages.phone.text}
            </div>
          )}
        </div>

        <PreferenceCategorySelector
            selectedCategories={formData.preferenceCategory} 
            onCategoryChange={handleCategoryChange} 
            maxSelection={2}
        />

        {/* 전체 에러 메시지 */}
        {errors.general && (
          <div className={styles.errorAlert}>{errors.general}</div>
        )}

        <div className={styles.buttonContainer}>
          <FormButton type="button" variant="secondary" onClick={onBack}>
            이전
          </FormButton>
          <FormButton type="submit" variant="primary" loading={isLoading}>
            회원가입
          </FormButton>
        </div>
      </form>
    </div>
  );
};

export default UserSignupPage;