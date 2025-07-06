import React from 'react';
import styles from '../../assets/styles/signup/ProgressBar.module.css';

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
            {/* <div className={styles.stepInfo}>
                <span className={styles.stepText}>
                    {stepTitles[currentStep - 1]} ({currentStep}/{totalSteps})
                </span>
            </div> */}
        </div>
    );
};

export default ProgressBar;