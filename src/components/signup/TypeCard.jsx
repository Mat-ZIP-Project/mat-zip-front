import React from 'react';
import styles from '../../assets/styles/signup/TypeCard.module.css';
import FormButton from '../common/FormButton';

/**
 * 회원 유형 선택 카드 컴포넌트
 */
const TypeCard = ({ icon, title, description, buttonText, buttonVariant, onSelect }) => {
    return (
        <div className={styles.typeCard}>
            <div className={styles.cardIcon}>{icon}</div>
            <h3 className={styles.cardTitle}>{title}</h3>
            <p className={styles.cardDescription}>{description}</p>
            <FormButton
                variant={buttonVariant}
                onClick={onSelect}
            >
                {buttonText}
            </FormButton>
        </div>
    );
};

export default TypeCard;