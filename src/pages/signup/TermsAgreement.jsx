import React, { useState, useCallback } from 'react';
import styles from '../../assets/styles/pages/signup/TermsAgreement.module.css';
import FormButton from '../../components/login/FormButton';


const TermsAgreement = ({ onNext, onBack }) => {
    const [agreements, setAgreements] = useState({
        termsAgreed: false,
        privacyAgreed: false,
        allAgreed: false
    });

    const handleAgreementChange = useCallback((type) => {
        setAgreements(prev => {
            const newAgreements = { ...prev };
            
            if (type === 'all') {
                const allChecked = !prev.allAgreed;
                newAgreements.allAgreed = allChecked;
                newAgreements.termsAgreed = allChecked;
                newAgreements.privacyAgreed = allChecked;
            } else {
                newAgreements[type] = !prev[type];
                newAgreements.allAgreed = newAgreements.termsAgreed && newAgreements.privacyAgreed;
            }
            
            return newAgreements;
        });
    }, []);

    const handleNext = useCallback(() => {
        if (agreements.termsAgreed && agreements.privacyAgreed) {
            onNext({ agreements });
        }
    }, [agreements, onNext]);

    const isNextEnabled = agreements.termsAgreed && agreements.privacyAgreed;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>약관 동의</h1>
            <p className={styles.subtitle}>서비스 이용을 위해 약관에 동의해주세요</p>

            <div className={styles.agreementSection}>
                <label className={styles.agreementItem}>
                    <input
                        type="checkbox"
                        checked={agreements.allAgreed}
                        onChange={() => handleAgreementChange('all')}
                        className={styles.checkbox}
                    />
                    <span className={styles.checkboxLabel}>전체 약관에 동의합니다</span>
                </label>

                <div className={styles.separator}></div>

                <label className={styles.agreementItem}>
                    <input
                        type="checkbox"
                        checked={agreements.termsAgreed}
                        onChange={() => handleAgreementChange('termsAgreed')}
                        className={styles.checkbox}
                    />
                    <span className={styles.checkboxLabel}>
                        회원 서비스 이용약관 동의 <span className={styles.required}>(필수)</span>
                    </span>
                </label>

                <div className={styles.termsContent}>
                    <h4>제1조 (목적)</h4>
                    <p>본 약관은 맛집 예약 및 웨이팅 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
                    
                    <h4>제2조 (정의)</h4>
                    <p>1. "서비스"란 회사가 제공하는 맛집 검색, 예약, 웨이팅, 리뷰 등의 서비스를 의미합니다.</p>
                    <p>2. "회원"이란 본 약관에 따라 회사와 이용계약을 체결한 자를 의미합니다.</p>
                    
                    <h4>제3조 (서비스의 제공 및 변경)</h4>
                    <p>회사는 다음과 같은 서비스를 제공합니다:</p>
                    <p>- 맛집 정보 제공 및 검색 서비스</p>
                    <p>- 식당 예약 및 웨이팅 서비스</p>
                    <p>- 리뷰 작성 및 평점 서비스</p>
                </div>

                <label className={styles.agreementItem}>
                    <input
                        type="checkbox"
                        checked={agreements.privacyAgreed}
                        onChange={() => handleAgreementChange('privacyAgreed')}
                        className={styles.checkbox}
                    />
                    <span className={styles.checkboxLabel}>
                        개인정보 수집 및 이용 동의 <span className={styles.required}>(필수)</span>
                    </span>
                </label>

                <div className={styles.termsContent}>
                    <h4>개인정보 수집 및 이용 동의</h4>
                    <p><strong>수집하는 개인정보 항목:</strong></p>
                    <p>- 필수항목: 아이디, 비밀번호, 이름, 휴대폰번호</p>
                    <p>- 선택항목: 선호 음식 카테고리</p>
                    
                    <p><strong>개인정보 수집 및 이용 목적:</strong></p>
                    <p>- 회원 식별 및 서비스 제공</p>
                    <p>- 예약 및 웨이팅 서비스 제공</p>
                    <p>- 고객 문의 응대 및 서비스 개선</p>
                    
                    <p><strong>개인정보 보유 및 이용 기간:</strong></p>
                    <p>회원 탈퇴 시까지 보유하며, 탈퇴 후 즉시 삭제됩니다.</p>
                    
                    <p><strong>개인정보 처리 위탁:</strong></p>
                    <p>SMS 발송 서비스, 결제 서비스 등 필요한 경우에만 위탁 처리됩니다.</p>
                </div>
            </div>

            <div className={styles.buttonContainer}>
                <FormButton
                    variant="secondary"
                    onClick={onBack}
                >
                    이전
                </FormButton>
                <FormButton 
                    variant="primary"
                    disabled={!isNextEnabled}
                    onClick={handleNext}
                >
                    다음
                </FormButton>
            </div>
        </div>
    );
};

export default TermsAgreement;