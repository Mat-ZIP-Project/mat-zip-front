import React from 'react';
import styles from '../../assets/styles/pages/signup/UserTypeSelection.module.css';
import FormButton from '../../components/login/FormButton';

const UserTypeSelection = ({ onSelect }) => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>회원가입</h1>
            <p className={styles.subtitle}>가입하실 회원 유형을 선택해주세요</p>
            
            <div className={styles.typeCards}>
                <div className={styles.typeCard}>
                    <div className={styles.cardIcon}>👤</div>
                    <h3 className={styles.cardTitle}>일반 회원</h3>
                    <p className={styles.cardDescription}>
                        맛집 검색, 예약, 리뷰 작성 등<br />
                        다양한 서비스를 <br/>이용하실 수 있습니다.
                    </p>
                    <FormButton
                        variant="primary"
                        onClick={() => onSelect('user')}
                    >
                        일반 회원으로 가입
                    </FormButton>
                </div>

                <div className={styles.typeCard}>
                    <div className={styles.cardIcon}>🏪</div>
                    <h3 className={styles.cardTitle}>식당 업주</h3>
                    <p className={styles.cardDescription}>
                        식당 등록, 예약 관리, 웨이팅 관리 등<br />
                        사업자 전용 서비스를 <br/>이용하실 수 있습니다.
                    </p>
                    <FormButton 
                        variant="secondary"
                        onClick={() => onSelect('owner')}
                    >
                        식당 업주로 가입
                    </FormButton>
                </div>
            </div>
        </div>
    );
};

export default UserTypeSelection;