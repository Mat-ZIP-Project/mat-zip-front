import React from 'react';
import styles from '../../assets/styles/signup/ProgressBar.module.css';

/**
 * 회원가입 진행 상태를 표시하는 프로그레스 바 컴포넌트
 */
const ProgressBar = ({ currentStep, totalSteps, stepTitles }) => {
    const progressPercentage = (currentStep / totalSteps) * 100;

    return (
        <div className={styles.container}>
            <div className={styles.progressBar}>
                <div 
                    className={styles.progressFill}
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>
            {/* 순서 단계 표시 텍스트
            <div className={styles.stepInfo}>
                <span className={styles.stepText}>
                    {stepTitles[currentStep - 1]} ({currentStep}/{totalSteps})
                </span>
            </div> */}
        </div>
    );
};

export default ProgressBar;