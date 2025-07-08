import React from 'react';
import styles from '../../assets/styles/pages/signup/TypeSelectionPage.module.css';
import TypeCard from '../../components/signup/TypeCard';

/**
 * 회원가입 유형 선택 페이지
 */
const TypeSelectionPage = ({ onSelect }) => {
    // 회원 유형 데이터 정의
    const memberTypes = [
        {
            id: 'user',
            icon: '👤',
            title: '일반 회원',
            description: '맛집 검색, 예약, 리뷰 작성 등\n다양한 서비스를 \n이용하실 수 있습니다.',
            buttonText: '일반 회원으로 가입',
            buttonVariant: 'primary'
        },
        {
            id: 'owner',
            icon: '🏪',
            title: '식당 업주',
            description: '식당 등록, 예약 관리, 웨이팅 관리 등\n사업자 전용 서비스를 \n이용하실 수 있습니다.',
            buttonText: '식당 업주로 가입',
            buttonVariant: 'secondary'
        }
    ];

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>회원가입</h1>
            <p className={styles.subtitle}>가입하실 회원 유형을 선택해주세요</p>
            
            <div className={styles.typeCards}>
                {memberTypes.map(type => (
                    <TypeCard
                        key={type.id}
                        icon={type.icon}
                        title={type.title}
                        description={type.description}
                        buttonText={type.buttonText}
                        buttonVariant={type.buttonVariant}
                        onSelect={() => onSelect(type.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default TypeSelectionPage;