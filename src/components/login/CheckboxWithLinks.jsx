import React from 'react';
import styles from '../../assets/styles/login/CheckboxWithLinks.module.css';

const CheckboxWithLinks = ({ 
  checked, 
  onChange, 
  checkboxText = "보안접속",
  links = []
}) => {

  return (
    <div className={styles.container}>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className={styles.checkbox}
        />
        <span className={styles.checkboxText}>{checkboxText}</span>
      </label>
      
      {links.length > 0 && (
        <div className={styles.links}>
          {links.map((link, index) => (
            <React.Fragment key={link.path || index}>
              <button 
                type="button" 
                className={styles.linkButton}
                onClick={link.onClick}
              >
                {link.text}
              </button>
              {index < links.length - 1 && (
                <span className={styles.divider}>|</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default CheckboxWithLinks;