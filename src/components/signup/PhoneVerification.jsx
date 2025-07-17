import React, { useState, useCallback, useEffect, forwardRef } from 'react';
import styles from '../../assets/styles/signup/PhoneVerification.module.css';
import FormInput from '../common/FormInput';
import FormButton from '../common/FormButton';
import { formatters } from '../../utils/formatters';
import { signupApi } from '../../api/signupApi';
import { showSuccessAlert, showErrorAlert } from "../../utils/sweetAlert";

/**
 * 휴대폰 인증 컴포넌트
 * - 휴대폰 중복 확인 및 SMS 인증 처리
 * - 타이머 기능으로 인증코드 유효시간 관리
 */
const PhoneVerification = forwardRef(({ 
    phone, 
    onChange, 
    onVerified, 
    error, 
    onErrorClear,
    phoneMessage,
    setPhoneMessage,
    verificationStatus,
    setVerificationStatus
}, ref) => {
    const [state, setState] = useState({
        verificationCode: '',
        isCodeSent: false,
        timeLeft: 0
    });
    
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState({});

    /** 인증코드 타이머 관리 */
    useEffect(() => {
        let timer;
        if (state.timeLeft > 0) {
            timer = setTimeout(() => {
                setState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
            }, 1000);
        } else if (state.timeLeft === 0 && state.isCodeSent) {
            setState(prev => ({ 
                ...prev, 
                isCodeSent: false, 
                verificationCode: '' 
            }));
        }
        return () => clearTimeout(timer);
    }, [state.timeLeft]);

    const updateState = useCallback((updates) => {
        setState(prev => ({ ...prev, ...updates }));
    }, []);

    /** 휴대폰 중복 확인 처리 */
    const handlePhoneCheck = useCallback(async () => {
        const cleanPhone = phone.replace(/-/g, '');

        if (!/^01[0-9]{8,9}$/.test(cleanPhone)) {
            setPhoneMessage({ type: 'error', text: '올바른 휴대폰번호를 입력해주세요' });
            showErrorAlert("휴대폰번호 오류", "올바른 휴대폰번호를 입력해주세요");
            return;
        }

        setLoading({ phone: true });
        setPhoneMessage({ type: '', text: '' });

        try {
            await signupApi.checkPhone(phone);

            setVerificationStatus(prev => ({
                ...prev,
                phoneChecked: true,
                phoneAvailable: true
            }));

            setPhoneMessage({ type: 'success', text: '사용 가능한 휴대폰번호입니다' });
            showSuccessAlert("중복확인 성공", "사용 가능한 휴대폰번호입니다");
            onErrorClear?.('phone');
        } catch (error) {
            let errorMessage = '이미 사용 중인 휴대폰번호입니다';

            if (error.response?.status === 409) {
                errorMessage = error.response.data?.errMsg || '이미 사용 중인 휴대폰번호입니다';
            } else if (error.response?.status === 400) {
                errorMessage = error.response.data?.errMsg || '올바르지 않은 휴대폰번호입니다';
            } else {
                errorMessage = '휴대폰번호 확인 중 오류가 발생했습니다';
            }

            setPhoneMessage({ type: 'error', text: errorMessage });
            showErrorAlert("중복확인 실패", errorMessage);
            setVerificationStatus(prev => ({
                ...prev,
                phoneChecked: false,
                phoneAvailable: false
            }));
        } finally {
            setLoading({});
        }
    }, [phone, setPhoneMessage, setVerificationStatus, onErrorClear]);

    /** SMS 인증코드 발송 */
    const handleSendCode = useCallback(async () => {
        if (!verificationStatus.phoneChecked || !verificationStatus.phoneAvailable) {
            setErrors({ sms: '휴대폰 중복확인을 먼저 완료해주세요' });
            return;
        }

        setLoading({ sms: true });
        try {
            // SMS 발송은 하이픈 제거해서 전송 (coolsms api 규칙)
            const cleanPhone = phone.replace(/-/g, '');
            await signupApi.sendSMS(cleanPhone);
            
            updateState({
                isCodeSent: true,
                timeLeft: 300
            });
            
            setErrors({});
            onErrorClear?.('phone');
            
        } catch (error) {
            const errorMessage = error.response?.data?.errMsg || '인증코드 발송에 실패했습니다';
            setErrors({ sms: errorMessage });
        } finally {
            setLoading({});
        }
    }, [phone, verificationStatus.phoneChecked, verificationStatus.phoneAvailable, onErrorClear, updateState]);

    /** SMS 인증코드 검증 */
    const handleVerifyCode = useCallback(async () => {
        if (!state.verificationCode.trim()) {
            setErrors({ code: '인증코드를 입력해주세요' });
            return;
        }

        setLoading({ verify: true });
        try { 
            const cleanPhone = phone.replace(/-/g, ''); //하이픈 제거
            await signupApi.verifySMS(cleanPhone, state.verificationCode);
                        
            updateState({
                isCodeSent: false,
                timeLeft: 0,
                verificationCode: ''
            });
            
            setVerificationStatus(prev => ({
                ...prev,
                phoneVerified: true
            }));
            
            setErrors({});
            setPhoneMessage({ type: 'success', text: '휴대폰 인증이 완료되었습니다' });
            onVerified(true);
            onErrorClear?.('phone');
            
        } catch (error) {
            const errorMessage = error.response?.data?.errMsg || '인증코드가 일치하지 않습니다';
            setErrors({ code: errorMessage });
            onVerified(false);
        } finally {
            setLoading({});
        }
    }, [phone, state.verificationCode, onVerified, onErrorClear, updateState, setVerificationStatus, setPhoneMessage]);

    /** 휴대폰번호 입력 변경 처리 */
    const handlePhoneChange = useCallback((e) => {
        const formattedValue = formatters.phone(e.target.value);
        
        onChange({
            target: { name: 'phone', value: formattedValue }
        });

        if (verificationStatus.phoneVerified || verificationStatus.phoneChecked) {
            setVerificationStatus(prev => ({
                ...prev,
                phoneVerified: false,
                phoneChecked: false,
                phoneAvailable: false
            }));
            onVerified(false);
            setPhoneMessage({ type: '', text: '' });
        }
        
        setErrors({});
    }, [onChange, onVerified, verificationStatus.phoneVerified, verificationStatus.phoneChecked, setVerificationStatus, setPhoneMessage]);

    /** 인증코드 입력 변경 처리 */
    const handleCodeChange = useCallback((e) => {
        updateState({ verificationCode: e.target.value });
        setErrors({ code: '' });
    }, [updateState]);

    const isLoading = Object.values(loading).some(Boolean);

    return (
        <div className={styles.container}>
            <div className={styles.inputGroup}>
                <FormInput
                    ref={ref}
                    name="phone"
                    type="tel"
                    placeholder="휴대폰번호를 입력해주세요"
                    value={phone}
                    onChange={handlePhoneChange}
                    error={!verificationStatus.phoneVerified && error}
                    disabled={verificationStatus.phoneVerified}
                />

                <FormButton
                    type="button"
                    variant="secondary"
                    size="small"
                    onClick={handlePhoneCheck}
                    disabled={verificationStatus.phoneVerified || isLoading || (verificationStatus.phoneChecked && verificationStatus.phoneAvailable)}
                    loading={loading.phone}
                    className={styles.checkButton}
                >
                    {verificationStatus.phoneChecked && verificationStatus.phoneAvailable ? '확인완료' : '중복확인'}
                </FormButton>

                <FormButton
                    type="button"
                    variant="secondary"
                    size="small"
                    onClick={handleSendCode}
                    disabled={verificationStatus.phoneVerified || isLoading || !verificationStatus.phoneChecked || !verificationStatus.phoneAvailable}
                    loading={loading.sms}
                    className={styles.sendButton}
                >
                    {state.isCodeSent ? '재발송' : '인증코드 발송'}
                </FormButton>
            </div>

            {/* 인증코드 입력란 */}
            {state.isCodeSent && (
                <div className={styles.inputGroup}>
                    <FormInput
                        name="verificationCode"
                        type="text"
                        placeholder="인증코드를 입력해주세요"
                        value={state.verificationCode}
                        onChange={handleCodeChange}
                        error={errors.code}
                    />
                    <FormButton
                        type="button"
                        variant="primary"
                        size="small"
                        onClick={handleVerifyCode}
                        disabled={isLoading}
                        loading={loading.verify}
                        className={styles.verifyButton}
                    >
                        인증확인
                    </FormButton>
                </div>
            )}

            {/* 타이머 표시 */}
            {state.isCodeSent && state.timeLeft > 0 && (
                <div className={styles.timerInfo}>
                    인증코드 유효시간: {formatters.time(state.timeLeft)}
                </div>
            )}

            {/* SMS 발송 에러 메시지 */}
            {errors.sms && (
                <div className={styles.errorMessage}>
                    {errors.sms}
                </div>
            )}
        </div>
    );
});

PhoneVerification.displayName = 'PhoneVerification';

export default PhoneVerification;