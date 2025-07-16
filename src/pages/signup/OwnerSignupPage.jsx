import React, { useCallback } from 'react';
import styles from '../../assets/styles/pages/signup/UserSignupPage.module.css';
import FormInput from '../../components/common/FormInput';
import FormButton from '../../components/common/FormButton';
import PhoneVerification from '../../components/signup/PhoneVerification';
import { useSignupForm } from '../../hooks/useSignupForm';
import { signupApi } from '../../api/signupApi';
import ProgressBar from '../../components/signup/ProgressBar';

/**
 * 식당 업주 기본정보 입력 페이지
 * - 사업자 회원가입을 위한 기본 정보 수집 (일반회원과 동일)
 * - 식당 정보 입력페이지(다음 단계) 로 데이터 전달
 */
const passwordValid = (pw) => {
  const lengthValid = pw.length >= 10;
  const types = [
    /[A-Z]/.test(pw),
    /[a-z]/.test(pw),
    /[0-9]/.test(pw),
    /[^A-Za-z0-9]/.test(pw),
  ];
  const typeCount = types.filter(Boolean).length;
  return lengthValid && typeCount >= 2;
};

const OwnerSignupForm = ({ onNext, onBack, initialData = {} }) => {
    
    // 업주 회원가입용 폼 상태 관리
    const {
        formData, errors, setErrors,
        verificationStatus, setVerificationStatus,
        userIdMessage, setUserIdMessage,
        messages, setMessages,
        passwordMatch, inputRefs,
        handleErrorClear,
        handleInputChange,
        validateForm
    } = useSignupForm(initialData, {
        userType: 'owner',
        validationFields: ['userId', 'password', 'confirmPassword', 'name', 'phone'],
        enableVerification: true
    });

    /** 아이디 중복 확인 처리 */
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
            await signupApi.checkUserId(formData.userId);
            
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

    /** 엔터키 제출 방지 */
    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
        }
    }, []);

    /** 다음 단계로 데이터 전달 */
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        
        // 폼 검증
        if (!validateForm()) return;

        // 검증 통과 시 다음 단계로 데이터 전달
        onNext({ 
            userInfo: {
                ...formData,
                phone: formData.phone.replace(/-/g, ''), // 하이픈 제거
                role: 'ROLE_OWNER'
            }
        });
    }, [formData, validateForm, onNext]);

    const [pwValid, setPwValid] = React.useState(false);

    const handleInputChangeWithPw = (e) => {
        handleInputChange(e);
        if (e.target.name === 'password') setPwValid(passwordValid(e.target.value));
    };

    return (
      <div className={styles.container}>
        <h1 className={styles.title}>기본 정보 입력</h1>
        <p className={styles.subtitle}>회원가입을 위한 기본 정보를 입력해주세요</p>
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

                  {/* 아이디 중복확인 결과 표시 */}
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
                      onChange={handleInputChangeWithPw}
                      error={errors.password}
                      autoComplete="new-password" 
                  />
                  <div
                      className={
                        formData.password
                          ? pwValid
                            ? styles.pwMessageValid
                            : styles.pwMessageError
                          : ''
                      }
                    >
                      {formData.password && (
                        pwValid ? (
                          <>
                            <span className={styles.checkIcon}>✔</span>
                            최소 10자리, 영문 대소문자/숫자/특수문자 중 2종류 이상 조합해야 합니다.
                          </>
                        ) : (
                          <>최소 10자리, 영문 대소문자/숫자/특수문자 중 2종류 이상 조합해야 합니다.</>
                        )
                      )}
                    </div>
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
                  {/* 비밀번호 일치 여부 실시간 표시 */}
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
                      setPhoneMessage={(message) => setMessages(prev => ({ ...prev, phone: message }))}
                      verificationStatus={verificationStatus}
                      setVerificationStatus={setVerificationStatus}
                  />
                  
                  {/* 휴대폰 중복확인/인증완료 메시지 */}
                  {messages.phone.text && (
                      <div className={`${styles.idMessage} ${
                          messages.phone.type === 'success' ? styles.success : styles.error
                      }`}>
                          {messages.phone.type === 'success' && <span className={styles.checkIcon}>✓</span>}
                          {messages.phone.text}
                      </div>
                  )}
              </div>

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