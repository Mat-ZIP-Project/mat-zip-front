import React from 'react';
import styles from '../../assets/styles/signup/ProgressBar.module.css';

const ProgressBar = ({ currentStep, totalSteps, stepTitles }) => {
    return (
        <div className={styles.container}>
            <div className={styles.stepsContainer}>
                {Array.from({ length: totalSteps }, (_, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber <= currentStep;
                    const isConnected = stepNumber < totalSteps;
                    
                    return (
                        <React.Fragment key={stepNumber}>
                            <div className={`${styles.stepCircle} ${isActive ? styles.active : ''}`}>
                                <span className={styles.stepNumber}>{stepNumber}</span>
                            </div>
                            {isConnected && (
                                <div className={`${styles.connector} ${stepNumber < currentStep ? styles.completed : ''}`} />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
            <div className={styles.stepInfo}>
                <span className={styles.stepText}>
                    {stepTitles[currentStep - 1]} ({currentStep}/{totalSteps})
                </span>
            </div>
        </div>
    );
};

export default ProgressBar;