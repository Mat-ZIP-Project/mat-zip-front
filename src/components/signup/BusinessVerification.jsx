import React, { useState, useCallback, forwardRef } from 'react';
import styles from '../../assets/styles/signup/BusinessVerification.module.css';
import FormInput from '../common/FormInput';
import FormButton from '../common/FormButton';
import { signupApi } from '../../api/signupApi';
import { formatters } from '../../utils/formatters';
import { showErrorAlert, showLoadingAlert, showSuccessAlert } from '../../utils/sweetAlert';

/**
 * 사업자등록번호 인증 컴포넌트
 * - 사업자등록번호 포맷팅 및 국세청 API 연동 인증
 * - 로딩 상태 및 인증 결과 관리
 */
const BusinessVerification = forwardRef(({ businessNumber, onChange, onVerified, error, onErrorClear }, ref) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [verificationMessage, setVerificationMessage] = useState({
        type: '',
        text: ''
    });

    /** 사업자등록번호 입력 변경 처리 */
    const handleInputChange = useCallback((e) => {
        const { value } = e.target;
        
        // 자동 포맷팅 (000-00-00000)
        const formattedValue = formatters.businessNumber(value);
        
        const syntheticEvent = {
            target: {
                name: 'businessNumber',
                value: formattedValue
            }
        };
        
        onChange(syntheticEvent);
        
        if (error && onErrorClear) { 
            onErrorClear('businessNumber');
        }
        
        // 번호 변경 시 기존 인증 상태 초기화
        if (isVerified) {
            setIsVerified(false);
            setVerificationMessage({ type: '', text: '' });
            onVerified(false);
        }
    }, [onChange, error, onErrorClear, isVerified, onVerified]);

    /** 사업자등록번호 인증 처리 */
    const handleBusinessVerification = useCallback(async () => {
        const cleanBusinessNumber = businessNumber.replace(/-/g, '');
        
        // 입력값 검증
        if (!cleanBusinessNumber.trim()) {
            setVerificationMessage({ type: 'error', text: '사업자등록번호를 입력해주세요' });
            return;
        }

        if (!/^\d{10}$/.test(cleanBusinessNumber)) {
            setVerificationMessage({ type: 'error', text: '올바른 사업자등록번호를 입력해주세요' });
            return;
        }

        setIsLoading(true);

        const loadingToast = showLoadingAlert( '사업자 인증 중...', '국세청 사업자등록정보를 확인하고 있습니다.' );

        try {
            // API 호출과 최소 대기시간 병렬 처리
            await Promise.all([
                signupApi.verifyBusiness(businessNumber),
                new Promise(resolve => setTimeout(resolve, 2000)) // 2초
            ]);

            await loadingToast;

            // 인증 성공
            setIsVerified(true);
            setVerificationMessage({ type: 'success', text: '사업자 인증이 완료되었습니다' });
            onVerified(true);
            
            if (onErrorClear) { onErrorClear('businessNumber'); }

            await showSuccessAlert( '인증 완료!', '사업자등록번호 인증이 성공적으로 완료되었습니다.', 1000);

        } catch (error) {
            await loadingToast;

            const errorMessage = error.response?.data?.errMsg || '사업자 인증에 실패했습니다';
            setVerificationMessage({ type: 'error', text: errorMessage });
            setIsVerified(false);
            onVerified(false);

            await showErrorAlert( '인증 실패', errorMessage, 1500 );

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