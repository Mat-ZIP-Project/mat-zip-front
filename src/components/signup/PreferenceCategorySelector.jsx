import React, { useCallback } from 'react';
import styles from '../../assets/styles/signup/PreferenceCategorySelector.module.css';

/** 
 * 선호 카테고리 컴포넌트 
 * */
const PreferenceCategorySelector = ({ 
    selectedCategories = '', 
    onCategoryChange, 
    maxSelection = 2,
    categories = ['한식', '중식', '일식', '양식', '카페']
}) => {
    
    const handleCategoryClick = useCallback((category) => {
        if (typeof onCategoryChange === 'function') {
            onCategoryChange(category);
        }
    }, [onCategoryChange]);

    const selectedCategoryArray = selectedCategories ? selectedCategories.split(',') : [];

    return (
        <div className={styles.categorySection}>
            <label className={styles.categoryLabel}>
                선호 음식 카테고리 <span className={styles.optional}>(선택, 최대 {maxSelection}개)</span>
            </label>
            <div className={styles.categoryGrid}>
                {categories.map(category => (
                    <button key={category} type="button" 
                            className={`${styles.categoryButton} ${selectedCategoryArray.includes(category) ? styles.selected : ''}`}
                            onClick={() => handleCategoryClick(category)}
                            disabled={!selectedCategoryArray.includes(category) && selectedCategoryArray.length >= maxSelection}
                    > {category} </button>
                ))}
            </div>
        </div>
    );
};

export default PreferenceCategorySelector;