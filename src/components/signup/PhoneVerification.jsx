import React, { useState, useCallback, useEffect, forwardRef } from 'react'; // 수정: forwardRef 추가
import styles from '../../assets/styles/signup/PhoneVerification.module.css';
import axiosInstance from '../../api/axiosinstance';
import FormInput from '../../components/login/FormInput';
import FormButton from '../../components/login/FormButton';

// 수정: forwardRef로 래핑
const PhoneVerification = forwardRef(({ phone, onChange, onVerified, error, onErrorClear }, ref) => {
    const [verificationCode, setVerificationCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let timer;
        if (timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        } else if (timeLeft === 0 && isCodeSent) {
            setIsCodeSent(false);
            setVerificationCode('');
        }
        return () => clearTimeout(timer);
    }, [timeLeft, isCodeSent]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSendCode = useCallback(async () => {
        if (!phone || !/^01[0-9]{8,9}$/.test(phone.replace(/-/g, ''))) {
            setErrors({ phone: '올바른 휴대폰번호를 입력해주세요' });
            return;
        }

        setIsLoading(true);
        try {
            await axiosInstance.post('/signup/sms/send', {
                phone: phone.replace(/-/g, ''),
                purpose: 'SIGNUP'
            });
            
            setIsCodeSent(true);
            setTimeLeft(300);
            setErrors({});
            if (onErrorClear) {
                onErrorClear('phone');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.errMsg || '인증코드 발송에 실패했습니다';
            setErrors({ sms: errorMessage });
        } finally {
            setIsLoading(false);
        }
    }, [phone, onErrorClear]);

    const handleVerifyCode = useCallback(async () => {
        if (!verificationCode.trim()) {
            setErrors({ code: '인증코드를 입력해주세요' });
            return;
        }

        setIsLoading(true);
        try {
            await axiosInstance.post('/signup/sms/verify', {
                phone: phone.replace(/-/g, ''),
                code: verificationCode,
                purpose: 'SIGNUP'
            });
            
            setIsVerified(true);
            setIsCodeSent(false);
            setTimeLeft(0);
            setErrors({});
            onVerified(true);

            // 수정: 인증 완료 시 상위 컴포넌트의 에러 메시지도 확실히 제거
            if (onErrorClear) {
                onErrorClear('phone');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.errMsg || '인증코드가 일치하지 않습니다';
            setErrors({ code: errorMessage });
            onVerified(false);
        } finally {
            setIsLoading(false);
        }
    }, [verificationCode, phone, onVerified, onErrorClear]);

    const handlePhoneChange = useCallback((e) => {
        const { value } = e.target;
        const formattedValue = value.replace(/[^0-9]/g, '').replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
        
        onChange({
            target: {
                name: 'phone',
                value: formattedValue
            }
        });

        if (isVerified) {
            setIsVerified(false);
            onVerified(false);
        }
        
        setErrors({});
    }, [onChange, onVerified, isVerified]);

    return (
        <div className={styles.container}>
            <div className={styles.inputGroup}>
                <FormInput
                    ref={ref} // 추가: ref 전달
                    name="phone"
                    type="tel"
                    placeholder="휴대폰번호를 입력해주세요"
                    value={phone}
                    onChange={handlePhoneChange}
                    error={(!isVerified && error) || errors.phone} // 수정: 인증 완료 시 에러 숨김
                    disabled={isVerified}
                />
                <FormButton
                    type="button"
                    variant="secondary"
                    size="small"
                    onClick={handleSendCode}
                    disabled={isVerified || isLoading}
                    loading={isLoading}
                    className={styles.sendButton}
                >
                    {isCodeSent ? '재발송' : '인증코드 발송'}
                </FormButton>
            </div>

            {isCodeSent && (
                <div className={styles.inputGroup}>
                    <FormInput
                        name="verificationCode"
                        type="text"
                        placeholder="인증코드를 입력해주세요"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        error={errors.code}
                    />
                    <FormButton
                        type="button"
                        variant="primary"
                        size="small"
                        onClick={handleVerifyCode}
                        disabled={isLoading}
                        loading={isLoading}
                        className={styles.verifyButton}
                    >
                        인증확인
                    </FormButton>
                </div>
            )}

            {isCodeSent && timeLeft > 0 && (
                <div className={styles.timerInfo}>
                    인증코드 유효시간: {formatTime(timeLeft)}
                </div>
            )}

            {isVerified && (
                <div className={styles.successMessage}>
                    휴대폰 인증이 완료되었습니다.
                </div>
            )}

            {errors.sms && (
                <div className={styles.errorMessage}>
                    {errors.sms}
                </div>
            )}
        </div>
    );
});

PhoneVerification.displayName = 'PhoneVerification'; // 추가: displayName 설정

export default PhoneVerification;