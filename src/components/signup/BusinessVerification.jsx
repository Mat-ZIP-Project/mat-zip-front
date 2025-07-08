import React, { useState, useCallback, forwardRef } from 'react';
import styles from '../../assets/styles/signup/BusinessVerification.module.css';
import FormInput from '../common/FormInput';
import FormButton from '../common/FormButton';
import axiosInstance from '../../api/axiosinstance';
import { showErrorAlert, showLoadingAlert, showSuccessAlert } from '../../utils/sweetAlert';

const BusinessVerification = forwardRef(({ businessNumber, onChange, onVerified, error, onErrorClear }, ref) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [verificationMessage, setVerificationMessage] = useState({
        type: '',
        text: ''
    });

    // 사업자등록번호 포맷팅
    const handleInputChange = useCallback((e) => {
        const { value } = e.target;
        
        // 숫자만 추출
        const numericValue = value.replace(/[^0-9]/g, '');
        
        // 10자리까지만 입력 허용
        const limitedValue = numericValue.slice(0, 10);
        
        // 하이픈 포맷팅 (000-00-00000)
        let formattedValue = limitedValue;
        if (limitedValue.length > 3) {
            formattedValue = limitedValue.slice(0, 3) + '-' + limitedValue.slice(3);
        }
        if (limitedValue.length > 5) {
            formattedValue = limitedValue.slice(0, 3) + '-' + limitedValue.slice(3, 5) + '-' + limitedValue.slice(5);
        }
        
        const syntheticEvent = {
            target: {
                name: 'businessNumber',
                value: formattedValue
            }
        };
        
        onChange(syntheticEvent);
        
        // 에러 제거
        if (error && onErrorClear) { onErrorClear('businessNumber');}
        
        // 값 변경 시 검증 상태 초기화
        if (isVerified) {
            setIsVerified(false);
            setVerificationMessage({ type: '', text: '' });
            onVerified(false);
        }
    }, [onChange, error, onErrorClear, isVerified, onVerified]);

    /** 사업자 인증 처리 */ 
    const handleBusinessVerification = useCallback(async () => {
        const cleanBusinessNumber = businessNumber.replace(/-/g, '');
        
        if (!cleanBusinessNumber.trim()) {
            setVerificationMessage({ type: 'error', text: '사업자등록번호를 입력해주세요' });
            return;
        }

        if (!/^\d{10}$/.test(cleanBusinessNumber)) {
            setVerificationMessage({ type: 'error', text: '올바른 사업자등록번호를 입력해주세요' });
            return;
        }

        setIsLoading(true);

        // 사업자 인증 진행 표시
        const loadingToast = showLoadingAlert(
            '사업자 인증 중...',
            '국세청 사업자등록정보를 확인하고 있습니다.'
        );

        try {
            const [apiResponse] = await Promise.all([
                axiosInstance.post('/signup/verify/business', {
                    businessNumber: cleanBusinessNumber
                }),
                new Promise(resolve => setTimeout(resolve, 3000))
            ]);

            await loadingToast;

            setIsVerified(true);
            setVerificationMessage({ type: 'success', text: '사업자 인증이 완료되었습니다' });
            onVerified(true);
            
            if (onErrorClear) {
                onErrorClear('businessNumber');
            }

            // 수정: 공통 유틸리티 사용
            await showSuccessAlert(
                '인증 완료!',
                '사업자등록번호 인증이 성공적으로 완료되었습니다.',
                1000
            );

        } catch (error) {
            await loadingToast;

            const errorMessage = error.response?.data?.errMsg || '사업자 인증에 실패했습니다';
            setVerificationMessage({ type: 'error', text: errorMessage });
            setIsVerified(false);
            onVerified(false);

            // 수정: 공통 유틸리티 사용
            await showErrorAlert(
                '인증 실패',
                errorMessage,
                1500
            );

        } finally {
            setIsLoading(false);
        }
    }, [businessNumber, onVerified, onErrorClear]);

    return (
        <div className={styles.container}>
            <div className={styles.inputGroup}>
                <FormInput
                    ref={ref}
                    name="businessNumber"
                    type="text"
                    placeholder="000-00-00000"
                    value={businessNumber || ''}
                    onChange={handleInputChange}
                    error={error}
                    disabled={isVerified}
                    maxLength="12"
                />
                <FormButton
                    type="button"
                    variant="secondary"
                    size="small"
                    onClick={handleBusinessVerification}
                    disabled={isVerified || isLoading}
                    loading={isLoading}
                    className={styles.verifyButton}
                >
                    {isVerified ? '인증완료' : '인증하기'}
                </FormButton>
            </div>

            {verificationMessage.text && verificationMessage.type === 'success' && (
                <div className={`${styles.verificationMessage} ${styles.successMessage}`}>
                    <span className={styles.checkIcon}>✓</span>
                    {verificationMessage.text}
                </div>
            )}
        </div>
    );
});

BusinessVerification.displayName = 'BusinessVerification';

export default BusinessVerification;